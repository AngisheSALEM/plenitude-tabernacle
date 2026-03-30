"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Bell, Calendar, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const announcements = [
  {
    id: 1,
    title: "Semaine de Prière et de Jeûne",
    content: "Rejoignez-nous pour une semaine spéciale de prière et de jeûne du 1er au 7 Avril. Programme spécial chaque soir à 18h.",
    date: "25 Mars 2026",
    isActive: true,
  },
  {
    id: 2,
    title: "Conférence des Femmes 2026",
    content: "Inscription ouverte pour notre conférence annuelle des femmes. Thème : 'Femmes de Valeur'. Places limitées.",
    date: "20 Mars 2026",
    isActive: true,
  },
  {
    id: 3,
    title: "Baptême Collectif",
    content: "Le prochain baptême aura lieu le dernier dimanche d'Avril. Inscrivez-vous auprès du secrétariat de l'église.",
    date: "18 Mars 2026",
    isActive: true,
  },
]

export function NewsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

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
            Annonces &amp; Événements
          </h2>
          <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto text-pretty">
            Restez informé des dernières actualités et événements de notre communauté.
          </p>
        </motion.div>

        {/* Announcements Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {announcements.map((announcement, index) => (
            <motion.article
              key={announcement.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + index * 0.15 }}
              className="group relative bg-background/50 backdrop-blur-sm rounded-2xl border border-border hover:border-primary/30 p-6 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
            >
              {/* Active indicator */}
              {announcement.isActive && (
                <div className="absolute top-4 right-4">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                </div>
              )}
              
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{announcement.date}</span>
                </div>
                
                <h3 className="font-serif text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {announcement.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {announcement.content}
                </p>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-primary hover:text-primary hover:bg-primary/10 p-0 h-auto group/btn"
                >
                  En savoir plus
                  <ArrowRight className="ml-1 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
