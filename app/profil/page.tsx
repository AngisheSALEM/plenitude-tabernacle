"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { 
  ArrowLeft, User, Mail, Phone, MapPin, Calendar, 
  Camera, Edit2, Save, X, Heart, Download, Play,
  Video, Headphones, Book, CheckCircle, Shield, LogOut
} from "lucide-react"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ThemeToggle } from "@/components/theme-toggle"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface ProfileUser {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  birthDate: string
  joinDate: string
  bio: string
  avatar: string | null
  stats: {
    videosWatched: number
    audioListened: number
    favorites: number
    downloads: number
  }
}

interface FavoriteItem {
  id: string
  title: string
  speaker?: string
  reference?: string
  date?: string
}

interface Favorites {
  videos: FavoriteItem[]
  audio: FavoriteItem[]
  cantiques: FavoriteItem[]
}

const defaultUser: ProfileUser = {
  id: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  birthDate: "",
  joinDate: new Date().toISOString(),
  bio: "",
  avatar: null,
  stats: { videosWatched: 0, audioListened: 0, favorites: 0, downloads: 0 }
}

export default function ProfilPage() {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [user, setUser] = useState<ProfileUser>(defaultUser)
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    bio: ""
  })
  const [favorites, setFavorites] = useState<Favorites>({ videos: [], audio: [], cantiques: [] })

  useEffect(() => {
    fetch("/api/profil")
      .then((r) => {
        if (!r.ok) throw new Error("Non autorise")
        return r.json()
      })
      .then((data) => {
        const u = data.user
        const favVideos: FavoriteItem[] = (u.favoriteVideos ?? []).map((f: any) => ({
          id: f.video?.id ?? f.videoId,
          title: f.video?.title ?? "Video",
          speaker: f.video?.speaker ?? "",
          date: f.video?.date ?? "",
        }))
        const favAudio: FavoriteItem[] = (u.favoriteAudios ?? []).map((f: any) => ({
          id: f.audio?.id ?? f.audioId,
          title: f.audio?.title ?? "Audio",
          speaker: f.audio?.speaker ?? "",
          date: f.audio?.date ?? "",
        }))
        const favCantiques: FavoriteItem[] = (u.favoriteCantiques ?? []).map((f: any) => ({
          id: f.cantique?.id ?? f.cantiqueId,
          title: f.cantique?.title ?? "Cantique",
          reference: f.cantique?.reference ?? "",
        }))
        setFavorites({ videos: favVideos, audio: favAudio, cantiques: favCantiques })
        const profile: ProfileUser = {
          id: u.id,
          firstName: u.firstName ?? "",
          lastName: u.lastName ?? "",
          email: u.email ?? "",
          phone: u.phone ?? "",
          address: u.address ?? "",
          birthDate: u.birthDate ?? "",
          joinDate: u.joinDate ?? u.createdAt ?? new Date().toISOString(),
          bio: u.bio ?? "",
          avatar: u.avatar ?? null,
          stats: {
            videosWatched: 0,
            audioListened: 0,
            favorites: favVideos.length + favAudio.length + favCantiques.length,
            downloads: 0,
          }
        }
        setUser(profile)
        setEditForm({
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
          phone: profile.phone,
          address: profile.address,
          bio: profile.bio,
        })
      })
      .catch(() => {
        router.push("/connexion")
      })
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    const res = await fetch("/api/profil", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    })
    setIsSaving(false)
    if (res.ok) {
      const data = await res.json()
      const u = data.user
      setUser((prev) => ({
        ...prev,
        firstName: u.firstName ?? prev.firstName,
        lastName: u.lastName ?? prev.lastName,
        email: u.email ?? prev.email,
        phone: u.phone ?? prev.phone,
        address: u.address ?? prev.address,
        bio: u.bio ?? prev.bio,
      }))
      setIsEditing(false)
    }
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/connexion" })
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "—"
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/espace-membre">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <span className="font-serif text-lg font-bold text-foreground">Mon Profil</span>
                <span className="block text-xs text-muted-foreground -mt-1">Plenitude Tabernacle</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link href="/parametres">
                <Button variant="outline" size="sm">
                  Parametres
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-2xl p-6 md:p-8 mb-8"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-primary/20 flex items-center justify-center">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.firstName} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span className="font-serif text-4xl md:text-5xl font-bold text-primary">
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </span>
                  )}
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-colors">
                  <Camera className="h-4 w-4" />
                </button>
              </div>

              {/* User Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
                      {user.firstName} {user.lastName}
                    </h1>
                    <p className="text-muted-foreground mt-1">{user.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                        <CheckCircle className="h-3 w-3" />
                        Membre verifie
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Membre depuis {formatDate(user.joinDate)}
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={() => setIsEditing(!isEditing)}
                    variant={isEditing ? "outline" : "default"}
                  >
                    {isEditing ? (
                      <>
                        <X className="mr-2 h-4 w-4" />
                        Annuler
                      </>
                    ) : (
                      <>
                        <Edit2 className="mr-2 h-4 w-4" />
                        Modifier
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-border">
              {[
                { icon: Video, label: "Videos vues", value: user.stats.videosWatched },
                { icon: Headphones, label: "Audio ecoutes", value: user.stats.audioListened },
                { icon: Heart, label: "Favoris", value: user.stats.favorites },
                { icon: Download, label: "Telechargements", value: user.stats.downloads },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  className="text-center p-4 bg-secondary/50 rounded-xl"
                >
                  <stat.icon className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Edit Form / Info Display */}
          {isEditing ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-2xl p-6 md:p-8 mb-8"
            >
              <h2 className="font-serif text-xl font-bold text-foreground mb-6">Modifier mes informations</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prenom</Label>
                  <Input
                    id="firstName"
                    value={editForm.firstName}
                    onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    value={editForm.lastName}
                    onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telephone</Label>
                  <Input
                    id="phone"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Adresse</Label>
                  <Input
                    id="address"
                    value={editForm.address}
                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    rows={3}
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-border">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Annuler
                </Button>
                <Button onClick={handleSave} disabled={isSaving}>
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? "Enregistrement..." : "Enregistrer"}
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-2xl p-6 md:p-8 mb-8"
            >
              <h2 className="font-serif text-xl font-bold text-foreground mb-6">Mes informations</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { icon: User, label: "Nom complet", value: `${user.firstName} ${user.lastName}` },
                  { icon: Mail, label: "Email", value: user.email },
                  { icon: Phone, label: "Telephone", value: user.phone || "—" },
                  { icon: MapPin, label: "Adresse", value: user.address || "—" },
                  { icon: Calendar, label: "Date de naissance", value: user.birthDate ? formatDate(user.birthDate) : "—" },
                  { icon: Calendar, label: "Membre depuis", value: formatDate(user.joinDate) },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{item.label}</p>
                      <p className="font-medium text-foreground">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              {user.bio && (
                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-2">Bio</p>
                  <p className="text-foreground">{user.bio}</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Favorites Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-2xl p-6 md:p-8"
          >
            <h2 className="font-serif text-xl font-bold text-foreground mb-6">Mes favoris</h2>
            
            <Tabs defaultValue="videos" className="space-y-6">
              <TabsList className="bg-secondary p-1 rounded-full w-fit">
                <TabsTrigger value="videos" className="rounded-full px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Video className="mr-2 h-4 w-4" />
                  Videos ({favorites.videos.length})
                </TabsTrigger>
                <TabsTrigger value="audio" className="rounded-full px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Headphones className="mr-2 h-4 w-4" />
                  Audio ({favorites.audio.length})
                </TabsTrigger>
                <TabsTrigger value="cantiques" className="rounded-full px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Book className="mr-2 h-4 w-4" />
                  Cantiques ({favorites.cantiques.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="videos" className="space-y-3">
                {favorites.videos.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">Aucune video en favori</p>
                ) : favorites.videos.map((video) => (
                  <div key={video.id} className="flex items-center gap-4 p-4 bg-secondary/30 rounded-xl hover:bg-secondary/50 transition-colors cursor-pointer">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Play className="h-5 w-5 text-primary ml-0.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground truncate">{video.title}</h3>
                      <p className="text-sm text-muted-foreground">{video.speaker}</p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Heart className="h-4 w-4 fill-primary text-primary" />
                    </Button>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="audio" className="space-y-3">
                {favorites.audio.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">Aucun audio en favori</p>
                ) : favorites.audio.map((audio) => (
                  <div key={audio.id} className="flex items-center gap-4 p-4 bg-secondary/30 rounded-xl hover:bg-secondary/50 transition-colors cursor-pointer">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Headphones className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground truncate">{audio.title}</h3>
                      <p className="text-sm text-muted-foreground">{audio.speaker}</p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Heart className="h-4 w-4 fill-primary text-primary" />
                    </Button>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="cantiques" className="space-y-3">
                {favorites.cantiques.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">Aucun cantique en favori</p>
                ) : favorites.cantiques.map((cantique) => (
                  <Link key={cantique.id} href="/cantiques">
                    <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-xl hover:bg-secondary/50 transition-colors cursor-pointer">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Book className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground truncate">{cantique.title}</h3>
                        <p className="text-sm text-muted-foreground">{cantique.reference}</p>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Heart className="h-4 w-4 fill-primary text-primary" />
                      </Button>
                    </div>
                  </Link>
                ))}
              </TabsContent>
            </Tabs>
          </motion.div>

          {/* Danger Zone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 p-6 border border-destructive/30 bg-destructive/5 rounded-2xl"
          >
            <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <Shield className="h-5 w-5 text-destructive" />
              Zone de danger
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Ces actions sont irreversibles. Procedez avec precaution.
            </p>
            <div className="flex flex-wrap gap-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="border-destructive/50 text-destructive hover:bg-destructive/10">
                    <LogOut className="mr-2 h-4 w-4" />
                    Deconnexion
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirmer la deconnexion</DialogTitle>
                    <DialogDescription>
                      Etes-vous sur de vouloir vous deconnecter de votre compte ?
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline">Annuler</Button>
                    <Button variant="destructive" onClick={handleLogout}>
                      Se deconnecter
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
