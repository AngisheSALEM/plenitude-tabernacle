"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  Headphones, 
  Search, 
  Plus, 
  MoreVertical,
  Play,
  Pause,
  Edit,
  Trash2,
  Star,
  Filter,
  Clock
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

const audioTracks = [
  {
    id: 1,
    title: "Marcher dans la foi",
    description: "Comment developper une foi inébranlable",
    speaker: "Pasteur Joel Mugisho",
    date: "2026-03-25",
    plays: 856,
    duration: "32:15",
    category: "Predication",
    isFeatured: true
  },
  {
    id: 2,
    title: "La priere efficace",
    description: "Les cles d&apos;une vie de priere puissante",
    speaker: "Pasteur Joel Mugisho",
    date: "2026-03-22",
    plays: 1234,
    duration: "28:45",
    category: "Enseignement",
    isFeatured: false
  },
  {
    id: 3,
    title: "Vivre par l&apos;Esprit",
    description: "La vie dans l&apos;Esprit Saint",
    speaker: "Pasteur Joel Mugisho",
    date: "2026-03-20",
    plays: 678,
    duration: "35:00",
    category: "Predication",
    isFeatured: false
  },
  {
    id: 4,
    title: "Les fruits de l&apos;Esprit",
    description: "Manifester le caractere de Christ",
    speaker: "Pasteur Joel Mugisho",
    date: "2026-03-18",
    plays: 945,
    duration: "41:30",
    category: "Enseignement",
    isFeatured: false
  },
  {
    id: 5,
    title: "La guerison divine",
    description: "Comprendre la guerison par la foi",
    speaker: "Pasteur Joel Mugisho",
    date: "2026-03-15",
    plays: 1567,
    duration: "38:20",
    category: "Predication",
    isFeatured: false
  },
  {
    id: 6,
    title: "Le combat spirituel",
    description: "Les armes de notre combat",
    speaker: "Pasteur Joel Mugisho",
    date: "2026-03-12",
    plays: 789,
    duration: "45:00",
    category: "Enseignement",
    isFeatured: false
  },
]

export default function AdminAudioPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [playingId, setPlayingId] = useState<number | null>(null)

  const filteredTracks = audioTracks.filter(track => {
    const matchesSearch = track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         track.speaker.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || track.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-foreground">
            Gestion Audio
          </h2>
          <p className="text-muted-foreground">
            {audioTracks.length} pistes audio au total
          </p>
        </div>
        <Link href="/admin/audio/nouveau">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un audio
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
                placeholder="Rechercher un audio..."
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
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Audio List */}
      <Card className="bg-card border-border">
        <CardContent className="p-0">
          {/* Table Header */}
          <div className="hidden sm:grid grid-cols-12 gap-4 px-4 py-3 border-b border-border text-sm font-medium text-muted-foreground">
            <div className="col-span-1">#</div>
            <div className="col-span-5">Titre</div>
            <div className="col-span-2">Categorie</div>
            <div className="col-span-2">Ecoutes</div>
            <div className="col-span-1">Duree</div>
            <div className="col-span-1"></div>
          </div>

          {/* Tracks */}
          <div className="divide-y divide-border">
            {filteredTracks.map((track, index) => (
              <motion.div
                key={track.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="grid grid-cols-12 gap-4 px-4 py-3 items-center hover:bg-muted/50 transition-colors group"
              >
                {/* Index / Play */}
                <div className="col-span-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setPlayingId(playingId === track.id ? null : track.id)}
                  >
                    {playingId === track.id ? (
                      <Pause className="h-4 w-4 text-primary" />
                    ) : (
                      <Play className="h-4 w-4 group-hover:text-primary" />
                    )}
                  </Button>
                </div>

                {/* Title & Info */}
                <div className="col-span-11 sm:col-span-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center shrink-0">
                      <Headphones className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground truncate">{track.title}</p>
                        {track.isFeatured && (
                          <Star className="h-3 w-3 text-primary shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{track.speaker}</p>
                    </div>
                  </div>
                </div>

                {/* Category - Hidden on mobile */}
                <div className="hidden sm:block col-span-2">
                  <span className="px-2 py-1 bg-muted rounded-full text-xs text-muted-foreground">
                    {track.category}
                  </span>
                </div>

                {/* Plays - Hidden on mobile */}
                <div className="hidden sm:flex col-span-2 items-center gap-1 text-sm text-muted-foreground">
                  <Play className="h-3 w-3" />
                  {track.plays}
                </div>

                {/* Duration - Hidden on mobile */}
                <div className="hidden sm:flex col-span-1 items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {track.duration}
                </div>

                {/* Actions */}
                <div className="hidden sm:flex col-span-1 justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Star className="mr-2 h-4 w-4" />
                        {track.isFeatured ? "Retirer de la une" : "Mettre a la une"}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      {filteredTracks.length === 0 && (
        <Card className="bg-card border-border">
          <CardContent className="p-12 text-center">
            <Headphones className="h-12 w-12 text-muted-foreground mx-auto" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">Aucun audio trouve</h3>
            <p className="mt-2 text-muted-foreground">
              Modifiez vos filtres ou ajoutez un nouvel audio.
            </p>
            <Link href="/admin/audio/nouveau">
              <Button className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un audio
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
