// src/app/api/blogs/route.ts
import { NextResponse } from "next/server";

interface BlogPost {
  id: string;
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  author: string;
  tags: string[];
  coverImage?: string | null;
  readTime?: number;
  body_html?: string;
  source: string;
}

interface HashnodePost {
  slug?: string;
  title?: string;
  brief?: string;
  dateAdded?: string;
  author?: { name?: string };
  tags?: { name?: string }[];
  coverImage?: string;
  readTime?: number;
  content?: string;
}

interface DevToPost {
  id: number;
  title?: string;
  description?: string;
  url?: string;
  canonical_url?: string;
  published_at?: string;
  created_at?: string;
  user?: { name?: string; username?: string };
  tags?: string[];
  tag_list?: string[];
  cover_image?: string;
  social_image?: string;
  reading_time_minutes?: number;
  reading_time?: number;
}

/** -------------------------
 * Hashnode (GraphQL) fetch
 * ------------------------- */
async function fetchHashnodePosts(limit = 6): Promise<BlogPost[]> {
  try {
    const username = process.env.HASHNODE_USERNAME || "hashnode"; // change via env
    const apiKey = process.env.HASHNODE_API_KEY; // optional

    const query = `
      query {
        user(username: "${username}") {
          publications(first: 1) {
            edges {
              node {
                posts(first: ${limit}) {
                  edges {
                    node {
                      title
                      brief
                      slug
                      dateAdded
                      author { name }
                      tags { name }
                      coverImage
                      readTime
                      content
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    const res = await fetch("https://gql.hashnode.com/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      body: JSON.stringify({ query }),
    });

    if (!res.ok) {
      console.error("Hashnode returned not ok:", res.status, await res.text().catch(() => ""));
      throw new Error("Hashnode API failed");
    }

    const json = await res.json().catch(() => ({}));
    const publicationEdge = json?.data?.user?.publications?.edges?.[0]?.node;
    const postsRaw = publicationEdge?.posts?.edges?.map((edge: { node: HashnodePost }) => edge.node) || [];

    return postsRaw.slice(0, limit).map((p: HashnodePost) => ({
      id: `hashnode-${p.slug ?? Math.random().toString(36).slice(2)}`,
      title: p.title ?? "Untitled",
      description: p.brief ?? "",
      url: p.slug ? `https://${username}.hashnode.dev/${p.slug}`.replace(/\/\/+/, "//") : "#",
      publishedAt: p.dateAdded ?? new Date().toISOString(),
      author: p.author?.name ?? username,
      tags: Array.isArray(p.tags) ? p.tags.map((t) => t?.name).filter(Boolean) : [],
      coverImage: p.coverImage ?? null,
      readTime: p.readTime ?? undefined,
      body_html: p.content ?? undefined,
      source: "hashnode",
    }));
  } catch (err) {
    console.error("fetchHashnodePosts error:", err);
    return [];
  }
}

/** -------------------------
 * Dev.to fetch
 * ------------------------- */
async function fetchDevToPosts(): Promise<BlogPost[]> {
  try {
    const tags = ["javascript", "react", "nextjs", "typescript"];
    const all: BlogPost[] = [];

    // Fetch a few tags in parallel but tolerate failures
    await Promise.all(
      tags.map(async (tag) => {
        try {
          const res = await fetch(`https://dev.to/api/articles?tag=${encodeURIComponent(tag)}&per_page=8`, {
            headers: { Accept: "application/json" },
            next: { revalidate: 3600 },
          });

          if (!res.ok) return;

          const articles = (await res.json()) as DevToPost[];
          (articles || []).slice(0, 8).forEach((a) => {
            all.push({
              id: `devto-${a.id}`,
              title: a.title ?? "Untitled",
              description: a.description ?? "",
              url: a.url ?? a.canonical_url ?? "#",
              publishedAt: a.published_at ?? a.created_at ?? new Date().toISOString(),
              author: a.user?.name ?? (a.user?.username ?? "dev.to"),
              tags: Array.isArray(a.tags) ? a.tags : (typeof a.tag_list !== "undefined" ? a.tag_list : [tag]),
              coverImage: a.cover_image ?? a.social_image ?? null,
              readTime: Math.ceil(a.reading_time_minutes ?? a.reading_time ?? 5),
              body_html: a.description ? `<p>${a.description}</p>` : undefined,
              source: "dev.to",
            });
          });
        } catch (e) {
          console.error(`Dev.to tag ${tag} fetch error:`, e);
        }
      })
    );

    return all;
  } catch (err) {
    console.error("fetchDevToPosts error:", err);
    return [];
  }
}

/** -------------------------
 * Medium RSS parse (simple)
 * ------------------------- */
async function fetchMediumPosts(): Promise<BlogPost[]> {
  try {
    const url = "https://medium.com/feed/tag/javascript";
    const res = await fetch(url);
    if (!res.ok) throw new Error("Medium RSS failed");

    const xml = await res.text();
    const items = Array.from(xml.matchAll(/<item>([\s\S]*?)<\/item>/g)).map((m) => m[1]);

    return items.slice(0, 10).map((item, idx) => {
      const get = (r: RegExp) => (item.match(r) || [null, null])[1] || "";
      const title = get(/<title>([\s\S]*?)<\/title>/) .replace(/<!\[CDATA\[|\]\]>/g, "");
      const description = get(/<description>([\s\S]*?)<\/description>/).replace(/<!\[CDATA\[|\]\]>/g, "");
      const link = get(/<link>([\s\S]*?)<\/link>/).trim();
      const pubDate = get(/<pubDate>([\s\S]*?)<\/pubDate>/).trim();

      return {
        id: `medium-${idx}-${(link || title).slice(0, 30)}`,
        title: title || "Medium Article",
        description: description || "",
        url: link || "#",
        publishedAt: pubDate || new Date().toISOString(),
        author: "Medium",
        tags: ["javascript", "medium"],
        coverImage: null,
        readTime: Math.floor(Math.random() * 8) + 4,
        body_html: description ? `<p>${description}</p>` : undefined,
        source: "medium",
      } as BlogPost;
    });
  } catch (err) {
    console.error("fetchMediumPosts error:", err);
    return [];
  }
}

/** -------------------------
 * Generic RSS feeds
 * ------------------------- */
async function fetchRSSPosts(): Promise<BlogPost[]> {
  const feeds = [
    "https://css-tricks.com/feed/",
    "https://www.smashingmagazine.com/feed/",
    "https://alistapart.com/main/feed/",
    "https://web.dev/feed.xml",
    "https://blog.logrocket.com/feed/",
  ];

  const all: BlogPost[] = [];

  await Promise.all(
    feeds.map(async (feed) => {
      try {
        const r = await fetch(feed);
        if (!r.ok) return;
        const xml = await r.text();
        const items = Array.from(xml.matchAll(/<item>([\s\S]*?)<\/item>/g)).map((m) => m[1]).slice(0, 5);

        items.forEach((item, i) => {
          const get = (r: RegExp) => (item.match(r) || [null, null])[1] || "";
          const title = get(/<title>([\s\S]*?)<\/title>/).replace(/<!\[CDATA\[|\]\]>/g, "");
          const description = get(/<description>([\s\S]*?)<\/description>/).replace(/<!\[CDATA\[|\]\]>/g, "");
          const link = get(/<link>([\s\S]*?)<\/link>/).trim();
          const pubDate = get(/<pubDate>([\s\S]*?)<\/pubDate>/).trim();

          if (!title) return;
          all.push({
            id: `rss-${feed}-${i}`,
            title,
            description: description || "",
            url: link || "#",
            publishedAt: pubDate || new Date().toISOString(),
            author: "Tech Blog",
            tags: ["web-development", "programming"],
            coverImage: null,
            readTime: Math.floor(Math.random() * 12) + 5,
            body_html: description ? `<p>${description}</p>` : undefined,
            source: "rss",
          });
        });
      } catch (e) {
        console.error(`RSS fetch error for ${feed}:`, e);
      }
    })
  );

  return all;
}

/** -------------------------
 * Fallback posts generator
 * ------------------------- */
function generateFallbackPosts(count = 30): BlogPost[] {
  const topics = [
    "React Hooks Deep Dive",
    "Next.js 14 Features",
    "TypeScript Best Practices",
    "Node.js Performance",
    "CSS Grid Layout",
    "JavaScript ES2023",
    "Web Security",
    "API Design",
    "Database Optimization",
    "Cloud Deployment",
    "Testing Strategies",
    "Code Review",
    "Git Workflows",
    "Docker Basics",
    "Microservices",
    "GraphQL vs REST",
    "Progressive Web Apps",
    "Web Accessibility",
    "Performance Optimization",
    "SEO for Developers",
  ];

  return topics.slice(0, count).map((t, i) => ({
    id: `fallback-${i + 1}`,
    title: t,
    description: `A comprehensive guide to ${t.toLowerCase()}.`,
    url: `https://example.com/blog-${i + 1}`,
    publishedAt: new Date(Date.now() - i * 86400000).toISOString(),
    author: ["Sarah Chen", "Mike Johnson", "Alex Rodriguez"][i % 3],
    tags: ["tech", "programming"],
    coverImage: null,
    readTime: Math.floor(Math.random() * 12) + 6,
    body_html: `<p>${t} content...</p>`,
    source: "fallback",
  }));
}

/** -------------------------
 * Main GET handler
 * ------------------------- */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get("limit");
    const pageParam = searchParams.get("page") || "1";
    const limit = limitParam ? Math.max(1, Math.min(100, Number(limitParam))) : undefined;
    const page = Math.max(1, Number(pageParam));

    // Use all sources but don't fail if one fails
    const results = await Promise.allSettled([
      fetchDevToPosts(),
      fetchHashnodePosts(limit ?? 6),
      fetchMediumPosts(),
      fetchRSSPosts(),
    ]);

    const collected: BlogPost[] = [];
    results.forEach((r) => {
      if (r.status === "fulfilled" && Array.isArray(r.value)) {
        collected.push(...r.value);
      } else if (r.status === "rejected") {
        console.error("One source failed:", r.reason);
      }
    });

    // Add fallback if not enough
    if (collected.length < 20) {
      collected.push(...generateFallbackPosts(30));
    }

    // Normalize: ensure tags, publishedAt
    const normalized = collected.map((p) => ({
      ...p,
      tags: Array.isArray(p.tags) ? p.tags : ["tech"],
      publishedAt: p.publishedAt || new Date().toISOString(),
    }));

    // Deduplicate by url or title
    const unique: BlogPost[] = [];
    const seen = new Set<string>();
    for (const p of normalized) {
      const key = (p.url || p.title || "").trim();
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(p);
      }
    }

    // Sort newest first (safe parse)
    unique.sort((a, b) => {
      const ta = new Date(a.publishedAt).getTime() || 0;
      const tb = new Date(b.publishedAt).getTime() || 0;
      return tb - ta;
    });

    // Pagination
    if (limit) {
      const start = (page - 1) * limit;
      const pageItems = unique.slice(start, start + limit);
      return NextResponse.json({
        posts: pageItems,
        total: unique.length,
        pagination: {
          page,
          limit,
          totalPages: Math.ceil(unique.length / limit),
        },
        source: "multiple",
      });
    }

    // No pagination requested — return all (capped)
    const cap = 200;
    return NextResponse.json({
      posts: unique.slice(0, cap),
      total: unique.length,
      pagination: { page: 1, limit: Math.min(unique.length, cap), totalPages: 1 },
      source: "multiple",
    });
  } catch (err) {
    console.error("Blog API error:", err);
    const fallback = generateFallbackPosts(20);
    return NextResponse.json({
      posts: fallback,
      total: fallback.length,
      source: "fallback",
      error: "Failed to fetch blog posts, returning fallback data",
    });
  }
}
