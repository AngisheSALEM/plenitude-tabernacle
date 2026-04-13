"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Download, X, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePwa } from "@/components/pwa-provider"

export function PwaInstallButton() {
  const { isInstallable, installApp } = usePwa()
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    const dismissed = localStorage.getItem("pwa-install-dismissed")
    if (dismissed) return

    if (isInstallable) {
      const timer = setTimeout(() => setIsVisible(true), 3000)
      return () => clearTimeout(timer)
    } else {
      setIsVisible(false)
    }
  }, [isInstallable])

  const handleInstall = async () => {
    await installApp()
    setIsVisible(false)
  }

  const handleDismiss = () => {
    setIsVisible(false)
    setIsDismissed(true)
    localStorage.setItem("pwa-install-dismissed", "1")
  }

  return (
    <AnimatePresence>
      {isVisible && !isDismissed && (
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] w-full max-w-sm mx-auto px-4"
        >
          <div className="bg-card border border-border rounded-2xl shadow-2xl p-4 flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-primary/10 shrink-0">
              <Smartphone className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground text-sm">Installer l&apos;application</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-tight">
                Accédez à Plénitude même sans connexion
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                size="sm"
                onClick={handleInstall}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-3 h-8 text-xs gap-1"
              >
                <Download className="h-3 w-3" />
                Installer
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleDismiss}
                className="h-8 w-8 rounded-full shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
