import type React from "react"
import { useState, useEffect, useRef } from "react"
import { GripVertical } from "lucide-react"

interface SplitPaneProps {
  left: React.ReactNode
  right: React.ReactNode
}

export function SplitPane({ left, right }: SplitPaneProps) {
  const [leftWidth, setLeftWidth] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const splitPaneRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = () => {
    setIsDragging(true)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !splitPaneRef.current) return
    const splitPaneRect = splitPaneRef.current.getBoundingClientRect()
    const newLeftWidth = ((e.clientX - splitPaneRect.left) / splitPaneRect.width) * 100
    setLeftWidth(Math.max(0, Math.min(100, newLeftWidth)))
  }

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging])

  return (
    <div ref={splitPaneRef} className="flex h-full">
      <div style={{ width: `${leftWidth}%` }} className="overflow-auto">
        {left}
      </div>
      <div className="w-1 bg-gray-300 cursor-col-resize flex items-center justify-center" onMouseDown={handleMouseDown}>
        <div className="bg-white p-1 rounded-full">
          <GripVertical size={16} className="text-gray-500" />
        </div>
      </div>
      <div style={{ width: `${100 - leftWidth}%` }} className="overflow-auto">
        {right}
      </div>
    </div>
  )
}

