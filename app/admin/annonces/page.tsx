"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Megaphone, 
  Plus, 
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Calendar,
  Upload,
  X,
  Loader2
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { toast } from "sonner"

interface Announcement {
  id: string
  title: string
  content: string
  imageUrl?: string
  isActive: boolean
  createdAt: string
}

export default function AdminAnnoncesPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    imageUrl: ""
  })

  const fetchAnnouncements = () => {
    fetch("/api/evenements?limit=100")
      .then((r) => r.json())
      .then((data) => setAnnouncements(data.evenements ?? []))
      .catch(console.error)
  }

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const toggleActive = async (announcement: Announcement) => {
    await fetch(`/api/evenements/${announcement.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !announcement.isActive }),
    })
    fetchAnnouncements()
  }

  const handleCreate = async () => {
    if (!newAnnouncement.title || !newAnnouncement.content) return
    try {
      const res = await fetch("/api/evenements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAnnouncement),
      })
      if (!res.ok) throw new Error("Erreur lors de la création")

      setNewAnnouncement({ title: "", content: "", imageUrl: "" })
      setIsDialogOpen(false)
      fetchAnnouncements()
      toast.success("Annonce créée avec succès")
    } catch (error) {
      toast.error("Erreur lors de la création de l'annonce")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette annonce ?")) return
    try {
      const res = await fetch(`/api/evenements/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Erreur lors de la suppression")
      fetchAnnouncements()
      toast.success("Annonce supprimée")
    } catch (error) {
      toast.error("Erreur lors de la suppression")
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      if (data.url) {
        setNewAnnouncement(prev => ({ ...prev, imageUrl: data.url }))
        toast.success("Image uploadée")
      } else {
        throw new Error(data.error || "Erreur upload")
      }
    } catch (error) {
      toast.error("Erreur lors de l'upload de l'image")
    } finally {
      setIsUploading(false)
    }
  }

  const activeCount = announcements.filter((a) => a.isActive).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-foreground">
            Gestion des Annonces
          </h2>
          <p className="text-muted-foreground">
            {activeCount} annonces actives sur {announcements.length}
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle annonce
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border max-w-md">
            <DialogHeader>
              <DialogTitle>Créer une annonce</DialogTitle>
              <DialogDescription>
                L&apos;annonce sera visible sur la page d&apos;accueil.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre</Label>
                <Input
                  id="title"
                  placeholder="Ex: Culte spécial"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                  className="bg-background border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Contenu</Label>
                <Textarea
                  id="content"
                  placeholder="Détails de l&apos;annonce..."
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                  className="bg-background border-border min-h-24"
                />
              </div>

              <div className="space-y-2">
                <Label>Image de l&apos;annonce (optionnel)</Label>
                {newAnnouncement.imageUrl ? (
                  <div className="relative aspect-video rounded-lg overflow-hidden border border-border">
                    <Image
                      src={newAnnouncement.imageUrl}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8"
                      onClick={() => setNewAnnouncement(prev => ({ ...prev, imageUrl: "" }))}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer border-border hover:bg-muted/50 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {isUploading ? (
                          <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
                        ) : (
                          <>
                            <Upload className="w-8 h-8 mb-3 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">Cliquez pour uploader</p>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={isUploading}
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={handleCreate}
                disabled={!newAnnouncement.title || !newAnnouncement.content || isUploading}
              >
                Publier
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Megaphone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{announcements.length}</p>
                <p className="text-sm text-muted-foreground">Total annonces</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-500/10">
                <Eye className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{activeCount}</p>
                <p className="text-sm text-muted-foreground">Actives</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-muted">
                <EyeOff className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{announcements.length - activeCount}</p>
                <p className="text-sm text-muted-foreground">Inactives</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Announcements List */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Toutes les annonces</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {announcements.map((announcement, index) => (
              <motion.div
                key={announcement.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="flex items-start gap-4 p-4 hover:bg-muted/50 transition-colors"
              >
                {announcement.imageUrl ? (
                  <div className="relative h-16 w-24 rounded-lg overflow-hidden shrink-0 border border-border">
                    <Image
                      src={announcement.imageUrl}
                      alt={announcement.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className={`p-2.5 rounded-lg shrink-0 ${announcement.isActive ? "bg-green-500/10" : "bg-muted"}`}>
                    <Megaphone className={`h-5 w-5 ${announcement.isActive ? "text-green-500" : "text-muted-foreground"}`} />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground truncate">{announcement.title}</h3>
                    {announcement.isActive && (
                      <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-xs rounded-full shrink-0">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                    {announcement.content}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>Créé le {new Date(announcement.createdAt).toLocaleDateString("fr-FR")}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center gap-2 mr-2">
                    <Switch
                      checked={announcement.isActive}
                      onCheckedChange={() => toggleActive(announcement)}
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(announcement.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      {announcements.length === 0 && (
        <Card className="bg-card border-border">
          <CardContent className="p-12 text-center">
            <Megaphone className="h-12 w-12 text-muted-foreground mx-auto" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">Aucune annonce</h3>
            <p className="mt-2 text-muted-foreground">
              Créez votre première annonce pour informer la communauté.
            </p>
            <Button
              className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Créer une annonce
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
