"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tv, BookOpen, Quote, Info, ChevronLeft, ChevronRight, ArrowLeft, RefreshCw } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function LiveMemberPage() {
  const [activeSlide, setActiveSlide] = useState<any>(null)
  const [slides, setSlides] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [sessionTitle, setSessionTitle] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isFollowingLive, setIsFollowingLive] = useState(true)
  const [liveSlideId, setLiveSlideId] = useState<string | null>(null)

  const fetchActiveSlide = useCallback(async () => {
    try {
      const response = await fetch('/api/live/active')
      const data = await response.json()
      if (data.activeSession) {
        setSlides(data.activeSession.slides || [])
        setSessionTitle(data.activeSession.sermonTitle)
        setLiveSlideId(data.activeSession.activeSlideId)

        if (isFollowingLive) {
          const index = data.activeSession.slides.findIndex((s: any) => s.id === data.activeSession.activeSlideId)
          if (index !== -1) {
            setCurrentIndex(index)
            setActiveSlide(data.activeSession.slides[index])
          }
        }
      } else {
        setActiveSlide(null)
        setSlides([])
        setSessionTitle("")
        setLiveSlideId(null)
      }
    } catch (error) {
      console.error("Failed to fetch active slide")
    } finally {
      setIsLoading(false)
    }
  }, [isFollowingLive])

  useEffect(() => {
    fetchActiveSlide()
    const interval = setInterval(fetchActiveSlide, 2000) // Poll every 2 seconds
    return () => clearInterval(interval)
  }, [fetchActiveSlide])

  const goToNext = () => {
    if (currentIndex < slides.length - 1) {
      const nextIndex = currentIndex + 1
      setCurrentIndex(nextIndex)
      setActiveSlide(slides[nextIndex])
      setIsFollowingLive(false)
    }
  }

  const goToPrev = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1
      setCurrentIndex(prevIndex)
      setActiveSlide(slides[prevIndex])
      setIsFollowingLive(false)
    }
  }

  const syncWithLive = () => {
    setIsFollowingLive(true)
    const index = slides.findIndex((s: any) => s.id === liveSlideId)
    if (index !== -1) {
      setCurrentIndex(index)
      setActiveSlide(slides[index])
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild className="mr-2">
                <Link href="/espace-membre">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
            </Button>
            <div className="relative">
            <Tv className="h-6 w-6 text-primary" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            </div>
            <h1 className="text-2xl font-bold">Session en Direct</h1>
        </div>

        {!isFollowingLive && activeSlide && (
            <Button
                variant="outline"
                size="sm"
                onClick={syncWithLive}
                className="text-red-500 border-red-200 hover:bg-red-50 gap-2"
            >
                <RefreshCw className="h-4 w-4" />
                Synchroniser avec le Live
            </Button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!activeSlide ? (
          <motion.div
            key="no-live"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-20 bg-card border border-dashed border-border rounded-3xl"
          >
            <Tv className="h-16 w-16 mx-auto mb-4 opacity-20" />
            <h2 className="text-xl font-semibold mb-2">Aucun direct en cours</h2>
            <p className="text-muted-foreground">Revenez plus tard pour suivre le message en temps réel.</p>
          </motion.div>
        ) : (
          <motion.div
            key={activeSlide.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs uppercase tracking-wider">{sessionTitle}</Badge>
                    {isFollowingLive && <Badge className="bg-red-500 animate-pulse text-[10px] h-5">LIVE</Badge>}
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground mr-2">{currentIndex + 1} / {slides.length}</span>
                    <Badge className="bg-primary">{activeSlide.type}</Badge>
                </div>
            </div>

            <Card className="relative overflow-hidden border-none shadow-2xl bg-gradient-to-br from-card to-secondary/30 min-h-[400px] flex items-center justify-center p-8 md:p-12">
                <div className="absolute inset-y-0 left-0 flex items-center">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-full rounded-none hover:bg-primary/5 opacity-0 hover:opacity-100 transition-opacity"
                        onClick={goToPrev}
                        disabled={currentIndex === 0}
                    >
                        <ChevronLeft className="h-8 w-8" />
                    </Button>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-full rounded-none hover:bg-primary/5 opacity-0 hover:opacity-100 transition-opacity"
                        onClick={goToNext}
                        disabled={currentIndex === slides.length - 1}
                    >
                        <ChevronRight className="h-8 w-8" />
                    </Button>
                </div>

              <CardContent className="w-full text-center space-y-8">
                {activeSlide.type === 'VERSE' && (
                  <div className="space-y-6">
                    <BookOpen className="h-12 w-12 mx-auto text-primary opacity-50" />
                    <p className="text-2xl md:text-4xl font-serif font-bold italic leading-tight">
                      "{activeSlide.content}"
                    </p>
                    <div className="text-xl font-semibold text-primary">
                      {activeSlide.metadata?.book} {activeSlide.metadata?.chapter}:{activeSlide.metadata?.verse}
                    </div>
                  </div>
                )}

                {activeSlide.type === 'CITATION' && (
                  <div className="space-y-6">
                    <Quote className="h-12 w-12 mx-auto text-primary opacity-50" />
                    <p className="text-2xl md:text-3xl font-medium leading-relaxed italic">
                      {activeSlide.content}
                    </p>
                    <div className="pt-6 border-t border-border/50 max-w-md mx-auto grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                        {activeSlide.metadata?.name && (
                            <div className="flex flex-col items-center">
                                <span className="uppercase text-[10px] tracking-widest opacity-50">Prédicateur</span>
                                <span className="font-semibold text-foreground">{activeSlide.metadata.name}</span>
                            </div>
                        )}
                        {activeSlide.metadata?.paragraph && (
                            <div className="flex flex-col items-center">
                                <span className="uppercase text-[10px] tracking-widest opacity-50">Paragraphe</span>
                                <span className="font-semibold text-foreground">{activeSlide.metadata.paragraph}</span>
                            </div>
                        )}
                        {activeSlide.metadata?.location && (
                            <div className="flex flex-col items-center">
                                <span className="uppercase text-[10px] tracking-widest opacity-50">Lieu</span>
                                <span className="font-semibold text-foreground">{activeSlide.metadata.location}</span>
                            </div>
                        )}
                        {activeSlide.metadata?.date && (
                            <div className="flex flex-col items-center">
                                <span className="uppercase text-[10px] tracking-widest opacity-50">Date</span>
                                <span className="font-semibold text-foreground">{activeSlide.metadata.date}</span>
                            </div>
                        )}
                    </div>
                  </div>
                )}

                {activeSlide.type === 'TEXT' && (
                  <p className="text-2xl md:text-4xl font-medium leading-relaxed">
                    {activeSlide.content}
                  </p>
                )}
              </CardContent>
            </Card>

            <div className="mt-4 flex items-center justify-center gap-4 md:hidden">
                <Button variant="outline" size="icon" onClick={goToPrev} disabled={currentIndex === 0}>
                    <ChevronLeft className="h-5 w-5" />
                </Button>
                <span className="text-sm font-medium">{currentIndex + 1} / {slides.length}</span>
                <Button variant="outline" size="icon" onClick={goToNext} disabled={currentIndex === slides.length - 1}>
                    <ChevronRight className="h-5 w-5" />
                </Button>
            </div>

            <div className="mt-8 p-4 bg-primary/5 rounded-2xl flex items-start gap-4 border border-primary/10">
                <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                    {isFollowingLive
                        ? "Les slides s'actualisent automatiquement. Vous pouvez naviguer manuellement avec les flèches."
                        : "Synchronisation automatique désactivée. Cliquez sur 'Synchroniser avec le Live' pour suivre le prédicateur."
                    }
                </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
