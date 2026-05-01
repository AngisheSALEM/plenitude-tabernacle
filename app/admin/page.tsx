"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Video, 
  Headphones, 
  Users, 
  Eye,
  TrendingUp,
  Calendar,
  Clock,
  ArrowUpRight,
  Play,
  BookOpen
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { cn } from "@/lib/utils"

export default function AdminDashboard() {
  const { data: session } = useSession()
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats")
        const json = await res.json()
        setData(json)
      } catch (error) {
        console.error("Erreur lors du chargement des stats:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchStats()
  }, [])

  const stats = [
    {
      title: "Total Videos",
      value: data?.stats?.videos || 0,
      change: data?.stats?.videosGrowth || "+0",
      changeLabel: "ce mois",
      icon: Video,
      color: "bg-blue-500/10 text-blue-500"
    },
    {
      title: "Total Audio",
      value: data?.stats?.audio || 0,
      change: data?.stats?.audioGrowth || "+0",
      changeLabel: "ce mois",
      icon: Headphones,
      color: "bg-purple-500/10 text-purple-500"
    },
    {
      title: "Membres",
      value: data?.stats?.users || 0,
      change: data?.stats?.usersGrowth || "+0",
      changeLabel: "ce mois",
      icon: Users,
      color: "bg-green-500/10 text-green-500"
    },
    {
      title: "Vues totales",
      value: data?.stats?.views || 0,
      change: data?.stats?.viewsGrowth || "+0%",
      changeLabel: "vs mois dernier",
      icon: Eye,
      color: "bg-primary/10 text-primary"
    },
  ]

  const recentSermons = data?.recentContent || []
  const upcomingEvents = data?.upcomingEvents || []

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-foreground">
            Bienvenue, {session?.user?.firstName || "Pasteur"}
          </h2>
          <p className="text-muted-foreground">
            Voici un apercu de votre plateforme aujourd&apos;hui.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/videos/nouveau">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Video className="mr-2 h-4 w-4" />
              Ajouter Video
            </Button>
          </Link>
          <Link href="/admin/audio/nouveau">
            <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
              <Headphones className="mr-2 h-4 w-4" />
              Ajouter Audio
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="bg-card border-border hover:border-primary/30 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className={`p-2.5 rounded-lg ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div className={cn(
                    "flex items-center gap-1 text-sm",
                    stat.change.startsWith('-') ? "text-red-500" : "text-green-500"
                  )}>
                    <TrendingUp className={cn("h-3 w-3", stat.change.startsWith('-') && "rotate-180")} />
                    <span>{stat.change}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-bold text-foreground">
                    {isLoading ? "..." : stat.value.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-2">{stat.changeLabel}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Sermons */}
        <Card className="lg:col-span-2 bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold text-foreground">
              Predications Recentes
            </CardTitle>
            <Link href="/admin/videos">
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                Voir tout
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                <p className="text-center py-8 text-muted-foreground">Chargement...</p>
              ) : recentSermons.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">Aucune prédication récente</p>
              ) : (
                recentSermons.map((sermon: any) => (
                  <div
                    key={`${sermon.type}-${sermon.id}`}
                    className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      {sermon.type === "VIDEO" ? (
                        <Video className="h-5 w-5 text-primary" />
                      ) : (
                        <Headphones className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{sermon.title}</p>
                      <p className="text-sm text-muted-foreground">{sermon.speaker}</p>
                    </div>
                    <div className="hidden sm:flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {sermon.views}
                      </span>
                      <span>{new Date(sermon.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
                    </div>
                    <Button variant="ghost" size="icon" className="shrink-0">
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">
              Evenements a Venir
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                <p className="text-center py-8 text-muted-foreground">Chargement...</p>
              ) : upcomingEvents.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">Aucun événement à venir</p>
              ) : (
                upcomingEvents.map((event: any, index: number) => (
                  <div
                    key={`event-${index}-${event.title}`}
                    className="flex items-start gap-4 p-3 rounded-lg border border-border hover:border-primary/30 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex flex-col items-center justify-center shrink-0">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground">{event.title}</p>
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <span>{event.date}</span>
                        <span>-</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {event.time}
                        </span>
                      </div>
                      <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        {event.type}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">
            Actions Rapides
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link href="/admin/videos/nouveau">
              <div className="p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer text-center group">
                <div className="w-12 h-12 mx-auto rounded-full bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Video className="h-5 w-5 text-blue-500" />
                </div>
                <p className="mt-3 text-sm font-medium text-foreground">Nouvelle Video</p>
              </div>
            </Link>
            <Link href="/admin/audio/nouveau">
              <div className="p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer text-center group">
                <div className="w-12 h-12 mx-auto rounded-full bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Headphones className="h-5 w-5 text-purple-500" />
                </div>
                <p className="mt-3 text-sm font-medium text-foreground">Nouvel Audio</p>
              </div>
            </Link>
            <Link href="/admin/annonces">
              <div className="p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer text-center group">
                <div className="w-12 h-12 mx-auto rounded-full bg-green-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
                <p className="mt-3 text-sm font-medium text-foreground">Nouvelle Annonce</p>
              </div>
            </Link>
            <Link href="/admin/sermons">
              <div className="p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer text-center group">
                <div className="w-12 h-12 mx-auto rounded-full bg-orange-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BookOpen className="h-5 w-5 text-orange-500" />
                </div>
                <p className="mt-3 text-sm font-medium text-foreground">Gérer Live</p>
              </div>
            </Link>
            <Link href="/admin/parametres">
              <div className="p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer text-center group">
                <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <p className="mt-3 text-sm font-medium text-foreground">Gerer Horaires</p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
