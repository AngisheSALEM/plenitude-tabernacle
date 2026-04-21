"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

interface PwaContextType {
  deferredPrompt: BeforeInstallPromptEvent | null
  isInstallable: boolean
  isStandalone: boolean
  installApp: () => Promise<void>
}

const PwaContext = createContext<PwaContextType | undefined>(undefined)

export function PwaProvider({ children }: { children: React.ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // Check if already in standalone mode
    if (window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone) {
      setIsStandalone(true)
    }

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setIsInstallable(true)
    }

    window.addEventListener("beforeinstallprompt", handler)

    window.addEventListener("appinstalled", () => {
      setIsInstallable(false)
      setDeferredPrompt(null)
      setIsStandalone(true)
    })

    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [])

  const installApp = async () => {
    if (!deferredPrompt) {
      alert("Pour installer l'application :\n\nSur iOS (Safari) : Appuyez sur le bouton 'Partager' et choisissez 'Sur l'écran d'accueil'.\n\nSur Android/Chrome : Appuyez sur les trois points (menu) et choisissez 'Installer l'application'.")
      return
    }
    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === "accepted") {
      setDeferredPrompt(null)
      setIsInstallable(false)
    }
  }

  return (
    <PwaContext.Provider value={{ deferredPrompt, isInstallable, isStandalone, installApp }}>
      {children}
    </PwaContext.Provider>
  )
}

export function usePwa() {
  const context = useContext(PwaContext)
  if (context === undefined) {
    throw new Error("usePwa must be used within a PwaProvider")
  }
  return context
}
