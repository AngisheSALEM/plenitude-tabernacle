"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Play, Pause, Download, Headphones, Video, MapPin, 
  Calendar, Clock, Search, Filter, Grid, List,
  Heart, Share2, CheckCircle, ArrowRight, User,
  ChevronDown, X, LogOut, Settings, Bell, Book, Music,
  Tv, Smartphone
} from "lucide-react"
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

export default function EspaceMembrePage() {
  const [allVideos, setAllVideos] = useState<any[]>([])
  const [allAudio, setAllAudio] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("videos")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [videosRes, audioRes] = await Promise.all([
          fetch("/api/videos?limit=100"),
          fetch("/api/audio?limit=100")
        ])

        const videosData = await videosRes.json()
        const audioData = await audioRes.json()

        setAllVideos(videosData.videos || [])
        setAllAudio(audioData.audios || [])
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"date" | "views" | "title">("date")
  const [showDownloaded, setShowDownloaded] = useState(false)
  const [playingAudio, setPlayingAudio] = useState<number | null>(null)
  const [downloadingItems, setDownloadingItems] = useState<Set<string>>(new Set())

  const filteredVideos = allVideos
    .filter(video => 
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (!showDownloaded || video.downloaded)
    )
    .sort((a, b) => {
      if (sortBy === "date") return new Date(b.date).getTime() - new Date(a.date).getTime()
      if (sortBy === "views") return b.views - a.views
      return a.title.localeCompare(b.title)
    })

  const filteredAudio = allAudio
    .filter(audio => 
      audio.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (!showDownloaded || audio.downloaded)
    )
    .sort((a, b) => {
      if (sortBy === "date") return new Date(b.date).getTime() - new Date(a.date).getTime()
      if (sortBy === "views") return b.plays - a.plays
      return a.title.localeCompare(b.title)
    })

  const downloadedVideos = allVideos.filter(v => v.downloaded)
  const downloadedAudio = allAudio.filter(a => a.downloaded)

  const handleDownload = async (type: string, id: string) => {
    const key = `${type}-${id}`
    setDownloadingItems(prev => new Set(prev).add(key))
    await new Promise(resolve => setTimeout(resolve, 2000))
    setDownloadingItems(prev => {
      const next = new Set(prev)
      next.delete(key)
      return next
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
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
              <Link href="/parametres?tab=preferences">
                <Button variant="outline" size="sm" className="hidden md:flex items-center gap-2 border-primary/30 text-primary">
                  <Smartphone className="h-4 w-4" />
                  Installer l'App
                </Button>
              </Link>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
              </Button>
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
            ) : (
              <>
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">
                {filteredVideos.length} predication{filteredVideos.length > 1 ? "s" : ""} disponible{filteredVideos.length > 1 ? "s" : ""}
              </p>
            </div>

            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredVideos.map((video, index) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all"
                  >
                    <div className="relative aspect-video bg-muted">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                          <Play className="h-6 w-6 text-primary-foreground ml-1" />
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2 px-2 py-1 bg-background/80 backdrop-blur-sm rounded text-xs font-medium">
                        {video.duration}
                      </div>
                      {video.downloaded && (
                        <div className="absolute top-2 left-2 px-2 py-1 bg-primary/90 rounded text-xs font-medium text-primary-foreground flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Telecharge
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-foreground line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                        {video.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">{video.speaker}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{formatDate(video.date)}</span>
                        <span>{video.views.toLocaleString()} vues</span>
                      </div>
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                        <Button variant="ghost" size="sm" className="flex-1">
                          <Heart className="mr-1 h-4 w-4" />
                          Favoris
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleDownload("video", video.id)}
                          disabled={downloadingItems.has(`video-${video.id}`) || video.downloaded}
                        >
                          {downloadingItems.has(`video-${video.id}`) ? (
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1" />
                          ) : (
                            <Download className="mr-1 h-4 w-4" />
                          )}
                          {video.downloaded ? "OK" : "DL"}
                        </Button>
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
                    className="group flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/50 transition-all"
                  >
                    <div className="relative w-40 aspect-video bg-muted rounded-lg overflow-hidden flex-shrink-0">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-primary/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                          <Play className="h-4 w-4 text-primary-foreground ml-0.5" />
                        </div>
                      </div>
                      <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-background/80 backdrop-blur-sm rounded text-xs font-medium">
                        {video.duration}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                        {video.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{video.speaker}</p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(video.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Play className="h-3 w-3" />
                          {video.views.toLocaleString()} vues
                        </span>
                        {video.downloaded && (
                          <span className="flex items-center gap-1 text-primary">
                            <CheckCircle className="h-3 w-3" />
                            Telecharge
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownload("video", video.id)}
                        disabled={downloadingItems.has(`video-${video.id}`) || video.downloaded}
                      >
                        {downloadingItems.has(`video-${video.id}`) ? (
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : video.downloaded ? (
                          <CheckCircle className="h-4 w-4 text-primary" />
                        ) : (
                          <Download className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </motion.div>
                ))}
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
                    <h3 className={`font-medium truncate transition-colors ${
                      playingAudio === audio.id ? "text-primary" : "text-foreground"
                    }`}>
                      {audio.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{audio.speaker}</p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                      <span>{audio.category}</span>
                      <span>{formatDate(audio.date)}</span>
                      <span>{audio.plays.toLocaleString()} ecoutes</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground hidden sm:block">{audio.duration}</span>
                    {audio.downloaded && (
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        DL
                      </span>
                    )}
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
            </>
            )}
          </TabsContent>

          {/* Cantiques Tab */}
          <TabsContent value="cantiques" className="space-y-6">
            <HymnBook />
          </TabsContent>

          {/* Downloads Tab */}
          <TabsContent value="downloads" className="space-y-8">
            {/* Downloaded Videos */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-xl font-bold text-foreground flex items-center gap-2">
                  <Video className="h-5 w-5 text-primary" />
                  Videos telechargees
                </h2>
                <span className="text-sm text-muted-foreground">{downloadedVideos.length} video(s)</span>
              </div>
              
              {downloadedVideos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {downloadedVideos.map((video, index) => (
                    <motion.div
                      key={video.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all"
                    >
                      <div className="relative aspect-video bg-muted">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <Play className="h-5 w-5 text-primary-foreground ml-0.5" />
                          </div>
                        </div>
                        <div className="absolute bottom-2 right-2 px-2 py-1 bg-background/80 backdrop-blur-sm rounded text-xs font-medium">
                          {video.duration}
                        </div>
                        <div className="absolute top-2 left-2 px-2 py-1 bg-green-500/90 rounded text-xs font-medium text-white flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Hors-ligne
                        </div>
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium text-foreground text-sm line-clamp-2 group-hover:text-primary transition-colors">
                          {video.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">{formatDate(video.date)}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-card border border-border rounded-xl">
                  <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Aucune video telechargee</p>
                  <Button variant="outline" className="mt-4" onClick={() => setActiveTab("videos")}>
                    Explorer les videos
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Downloaded Audio */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-xl font-bold text-foreground flex items-center gap-2">
                  <Headphones className="h-5 w-5 text-primary" />
                  Audio telecharges
                </h2>
                <span className="text-sm text-muted-foreground">{downloadedAudio.length} piste(s)</span>
              </div>
              
              {downloadedAudio.length > 0 ? (
                <div className="space-y-2">
                  {downloadedAudio.map((audio, index) => (
                    <motion.div
                      key={audio.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/50 transition-all cursor-pointer"
                      onClick={() => setPlayingAudio(playingAudio === audio.id ? null : audio.id)}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                        playingAudio === audio.id ? "bg-primary" : "bg-secondary group-hover:bg-primary/20"
                      }`}>
                        {playingAudio === audio.id ? (
                          <Pause className="h-4 w-4 text-primary-foreground" />
                        ) : (
                          <Play className="h-4 w-4 text-foreground ml-0.5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground truncate">{audio.title}</h3>
                        <p className="text-sm text-muted-foreground">{audio.speaker}</p>
                      </div>
                      <span className="text-sm text-muted-foreground">{audio.duration}</span>
                      <span className="px-2 py-1 bg-green-500/10 text-green-600 dark:text-green-400 text-xs rounded-full">
                        Hors-ligne
                      </span>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-card border border-border rounded-xl">
                  <Headphones className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Aucun audio telecharge</p>
                  <Button variant="outline" className="mt-4" onClick={() => setActiveTab("audio")}>
                    Explorer les audio
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Live Tab */}
          <TabsContent value="live" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card border border-border rounded-3xl p-8 text-center"
            >
              <h2 className="text-2xl font-bold mb-4">Rejoindre le Direct</h2>
              <p className="text-muted-foreground mb-8">
                Suivez les citations et les versets bibliques lus en temps réel pendant le culte.
              </p>
              <Button size="lg" className="bg-red-600 hover:bg-red-700" asChild>
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
              {/* Map */}
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="aspect-[4/3] lg:aspect-auto lg:h-[500px]">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3978.5289682959007!2d15.2662934!3d-4.3246379!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1a6a33c76c7c7c7c%3A0x1c7c7c7c7c7c7c7c!2sKinshasa%2C%20Democratic%20Republic%20of%20the%20Congo!5e0!3m2!1sen!2s!4v1234567890"
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

              {/* Info */}
              <div className="space-y-6">
                <div className="bg-card border border-border rounded-xl p-6">
                  <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
                    Nous trouver
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">Adresse</h3>
                        <p className="text-muted-foreground">
                          Avenue de la Paix, N 123<br />
                          Commune de Gombe<br />
                          Kinshasa, RD Congo
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-6">
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
                          <p className="font-medium text-foreground">{schedule.day}</p>
                          <p className="text-sm text-muted-foreground">{schedule.type}</p>
                        </div>
                        <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full font-medium">
                          {schedule.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full py-6">
                  <MapPin className="mr-2 h-5 w-5" />
                  Ouvrir dans Google Maps
                </Button>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
