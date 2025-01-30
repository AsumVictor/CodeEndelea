"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export default function Upload() {
  const [uploadType, setUploadType] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (uploadType === "pc") {
      router.push("/instructor/upload/preview")
    } else if (uploadType === "record") {
      router.push("/instructor/upload/code")
      window.open("/instructor/upload/record", "_blank");
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-3xl font-bold mb-8 text-white"
      >
        Upload Video
      </motion.h1>
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md mx-auto"
      >
        <div className="mb-4">
          <label htmlFor="uploadType" className="block text-sm font-medium text-gray-300">
            Upload Type
          </label>
          <select
            id="uploadType"
            value={uploadType}
            onChange={(e) => setUploadType(e.target.value)}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
            required
          >
            <option value="">Select upload type</option>
            <option value="pc">Upload from PC</option>
            <option value="record">Record</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-300">
            Video Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-300">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
            rows={4}
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition duration-300"
        >
          Continue
        </button>
      </motion.form>
    </div>
  )
}

