"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Tv, ChevronLeft, ChevronRight, Play, Square, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useParams } from "next/navigation"
import { toast } from "sonner"

export default function PredicateurLiveControl() {
  const params = useParams()
  const [sermon, setSermon] = useState<any>(null)
  const [activeSlideIndex, setActiveSlideIndex] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [liveSession, setLiveSession] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSermon = async () => {
      try {
        const response = await fetch(`/api/sermons/${params.id}`)
        const data = await response.json()
        if (data.sermon) {
          setSermon(data.sermon)
        } else {
          toast.error("Message non trouvé")
        }
      } catch (error) {
        toast.error("Erreur lors du chargement du message")
      } finally {
        setIsLoading(false)
      }
    }
    fetchSermon()
  }, [params.id])

  const toggleLive = async () => {
    if (!isActive) {
      try {
        const response = await fetch('/api/live/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sermonId: sermon.id }),
        })
        const data = await response.json()
        if (data.liveSession) {
          setLiveSession(data.liveSession)
          setIsActive(true)
          toast.success("Live démarré !")
          updateActiveSlide(0, data.liveSession.id)
        }
      } catch (error) {
        toast.error("Erreur au démarrage du live")
      }
    } else {
      try {
        await fetch('/api/live/session', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: liveSession.id, isActive: false }),
        })
        setIsActive(false)
        setLiveSession(null)
        toast.success("Live terminé")
      } catch (error) {
        toast.error("Erreur lors de l'arrêt du live")
      }
    }
  }

  const updateActiveSlide = async (index: number, sessionId = liveSession?.id) => {
    if (!sessionId) return
    try {
      await fetch('/api/live/session', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          activeSlideId: sermon.slides[index].id
        }),
      })
    } catch (error) {
      console.error("Failed to sync slide")
    }
  }

  const nextSlide = () => {
    if (activeSlideIndex < sermon.slides.length - 1) {
      const newIndex = activeSlideIndex + 1
      setActiveSlideIndex(newIndex)
      if (isActive) updateActiveSlide(newIndex)
    }
  }

  const prevSlide = () => {
    if (activeSlideIndex > 0) {
      const newIndex = activeSlideIndex - 1
      setActiveSlideIndex(newIndex)
      if (isActive) updateActiveSlide(newIndex)
    }
  }

  if (isLoading) return <div className="p-8 text-center">Chargement...</div>
  if (!sermon) return <div className="p-8 text-center">Message non trouvé</div>

  const currentSlide = sermon.slides[activeSlideIndex]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            {sermon.title}
            {isActive && (
              <Badge className="bg-red-500 animate-pulse">EN DIRECT</Badge>
            )}
          </h1>
          <p className="text-muted-foreground">Contrôle de la diffusion</p>
        </div>
        <Button
          variant={isActive ? "destructive" : "default"}
          size="lg"
          onClick={toggleLive}
        >
          {isActive ? <Square className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
          {isActive ? "Arrêter le Live" : "Démarrer le Live"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <Card className="aspect-video flex items-center justify-center p-12 bg-black text-white relative group overflow-hidden border-4 border-primary/20">
            {currentSlide && (
                <div className="text-center space-y-4">
                    <p className="text-3xl font-serif">{currentSlide.content}</p>
                    {currentSlide.type === 'VERSE' && (
                        <p className="text-xl text-primary font-bold">
                            {currentSlide.metadata.book} {currentSlide.metadata.chapter}:{currentSlide.metadata.verse}
                        </p>
                    )}
                </div>
            )}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4">
                <Button variant="secondary" size="icon" onClick={prevSlide} disabled={activeSlideIndex === 0}>
                    <ChevronLeft className="h-6 w-6" />
                </Button>
                <span className="font-mono bg-black/50 px-3 py-1 rounded-full text-sm">
                    {activeSlideIndex + 1} / {sermon.slides.length}
                </span>
                <Button variant="secondary" size="icon" onClick={nextSlide} disabled={activeSlideIndex === sermon.slides.length - 1}>
                    <ChevronRight className="h-6 w-6" />
                </Button>
            </div>
          </Card>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {sermon.slides.map((slide: any, i: number) => (
                <Card
                    key={slide.id}
                    className={`cursor-pointer transition-all ${activeSlideIndex === i ? 'ring-2 ring-primary border-primary' : 'hover:border-primary/50'}`}
                    onClick={() => {
                        setActiveSlideIndex(i)
                        if (isActive) updateActiveSlide(i)
                    }}
                >
                    <CardContent className="p-3 text-xs line-clamp-3">
                        {slide.content}
                    </CardContent>
                </Card>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-4 space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Infos Session
                </h3>
                <div className="text-sm text-muted-foreground">
                    ID: <span className="font-mono text-[10px]">{sermon.id}</span>
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
