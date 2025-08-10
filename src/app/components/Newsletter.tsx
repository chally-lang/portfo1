'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaEnvelope, FaPaperPlane, FaBell } from 'react-icons/fa'

type FormStatus = 'idle' | 'loading' | 'success' | 'error'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<FormStatus>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setMessage('')

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Subscribe failed')
      }

      setStatus('success')
      setMessage('Successfully subscribed! Thank you for joining our newsletter.')
      setEmail('')
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Failed to subscribe. Please try again.')
    }
  }

  return (
    <section className="py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-pattern opacity-10" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl" />

      <div className="container max-w-7xl mx-auto px-4 relative z-10">
        <motion.div className="max-w-4xl mx-auto text-center" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          {/* Icon */}
          <motion.div className="flex justify-center mb-8" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
            <div className="p-6 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
              <FaEnvelope className="text-white text-4xl" />
            </div>
          </motion.div>

          {/* Main Card */}
          <motion.div className="glass-effect rounded-3xl p-8 md:p-12 backdrop-blur-md border border-white/20" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <motion.h2 className="text-3xl md:text-4xl font-bold mb-6 text-white" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              Stay Updated with My Latest Work
            </motion.h2>
            <motion.p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              Get exclusive insights into my projects, tech tutorials, and industry thoughts delivered straight to your inbox.
            </motion.p>

            {/* Form */}
            <motion.form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaBell className="text-blue-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-white/90 backdrop-blur-sm border border-white/30 rounded-2xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-300"
                />
              </div>
              <motion.button
                type="submit"
                className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-white to-blue-50 text-blue-700 px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">{status === 'loading' ? 'Subscribing...' : 'Subscribe'}</span>
                <FaPaperPlane className="relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
              </motion.button>
            </motion.form>

            {status === 'success' && <p className="text-green-300 mt-4">{message}</p>}
            {status === 'error' && <p className="text-red-300 mt-4">{message}</p>}

            {/* Features */}
            <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
              {[{ icon: '🚀', title: 'Weekly Updates', desc: 'Latest project releases and tech insights' }, { icon: '💡', title: 'Exclusive Content', desc: 'Behind-the-scenes and tutorials' }, { icon: '🎯', title: 'No Spam', desc: 'Only valuable content, unsubscribe anytime' }].map((feature, index) => (
                <motion.div key={feature.title} className="text-center p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 + index * 0.1 }} whileHover={{ scale: 1.05, y: -5 }}>
                  <div className="text-3xl mb-3">{feature.icon}</div>
                  <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                  <p className="text-blue-100 text-sm">{feature.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}



// 'use client'

// import { motion } from 'framer-motion';
// import { FaEnvelope, FaPaperPlane, FaBell } from 'react-icons/fa';

// export default function Newsletter() {
//   return (
//     <section className="py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden">
//       {/* Background decorative elements */}
//       <div className="absolute inset-0 bg-pattern opacity-10" />
//       <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
//       <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
      
//       <div className="container max-w-7xl mx-auto px-4 relative z-10">
//         <motion.div 
//           className="max-w-4xl mx-auto text-center"
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//         >
//           {/* Icon */}
//           <motion.div
//             className="flex justify-center mb-8"
//             initial={{ opacity: 0, scale: 0.5 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ delay: 0.2 }}
//           >
//             <div className="p-6 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
//               <FaEnvelope className="text-white text-4xl" />
//             </div>
//           </motion.div>

//           {/* Content */}
//           <motion.div
//             className="glass-effect rounded-3xl p-8 md:p-12 backdrop-blur-md border border-white/20"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.3 }}
//           >
//             <motion.h2 
//               className="text-3xl md:text-4xl font-bold mb-6 text-white"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.4 }}
//             >
//               Stay Updated with My Latest Work
//             </motion.h2>
            
//             <motion.p 
//               className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.5 }}
//             >
//               Get exclusive insights into my projects, tech tutorials, and industry thoughts delivered straight to your inbox. Join a community of developers and tech enthusiasts.
//             </motion.p>

//             {/* Newsletter Form */}
//             <motion.form 
//               className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.6 }}
//             >
//               <div className="relative flex-1">
//                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                   <FaBell className="text-blue-400" />
//                 </div>
//                 <input
//                   type="email"
//                   placeholder="Enter your email address"
//                   className="w-full pl-12 pr-4 py-4 bg-white/90 backdrop-blur-sm border border-white/30 rounded-2xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-300"
//                   required
//                 />
//               </div>
              
//               <motion.button
//                 type="submit"
//                 className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-white to-blue-50 text-blue-700 px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 <span className="relative z-10">Subscribe</span>
//                 <FaPaperPlane className="relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
//                 <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//               </motion.button>
//             </motion.form>

//             {/* Features */}
//             <motion.div 
//               className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.7 }}
//             >
//               {[
//                 { icon: "🚀", title: "Weekly Updates", desc: "Latest project releases and tech insights" },
//                 { icon: "💡", title: "Exclusive Content", desc: "Behind-the-scenes and tutorials" },
//                 { icon: "🎯", title: "No Spam", desc: "Only valuable content, unsubscribe anytime" }
//               ].map((feature, index) => (
//                 <motion.div
//                   key={feature.title}
//                   className="text-center p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20"
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.8 + index * 0.1 }}
//                   whileHover={{ scale: 1.05, y: -5 }}
//                 >
//                   <div className="text-3xl mb-3">{feature.icon}</div>
//                   <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
//                   <p className="text-blue-100 text-sm">{feature.desc}</p>
//                 </motion.div>
//               ))}
//             </motion.div>
//           </motion.div>
//         </motion.div>
//       </div>
//     </section>
//   );
// } 