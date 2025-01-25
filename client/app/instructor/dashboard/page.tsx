"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ProtectedRoute } from "../../components/ProtectedRoute"

export default function InstructorDashboard() {
  return (
    <ProtectedRoute requiredRole="instructor">
      <div className="min-h-screen bg-gray-900 p-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl font-bold mb-8 text-white"
        >
          Instructor Dashboard
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <Link
            href="/instructor/upload"
            className="bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-700 transition duration-300"
          >
            <h2 className="text-xl font-semibold mb-2 text-white">Upload</h2>
            <p className="text-gray-400">Upload new video content</p>
          </Link>
          <Link
            href="/instructor/videos"
            className="bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-700 transition duration-300"
          >
            <h2 className="text-xl font-semibold mb-2 text-white">Videos</h2>
            <p className="text-gray-400">Manage your video content</p>
          </Link>
          <Link
            href="/instructor/exercises"
            className="bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-700 transition duration-300"
          >
            <h2 className="text-xl font-semibold mb-2 text-white">Exercises</h2>
            <p className="text-gray-400">Manage exercises</p>
          </Link>
          <Link
            href="/instructor/grade"
            className="bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-700 transition duration-300"
          >
            <h2 className="text-xl font-semibold mb-2 text-white">Grade</h2>
            <p className="text-gray-400">Grade student exercises</p>
          </Link>
        </motion.div>
      </div>
    </ProtectedRoute>
  )
}

