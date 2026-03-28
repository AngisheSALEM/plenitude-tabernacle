"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  Video, 
  Upload,
  Link as LinkIcon,
  Image as ImageIcon,
  ArrowLeft,
  Save,
  Eye
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

export default function NewVideoPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    speaker: "Pasteur Joel Mugisho",
    category: "",
    videoUrl: "",
    isFeatured: false
  })
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)

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

  const extractYouTubeId = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/)
    return match ? match[1] : null
  }

  const youtubeId = extractYouTubeId(formData.videoUrl)

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/videos">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-serif font-bold text-foreground">
            Nouvelle Video
          </h2>
          <p className="text-muted-foreground">
            Ajoutez une nouvelle predication video
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Informations generales</CardTitle>
              <CardDescription>Renseignez les details de la video</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre de la video</Label>
                <Input
                  id="title"
                  placeholder="Ex: La puissance de la resurrection"
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
                      <SelectItem value="Conference">Conference</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Lien YouTube</CardTitle>
              <CardDescription>Collez le lien de la video YouTube</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="videoUrl">URL de la video</Label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="videoUrl"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    className="pl-10 bg-background border-border"
                  />
                </div>
              </div>

              {/* YouTube Preview */}
              {youtubeId && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2"
                >
                  <Label>Apercu</Label>
                  <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                    <iframe
                      src={`https://www.youtube.com/embed/${youtubeId}`}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Miniature</CardTitle>
              <CardDescription>Uploadez une image de couverture (recommande: 1280x720)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {thumbnailPreview ? (
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
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
                  <label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors">
                    <div className="flex flex-col items-center justify-center py-6">
                      <div className="p-3 rounded-full bg-primary/10 mb-3">
                        <ImageIcon className="h-6 w-6 text-primary" />
                      </div>
                      <p className="text-sm font-medium text-foreground">Cliquez pour uploader</p>
                      <p className="text-xs text-muted-foreground mt-1">PNG, JPG jusqu&apos;a 5MB</p>
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
                  <p className="text-xs text-muted-foreground">Afficher sur la page d&apos;accueil</p>
                </div>
                <Switch
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
                />
              </div>
              
              <div className="pt-4 space-y-2">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
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
              <CardTitle className="text-lg">Conseils</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">1.</span>
                  Utilisez un titre clair et descriptif
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">2.</span>
                  Ajoutez une description detaillee
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">3.</span>
                  Choisissez une miniature attrayante
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">4.</span>
                  Selectionnez la bonne categorie
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
