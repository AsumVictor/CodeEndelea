"use client"

import Link from "next/link"
import { motion } from "framer-motion"

export default function StudentDashboard() {
  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-3xl font-bold mb-8 text-white"
      >
        Student Dashboard
      </motion.h1>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <Link
          href="/student/courses"
          className="bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-700 transition duration-300"
        >
          <h2 className="text-xl font-semibold mb-2 text-white">My Courses</h2>
          <p className="text-gray-400">View your enrolled courses</p>
        </Link>
        <Link
          href="/student/exercises"
          className="bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-700 transition duration-300"
        >
          <h2 className="text-xl font-semibold mb-2 text-white">Exercises</h2>
          <p className="text-gray-400">View and complete exercises</p>
        </Link>
        <Link
          href="/student/progress"
          className="bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-700 transition duration-300"
        >
          <h2 className="text-xl font-semibold mb-2 text-white">My Progress</h2>
          <p className="text-gray-400">Track your learning progress</p>
        </Link>
      </motion.div>
    </div>
  )
}

