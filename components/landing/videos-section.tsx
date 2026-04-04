"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import Link from "next/link"
import { Play, Clock, User, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/format"

export function VideosSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [videos, setVideos] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/api/videos?limit=3")
      .then(res => res.json())
      .then(data => {
        if (data.videos && data.videos.length > 0) {
          setVideos(data.videos)
        }
      })
      .catch(err => console.error("Error fetching landing videos:", err))
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <section id="videos" className="relative py-32 overflow-hidden" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      
      <div className="relative container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
        >
          <div>
            <p className="text-primary font-medium mb-4 tracking-wider uppercase text-sm">
              Médiathèque
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground text-balance">
              Dernières Prédications Vidéo
            </h2>
          </div>
          <Link href="/videos">
            <Button 
              variant="outline" 
              className="self-start md:self-auto border-primary/30 text-primary hover:bg-primary/10 rounded-full group"
            >
              Voir toutes les videos
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>

        {/* Videos Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="aspect-video rounded-2xl bg-card animate-pulse border border-border/50" />
            ))
          ) : videos.length > 0 ? (
            videos.map((video, index) => (
            <motion.article
              key={video.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + index * 0.15 }}
              className="group cursor-pointer"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-card border border-border/50 mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/20" />
                
                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div 
                    className="p-4 rounded-full bg-primary/90 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Play className="h-8 w-8 text-primary-foreground fill-current" />
                  </motion.div>
                </div>
                
                {/* Duration badge */}
                <div className="absolute bottom-3 right-3 px-2 py-1 rounded-md bg-background/80 backdrop-blur-sm text-xs font-medium text-foreground">
                  {video.duration}
                </div>
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Info */}
              <div className="space-y-2">
                <h3 className="font-serif text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {video.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {video.speaker}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {video.date}
                  </span>
                </div>
              </div>
            </motion.article>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            Aucune vidéo disponible pour le moment.
          </div>
        )}
        </div>
      </div>
    </section>
  )
}
