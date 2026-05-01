"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Play, Pause, Download, Headphones, Video, MapPin, 
  Calendar, Clock, Search, Filter, Grid, List,
  Heart, Share2, CheckCircle, ArrowRight, User,
  ChevronDown, X, LogOut, Settings, Bell, Book, Music,
  Tv, Smartphone, Shield, Mic, ChevronLeft, ChevronRight
} from "lucide-react"
import { useSession } from "next-auth/react"
import { usePwa } from "@/components/pwa-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { HymnBook } from "@/components/cantiques/hymn-book"
import { useAuth } from "@/hooks/useAuth"

export default function EspaceMembrePage() {
  const { isAdmin } = useAuth()
  const { data: session } = useSession()
  const { isStandalone, installApp } = usePwa()
  const [allVideos, setAllVideos] = useState<any[]>([])
  const [allAudio, setAllAudio] = useState<any[]>([])
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("videos")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedVideo, setSelectedVideo] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        setError(null)
        const [videosRes, audioRes, annoncesRes] = await Promise.all([
          fetch("/api/videos?limit=100"),
          fetch("/api/audio?limit=100"),
          fetch("/api/evenements?active=true&limit=20")
        ])

        if (!videosRes.ok || !audioRes.ok) {
          throw new Error("Erreur lors de la récupération des données")
        }

        const videosData = await videosRes.json()
        const audioData = await audioRes.json()
        const annoncesData = annoncesRes.ok ? await annoncesRes.json() : { evenements: [] }

        setAllVideos(videosData.videos || [])
        setAllAudio(audioData.audios || [])

        const fetchedAnnonces = annoncesData.evenements || []
        setAnnouncements(fetchedAnnonces)

        // Gestion des notifications lues
        const lastSeenStr = localStorage.getItem("lastSeenAnnonce")
        if (fetchedAnnonces.length > 0) {
          if (!lastSeenStr) {
            setUnreadCount(fetchedAnnonces.length)
            toast.info(`Bienvenue ! Vous avez ${fetchedAnnonces.length} nouvelles annonces.`)
          } else {
            const lastSeenDate = new Date(lastSeenStr).getTime()
            const newAnnonces = fetchedAnnonces.filter((a: any) => new Date(a.createdAt).getTime() > lastSeenDate)
            setUnreadCount(newAnnonces.length)
            if (newAnnonces.length > 0) {
              toast.info(`Vous avez ${newAnnonces.length} nouvelles annonces depuis votre dernière visite.`)
            }
          }
        }

      } catch (err) {
        console.error("Erreur lors du chargement des données:", err)
        setError("Impossible de charger les contenus. Veuillez réessayer plus tard.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"date" | "views" | "title">("date")
  const [showDownloaded, setShowDownloaded] = useState(false)
  const [playingAudio, setPlayingAudio] = useState<string | null>(null)
  const [downloadingItems, setDownloadingItems] = useState<Set<string>>(new Set())

  const filteredVideos = allVideos
    .filter(video => 
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (!showDownloaded || video.downloaded)
    )
    .sort((a, b) => {
      if (sortBy === "date") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      if (sortBy === "views") return (b.views || 0) - (a.views || 0)
      return a.title.localeCompare(b.title)
    })

  const filteredAudio = allAudio
    .filter(audio => 
      audio.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (!showDownloaded || audio.downloaded)
    )
    .sort((a, b) => {
      if (sortBy === "date") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      if (sortBy === "views") return (b.plays || 0) - (a.plays || 0)
      return a.title.localeCompare(b.title)
    })

  const downloadedVideos = allVideos.filter(v => v.downloaded)
  const downloadedAudio = allAudio.filter(a => a.downloaded)

  const handleDownload = async (type: string, id: string) => {
    const key = `${type}-${id}`
    setDownloadingItems(prev => new Set(prev).add(key))
    // Simuler un téléchargement
    await new Promise(resolve => setTimeout(resolve, 2000))
    setDownloadingItems(prev => {
      const next = new Set(prev)
      next.delete(key)
      return next
    })
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "Date inconnue"
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
    const match = url?.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }

  const getThumbnail = (video: any) => {
    if (video.thumbnail) return video.thumbnail
    const id = getYoutubeId(video.youtubeUrl)
    return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : "/app-logo.png"
  }

  const navigateVideo = (direction: 'prev' | 'next') => {
    if (!selectedVideo) return
    const currentIndex = filteredVideos.findIndex(v => v.id === selectedVideo.id)
    if (direction === 'prev' && currentIndex > 0) {
      setSelectedVideo(filteredVideos[currentIndex - 1])
    } else if (direction === 'next' && currentIndex < filteredVideos.length - 1) {
      setSelectedVideo(filteredVideos[currentIndex + 1])
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                <span className="font-serif text-xl font-bold text-primary">P</span>
              </div>
              <div className="hidden sm:block">
                <span className="font-serif text-lg font-bold text-foreground">Plenitude</span>
                <span className="block text-xs text-muted-foreground -mt-1">Espace Membre</span>
              </div>
            </Link>

            <div className="flex items-center gap-3">
              {!isStandalone && (
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden md:flex items-center gap-2 border-primary/30 text-primary"
                  onClick={installApp}
                >
                  <Smartphone className="h-4 w-4" />
                  Installer l'App
                </Button>
              )}

              <DropdownMenu onOpenChange={(open) => {
                if (open) {
                  setUnreadCount(0)
                  if (announcements.length > 0) {
                    localStorage.setItem("lastSeenAnnonce", announcements[0].createdAt)
                  }
                }
              }}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 p-0">
                  <DropdownMenuLabel className="p-4 border-b border-border">
                    Annonces & Notifications
                  </DropdownMenuLabel>
                  <div className="max-h-96 overflow-y-auto">
                    {announcements.length === 0 ? (
                      <div className="p-8 text-center text-muted-foreground italic">
                        Aucune annonce pour le moment.
                      </div>
                    ) : (
                      announcements.slice(0, 5).map((annonce, i) => (
                        <div key={annonce.id} className="p-4 border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] text-muted-foreground">
                              {annonce.date ? new Date(annonce.date).toLocaleString("fr-FR") : formatDate(annonce.createdAt)}
                            </span>
                          </div>
                          <h4 className="text-sm font-semibold text-foreground mb-1">{annonce.title}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-2">{annonce.content}</p>
                          <Link href="/evenements" className="text-[10px] text-primary hover:underline mt-2 inline-block">
                            En savoir plus
                          </Link>
                        </div>
                      ))
                    )}
                  </div>
                  {announcements.length > 0 && (
                    <DropdownMenuItem asChild className="p-3 text-center justify-center text-xs text-primary font-medium cursor-pointer">
                      <Link href="/evenements">Voir toutes les annonces</Link>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profil">
                      <User className="mr-2 h-4 w-4" />
                      Profil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/parametres">
                      <Settings className="mr-2 h-4 w-4" />
                      Parametres
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">
                        <User className="mr-2 h-4 w-4" />
                        Administration
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  {session?.user?.role === "ADMIN" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">
                        <Shield className="mr-2 h-4 w-4" />
                        Espace Admin
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {(session?.user?.role === "PREDICATEUR" || session?.user?.role === "ADMIN") && (
                    <DropdownMenuItem asChild>
                      <Link href="/predicateur">
                        <Mic className="mr-2 h-4 w-4" />
                        Espace Prédicateur
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/connexion" className="text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Deconnexion
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
            Bienvenue dans votre espace
          </h1>
          <p className="text-muted-foreground">
            Accedez a tous nos contenus, telechargez vos predications preferees et retrouvez l&apos;eglise.
          </p>
        </motion.div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="w-full lg:w-auto overflow-x-auto pb-2 scrollbar-hide">
              <TabsList className="bg-secondary p-1 rounded-full w-fit">
                <TabsTrigger value="videos" className="rounded-full px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Video className="mr-2 h-4 w-4" />
                  Videos
                </TabsTrigger>
                <TabsTrigger value="audio" className="rounded-full px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Headphones className="mr-2 h-4 w-4" />
                  Audio
                </TabsTrigger>
                <TabsTrigger value="cantiques" className="rounded-full px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Book className="mr-2 h-4 w-4" />
                  Cantiques
                </TabsTrigger>
                <TabsTrigger value="downloads" className="rounded-full px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Download className="mr-2 h-4 w-4" />
                  Telecharges
                </TabsTrigger>
                <TabsTrigger value="live" className="rounded-full px-6 data-[state=active]:bg-red-600 data-[state=active]:text-white relative">
                  <Tv className="mr-2 h-4 w-4" />
                  Live
                  <span className="absolute top-1 right-2 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                </TabsTrigger>
                <TabsTrigger value="location" className="rounded-full px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <MapPin className="mr-2 h-4 w-4" />
                  Localisation
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Search & Filters */}
            {(activeTab === "videos" || activeTab === "audio") && (
              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                <div className="relative w-full sm:flex-1 lg:w-64 lg:flex-none">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher..."
                    className="pl-10 bg-secondary border-border"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Trier par</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setSortBy("date")}>
                      <Calendar className="mr-2 h-4 w-4" />
                      Date (recent)
                      {sortBy === "date" && <CheckCircle className="ml-auto h-4 w-4 text-primary" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("views")}>
                      <Play className="mr-2 h-4 w-4" />
                      Popularite
                      {sortBy === "views" && <CheckCircle className="ml-auto h-4 w-4 text-primary" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("title")}>
                      <span className="mr-2">A-Z</span>
                      Alphabetique
                      {sortBy === "title" && <CheckCircle className="ml-auto h-4 w-4 text-primary" />}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <div className="flex items-center border border-border rounded-lg overflow-hidden">
                  <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="icon"
                    className="rounded-none"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "secondary" : "ghost"}
                    size="icon"
                    className="rounded-none"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Videos Tab */}
          <TabsContent value="videos" className="space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : error ? (
              <div className="text-center py-20 bg-destructive/10 rounded-3xl border border-destructive/20">
                <p className="text-destructive font-medium">{error}</p>
                <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                  Réessayer
                </Button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground">
                    {filteredVideos.length} predication{filteredVideos.length > 1 ? "s" : ""} disponible{filteredVideos.length > 1 ? "s" : ""}
                  </p>
                </div>

                {filteredVideos.length > 0 ? (
                  viewMode === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {filteredVideos.map((video, index) => (
                        <motion.div
                          key={video.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all cursor-pointer"
                          onClick={() => setSelectedVideo(video)}
                        >
                          <div className="relative aspect-video bg-muted overflow-hidden">
                            <img
                              src={getThumbnail(video)}
                              alt={video.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                              <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
                                <Play className="h-6 w-6 text-primary-foreground ml-1" />
                              </div>
                            </div>
                            <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 backdrop-blur-sm rounded text-[10px] font-bold text-white uppercase tracking-wider">
                              {video.category || "Predication"}
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="font-medium text-foreground line-clamp-2 mb-1 group-hover:text-primary transition-colors text-sm">
                              {video.title}
                            </h3>
                            <p className="text-xs text-muted-foreground mb-2">{video.speaker}</p>
                            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                              <span>{formatDate(video.createdAt)}</span>
                              <span>{video.views || 0} vues</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredVideos.map((video, index) => (
                        <motion.div
                          key={video.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.03 }}
                          className="group flex items-center gap-4 p-3 bg-card border border-border rounded-xl hover:border-primary/50 transition-all cursor-pointer"
                          onClick={() => setSelectedVideo(video)}
                        >
                          <div className="relative w-40 aspect-video bg-muted rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={getThumbnail(video)}
                              alt={video.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/30 transition-colors">
                              <div className="w-8 h-8 rounded-full bg-primary/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                                <Play className="h-4 w-4 text-primary-foreground ml-0.5" />
                              </div>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-foreground truncate group-hover:text-primary transition-colors text-sm">
                              {video.title}
                            </h3>
                            <div className="flex items-center gap-4 mt-1 text-[11px] text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(video.createdAt)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Play className="h-3 w-3" />
                                {video.views || 0} vues
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )
                ) : (
                  <div className="text-center py-20 bg-secondary/30 rounded-3xl border border-dashed border-border">
                    <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                    <h3 className="text-lg font-medium text-foreground mb-1">Aucune vidéo trouvée</h3>
                    <p className="text-muted-foreground">Essayez d'ajuster votre recherche ou vos filtres.</p>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          {/* Audio Tab */}
          <TabsContent value="audio" className="space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground">
                    {filteredAudio.length} piste{filteredAudio.length > 1 ? "s" : ""} audio disponible{filteredAudio.length > 1 ? "s" : ""}
                  </p>
                </div>

                {filteredAudio.length > 0 ? (
                  <div className="space-y-2">
                    {filteredAudio.map((audio, index) => (
                      <motion.div
                        key={audio.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className={`group flex items-center gap-4 p-4 rounded-xl transition-all cursor-pointer ${
                          playingAudio === audio.id
                            ? "bg-primary/10 border border-primary/30"
                            : "bg-card border border-border hover:border-primary/30"
                        }`}
                        onClick={() => setPlayingAudio(playingAudio === audio.id ? null : audio.id)}
                      >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                          playingAudio === audio.id ? "bg-primary" : "bg-secondary group-hover:bg-primary/20"
                        }`}>
                          {playingAudio === audio.id ? (
                            <Pause className="h-5 w-5 text-primary-foreground" />
                          ) : (
                            <Play className="h-5 w-5 text-foreground ml-0.5" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-medium truncate transition-colors text-sm ${
                            playingAudio === audio.id ? "text-primary" : "text-foreground"
                          }`}>
                            {audio.title}
                          </h3>
                          <div className="flex items-center gap-4 mt-1 text-[11px] text-muted-foreground">
                            <span>{audio.category || "Audio"}</span>
                            <span>{formatDate(audio.createdAt)}</span>
                            <span>{audio.plays || 0} écoutes</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                              <Heart className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDownload("audio", audio.id)
                              }}
                              disabled={downloadingItems.has(`audio-${audio.id}`) || audio.downloaded}
                            >
                              {downloadingItems.has(`audio-${audio.id}`) ? (
                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Download className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-secondary/30 rounded-3xl border border-dashed border-border">
                    <Headphones className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                    <h3 className="text-lg font-medium text-foreground mb-1">Aucun audio trouvé</h3>
                    <p className="text-muted-foreground">Revenez plus tard pour de nouveaux contenus.</p>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          {/* Cantiques Tab */}
          <TabsContent value="cantiques" className="space-y-6">
            <HymnBook />
          </TabsContent>

          {/* Downloads Tab */}
          <TabsContent value="downloads" className="space-y-8">
            <div className="text-center py-20 bg-secondary/30 rounded-3xl border border-dashed border-border">
              <Download className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
              <h3 className="text-lg font-medium text-foreground mb-1">Espace de téléchargement</h3>
              <p className="text-muted-foreground">Vos contenus téléchargés apparaîtront ici pour une écoute hors-ligne.</p>
            </div>
          </TabsContent>

          {/* Live Tab */}
          <TabsContent value="live" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card border border-border rounded-3xl p-8 text-center max-w-2xl mx-auto"
            >
              <div className="w-20 h-20 bg-red-600/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Tv className="h-10 w-10 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Rejoindre le Direct</h2>
              <p className="text-muted-foreground mb-8">
                Suivez les citations et les versets bibliques lus en temps réel pendant le culte sur votre mobile ou tablette.
              </p>
              <Button size="lg" className="bg-red-600 hover:bg-red-700 rounded-full px-8" asChild>
                <Link href="/espace-membre/live">
                  <Tv className="mr-2 h-5 w-5" />
                  Ouvrir l'Espace Live
                </Link>
              </Button>
            </motion.div>
          </TabsContent>

          {/* Location Tab */}
          <TabsContent value="location" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid lg:grid-cols-2 gap-8"
            >
              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="aspect-[4/3] lg:aspect-auto lg:h-[500px]">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3978.472856525944!2d15.232468211029272!3d-4.352512146958869!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1a6a3130fa579c95%3A0x87a7ed5ea0d45413!2s-4.352517%2C%2015.234657!5e0!3m2!1sfr!2scd!4v1710000000000!5m2!1sfr!2scd"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Location de l'eglise"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Nous trouver</h2>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">Adresse</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        03 Av. Mafuta, Q. Mfinda<br />
                        Commune de Ngaliema<br />
                        Kinshasa, RD Congo
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-2xl p-6">
                  <h3 className="font-serif text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Horaires des cultes
                  </h3>
                  <div className="space-y-3">
                    {[
                      { day: "Dimanche", time: "09h00 - 12h00", type: "Culte principal" },
                      { day: "Mercredi", time: "18h00 - 20h00", type: "Etude biblique" },
                      { day: "Vendredi", time: "18h00 - 21h00", type: "Nuit de priere" },
                    ].map((schedule, i) => (
                      <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                        <div>
                          <p className="text-sm font-medium text-foreground">{schedule.day}</p>
                          <p className="text-[11px] text-muted-foreground">{schedule.type}</p>
                        </div>
                        <span className="px-3 py-1 bg-primary/10 text-primary text-[11px] rounded-full font-bold">
                          {schedule.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full py-6 shadow-lg shadow-primary/20"
                  onClick={() => window.open("https://maps.app.goo.gl/ZT9YKAkDYa12Le2ZA", "_blank")}
                >
                  <MapPin className="mr-2 h-5 w-5" />
                  Ouvrir dans Google Maps
                </Button>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Video Player Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/95 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-5xl bg-card border border-border rounded-3xl overflow-hidden shadow-2xl"
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-10 bg-background/50 hover:bg-background backdrop-blur-md rounded-full"
                onClick={() => setSelectedVideo(null)}
              >
                <X className="h-5 w-5" />
              </Button>

              <div className="aspect-video w-full bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${getYoutubeId(selectedVideo.youtubeUrl)}?autoplay=1`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded uppercase">
                      {selectedVideo.category || "Predication"}
                    </span>
                    <span className="text-xs text-muted-foreground">{formatDate(selectedVideo.createdAt)}</span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-foreground mb-1 line-clamp-2">
                    {selectedVideo.title}
                  </h2>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {selectedVideo.speaker}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    onClick={() => navigateVideo('prev')}
                    disabled={filteredVideos.findIndex(v => v.id === selectedVideo.id) === 0}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    onClick={() => navigateVideo('next')}
                    disabled={filteredVideos.findIndex(v => v.id === selectedVideo.id) === filteredVideos.length - 1}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                  <Button className="rounded-full px-6 bg-primary hover:bg-primary/90">
                    <Download className="mr-2 h-4 w-4" />
                    Télécharger
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
