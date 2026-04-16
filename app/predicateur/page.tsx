"use client"

import { motion } from "framer-motion"
import {
  Plus,
  Search,
  BookOpen,
  Tv,
  ArrowRight,
  Clock
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Send } from "lucide-react"

export default function PredicateurDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sermons, setSermons] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchSermons = () => {
    setIsLoading(true)
    fetch('/api/sermons')
      .then(res => res.json())
      .then(data => {
        if (data.sermons) setSermons(data.sermons)
        setIsLoading(false)
      })
  }

  useEffect(() => {
    fetchSermons()
  }, [])

  const handleShare = async (id: string) => {
    try {
      const response = await fetch(`/api/sermons/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isShared: true }),
      })
      if (response.ok) {
        toast.success("Message envoyé à l'admin !")
        fetchSermons()
      } else {
        toast.error("Erreur lors de l'envoi")
      }
    } catch (error) {
      toast.error("Erreur réseau")
    }
  }

  const filteredSermons = sermons.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Espace Prédicateur</h1>
          <p className="text-muted-foreground">Préparez vos messages et gérez vos directs.</p>
        </div>
        <Link href="/predicateur/editeur">
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Nouveau Message
          </Button>
        </Link>
      </div>

      <div className="relative max-w-2xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher dans vos messages ou slides..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="md:col-span-2 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Vos Messages ({filteredSermons.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
                <p>Chargement...</p>
            ) : filteredSermons.length === 0 ? (
                <p className="text-sm text-muted-foreground italic text-center py-8">Aucun message trouvé.</p>
            ) : (
                <div className="grid gap-4">
                    {filteredSermons.map(sermon => (
                        <div key={sermon.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-xl hover:bg-muted transition-colors group">
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold truncate">{sermon.title}</h3>
                                <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {new Date(sermon.updatedAt).toLocaleDateString()}
                                    </span>
                                    <Badge variant="outline" className="text-[10px]">{sermon.slides?.length || 0} slides</Badge>
                                    {sermon.isShared && (
                                        <Badge variant="secondary" className="bg-green-500/10 text-green-500 hover:bg-green-500/20 text-[10px] border-green-500/20">
                                            Envoyé à l&apos;admin
                                        </Badge>
                                    )}
                                </div>
                            </div>
                            {!sermon.isShared && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="mr-2 text-primary hover:text-primary/80 hover:bg-primary/5"
                                    onClick={() => handleShare(sermon.id)}
                                >
                                    <Send className="mr-1 h-3.5 w-3.5" />
                                    Partager
                                </Button>
                            )}
                            <Button variant="ghost" size="sm" asChild>
                                <Link href={`/predicateur/live/${sermon.id}`}>
                                    Gérer
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    ))}
                </div>
            )}
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 transition-colors h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tv className="h-5 w-5 text-primary" />
              Directs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
                Sélectionnez un message à gauche pour lancer un direct et partager vos slides.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
