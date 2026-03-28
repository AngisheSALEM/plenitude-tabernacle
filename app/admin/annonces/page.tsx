"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  Megaphone, 
  Plus, 
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Calendar
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

const initialAnnouncements = [
  {
    id: 1,
    title: "Culte special de Paques",
    content: "Rejoignez-nous pour celebrer la resurrection de notre Seigneur Jesus-Christ. Service special a 9h00.",
    isActive: true,
    createdAt: "2026-03-25"
  },
  {
    id: 2,
    title: "Inscription aux cellules de maison",
    content: "Les inscriptions pour les cellules de maison sont ouvertes. Contactez le secretariat pour plus d&apos;informations.",
    isActive: true,
    createdAt: "2026-03-20"
  },
  {
    id: 3,
    title: "Conference des jeunes",
    content: "Grande conference des jeunes du 15 au 17 Avril. Theme: Bâtir sur le roc.",
    isActive: false,
    createdAt: "2026-03-15"
  },
  {
    id: 4,
    title: "Seminaire de formation",
    content: "Formation des ouvriers le samedi 5 Avril de 8h a 12h. Presence obligatoire.",
    isActive: true,
    createdAt: "2026-03-10"
  },
]

export default function AdminAnnoncesPage() {
  const [announcements, setAnnouncements] = useState(initialAnnouncements)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newAnnouncement, setNewAnnouncement] = useState({ title: "", content: "" })

  const toggleActive = (id: number) => {
    setAnnouncements(prev => 
      prev.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a)
    )
  }

  const handleCreate = () => {
    if (newAnnouncement.title && newAnnouncement.content) {
      setAnnouncements(prev => [
        {
          id: Date.now(),
          title: newAnnouncement.title,
          content: newAnnouncement.content,
          isActive: true,
          createdAt: new Date().toISOString().split('T')[0]
        },
        ...prev
      ])
      setNewAnnouncement({ title: "", content: "" })
      setIsDialogOpen(false)
    }
  }

  const handleDelete = (id: number) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id))
  }

  const activeCount = announcements.filter(a => a.isActive).length

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
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle>Creer une annonce</DialogTitle>
              <DialogDescription>
                L&apos;annonce sera visible sur la page d&apos;accueil.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre</Label>
                <Input
                  id="title"
                  placeholder="Ex: Culte special"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                  className="bg-background border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Contenu</Label>
                <Textarea
                  id="content"
                  placeholder="Details de l&apos;annonce..."
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                  className="bg-background border-border min-h-24"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button 
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={handleCreate}
                disabled={!newAnnouncement.title || !newAnnouncement.content}
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
                <div className={`p-2.5 rounded-lg shrink-0 ${announcement.isActive ? 'bg-green-500/10' : 'bg-muted'}`}>
                  <Megaphone className={`h-5 w-5 ${announcement.isActive ? 'text-green-500' : 'text-muted-foreground'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{announcement.title}</h3>
                    {announcement.isActive && (
                      <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-xs rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {announcement.content}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>Cree le {new Date(announcement.createdAt).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground hidden sm:block">
                      {announcement.isActive ? "Visible" : "Masquee"}
                    </span>
                    <Switch
                      checked={announcement.isActive}
                      onCheckedChange={() => toggleActive(announcement.id)}
                    />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => handleDelete(announcement.id)}
                      >
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
      {announcements.length === 0 && (
        <Card className="bg-card border-border">
          <CardContent className="p-12 text-center">
            <Megaphone className="h-12 w-12 text-muted-foreground mx-auto" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">Aucune annonce</h3>
            <p className="mt-2 text-muted-foreground">
              Creez votre premiere annonce pour informer la communaute.
            </p>
            <Button 
              className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Creer une annonce
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
