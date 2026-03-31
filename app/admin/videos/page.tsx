"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Video, 
  Search, 
  Plus, 
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Star,
  Filter,
  Grid,
  List
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from "next/link"

interface AdminVideo {
  id: string
  title: string
  description: string | null
  speaker: string
  date: string
  views: number
  duration: string | null
  thumbnail: string | null
  isFeatured: boolean
  category: string
}

export default function AdminVideosPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [videos, setVideos] = useState<AdminVideo[]>([])

  const fetchVideos = () => {
    fetch("/api/videos?limit=100")
      .then((r) => r.json())
      .then((data) => setVideos(data.videos ?? []))
      .catch(console.error)
  }

  useEffect(() => {
    fetchVideos()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette video ?")) return
    await fetch(`/api/videos/${id}`, { method: "DELETE" })
    fetchVideos()
  }

  const handleToggleFeatured = async (video: AdminVideo) => {
    await fetch(`/api/videos/${video.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isFeatured: !video.isFeatured }),
    })
    fetchVideos()
  }

  const filteredVideos = videos.filter((video) => {
    const matchesSearch =
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.speaker.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || video.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-foreground">
            Gestion des Videos
          </h2>
          <p className="text-muted-foreground">
            {videos.length} videos au total
          </p>
        </div>
        <Link href="/admin/videos/nouveau">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une video
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une video..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background border-border"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-background border-border">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Categorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les categories</SelectItem>
                <SelectItem value="Predication">Predication</SelectItem>
                <SelectItem value="Enseignement">Enseignement</SelectItem>
                <SelectItem value="Louange">Louange</SelectItem>
                <SelectItem value="Temoignage">Temoignage</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Videos Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="bg-card border-border overflow-hidden group hover:border-primary/30 transition-colors">
                <div className="relative aspect-video bg-muted">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent flex items-center justify-center">
                    <Video className="h-12 w-12 text-primary/50" />
                  </div>
                  {video.duration && (
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-background/90 rounded text-xs font-medium text-foreground">
                      {video.duration}
                    </div>
                  )}
                  {video.isFeatured && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-primary rounded text-xs font-medium text-primary-foreground flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      A la une
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">{video.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{video.speaker}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {video.views}
                        </span>
                        <span>{new Date(video.date).toLocaleDateString("fr-FR")}</span>
                        <span className="px-2 py-0.5 bg-muted rounded-full">{video.category}</span>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="shrink-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleFeatured(video)}>
                          <Star className="mr-2 h-4 w-4" />
                          {video.isFeatured ? "Retirer de la une" : "Mettre a la une"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(video.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="bg-card border-border">
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {filteredVideos.map((video) => (
                <div
                  key={video.id}
                  className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="relative w-32 aspect-video bg-muted rounded-lg overflow-hidden shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent flex items-center justify-center">
                      <Video className="h-6 w-6 text-primary/50" />
                    </div>
                    {video.duration && (
                      <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-background/90 rounded text-xs font-medium text-foreground">
                        {video.duration}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground truncate">{video.title}</h3>
                      {video.isFeatured && (
                        <Star className="h-4 w-4 text-primary shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{video.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span>{video.speaker}</span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {video.views} vues
                      </span>
                      <span>{new Date(video.date).toLocaleDateString("fr-FR")}</span>
                      <span className="px-2 py-0.5 bg-muted rounded-full text-xs">{video.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleToggleFeatured(video)}>
                          <Star className="mr-2 h-4 w-4" />
                          {video.isFeatured ? "Retirer de la une" : "Mettre a la une"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(video.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {filteredVideos.length === 0 && (
        <Card className="bg-card border-border">
          <CardContent className="p-12 text-center">
            <Video className="h-12 w-12 text-muted-foreground mx-auto" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">Aucune video trouvee</h3>
            <p className="mt-2 text-muted-foreground">
              Modifiez vos filtres ou ajoutez une nouvelle video.
            </p>
            <Link href="/admin/videos/nouveau">
              <Button className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter une video
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
