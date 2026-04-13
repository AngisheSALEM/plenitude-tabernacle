"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Tv, ChevronLeft, ChevronRight, Play, Square, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function PredicateurLiveControl() {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [slides, setSlides] = useState<any[]>([])

  // Mocking some slides for demonstration if none exist
  useEffect(() => {
      setSlides([
          { id: '1', content: "Dieu a tellement aimé le monde qu'il a donné son Fils unique...", type: 'VERSE', metadata: { book: 'Jean', chapter: 3, verse: '16' } },
          { id: '2', content: "C'est ici la victoire qui triomphe du monde : notre foi.", type: 'VERSE', metadata: { book: '1 Jean', chapter: 5, verse: '4' } },
          { id: '3', content: "La foi n'est pas de croire que Dieu peut le faire, c'est de savoir qu'il le fera.", type: 'CITATION', metadata: { name: 'W.M.B', paragraph: '45', location: 'Jeffersonville', date: '1963' } },
      ])
  }, [])

  const toggleLive = () => setIsActive(!isActive)

  const nextSlide = () => {
    if (activeSlideIndex < slides.length - 1) {
      setActiveSlideIndex(prev => prev + 1)
    }
  }

  const prevSlide = () => {
    if (activeSlideIndex > 0) {
      setActiveSlideIndex(prev => prev - 1)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Contrôle du Live
            {isActive && (
              <Badge className="bg-red-500 animate-pulse">EN DIRECT</Badge>
            )}
          </h1>
          <p className="text-muted-foreground">Gérez la diffusion de vos slides en temps réel.</p>
        </div>
        <Button
          variant={isActive ? "destructive" : "default"}
          size="lg"
          onClick={toggleLive}
          className="w-full md:w-auto"
        >
          {isActive ? <Square className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
          {isActive ? "Arrêter le Live" : "Démarrer le Live"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <Card className="aspect-video flex items-center justify-center p-12 bg-black text-white relative group overflow-hidden border-4 border-primary/20">
            {slides[activeSlideIndex] && (
                <div className="text-center space-y-4">
                    <p className="text-3xl font-serif">{slides[activeSlideIndex].content}</p>
                    {slides[activeSlideIndex].type === 'VERSE' && (
                        <p className="text-xl text-primary font-bold">
                            {slides[activeSlideIndex].metadata.book} {slides[activeSlideIndex].metadata.chapter}:{slides[activeSlideIndex].metadata.verse}
                        </p>
                    )}
                </div>
            )}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="secondary" size="icon" onClick={prevSlide} disabled={activeSlideIndex === 0}>
                    <ChevronLeft className="h-6 w-6" />
                </Button>
                <span className="font-mono bg-black/50 px-3 py-1 rounded-full text-sm">
                    {activeSlideIndex + 1} / {slides.length}
                </span>
                <Button variant="secondary" size="icon" onClick={nextSlide} disabled={activeSlideIndex === slides.length - 1}>
                    <ChevronRight className="h-6 w-6" />
                </Button>
            </div>
          </Card>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {slides.map((slide, i) => (
                <Card
                    key={slide.id}
                    className={`cursor-pointer transition-all ${activeSlideIndex === i ? 'ring-2 ring-primary border-primary' : 'hover:border-primary/50'}`}
                    onClick={() => setActiveSlideIndex(i)}
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
                    Paramètres
                </h3>
                <div className="text-sm text-muted-foreground">
                    Connecté en tant que: <strong>Prédicateur</strong>
                </div>
                <div className="pt-4 border-t border-border space-y-2">
                    <p className="text-xs font-medium uppercase text-muted-foreground">Aperçu pour les membres</p>
                    <div className="aspect-video bg-muted rounded-lg border border-border flex items-center justify-center text-[10px] text-center p-2 italic">
                        {slides[activeSlideIndex]?.content.substring(0, 50)}...
                    </div>
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
