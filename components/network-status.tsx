"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { WifiOff, Wifi } from "lucide-react"
import { syncToLocalDb } from "@/lib/dexie"

export function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [showReconnected, setShowReconnected] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setIsOnline(navigator.onLine)

    const handleOnline = async () => {
      setIsOnline(true)
      setShowReconnected(true)
      setTimeout(() => setShowReconnected(false), 3000)
      await syncToLocalDb()
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowReconnected(false)
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  if (!mounted || typeof window === "undefined") return null

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          key="offline"
          initial={{ opacity: 0, y: -48 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -48 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-center gap-2 px-4 py-2 bg-amber-500 text-white text-sm font-medium shadow-lg"
        >
          <WifiOff className="h-4 w-4 shrink-0" />
          <span>Mode hors ligne actif — les contenus en cache restent disponibles</span>
        </motion.div>
      )}
      {isOnline && showReconnected && (
        <motion.div
          key="reconnected"
          initial={{ opacity: 0, y: -48 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -48 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium shadow-lg"
        >
          <Wifi className="h-4 w-4 shrink-0" />
          <span>Connexion rétablie — synchronisation en cours…</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
