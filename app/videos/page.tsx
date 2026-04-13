"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { Play, Clock, User, Search, Grid, List, Calendar, Share2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { formatDate } from "@/lib/format"
import { extractYoutubeId } from "@/lib/youtube"

const categories = [
  "Toutes",
  "Predications",
  "Enseignements",
  "Louange",
  "Temoignages",
  "Conferences",
]

interface Video {
  id: string
  title: string
  speaker: string
  date: string
  duration: string | null
  category: string
  description: string | null
  thumbnail: string | null
  youtubeUrl: string | null
}

const categoryMap: Record<string, string> = {
  "Predication": "Predications",
  "Prédication": "Predications",
  "Enseignement": "Enseignements",
  "Louange": "Louange",
  "Temoignage": "Temoignages",
  "Témoignage": "Temoignages",
  "Conference": "Conferences",
  "Conférence": "Conferences",
}

export default function VideosPage() {
  const [selectedCategory, setSelectedCategory] = useState("Toutes")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [videos, setVideos] = useState<Video[]>([])

  useEffect(() => {
    fetch("/api/videos?limit=50")
      .then((r) => r.json())
      .then((data) => setVideos(data.videos ?? []))
      .catch(console.error)
  }, [])

  const filteredVideos = videos.filter((video) => {
    const displayCat = categoryMap[video.category] ?? video.category
    const matchesCategory = selectedCategory === "Toutes" || displayCat === selectedCategory
    const matchesSearch =
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.speaker.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
        
        <div className="relative container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <p className="text-primary font-medium mb-4 tracking-wider uppercase text-sm">
              Mediatheque Video
            </p>
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
              Nos Predications en Video
            </h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Retrouvez toutes nos predications, enseignements et moments de louange en video. 
              Une bibliotheque complete pour nourrir votre foi.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b border-border/50 sticky top-20 bg-background/95 backdrop-blur-xl z-30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une video..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 bg-card border-border/50 rounded-full"
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full ${
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "border-border/50 hover:border-primary/50 hover:text-primary"
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* View Mode */}
            <div className="flex items-center gap-2 bg-card rounded-full p-1 border border-border/50">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewMode("grid")}
                className={`rounded-full h-8 w-8 ${viewMode === "grid" ? "bg-primary text-primary-foreground" : ""}`}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewMode("list")}
                className={`rounded-full h-8 w-8 ${viewMode === "list" ? "bg-primary text-primary-foreground" : ""}`}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Videos Grid/List */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <p className="text-muted-foreground">
              {filteredVideos.length} video{filteredVideos.length > 1 ? "s" : ""} trouvee{filteredVideos.length > 1 ? "s" : ""}
            </p>
          </div>

          {viewMode === "grid" ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((video, index) => (
                <motion.article
                  key={video.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedVideo(video)}
                  className="group cursor-pointer"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-card border border-border/50 mb-4">
                    {video.thumbnail ? (
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/20" />
                    )}
                    
                    {/* Category badge */}
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-primary/90 text-xs font-medium text-primary-foreground">
                      {video.category}
                    </div>
                    
                    {/* Play button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div 
                        className="p-4 rounded-full bg-primary/90 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
                        whileHover={{ scale: 1.1 }}
                      >
                        <Play className="h-8 w-8 text-primary-foreground fill-current" />
                      </motion.div>
                    </div>
                    
                    {/* Duration badge */}
                    {video.duration && (
                      <div className="absolute bottom-3 right-3 px-2 py-1 rounded-md bg-background/80 backdrop-blur-sm text-xs font-medium text-foreground">
                        {video.duration}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="space-y-2">
                    <h3 className="font-serif text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {video.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {video.speaker}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(video.date)}
                      </span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredVideos.map((video, index) => (
                <motion.article
                  key={video.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedVideo(video)}
                  className="group flex gap-6 p-4 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all cursor-pointer"
                >
                  {/* Thumbnail */}
                  <div className="relative w-48 aspect-video rounded-xl overflow-hidden bg-muted flex-shrink-0">
                    {video.thumbnail ? (
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/20" />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="p-3 rounded-full bg-primary/90">
                        <Play className="h-5 w-5 text-primary-foreground fill-current" />
                      </div>
                    </div>
                    {video.duration && (
                      <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-background/80 text-xs">
                        {video.duration}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="inline-block px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-2">
                          {video.category}
                        </span>
                        <h3 className="font-serif text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                          {video.title}
                        </h3>
                      </div>
                    </div>
                    <p className="text-muted-foreground line-clamp-2">{video.description}</p>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {video.speaker}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(video.date)}
                      </span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Video Modal */}
      {selectedVideo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/95 backdrop-blur-xl"
          onClick={() => setSelectedVideo(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-full max-w-5xl bg-card rounded-3xl overflow-hidden border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 rounded-full bg-background/50 backdrop-blur-sm"
              onClick={() => setSelectedVideo(null)}
            >
              <X className="h-5 w-5" />
            </Button>

            {/* Video Player */}
            <div className="relative aspect-video bg-muted">
              {selectedVideo.youtubeUrl ? (
                <iframe
                  src={`https://www.youtube.com/embed/${extractYoutubeId(selectedVideo.youtubeUrl)}?autoplay=1`}
                  title={selectedVideo.title}
                  className="absolute inset-0 w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/20 flex items-center justify-center">
                  <p className="text-primary-foreground">Vidéo non disponible</p>
                </div>
              )}
            </div>

            {/* Video Info */}
            <div className="p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
                    {selectedVideo.category}
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-foreground">
                    {selectedVideo.title}
                  </h2>
                </div>
                <Button variant="outline" size="icon" className="rounded-full">
                    <Share2 className="h-4 w-4" />
                  </Button>
              </div>
              <p className="text-muted-foreground mb-4">{selectedVideo.description}</p>
              <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {selectedVideo.speaker}
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {formatDate(selectedVideo.date)}
                </span>
                {selectedVideo.duration && (
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {selectedVideo.duration}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      <Footer />
    </main>
  )
}
