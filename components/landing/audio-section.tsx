"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useState } from "react"
import Link from "next/link"
import { Play, Pause, Headphones, Clock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const audioTracks = [
  {
    id: 1,
    title: "La Grâce Suffisante",
    speaker: "Pasteur Joel Mugisho",
    duration: "45:32",
    date: "22 Mars 2026",
  },
  {
    id: 2,
    title: "Vivre par l'Esprit",
    speaker: "Pasteur Joel Mugisho",
    duration: "52:18",
    date: "15 Mars 2026",
  },
  {
    id: 3,
    title: "Le Combat de la Foi",
    speaker: "Pasteur Joel Mugisho",
    duration: "48:45",
    date: "8 Mars 2026",
  },
  {
    id: 4,
    title: "L'Amour Inconditionnel",
    speaker: "Pasteur Joel Mugisho",
    duration: "55:10",
    date: "1 Mars 2026",
  },
]

export function AudioSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [playingId, setPlayingId] = useState<number | null>(null)

  return (
    <section id="audio" className="relative py-32 overflow-hidden" ref={ref}>
      {/* Dark theme background */}
      <div className="absolute inset-0 bg-card" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="relative container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div>
              <p className="text-primary font-medium mb-4 tracking-wider uppercase text-sm">
                Prédications Audio
              </p>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground text-balance">
                Écoutez la Parole en déplacement
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mt-4 text-pretty">
                Accédez à notre bibliothèque audio complète et nourrissez votre foi où que vous soyez. 
                Un lecteur persistant vous permet de continuer l&apos;écoute tout en naviguant.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 border border-primary/20">
                <Headphones className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold text-foreground">200+</p>
                  <p className="text-xs text-muted-foreground">Prédications</p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 border border-primary/20">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold text-foreground">150h+</p>
                  <p className="text-xs text-muted-foreground">De contenu</p>
                </div>
              </div>
            </div>

            <Link href="/audio">
              <Button 
                variant="outline" 
                className="border-primary/30 text-primary hover:bg-primary/10 rounded-full group"
              >
                Explorer la mediatheque audio
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>

          {/* Right: Audio Player UI */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-background/50 backdrop-blur-xl rounded-3xl border border-border p-6 shadow-2xl">
              {/* Mini player header */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border/50">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/30 to-accent/20 flex items-center justify-center">
                  <Headphones className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-primary font-medium">En cours de lecture</p>
                  <h4 className="font-serif font-bold text-foreground">La Grâce Suffisante</h4>
                  <p className="text-sm text-muted-foreground">Pasteur Joel Mugisho</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-6">
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-primary rounded-full"
                    initial={{ width: "0%" }}
                    animate={isInView ? { width: "35%" } : {}}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>15:45</span>
                  <span>45:32</span>
                </div>
              </div>

              {/* Track list */}
              <div className="space-y-2">
                {audioTracks.map((track, index) => (
                  <motion.div
                    key={track.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    onClick={() => setPlayingId(playingId === track.id ? null : track.id)}
                    className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                      playingId === track.id || (track.id === 1 && playingId === null)
                        ? "bg-primary/10 border border-primary/20"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    <button className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      playingId === track.id || (track.id === 1 && playingId === null)
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-primary/20 hover:text-primary"
                    }`}>
                      {playingId === track.id || (track.id === 1 && playingId === null) ? (
                        <Pause className="h-4 w-4 fill-current" />
                      ) : (
                        <Play className="h-4 w-4 fill-current ml-0.5" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-foreground truncate">{track.title}</h5>
                      <p className="text-xs text-muted-foreground">{track.speaker}</p>
                    </div>
                    <span className="text-sm text-muted-foreground">{track.duration}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Decorative element */}
            <div className="absolute -z-10 top-8 -right-8 w-full h-full rounded-3xl bg-primary/5 border border-primary/10" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
