"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tv, BookOpen, Quote, Info } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function LiveMemberPage() {
  const [activeSlide, setActiveSlide] = useState<any>(null)
  const [sessionTitle, setSessionTitle] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchActiveSlide = async () => {
      try {
        const response = await fetch('/api/live/active')
        const data = await response.json()
        if (data.activeSession) {
          setActiveSlide(data.activeSession.activeSlide)
          setSessionTitle(data.activeSession.sermonTitle)
        } else {
          setActiveSlide(null)
          setSessionTitle("")
        }
      } catch (error) {
        console.error("Failed to fetch active slide")
      } finally {
        setIsLoading(false)
      }
    }

    fetchActiveSlide()
    const interval = setInterval(fetchActiveSlide, 2000) // Poll every 2 seconds
    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="relative">
          <Tv className="h-6 w-6 text-primary" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        </div>
        <h1 className="text-2xl font-bold">Session en Direct</h1>
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
                <Badge variant="outline" className="text-xs uppercase tracking-wider">{sessionTitle}</Badge>
                <Badge className="bg-primary">{activeSlide.type}</Badge>
            </div>

            <Card className="overflow-hidden border-none shadow-2xl bg-gradient-to-br from-card to-secondary/30 min-h-[400px] flex items-center justify-center p-8 md:p-12">
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

            <div className="mt-8 p-4 bg-primary/5 rounded-2xl flex items-start gap-4 border border-primary/10">
                <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                    Les slides s'actualisent automatiquement à mesure que le prédicateur avance dans son message.
                    Restez connecté pour ne rien manquer.
                </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
