"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  Headphones, 
  Upload,
  Image as ImageIcon,
  ArrowLeft,
  Save,
  Eye,
  Music,
  X
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from "next/link"

export default function NewAudioPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    speaker: "Pasteur Joel Mugisho",
    category: "",
    isFeatured: false
  })
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAudioFile(file)
    }
  }

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/audio">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-serif font-bold text-foreground">
            Nouvel Audio
          </h2>
          <p className="text-muted-foreground">
            Ajoutez une nouvelle predication audio
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Informations generales</CardTitle>
              <CardDescription>Renseignez les details de l&apos;audio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre</Label>
                <Input
                  id="title"
                  placeholder="Ex: Marcher dans la foi"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-background border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Decrivez le contenu de cette predication..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-background border-border min-h-24"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="speaker">Orateur</Label>
                  <Input
                    id="speaker"
                    value={formData.speaker}
                    onChange={(e) => setFormData({ ...formData, speaker: e.target.value })}
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Categorie</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue placeholder="Selectionnez" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Predication">Predication</SelectItem>
                      <SelectItem value="Enseignement">Enseignement</SelectItem>
                      <SelectItem value="Louange">Louange</SelectItem>
                      <SelectItem value="Temoignage">Temoignage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Fichier Audio</CardTitle>
              <CardDescription>Uploadez le fichier MP3 de la predication</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {audioFile ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 border border-border"
                  >
                    <div className="p-3 rounded-full bg-primary/10">
                      <Music className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{audioFile.name}</p>
                      <p className="text-sm text-muted-foreground">{formatFileSize(audioFile.size)}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setAudioFile(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors">
                    <div className="flex flex-col items-center justify-center py-6">
                      <div className="p-3 rounded-full bg-primary/10 mb-3">
                        <Upload className="h-6 w-6 text-primary" />
                      </div>
                      <p className="text-sm font-medium text-foreground">Cliquez pour uploader</p>
                      <p className="text-xs text-muted-foreground mt-1">MP3 jusqu&apos;a 100MB</p>
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="audio/mp3,audio/mpeg"
                      onChange={handleAudioChange}
                    />
                  </label>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Miniature (optionnel)</CardTitle>
              <CardDescription>Uploadez une image de couverture</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {thumbnailPreview ? (
                  <div className="relative aspect-square max-w-xs rounded-lg overflow-hidden bg-muted">
                    <img 
                      src={thumbnailPreview} 
                      alt="Thumbnail preview" 
                      className="w-full h-full object-cover"
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute bottom-2 right-2"
                      onClick={() => setThumbnailPreview(null)}
                    >
                      Changer
                    </Button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full max-w-xs aspect-square border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors">
                    <div className="flex flex-col items-center justify-center py-6">
                      <div className="p-3 rounded-full bg-primary/10 mb-3">
                        <ImageIcon className="h-6 w-6 text-primary" />
                      </div>
                      <p className="text-sm font-medium text-foreground">Ajouter une image</p>
                      <p className="text-xs text-muted-foreground mt-1">PNG, JPG (500x500)</p>
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleThumbnailChange}
                    />
                  </label>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Publication</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Mettre a la une</Label>
                  <p className="text-xs text-muted-foreground">Afficher en premier</p>
                </div>
                <Switch
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
                />
              </div>
              
              <div className="pt-4 space-y-2">
                <Button 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={!audioFile || !formData.title}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Publier
                </Button>
                <Button variant="outline" className="w-full border-border">
                  <Eye className="mr-2 h-4 w-4" />
                  Apercu
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Format audio</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">-</span>
                  Format: MP3
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">-</span>
                  Bitrate: 128-320 kbps
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">-</span>
                  Taille max: 100 MB
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
