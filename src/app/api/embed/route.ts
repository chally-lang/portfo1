import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const hfApiKey = process.env.HUGGINGFACE_API_KEY;
    const embeddingModel = process.env.EMBEDDING_MODEL;

    if (!hfApiKey || !embeddingModel) {
      return NextResponse.json({ error: "Hugging Face config missing" }, { status: 500 });
    }

    const res = await fetch(`https://api-inference.huggingface.co/pipeline/feature-extraction/${embeddingModel}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${hfApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(text),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: err }, { status: res.status });
    }

    const vector = await res.json();
    return NextResponse.json({ embedding: vector });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
