"use client"

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const colors = [
  "#000000",
  "#ffffff",
  "#ff0000",
  "#00ff00",
  "#0000ff",
  "#ffff00",
  "#ff00ff",
  "#00ffff",
  "#ff9900",
  "#9900ff",
]

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
}

export function ColorPicker({ color, onChange }: ColorPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full p-1 border border-gray-600">
          <div className="w-full h-full rounded-full" style={{ backgroundColor: color }} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2 bg-[#1e1f26] border-gray-800">
        <div className="grid grid-cols-5 gap-1">
          {colors.map((c) => (
            <Button key={c} variant="ghost" size="icon" className="w-8 h-8 p-1" onClick={() => onChange(c)}>
              <div className="w-full h-full rounded-full border border-gray-600" style={{ backgroundColor: c }} />
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

