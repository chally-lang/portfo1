'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaCalendarAlt, FaClock, FaArrowRight, FaBookOpen } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { staggerContainer } from '@/utils/animations';

interface BlogPost {
  id: string;
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  author: string;
  tags: string[];
  coverImage?: string;
  readTime?: number;
  source?: string;
}

export default function Blogs() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        // Fetch only 6 posts for homepage
        const response = await fetch('/api/blogs?limit=6');
        if (response.ok) {
          const data = await response.json();
          setBlogs(data.posts);
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};


  if (loading) {
    return (
      <section className="py-24 bg-gradient-to-br from-white via-blue-50 to-blue-100 relative overflow-hidden">
        <div className="container max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gradient-to-br from-white via-blue-50 to-blue-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-pattern opacity-20" />
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl" />
      
      <div className="container max-w-7xl mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Latest Blog Posts
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover insights, tutorials, and thoughts on technology, development, and innovation
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {blogs.map((blog, index) => (
            <motion.article
              key={blog.id}
              className="group relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden"
              variants={fadeInUp}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 25px 50px rgba(59, 130, 246, 0.15)"
              }}
            >
              {/* Gradient border effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 p-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-white rounded-3xl p-6 h-full">
                {/* Blog Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full">
                    <FaBookOpen className="text-blue-600 text-lg" />
                  </div>
                  <div className="flex-1">
                    <motion.h3 
                      className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2"
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Link href={`/blog/${blog.id}`} className="hover:text-blue-600 transition-colors">
                        {blog.title}
                      </Link>
                    </motion.h3>
                  </div>
                </div>

                {/* Blog Content */}
                <motion.p 
                  className="text-gray-600 leading-relaxed mb-6 line-clamp-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {blog.description}
                </motion.p>

                {/* Blog Meta */}
                <motion.div 
                  className="flex items-center justify-between text-sm text-gray-500 mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center gap-4">
                    <motion.span 
                      className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full"
                      whileHover={{ scale: 1.05 }}
                    >
                      <FaCalendarAlt className="text-blue-600" />
                      <span className="text-blue-700 font-medium">
                        {new Date(blog.publishedAt).toLocaleDateString()}
                      </span>
                    </motion.span>
                    <motion.span 
                      className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full"
                      whileHover={{ scale: 1.05 }}
                    >
                      <FaClock className="text-green-600" />
                      <span className="text-green-700 font-medium">
                        {blog.readTime} min read
                      </span>
                    </motion.span>
                  </div>
                </motion.div>

                {/* Read More Button */}
                <motion.div 
                  className="flex justify-between items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <Link
                    href={`/blog/${blog.id}`}
                    className="group inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-300"
                  >
                    <span>Read More</span>
                    <FaArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                  
                  <div className="flex items-center gap-2">
                    {/* Category Badge */}
                    <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 rounded-full text-sm font-medium">
                      {blog.tags?.[0] || 'Tech'}
                    </span>
                    
                    {/* Source Badge */}
                    {blog.source && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        blog.source === 'dev.to' ? 'bg-purple-100 text-purple-700' :
                        blog.source === 'hashnode' ? 'bg-blue-100 text-blue-700' :
                        blog.source === 'medium' ? 'bg-green-100 text-green-700' :
                        blog.source === 'rss' ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {blog.source}
                      </span>
                    )}
                  </div>
                </motion.div>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* View All Posts Button */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/blog"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 group"
            >
              <span>View All Posts</span>
              <FaArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
