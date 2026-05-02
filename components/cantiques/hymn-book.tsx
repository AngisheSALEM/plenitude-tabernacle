"use client"

import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Search, Book, Music, ChevronRight, X, 
  Grid, List, BookOpen, Heart, Share2, Copy,
  ChevronDown, Filter, ChevronLeft
} from "lucide-react"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cantiques, categories, type Cantique } from "@/lib/cantiques-data"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function HymnBook() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Tous")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedHymn, setSelectedHymn] = useState<Cantique | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number>(-1)
  const [favorites, setFavorites] = useState<Set<number>>(new Set())
  const [copied, setCopied] = useState(false)
  const { data: session } = useSession()

  useEffect(() => {
    if (session) {
      fetch("/api/favoris?type=cantiques")
        .then(res => res.json())
        .then(data => {
          if (data && data.favoriteCantiques) {
            setFavorites(new Set(data.favoriteCantiques.map((f: any) => f.cantiqueId)))
          }
        })
        .catch(console.error)
    }
  }, [session])

  const filteredHymns = useMemo(() => {
    return cantiques.filter(hymn => {
      const matchesSearch = 
        hymn.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hymn.lyrics.some(verse => verse.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesCategory = selectedCategory === "Tous" || hymn.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  const goToNextHymn = () => {
    if (selectedIndex < filteredHymns.length - 1) {
      const nextIndex = selectedIndex + 1
      setSelectedIndex(nextIndex)
      setSelectedHymn(filteredHymns[nextIndex])
    }
  }

  const goToPrevHymn = () => {
    if (selectedIndex > 0) {
      const prevIndex = selectedIndex - 1
      setSelectedIndex(prevIndex)
      setSelectedHymn(filteredHymns[prevIndex])
    }
  }

  const toggleFavorite = async (id: number) => {
    if (!session) {
      toast.error("Veuillez vous connecter pour ajouter des favoris")
      return
    }

    const isFavorite = favorites.has(id)

    try {
      const res = await fetch("/api/favoris", {
        method: isFavorite ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "cantique", itemId: id.toString() })
      })

      if (res.ok) {
        setFavorites(prev => {
          const next = new Set(prev)
          if (isFavorite) next.delete(id)
          else next.add(id)
          return next
        })
        toast.success(isFavorite ? "Retiré des favoris" : "Ajouté aux favoris")
      }
    } catch (err) {
      toast.error("Erreur lors de la mise à jour des favoris")
    }
  }

  const copyLyrics = (hymn: Cantique) => {
    const text = `${hymn.title}\n(${hymn.reference})\n\n${hymn.lyrics.join('\n\n')}${hymn.chorus ? '\n\nChoeur:\n' + hymn.chorus.join('\n') : ''}`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-foreground flex items-center gap-2">
            <Book className="h-6 w-6 text-primary" />
            Recueil de Cantiques
          </h2>
          <p className="text-muted-foreground mt-1">
            {filteredHymns.length} cantique{filteredHymns.length > 1 ? "s" : ""} disponible{filteredHymns.length > 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un cantique..."
              className="pl-10 bg-secondary border-border"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">{selectedCategory}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="max-h-80 overflow-y-auto">
              <DropdownMenuLabel>Categories</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {categories.map(category => (
                <DropdownMenuItem 
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "bg-primary/10 text-primary" : ""}
                >
                  {category}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* View Mode Toggle */}
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
      </div>

      {/* Hymns Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredHymns.map((hymn, index) => (
            <motion.div
              key={hymn.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="group bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-all cursor-pointer"
              onClick={() => {
                setSelectedHymn(hymn)
                setSelectedIndex(index)
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Music className="h-5 w-5 text-primary" />
                </div>
                <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">
                  {hymn.reference}
                </span>
              </div>
              <h3 className="font-semibold text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                {hymn.title}
              </h3>
              <p className="text-xs text-muted-foreground mb-3">{hymn.category}</p>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {hymn.lyrics[0].split('\n')[0]}...
              </p>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleFavorite(hymn.id)
                  }}
                >
                  <Heart 
                    className={`h-4 w-4 ${favorites.has(hymn.id) ? "fill-primary text-primary" : ""}`} 
                  />
                </Button>
                <Button variant="ghost" size="sm" className="h-8">
                  <BookOpen className="mr-1 h-4 w-4" />
                  Lire
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredHymns.map((hymn, index) => (
            <motion.div
              key={hymn.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.02 }}
              className="group flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/50 transition-all cursor-pointer"
              onClick={() => {
                setSelectedHymn(hymn)
                setSelectedIndex(index)
              }}
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-primary">{hymn.id}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                  {hymn.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{hymn.reference}</span>
                  <span>-</span>
                  <span>{hymn.category}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleFavorite(hymn.id)
                  }}
                >
                  <Heart 
                    className={`h-4 w-4 ${favorites.has(hymn.id) ? "fill-primary text-primary" : ""}`} 
                  />
                </Button>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredHymns.length === 0 && (
        <div className="text-center py-16">
          <Book className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Aucun cantique trouve
          </h3>
          <p className="text-muted-foreground">
            Essayez de modifier votre recherche ou de changer de categorie.
          </p>
        </div>
      )}

      {/* Hymn Detail Modal */}
      <Dialog open={!!selectedHymn} onOpenChange={(open) => {
        if (!open) {
            setSelectedHymn(null)
            setSelectedIndex(-1)
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedHymn && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <DialogTitle className="font-serif text-2xl">
                      {selectedHymn.title}
                    </DialogTitle>
                    <p className="text-muted-foreground mt-1">
                      {selectedHymn.reference} - {selectedHymn.category}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mr-6">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={goToPrevHymn}
                        disabled={selectedIndex <= 0}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-xs font-mono">{selectedIndex + 1} / {filteredHymns.length}</span>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={goToNextHymn}
                        disabled={selectedIndex >= filteredHymns.length - 1}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </DialogHeader>

              <div className="flex items-center gap-2 mb-6">
                <Button
                  variant={favorites.has(selectedHymn.id) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleFavorite(selectedHymn.id)}
                >
                  <Heart className={`mr-2 h-4 w-4 ${favorites.has(selectedHymn.id) ? "fill-current" : ""}`} />
                  {favorites.has(selectedHymn.id) ? "Favori" : "Ajouter aux favoris"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyLyrics(selectedHymn)}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  {copied ? "Copie !" : "Copier"}
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="mr-2 h-4 w-4" />
                  Partager
                </Button>
              </div>

              <div className="space-y-6">
                {selectedHymn.lyrics.map((verse, index) => (
                  <div key={index} className="space-y-2">
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                      {index === 0 ? "Couplet 1" : `Couplet ${index + 1}`}
                    </span>
                    <p className="text-foreground whitespace-pre-line leading-relaxed">
                      {verse}
                    </p>
                  </div>
                ))}

                {selectedHymn.chorus && (
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 space-y-2">
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                      Choeur
                    </span>
                    {selectedHymn.chorus.map((line, index) => (
                      <p key={index} className="text-foreground whitespace-pre-line leading-relaxed font-medium">
                        {line}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
