"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useRef, useEffect } from "react"
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Search, 
  Headphones, 
  Clock, 
  User, 
  Calendar,
  Heart,
  Share2,
  Repeat,
  Shuffle,
  List,
  X,
  Music
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"

const categories = [
  "Toutes",
  "Predications",
  "Enseignements",
  "Louange",
  "Prieres",
]

const audioTracks = [
  {
    id: 1,
    title: "La Grace Suffisante",
    speaker: "Pasteur Joel Mugisho",
    duration: "45:32",
    durationSec: 2732,
    date: "22 Mars 2026",
    category: "Predications",
    plays: "1.2K",
  },
  {
    id: 2,
    title: "Vivre par l'Esprit",
    speaker: "Pasteur Joel Mugisho",
    duration: "52:18",
    durationSec: 3138,
    date: "15 Mars 2026",
    category: "Enseignements",
    plays: "980",
  },
  {
    id: 3,
    title: "Le Combat de la Foi",
    speaker: "Pasteur Joel Mugisho",
    duration: "48:45",
    durationSec: 2925,
    date: "8 Mars 2026",
    category: "Predications",
    plays: "1.5K",
  },
  {
    id: 4,
    title: "L'Amour Inconditionnel",
    speaker: "Pasteur Joel Mugisho",
    duration: "55:10",
    durationSec: 3310,
    date: "1 Mars 2026",
    category: "Enseignements",
    plays: "2.1K",
  },
  {
    id: 5,
    title: "Louange et Adoration - Session 1",
    speaker: "Chorale Plenitude",
    duration: "1:15:22",
    durationSec: 4522,
    date: "25 Fevrier 2026",
    category: "Louange",
    plays: "3.4K",
  },
  {
    id: 6,
    title: "Priere du Matin",
    speaker: "Pasteur Joel Mugisho",
    duration: "32:15",
    durationSec: 1935,
    date: "20 Fevrier 2026",
    category: "Prieres",
    plays: "890",
  },
  {
    id: 7,
    title: "La Puissance de la Resurrection",
    speaker: "Pasteur Joel Mugisho",
    duration: "58:40",
    durationSec: 3520,
    date: "15 Fevrier 2026",
    category: "Predications",
    plays: "1.8K",
  },
  {
    id: 8,
    title: "Chants de Victoire",
    speaker: "Chorale Plenitude",
    duration: "45:00",
    durationSec: 2700,
    date: "10 Fevrier 2026",
    category: "Louange",
    plays: "2.7K",
  },
  {
    id: 9,
    title: "Les Promesses de Dieu",
    speaker: "Pasteur Joel Mugisho",
    duration: "1:02:30",
    durationSec: 3750,
    date: "5 Fevrier 2026",
    category: "Enseignements",
    plays: "1.1K",
  },
  {
    id: 10,
    title: "Intercession pour les Nations",
    speaker: "Equipe de Priere",
    duration: "28:45",
    durationSec: 1725,
    date: "1 Fevrier 2026",
    category: "Prieres",
    plays: "650",
  },
]

export default function AudioPage() {
  const [selectedCategory, setSelectedCategory] = useState("Toutes")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentTrack, setCurrentTrack] = useState<typeof audioTracks[0] | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(80)
  const [isMuted, setIsMuted] = useState(false)
  const [isShuffled, setIsShuffled] = useState(false)
  const [isRepeating, setIsRepeating] = useState(false)
  const [showQueue, setShowQueue] = useState(false)
  const [likedTracks, setLikedTracks] = useState<number[]>([])

  const progressInterval = useRef<NodeJS.Timeout | null>(null)

  const filteredTracks = audioTracks.filter((track) => {
    const matchesCategory = selectedCategory === "Toutes" || track.category === selectedCategory
    const matchesSearch = track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.speaker.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const playTrack = (track: typeof audioTracks[0]) => {
    setCurrentTrack(track)
    setIsPlaying(true)
    setProgress(0)
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleLike = (trackId: number) => {
    setLikedTracks(prev => 
      prev.includes(trackId) 
        ? prev.filter(id => id !== trackId)
        : [...prev, trackId]
    )
  }

  const playNext = () => {
    if (!currentTrack) return
    const currentIndex = filteredTracks.findIndex(t => t.id === currentTrack.id)
    const nextIndex = isShuffled 
      ? Math.floor(Math.random() * filteredTracks.length)
      : (currentIndex + 1) % filteredTracks.length
    playTrack(filteredTracks[nextIndex])
  }

  const playPrevious = () => {
    if (!currentTrack) return
    const currentIndex = filteredTracks.findIndex(t => t.id === currentTrack.id)
    const prevIndex = currentIndex === 0 ? filteredTracks.length - 1 : currentIndex - 1
    playTrack(filteredTracks[prevIndex])
  }

  useEffect(() => {
    if (isPlaying && currentTrack) {
      progressInterval.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            if (isRepeating) {
              return 0
            } else {
              playNext()
              return 0
            }
          }
          return prev + (100 / currentTrack.durationSec)
        })
      }, 1000)
    } else {
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }
    }
  }, [isPlaying, currentTrack, isRepeating])

  return (
    <main className="min-h-screen bg-background pb-32">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-40 left-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
        
        <div className="relative container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <p className="text-primary font-medium mb-4 tracking-wider uppercase text-sm">
              Mediatheque Audio
            </p>
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
              Ecoutez la Parole
            </h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Nourrissez votre foi ou que vous soyez avec notre collection de predications, 
              enseignements et moments de louange en audio.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-8 mt-12"
          >
            <div className="text-center">
              <p className="font-serif text-4xl font-bold text-primary">200+</p>
              <p className="text-sm text-muted-foreground">Predications</p>
            </div>
            <div className="text-center">
              <p className="font-serif text-4xl font-bold text-primary">150h+</p>
              <p className="text-sm text-muted-foreground">De contenu</p>
            </div>
            <div className="text-center">
              <p className="font-serif text-4xl font-bold text-primary">50K+</p>
              <p className="text-sm text-muted-foreground">Ecoutes</p>
            </div>
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
                placeholder="Rechercher un audio..."
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
          </div>
        </div>
      </section>

      {/* Audio List */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <p className="text-muted-foreground">
              {filteredTracks.length} audio{filteredTracks.length > 1 ? "s" : ""} trouve{filteredTracks.length > 1 ? "s" : ""}
            </p>
          </div>

          <div className="space-y-2">
            {filteredTracks.map((track, index) => (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className={`group flex items-center gap-4 p-4 rounded-xl transition-all cursor-pointer ${
                  currentTrack?.id === track.id
                    ? "bg-primary/10 border border-primary/30"
                    : "hover:bg-card border border-transparent"
                }`}
              >
                {/* Play Button */}
                <button
                  onClick={() => currentTrack?.id === track.id ? togglePlay() : playTrack(track)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                    currentTrack?.id === track.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
                  }`}
                >
                  {currentTrack?.id === track.id && isPlaying ? (
                    <Pause className="h-5 w-5 fill-current" />
                  ) : (
                    <Play className="h-5 w-5 fill-current ml-0.5" />
                  )}
                </button>

                {/* Track Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      {track.category}
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                    {track.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {track.speaker}
                    </span>
                    <span className="hidden sm:flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {track.date}
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Headphones className="h-4 w-4" />
                    {track.plays}
                  </span>
                </div>

                {/* Duration */}
                <span className="text-sm text-muted-foreground font-medium w-16 text-right">
                  {track.duration}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleLike(track.id)
                    }}
                  >
                    <Heart className={`h-4 w-4 ${likedTracks.includes(track.id) ? "fill-primary text-primary" : ""}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Persistent Audio Player */}
      <AnimatePresence>
        {currentTrack && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border"
          >
            {/* Progress Bar */}
            <div className="h-1 bg-muted">
              <motion.div 
                className="h-full bg-primary"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center gap-4">
                {/* Track Info */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/30 to-accent/20 flex items-center justify-center flex-shrink-0">
                    <Music className="h-6 w-6 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-foreground truncate">{currentTrack.title}</h4>
                    <p className="text-sm text-muted-foreground truncate">{currentTrack.speaker}</p>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-2 md:gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsShuffled(!isShuffled)}
                    className={`hidden md:flex h-10 w-10 rounded-full ${isShuffled ? "text-primary" : "text-muted-foreground"}`}
                  >
                    <Shuffle className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={playPrevious}
                    className="h-10 w-10 rounded-full"
                  >
                    <SkipBack className="h-5 w-5" />
                  </Button>
                  <Button
                    onClick={togglePlay}
                    className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {isPlaying ? (
                      <Pause className="h-6 w-6 fill-current" />
                    ) : (
                      <Play className="h-6 w-6 fill-current ml-0.5" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={playNext}
                    className="h-10 w-10 rounded-full"
                  >
                    <SkipForward className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsRepeating(!isRepeating)}
                    className={`hidden md:flex h-10 w-10 rounded-full ${isRepeating ? "text-primary" : "text-muted-foreground"}`}
                  >
                    <Repeat className="h-4 w-4" />
                  </Button>
                </div>

                {/* Time & Volume */}
                <div className="hidden lg:flex items-center gap-4 flex-1 justify-end">
                  <span className="text-sm text-muted-foreground w-20 text-right">
                    {formatTime((progress / 100) * currentTrack.durationSec)} / {currentTrack.duration}
                  </span>
                  <div className="flex items-center gap-2 w-32">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsMuted(!isMuted)}
                      className="h-8 w-8 rounded-full"
                    >
                      {isMuted ? (
                        <VolumeX className="h-4 w-4" />
                      ) : (
                        <Volume2 className="h-4 w-4" />
                      )}
                    </Button>
                    <Slider
                      value={[isMuted ? 0 : volume]}
                      onValueChange={(value) => {
                        setVolume(value[0])
                        setIsMuted(false)
                      }}
                      max={100}
                      step={1}
                      className="w-20"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowQueue(!showQueue)}
                    className={`h-8 w-8 rounded-full ${showQueue ? "text-primary" : ""}`}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCurrentTrack(null)}
                    className="h-8 w-8 rounded-full"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!currentTrack && <Footer />}
    </main>
  )
}
