"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useSpring, animated } from "react-spring"
import Link from "next/link"

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const props = useSpring({
    opacity: mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(50px)",
  })

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Aurora Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="aurora-container">
          <div className="aurora"></div>
          <div className="aurora"></div>
          <div className="aurora"></div>
        </div>
      </div>

      {/* Content */}
      <animated.div style={props} className="z-10 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl font-bold mb-4 text-white"
        >
          Interactive Video Learning Platform
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl mb-8 text-gray-300"
        >
          Pause, Edit, and Learn Coding Interactively
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Link
            href="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition duration-300"
          >
            Get Started
          </Link>
        </motion.div>
      </animated.div>
    </div>
  )
}

