'use client'

import Link from 'next/link';
import Image from 'next/image';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { fadeInUp, scaleIn } from '@/utils/animations';


export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100 bg-pattern">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-200/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="container max-w-7xl mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Profile Image with animated border */}
          <motion.div 
            className='flex justify-center items-center mb-8'
            {...scaleIn}
            transition={{ delay: 0.2 }}
          >
            <div className="relative">
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 p-1"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              <div className="relative bg-white rounded-full p-2">
                <Image 
                  src="/profile.avif" 
                  alt="Profile" 
                  width={120} 
                  height={120} 
                  className="rounded-full w-28 h-28 object-cover ring-4 ring-white shadow-2xl" 
                />
              </div>
            </div>
          </motion.div>

          {/* Word by Word Animation Component */}
          {(() => {
            const WordReveal = ({ text, delay = 0 }: { text: string; delay?: number }) => {
              const words = text.split(' ');
              
              return (
                <span>
                  {words.map((word, index) => (
                    <motion.span
                      key={index}
                      className="inline-block mr-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        delay: delay + index * 0.3,
                        duration: 0.5,
                        ease: "easeOut"
                      }}
                    >
                      {word}
                    </motion.span>
                  ))}
                </span>
              );
            };

            return (
              <motion.h1 
                className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <span className="text-blue-400">
                  <WordReveal text="Hi, I'm" delay={0.3} />
                </span>
                <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent">
                  <WordReveal text="Charles Chimaobi" delay={0.9} />
                </span>
              </motion.h1>
            );
          })()}

          {/* Subtitle with glass effect */}
          <motion.div
            className="inline-block mb-8"
            {...fadeInUp}
            transition={{ delay: 0.4 }}
          >
            <div className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 glass-effect rounded-2xl px-8 py-4 backdrop-blur-md">
              <p className="text-xl md:text-2xl text-cyan-200 font-medium">
               Software Engineer | Full Stack Developer | Mobile App Developer | n8n AI Automations | Database Management | API Optimization | UI/UX Enthusiast | Open Source Contributor
              </p>
            </div>
          </motion.div>

          {/* Social links with hover effects */}
          <motion.div 
            className="flex justify-center space-x-6 mb-12"
            {...fadeInUp}
            transition={{ delay: 0.5 }}
          >
            {[
              { icon: FaGithub, href: "https://github.com", label: "GitHub" },
              { icon: FaLinkedin, href: "https://linkedin.com", label: "LinkedIn" },
              { icon: FaTwitter, href: "https://twitter.com", label: "Twitter" }
            ].map((social, index) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-4 rounded-full bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ 
                  scale: 1.1,
                  y: -5,
                  boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <social.icon className="text-2xl text-blue-600 group-hover:text-blue-700 transition-colors" />
                <span className="sr-only">{social.label}</span>
              </motion.a>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            {...fadeInUp}
            transition={{ delay: 0.5 }}
          >
            <motion.div className="pb-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href="/projects" 
                className="btn btn-primary text-lg px-8 py-3"
              >
                View My Work
                
              </Link>
            </motion.div>
            
            <motion.div className='pb-2'
              whileHover={{ scale: 0.95 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href="/contact" 
                className="btn btn-outline text-lg px-8 py-3"
              >
                Get In Touch
              </Link>
            </motion.div>

          <motion.div className="pt-1 pb-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
               <button className='btn btn-primary'
                onClick={() => {
                  // Trigger the PortfolioAssistant to open
                  const event = new CustomEvent('openPortfolioAssistant');
                  window.dispatchEvent(event);
                }}
                
              >
                Meet My Personal Assistant
              </button>
            </motion.div>

           
          </motion.div>
           {/* New Personal Assistant Button */}
            

          {/* Floating stats */}
          <motion.div
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            {[
              { number: "24+", label: "Projects Completed" },
              { number: "5+", label: "Years Experience" },
              { number: "95%", label: "Client Satisfaction" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 bg-color- glass-effect rounded-2xl p-6 text-center"
                whileHover={{ scale: 1.05, y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 + index * 0.1 }}
              >
                <div className="text-3xl font-bold bg-gradient-to-r from-teal-200 to-teal-500 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-200 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
} 