"use client"

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

const stats = [
  {
    title: "Total Videos",
    value: "156",
    change: "+12",
    changeLabel: "ce mois",
    icon: Video,
    color: "bg-blue-500/10 text-blue-500"
  },
  {
    title: "Total Audio",
    value: "89",
    change: "+5",
    changeLabel: "ce mois",
    icon: Headphones,
    color: "bg-purple-500/10 text-purple-500"
  },
  {
    title: "Membres",
    value: "2,847",
    change: "+234",
    changeLabel: "ce mois",
    icon: Users,
    color: "bg-green-500/10 text-green-500"
  },
  {
    title: "Vues totales",
    value: "45.2K",
    change: "+18%",
    changeLabel: "vs mois dernier",
    icon: Eye,
    color: "bg-primary/10 text-primary"
  },
]

const recentSermons = [
  {
    id: 1,
    title: "La puissance de la resurrection",
    type: "VIDEO",
    date: "2026-03-28",
    views: 1234,
    speaker: "Pasteur Joel Mugisho"
  },
  {
    id: 2,
    title: "Marcher dans la foi",
    type: "AUDIO",
    date: "2026-03-25",
    views: 856,
    speaker: "Pasteur Joel Mugisho"
  },
  {
    id: 3,
    title: "La grace suffisante",
    type: "VIDEO",
    date: "2026-03-22",
    views: 2341,
    speaker: "Pasteur Joel Mugisho"
  },
  {
    id: 4,
    title: "Vivre par l&apos;Esprit",
    type: "AUDIO",
    date: "2026-03-20",
    views: 678,
    speaker: "Pasteur Joel Mugisho"
  },
]

const upcomingEvents = [
  {
    title: "Culte du Dimanche",
    date: "Dim 30 Mars",
    time: "09:00",
    type: "Culte"
  },
  {
    title: "Etude Biblique",
    date: "Mer 02 Avril",
    time: "18:00",
    type: "Enseignement"
  },
  {
    title: "Nuit de Priere",
    date: "Ven 04 Avril",
    time: "21:00",
    type: "Priere"
  },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-foreground">
            Bienvenue, Pasteur Joel
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
                  <div className="flex items-center gap-1 text-green-500 text-sm">
                    <TrendingUp className="h-3 w-3" />
                    <span>{stat.change}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
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
              {recentSermons.map((sermon) => (
                <div 
                  key={sermon.id}
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
              ))}
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
              {upcomingEvents.map((event, index) => (
                <div 
                  key={index}
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
              ))}
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
            <Link href="/admin/annonces/nouveau">
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
