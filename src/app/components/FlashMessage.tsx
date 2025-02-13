"use client"

import { useEffect } from "react"

interface FlashMessageProps {
  message: string
  onClose: () => void
}

export function FlashMessage({ message, onClose }: FlashMessageProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 3000) // 3秒後に自動的に消える

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
      {message}
    </div>
  )
}

