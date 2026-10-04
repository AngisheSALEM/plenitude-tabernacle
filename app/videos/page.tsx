"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect, useRef } from "react"
import {
  Play,
  Clock,
  User,
  Search,
  Grid,
  List,
  Calendar,
  Share2,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ExternalLink,
  Youtube,
  Check
} from "lucide-react"
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

const YOUTUBE_CHANNEL_HANDLE = "@pastorjoelmugisho3006"
const YOUTUBE_CHANNEL_NAME = "Pastor Joel MUGISHO Ministries"
const YOUTUBE_PLAYLIST_ID = "UUgfY5F6s25-VN4XqxYvILgA"
const YOUTUBE_PLAYLIST_URL = `https://www.youtube.com/playlist?list=${YOUTUBE_PLAYLIST_ID}`
const YOUTUBE_CHANNEL_URL = `https://www.youtube.com/${YOUTUBE_CHANNEL_HANDLE}`

export default function VideosPage() {
  const [selectedCategory, setSelectedCategory] = useState("Toutes")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number>(-1)
  const [videos, setVideos] = useState<Video[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [copiedLink, setCopiedLink] = useState(false)
  const itemsPerPage = 9

  const videosSectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsLoading(true)
    fetch("/api/videos?limit=100")
      .then((r) => r.json())
      .then((data) => {
        setVideos(data.videos ?? [])
      })
      .catch((err) => {
        console.error("Error fetching videos:", err)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  // Reset pagination when category or search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory, searchQuery])

  const filteredVideos = videos.filter((video) => {
    const displayCat = categoryMap[video.category] ?? video.category
    const matchesCategory = selectedCategory === "Toutes" || displayCat === selectedCategory
    const matchesSearch =
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.speaker.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Pagination calculations
  const totalItems = filteredVideos.length
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage))
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems)
  const paginatedVideos = filteredVideos.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
    if (videosSectionRef.current) {
      videosSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const goToNextVideo = () => {
    if (selectedIndex < filteredVideos.length - 1) {
      const nextIndex = selectedIndex + 1
      setSelectedIndex(nextIndex)
      setSelectedVideo(filteredVideos[nextIndex])
    }
  }

  const goToPrevVideo = () => {
    if (selectedIndex > 0) {
      const prevIndex = selectedIndex - 1
      setSelectedIndex(prevIndex)
      setSelectedVideo(filteredVideos[prevIndex])
    }
  }

  const handleShare = async (video: Video) => {
    const shareUrl = video.youtubeUrl || window.location.href
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareUrl)
        setCopiedLink(true)
        setTimeout(() => setCopiedLink(false), 2000)
      } catch (e) {
        console.error("Copy failed", e)
      }
    }
  }

  // Generate pagination page numbers
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages)
      }
    }
    return pages
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-14 overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium tracking-wide">
              <span>Médiathèque Officielle</span>
            </div>
            <h1 className="font-serif text-4xl md:text-6xl font-bold tracking-tight text-balance">
              Prédications & Enseignements Vidéo
            </h1>
            <p className="text-base md:text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
              Retrouvez l&apos;intégralité des cultes, prédications et louanges du Pasteur Joël Mugisho.
              Une source spirituelle pour nourrir et fortifier votre foi.
            </p>

            {/* Official YouTube Channel / Playlist Banner */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <a
                href={YOUTUBE_PLAYLIST_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity shadow-sm"
              >
                <Youtube className="h-4 w-4" />
                <span>Playlist complète ({YOUTUBE_CHANNEL_NAME})</span>
                <ExternalLink className="h-3.5 w-3.5 opacity-70" />
              </a>
              <a
                href={YOUTUBE_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/60 hover:bg-accent text-sm text-foreground transition-colors"
              >
                <span>Chaîne {YOUTUBE_CHANNEL_HANDLE}</span>
                <ExternalLink className="h-3.5 w-3.5 opacity-70" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters Bar */}
      <section className="py-6 border-b border-border/50 sticky top-16 md:top-20 bg-background/95 backdrop-blur-xl z-30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full lg:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une prédication..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 bg-card border-border/50 rounded-full text-sm"
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap justify-center gap-1.5">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full text-xs h-8 px-3.5 ${
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "border-border/50 hover:bg-accent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* View Mode */}
            <div className="flex items-center gap-1 bg-card rounded-full p-1 border border-border/50">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewMode("grid")}
                className={`rounded-full h-7 w-7 ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
                title="Affichage grille"
              >
                <Grid className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewMode("list")}
                className={`rounded-full h-7 w-7 ${viewMode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
                title="Affichage liste"
              >
                <List className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Videos Section */}
      <section ref={videosSectionRef} className="py-12 min-h-[500px]">
        <div className="container mx-auto px-4">
          {/* Header Info */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <p className="text-sm text-muted-foreground">
              {totalItems > 0 ? (
                <>
                  Affichage de <span className="font-medium text-foreground">{startIndex + 1}</span> à{" "}
                  <span className="font-medium text-foreground">{endIndex}</span> sur{" "}
                  <span className="font-medium text-foreground">{totalItems}</span> vidéo{totalItems > 1 ? "s" : ""}
                </>
              ) : (
                "Aucune vidéo trouvée"
              )}
            </p>
            {totalPages > 1 && (
              <p className="text-xs text-muted-foreground">
                Page {currentPage} sur {totalPages}
              </p>
            )}
          </div>

          {/* Loading Skeleton */}
          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="aspect-video rounded-2xl bg-card animate-pulse border border-border/40" />
                  <div className="h-5 bg-card rounded animate-pulse w-3/4" />
                  <div className="h-4 bg-card rounded animate-pulse w-1/2" />
                </div>
              ))}
            </div>
          ) : paginatedVideos.length === 0 ? (
            <div className="text-center py-20 bg-card/40 rounded-3xl border border-dashed border-border/60 max-w-md mx-auto space-y-4">
              <Youtube className="h-12 w-12 mx-auto text-muted-foreground/50" />
              <h3 className="font-serif text-lg font-semibold">Aucun résultat</h3>
              <p className="text-sm text-muted-foreground">
                Aucune vidéo ne correspond à votre recherche ou catégorie sélectionnée.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("Toutes")
                }}
                className="rounded-full"
              >
                Réinitialiser les filtres
              </Button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedVideos.map((video, index) => (
                <motion.article
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  onClick={() => {
                    const originalIndex = filteredVideos.findIndex((v) => v.id === video.id)
                    setSelectedVideo(video)
                    setSelectedIndex(originalIndex >= 0 ? originalIndex : index)
                  }}
                  className="group cursor-pointer flex flex-col"
                >
                  {/* Thumbnail Card */}
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-card border border-border/50 mb-3 shadow-xs">
                    {video.thumbnail ? (
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent flex items-center justify-center">
                        <Play className="h-10 w-10 text-muted-foreground" />
                      </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* Category badge */}
                    <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-background/90 backdrop-blur-md text-[11px] font-medium text-foreground border border-border/40">
                      {video.category}
                    </div>

                    {/* Play button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="p-3.5 rounded-full bg-primary/90 text-primary-foreground opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all shadow-md">
                        <Play className="h-6 w-6 fill-current" />
                      </div>
                    </div>

                    {/* Duration badge */}
                    {video.duration && (
                      <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/80 text-[11px] font-medium text-white backdrop-blur-xs">
                        {video.duration}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="space-y-1.5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif text-base md:text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                        {video.title}
                      </h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-1">
                      <span className="flex items-center gap-1">
                        <User className="h-3.5 w-3.5" />
                        {video.speaker}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(video.date)}
                      </span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {paginatedVideos.map((video, index) => (
                <motion.article
                  key={video.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => {
                    const originalIndex = filteredVideos.findIndex((v) => v.id === video.id)
                    setSelectedVideo(video)
                    setSelectedIndex(originalIndex >= 0 ? originalIndex : index)
                  }}
                  className="group flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-card border border-border/50 hover:border-primary/40 transition-all cursor-pointer shadow-xs"
                >
                  {/* Thumbnail */}
                  <div className="relative w-full sm:w-56 aspect-video rounded-xl overflow-hidden bg-muted flex-shrink-0">
                    {video.thumbnail ? (
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-muted flex items-center justify-center" />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="p-3 rounded-full bg-primary/90 text-primary-foreground shadow-md">
                        <Play className="h-4 w-4 fill-current" />
                      </div>
                    </div>
                    {video.duration && (
                      <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[11px] text-white">
                        {video.duration}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 space-y-2 flex flex-col justify-between">
                    <div>
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium mb-1.5">
                        {video.category}
                      </span>
                      <h3 className="font-serif text-base md:text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {video.title}
                      </h3>
                      {video.description && (
                        <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 mt-1">
                          {video.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
                      <span className="flex items-center gap-1">
                        <User className="h-3.5 w-3.5" />
                        {video.speaker}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(video.date)}
                      </span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}

          {/* Pagination Navigation */}
          {totalPages > 1 && (
            <div className="mt-12 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-muted-foreground">
                Affichage page <span className="font-medium text-foreground">{currentPage}</span> sur{" "}
                <span className="font-medium text-foreground">{totalPages}</span>
              </div>

              <div className="flex items-center gap-1.5">
                {/* First page button */}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="rounded-full h-8 w-8 border-border/60 hover:bg-accent text-foreground disabled:opacity-30"
                  title="Première page"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>

                {/* Previous page button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="rounded-full h-8 px-3 border-border/60 hover:bg-accent text-xs text-foreground disabled:opacity-30"
                >
                  <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                  Précédent
                </Button>

                {/* Page numbers */}
                <div className="flex items-center gap-1 mx-1">
                  {getPageNumbers().map((pageNum, idx) => {
                    if (pageNum === "...") {
                      return (
                        <span key={`dots-${idx}`} className="px-2 text-xs text-muted-foreground">
                          ...
                        </span>
                      )
                    }
                    const num = pageNum as number
                    const isActive = num === currentPage
                    return (
                      <Button
                        key={`page-${num}`}
                        variant={isActive ? "default" : "outline"}
                        size="icon"
                        onClick={() => handlePageChange(num)}
                        className={`rounded-full h-8 w-8 text-xs font-medium transition-all ${
                          isActive
                            ? "bg-primary text-primary-foreground shadow-xs"
                            : "border-border/60 hover:bg-accent text-foreground"
                        }`}
                      >
                        {num}
                      </Button>
                    )
                  })}
                </div>

                {/* Next page button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="rounded-full h-8 px-3 border-border/60 hover:bg-accent text-xs text-foreground disabled:opacity-30"
                >
                  Suivant
                  <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </Button>

                {/* Last page button */}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="rounded-full h-8 w-8 border-border/60 hover:bg-accent text-foreground disabled:opacity-30"
                  title="Dernière page"
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Video Modal Player */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-md"
            onClick={() => {
              setSelectedVideo(null)
              setSelectedIndex(-1)
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-4xl bg-card text-foreground rounded-2xl md:rounded-3xl overflow-hidden border border-border shadow-2xl flex flex-col max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-3 right-3 z-20 rounded-full bg-background/80 hover:bg-background backdrop-blur-md text-foreground h-9 w-9 border border-border/50"
                onClick={() => {
                  setSelectedVideo(null)
                  setSelectedIndex(-1)
                }}
                title="Fermer"
              >
                <X className="h-4 w-4" />
              </Button>

              {/* Video Player */}
              <div className="relative aspect-video w-full bg-black flex-shrink-0">
                {selectedVideo.youtubeUrl ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${extractYoutubeId(selectedVideo.youtubeUrl)}?autoplay=1&rel=0`}
                    title={selectedVideo.title}
                    className="absolute inset-0 w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    <p>Vidéo non disponible</p>
                  </div>
                )}

                {/* Left/Right Navigation on hover/overlay */}
                <div className="absolute inset-y-0 left-0 flex items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-16 w-10 rounded-r-lg bg-black/40 hover:bg-black/80 text-white opacity-40 hover:opacity-100 transition-opacity"
                    onClick={goToPrevVideo}
                    disabled={selectedIndex <= 0}
                    title="Prédication précédente"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-16 w-10 rounded-l-lg bg-black/40 hover:bg-black/80 text-white opacity-40 hover:opacity-100 transition-opacity"
                    onClick={goToNextVideo}
                    disabled={selectedIndex >= filteredVideos.length - 1}
                    title="Prédication suivante"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </div>
              </div>

              {/* Video Info Details */}
              <div className="p-5 md:p-6 overflow-y-auto space-y-4">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
                        {selectedVideo.category}
                      </span>
                      {selectedVideo.duration && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {selectedVideo.duration}
                        </span>
                      )}
                    </div>
                    <h2 className="font-serif text-xl md:text-2xl font-bold text-foreground">
                      {selectedVideo.title}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2 self-start">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShare(selectedVideo)}
                      className="rounded-full text-xs gap-1.5 border-border/60"
                      title="Copier le lien"
                    >
                      {copiedLink ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-foreground" />
                          <span>Lien copié</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="h-3.5 w-3.5" />
                          <span>Partager</span>
                        </>
                      )}
                    </Button>
                    {selectedVideo.youtubeUrl && (
                      <a
                        href={selectedVideo.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center h-8 px-3 rounded-full border border-border/60 hover:bg-accent text-xs font-medium text-foreground gap-1.5 transition-colors"
                      >
                        <Youtube className="h-3.5 w-3.5" />
                        <span>YouTube</span>
                        <ExternalLink className="h-3 w-3 opacity-60" />
                      </a>
                    )}
                  </div>
                </div>

                {selectedVideo.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedVideo.description}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border/40">
                  <span className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5" />
                    {selectedVideo.speaker}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(selectedVideo.date)}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  )
}
