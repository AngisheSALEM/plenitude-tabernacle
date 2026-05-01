"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Calendar, MapPin, ArrowLeft, Loader2, Megaphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"

interface Announcement {
  id: string
  title: string
  content: string
  imageUrl?: string
  isActive: boolean
  date?: string
  location?: string
  createdAt: string
}

export default function EvenementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/api/evenements?active=true&limit=50")
      .then((res) => res.json())
      .then((data) => {
        setAnnouncements(data.evenements ?? [])
      })
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-24 max-w-2xl">
        <div className="flex items-center gap-4 mb-12">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="font-serif text-3xl font-bold">Fil d&apos;Actualités</h1>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Chargement des actualités...</p>
          </div>
        ) : announcements.length > 0 ? (
          <div className="space-y-12">
            {announcements.map((announcement, index) => (
              <motion.article
                key={announcement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm"
              >
                {/* Post Header */}
                <div className="p-4 flex items-center gap-3 border-b border-border/50">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Megaphone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">{announcement.title}</h3>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                       <Calendar className="h-3 w-3" />
                       <span>
                         {announcement.date
                           ? new Date(announcement.date).toLocaleString("fr-FR", { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                           : new Date(announcement.createdAt).toLocaleDateString("fr-FR", { day: 'numeric', month: 'long', year: 'numeric' })
                         }
                       </span>
                    </div>
                  </div>
                </div>

                {/* Post Image */}
                {announcement.imageUrl && (
                  <div className="relative aspect-square w-full">
                    <Image
                      src={announcement.imageUrl}
                      alt={announcement.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Post Content */}
                <div className="p-6 space-y-4">
                  {announcement.location && (
                    <div className="flex items-center gap-2 text-sm text-primary font-medium">
                      <MapPin className="h-4 w-4" />
                      <span>{announcement.location}</span>
                    </div>
                  )}

                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <p className="text-base leading-relaxed whitespace-pre-wrap text-foreground/90">
                      {announcement.content}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-border/50 text-[10px] text-muted-foreground">
                    Publié le {new Date(announcement.createdAt).toLocaleDateString("fr-FR")}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed border-border">
            <Megaphone className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <h3 className="text-lg font-medium">Aucune actualité</h3>
            <p className="text-muted-foreground mt-1">Revenez plus tard pour de nouvelles annonces.</p>
            <Button variant="outline" className="mt-6" asChild>
              <Link href="/">Retour à l&apos;accueil</Link>
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
