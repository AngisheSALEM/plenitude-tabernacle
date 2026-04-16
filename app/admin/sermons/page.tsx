"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  BookOpen,
  Search,
  Play,
  Clock,
  User,
  ArrowRight,
  ExternalLink
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function AdminSermonsPage() {
  const [sermons, setSermons] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetch('/api/sermons?shared=true')
      .then(res => res.json())
      .then(data => {
        if (data.sermons) setSermons(data.sermons)
        setIsLoading(false)
      })
      .catch(err => {
        console.error("Failed to fetch sermons", err)
        setIsLoading(false)
      })
  }, [])

  const filteredSermons = sermons.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    `${s.author.firstName} ${s.author.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-foreground">
            Prédications Partagées
          </h2>
          <p className="text-muted-foreground">
            Gérez les messages envoyés par les prédicateurs pour le live.
          </p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher par titre ou prédicateur..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : filteredSermons.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>Aucune prédication partagée pour le moment.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredSermons.map((sermon, index) => (
            <motion.div
              key={sermon.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:border-primary/30 transition-colors overflow-hidden group">
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg truncate">{sermon.title}</h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="h-3.5 w-3.5" />
                          {sermon.author.firstName} {sermon.author.lastName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {new Date(sermon.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                        <Badge variant="outline" className="text-[10px] h-5">
                          {sermon.slides?.length || 0} slides
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Link href={`/admin/live/${sermon.id}`}>
                        <Button className="bg-primary hover:bg-primary/90">
                          <Play className="mr-2 h-4 w-4" />
                          Lancer le Live
                        </Button>
                      </Link>
                      <Link href={`/predicateur/live/${sermon.id}`} target="_blank">
                        <Button variant="ghost" size="icon" title="Voir l'aperçu">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
