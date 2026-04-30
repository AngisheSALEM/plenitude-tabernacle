"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { Bell, Calendar, ArrowRight, Megaphone, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface Announcement {
  id: string
  title: string
  content: string
  imageUrl?: string
  isActive: boolean
  createdAt: string
}

export function NewsSection() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  useEffect(() => {
    fetch("/api/evenements?active=true&limit=3")
      .then((res) => res.json())
      .then((data) => {
        setAnnouncements(data.evenements ?? [])
      })
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <section className="relative py-32 overflow-hidden" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0 bg-card" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="relative container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Bell className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Actualités</span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground text-balance">
            Annonces & Événements
          </h2>
          <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto text-pretty">
            Restez informé des dernières actualités et événements de notre communauté.
          </p>
        </motion.div>

        {/* Announcements Grid */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        ) : announcements.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {announcements.map((announcement, index) => (
              <motion.article
                key={announcement.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + index * 0.15 }}
                className="group relative bg-background/50 backdrop-blur-sm rounded-2xl border border-border hover:border-primary/30 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 flex flex-col"
              >
                {announcement.imageUrl && (
                  <div className="relative aspect-video w-full overflow-hidden">
                    <Image
                      src={announcement.imageUrl}
                      alt={announcement.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                
                <div className="p-6 space-y-4 flex-1 flex flex-col">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(announcement.createdAt).toLocaleDateString("fr-FR", { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                    {announcement.isActive && (
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {announcement.title}
                  </h3>

                  <p className="text-muted-foreground leading-relaxed line-clamp-3 flex-1">
                    {announcement.content}
                  </p>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary hover:text-primary hover:bg-primary/10 p-0 h-auto group/btn self-start"
                  >
                    En savoir plus
                    <ArrowRight className="ml-1 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            <Megaphone className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>Aucune annonce pour le moment.</p>
          </div>
        )}
      </div>
    </section>
  )
}
