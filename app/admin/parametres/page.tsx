"use client"

import { useState } from "react"
import { 
  Settings, 
  Church,
  Clock,
  MapPin,
  Phone,
  Mail,
  Globe,
  Save,
  Facebook,
  Youtube,
  RefreshCw
} from "lucide-react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdminSettingsPage() {
  const [churchInfo, setChurchInfo] = useState({
    name: "Plenitude Tabernacle",
    description: "Une eglise vivante au coeur de Kinshasa, engagee dans la proclamation de l&apos;Evangile et le service de la communaute.",
    address: "03 Av. Mafuta, Q. Mfinda, Ngaliema, Kinshasa, RDC",
    phone: "+243 999 123 456",
    email: "contact@plenitude-tabernacle.cd",
    website: "www.plenitude-tabernacle.cd"
  })

  const [schedule, setSchedule] = useState({
    sundayMorning: "09:00",
    sundayEvening: "17:00",
    wednesday: "18:00",
    friday: "18:00"
  })

  const [social, setSocial] = useState({
    facebook: "https://facebook.com/plenitudetabernacle",
    youtube: "https://youtube.com/@plenitudetabernacle",
    instagram: "",
    twitter: ""
  })

  const [youtubeSync, setYoutubeSync] = useState({
    playlistId: "PLPNLjERB0V6CQLtDMHkck2JhHCG9JXusa",
    isSyncing: false
  })

  const [features, setFeatures] = useState({
    enableLiveStream: true,
    enableMemberArea: true,
    enableComments: false,
    enableDownloads: true
  })

  const handleSyncVideos = async () => {
    setYoutubeSync(prev => ({ ...prev, isSyncing: true }))
    try {
      const res = await fetch(`/api/sync-youtube?playlistId=${youtubeSync.playlistId}`)
      const data = await res.json()

      if (res.ok) {
        const total = data.stats?.total ?? 0;
        toast.success(`Synchronisation réussie : ${total} vidéos traitées`)
      } else {
        toast.error(data.error || "Erreur lors de la synchronisation")
      }
    } catch (error) {
      console.error("Sync error:", error)
      toast.error("Erreur réseau lors de la synchronisation")
    } finally {
      setYoutubeSync(prev => ({ ...prev, isSyncing: false }))
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-serif font-bold text-foreground">
          Parametres
        </h2>
        <p className="text-muted-foreground">
          Configurez les informations de l&apos;eglise et les options du site.
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-muted">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="schedule">Horaires</TabsTrigger>
          <TabsTrigger value="social">Reseaux sociaux</TabsTrigger>
          <TabsTrigger value="youtube">YouTube</TabsTrigger>
          <TabsTrigger value="features">Fonctionnalites</TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Church className="h-5 w-5 text-primary" />
                Informations de l&apos;eglise
              </CardTitle>
              <CardDescription>
                Ces informations sont affichees sur le site public.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom de l&apos;eglise</Label>
                <Input
                  id="name"
                  value={churchInfo.name}
                  onChange={(e) => setChurchInfo({ ...churchInfo, name: e.target.value })}
                  className="bg-background border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={churchInfo.description}
                  onChange={(e) => setChurchInfo({ ...churchInfo, description: e.target.value })}
                  className="bg-background border-border min-h-24"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="address"
                    value={churchInfo.address}
                    onChange={(e) => setChurchInfo({ ...churchInfo, address: e.target.value })}
                    className="pl-10 bg-background border-border"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telephone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={churchInfo.phone}
                      onChange={(e) => setChurchInfo({ ...churchInfo, phone: e.target.value })}
                      className="pl-10 bg-background border-border"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={churchInfo.email}
                      onChange={(e) => setChurchInfo({ ...churchInfo, email: e.target.value })}
                      className="pl-10 bg-background border-border"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Site web</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="website"
                    value={churchInfo.website}
                    onChange={(e) => setChurchInfo({ ...churchInfo, website: e.target.value })}
                    className="pl-10 bg-background border-border"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Save className="mr-2 h-4 w-4" />
            Enregistrer les modifications
          </Button>
        </TabsContent>

        {/* Schedule Tab */}
        <TabsContent value="schedule" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Horaires des cultes
              </CardTitle>
              <CardDescription>
                Definissez les horaires des differents services.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sundayMorning">Culte du Dimanche matin</Label>
                  <Input
                    id="sundayMorning"
                    type="time"
                    value={schedule.sundayMorning}
                    onChange={(e) => setSchedule({ ...schedule, sundayMorning: e.target.value })}
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sundayEvening">Culte du Dimanche soir</Label>
                  <Input
                    id="sundayEvening"
                    type="time"
                    value={schedule.sundayEvening}
                    onChange={(e) => setSchedule({ ...schedule, sundayEvening: e.target.value })}
                    className="bg-background border-border"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="wednesday">Etude biblique (Mercredi)</Label>
                  <Input
                    id="wednesday"
                    type="time"
                    value={schedule.wednesday}
                    onChange={(e) => setSchedule({ ...schedule, wednesday: e.target.value })}
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="friday">Priere (Vendredi)</Label>
                  <Input
                    id="friday"
                    type="time"
                    value={schedule.friday}
                    onChange={(e) => setSchedule({ ...schedule, friday: e.target.value })}
                    className="bg-background border-border"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Save className="mr-2 h-4 w-4" />
            Enregistrer les horaires
          </Button>
        </TabsContent>

        {/* YouTube Tab */}
        <TabsContent value="youtube" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Youtube className="h-5 w-5 text-primary" />
                Synchronisation YouTube
              </CardTitle>
              <CardDescription>
                Gérez la synchronisation automatique des vidéos depuis votre chaîne YouTube.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="playlistId">ID de la Playlist YouTube</Label>
                <div className="flex gap-2">
                  <Input
                    id="playlistId"
                    value={youtubeSync.playlistId}
                    onChange={(e) => setYoutubeSync({ ...youtubeSync, playlistId: e.target.value })}
                    className="bg-background border-border"
                    placeholder="PL..."
                  />
                  <Button
                    onClick={handleSyncVideos}
                    disabled={youtubeSync.isSyncing}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground shrink-0"
                  >
                    {youtubeSync.isSyncing ? (
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="mr-2 h-4 w-4" />
                    )}
                    Synchroniser maintenant
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Cette playlist sera utilisée pour importer automatiquement les nouvelles vidéos sur le site.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Tab */}
        <TabsContent value="social" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Reseaux sociaux
              </CardTitle>
              <CardDescription>
                Liens vers vos pages sur les reseaux sociaux.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook</Label>
                <div className="relative">
                  <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="facebook"
                    value={social.facebook}
                    onChange={(e) => setSocial({ ...social, facebook: e.target.value })}
                    className="pl-10 bg-background border-border"
                    placeholder="https://facebook.com/..."
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="youtube">YouTube</Label>
                <div className="relative">
                  <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="youtube"
                    value={social.youtube}
                    onChange={(e) => setSocial({ ...social, youtube: e.target.value })}
                    className="pl-10 bg-background border-border"
                    placeholder="https://youtube.com/..."
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  value={social.instagram}
                  onChange={(e) => setSocial({ ...social, instagram: e.target.value })}
                  className="bg-background border-border"
                  placeholder="https://instagram.com/..."
                />
              </div>
            </CardContent>
          </Card>

          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Save className="mr-2 h-4 w-4" />
            Enregistrer les liens
          </Button>
        </TabsContent>

        {/* Features Tab */}
        <TabsContent value="features" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                Fonctionnalites du site
              </CardTitle>
              <CardDescription>
                Activez ou desactivez certaines fonctionnalites.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Streaming en direct</Label>
                  <p className="text-sm text-muted-foreground">
                    Afficher la section live sur la page d&apos;accueil
                  </p>
                </div>
                <Switch
                  checked={features.enableLiveStream}
                  onCheckedChange={(checked) => setFeatures({ ...features, enableLiveStream: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Espace membre</Label>
                  <p className="text-sm text-muted-foreground">
                    Permettre l&apos;inscription et la connexion des membres
                  </p>
                </div>
                <Switch
                  checked={features.enableMemberArea}
                  onCheckedChange={(checked) => setFeatures({ ...features, enableMemberArea: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Commentaires</Label>
                  <p className="text-sm text-muted-foreground">
                    Permettre les commentaires sur les predications
                  </p>
                </div>
                <Switch
                  checked={features.enableComments}
                  onCheckedChange={(checked) => setFeatures({ ...features, enableComments: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Telechargements</Label>
                  <p className="text-sm text-muted-foreground">
                    Permettre le telechargement des fichiers audio
                  </p>
                </div>
                <Switch
                  checked={features.enableDownloads}
                  onCheckedChange={(checked) => setFeatures({ ...features, enableDownloads: checked })}
                />
              </div>
            </CardContent>
          </Card>

          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Save className="mr-2 h-4 w-4" />
            Enregistrer les parametres
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  )
}
