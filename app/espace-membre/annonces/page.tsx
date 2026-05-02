"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ChevronLeft,
  Calendar,
  MapPin,
  Bell,
  Info,
  Clock,
  ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function MemberAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await fetch("/api/evenements?active=true&limit=50")
        const data = await res.json()
        if (data.evenements) {
          setAnnouncements(data.evenements)
        }
      } catch (error) {
        console.error("Error fetching announcements:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchAnnouncements()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-16">
            <Button variant="ghost" size="sm" asChild className="mr-4">
              <Link href="/espace-membre">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Retour
              </Link>
            </Button>
            <h1 className="font-serif text-xl font-bold text-foreground">Annonces & Événements</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h2 className="text-3xl font-serif font-bold text-foreground mb-2 flex items-center gap-3">
            <Bell className="h-8 w-8 text-primary" />
            Dernières Annonces
          </h2>
          <p className="text-muted-foreground">
            Restez informé des activités et des événements importants de Plénitude Tabernacle.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : announcements.length === 0 ? (
          <Card className="bg-card border-border text-center py-20">
            <CardContent>
              <Info className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
              <h3 className="text-lg font-medium text-foreground">Aucune annonce pour le moment</h3>
              <p className="text-muted-foreground">Revenez bientôt pour de nouvelles mises à jour.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {announcements.map((annonce, index) => (
              <motion.div
                key={annonce.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-card border-border overflow-hidden hover:border-primary/50 transition-all group">
                  <div className="md:flex">
                    {annonce.imageUrl && (
                      <div className="md:w-64 h-48 md:h-auto relative overflow-hidden shrink-0">
                        <img
                          src={annonce.imageUrl}
                          alt={annonce.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <CardContent className="p-6 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                          {annonce.date ? "Événement" : "Information"}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(annonce.createdAt)}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                        {annonce.title}
                      </h3>

                      <p className="text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
                        {annonce.content}
                      </p>

                      <div className="flex flex-wrap gap-4 pt-4 border-t border-border">
                        {annonce.date && (
                          <div className="flex items-center gap-2 text-sm text-foreground font-medium">
                            <Calendar className="h-4 w-4 text-primary" />
                            {new Date(annonce.date).toLocaleString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        )}
                        {annonce.location && (
                          <div className="flex items-center gap-2 text-sm text-foreground font-medium">
                            <MapPin className="h-4 w-4 text-primary" />
                            {annonce.location}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
