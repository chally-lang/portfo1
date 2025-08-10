'use client'

import { projects } from '@/contents/projects'
import Image from 'next/image'
import { FaGithub, FaExternalLinkAlt, FaCode} from 'react-icons/fa'
import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/utils/animations'

export default function Projects() {
  return (
    <section className="py-24 bg-gradient-to-br from-blue-50 via-white to-blue-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-pattern opacity-30" />
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl" />
      
      <div className="container max-w-7xl mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Featured Projects
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore my latest work showcasing innovative solutions and cutting-edge technologies
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {projects.map((project, index) => (
            <motion.article
              key={project.title}
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
                {/* Project Image */}
                <div className="relative aspect-video mb-6 rounded-2xl overflow-hidden group">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Hover overlay with buttons */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex gap-4">
                      <motion.a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white/90 backdrop-blur-sm text-blue-600 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaGithub className="h-5 w-5" />
                      </motion.a>
                      {/* <motion.a
                        href={project.demoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaExternalLinkAlt className="h-5 w-5" />
                      </motion.a> */}
                    </div>
                  </div>
                </div>

                {/* Project Content */}
                <div className="space-y-4">
                  <motion.h3 
                    className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {project.title}
                  </motion.h3>
                  
                  <motion.p 
                    className="text-gray-600 leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {project.description}
                  </motion.p>

                  {/* Technology Tags */}
                  <motion.div 
                    className="flex flex-wrap gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {project.technologies.map((tech) => (
                      <motion.span
                        key={tech}
                        className="px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 rounded-full text-sm font-medium border border-blue-200"
                        whileHover={{ 
                          scale: 1.05,
                          backgroundColor: "rgba(59, 130, 246, 0.1)"
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </motion.div>

                  {/* Action Buttons */}
                  <motion.div 
                    className="flex gap-3 pt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <motion.a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-300"
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaCode className="h-4 w-4" />
                      <span>Code</span>
                    </motion.a>
                    {/* <motion.a
                      href={project.demoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-300"
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaEye className="h-4 w-4" />
                      <span>Live Demo</span>
                    </motion.a> */}
                  </motion.div>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* View All Projects Button */}
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
            <a
              href="/projects"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 group"
            >
              <span>View All Projects</span>
              <FaExternalLinkAlt className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
} 