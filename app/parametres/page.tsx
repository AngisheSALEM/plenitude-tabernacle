"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { 
  ArrowLeft, Bell, Lock, Palette, 
  Smartphone, Eye, EyeOff, Save, User, Mail,
  Download, Trash2, HelpCircle, MessageSquare, FileText,
  ChevronRight, Check
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function ParametresPage() {
  const [settings, setSettings] = useState({
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    newVideoNotif: true,
    newAudioNotif: true,
    eventNotif: true,
    newsletterNotif: false,
  })

  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  const [savedMessage, setSavedMessage] = useState("")

  const handleSave = (section: string) => {
    setSavedMessage(section)
    setTimeout(() => setSavedMessage(""), 2000)
  }

  const updateSetting = (key: string, value: boolean | string) => {
    setSettings(prev => ({ ...prev, [key]: value }))
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
                <span className="font-serif text-lg font-bold text-foreground">Parametres</span>
                <span className="block text-xs text-muted-foreground -mt-1">Plenitude Tabernacle</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link href="/profil">
                <Button variant="outline" size="sm">
                  <User className="mr-2 h-4 w-4" />
                  Profil
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Parametres</h1>
            <p className="text-muted-foreground">
              Gerez vos preferences, notifications et parametres de securite.
            </p>
          </motion.div>

          <Tabs defaultValue="notifications" className="space-y-8">
            <TabsList className="bg-secondary p-1 rounded-xl w-full flex-wrap h-auto gap-1">
              <TabsTrigger value="notifications" className="rounded-lg flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Bell className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="preferences" className="rounded-lg flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Palette className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Preferences</span>
              </TabsTrigger>
              <TabsTrigger value="securite" className="rounded-lg flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Lock className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Securite</span>
              </TabsTrigger>
              <TabsTrigger value="aide" className="rounded-lg flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <HelpCircle className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Aide</span>
              </TabsTrigger>
            </TabsList>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* General Notifications */}
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h2 className="font-semibold text-foreground mb-6 flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" />
                    Notifications generales
                  </h2>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Notifications par email</Label>
                        <p className="text-sm text-muted-foreground">
                          Recevoir des notifications par email
                        </p>
                      </div>
                      <Switch
                        checked={settings.emailNotifications}
                        onCheckedChange={(checked) => updateSetting("emailNotifications", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Notifications push</Label>
                        <p className="text-sm text-muted-foreground">
                          Recevoir des notifications sur votre appareil
                        </p>
                      </div>
                      <Switch
                        checked={settings.pushNotifications}
                        onCheckedChange={(checked) => updateSetting("pushNotifications", checked)}
                      />
                    </div>
                  </div>
                </div>

                {/* Content Notifications */}
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h2 className="font-semibold text-foreground mb-6">Notifications de contenu</h2>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Nouvelles videos</Label>
                        <p className="text-sm text-muted-foreground">
                          Etre notifie lors de nouvelles predications
                        </p>
                      </div>
                      <Switch
                        checked={settings.newVideoNotif}
                        onCheckedChange={(checked) => updateSetting("newVideoNotif", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Nouveaux audio</Label>
                        <p className="text-sm text-muted-foreground">
                          Etre notifie lors de nouveaux contenus audio
                        </p>
                      </div>
                      <Switch
                        checked={settings.newAudioNotif}
                        onCheckedChange={(checked) => updateSetting("newAudioNotif", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Evenements</Label>
                        <p className="text-sm text-muted-foreground">
                          Rappels pour les cultes et evenements speciaux
                        </p>
                      </div>
                      <Switch
                        checked={settings.eventNotif}
                        onCheckedChange={(checked) => updateSetting("eventNotif", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Newsletter</Label>
                        <p className="text-sm text-muted-foreground">
                          Recevoir la newsletter mensuelle
                        </p>
                      </div>
                      <Switch
                        checked={settings.newsletterNotif}
                        onCheckedChange={(checked) => updateSetting("newsletterNotif", checked)}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => handleSave("notifications")}>
                    {savedMessage === "notifications" ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Enregistre !
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Enregistrer
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Theme */}
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h2 className="font-semibold text-foreground mb-6 flex items-center gap-2">
                    <Palette className="h-5 w-5 text-primary" />
                    Affichage
                  </h2>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Theme</Label>
                        <p className="text-sm text-muted-foreground">
                          Mode clair, sombre ou automatique
                        </p>
                      </div>
                      <ThemeToggle />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => handleSave("preferences")}>
                    {savedMessage === "preferences" ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Enregistre !
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Enregistrer
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="securite">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Password */}
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h2 className="font-semibold text-foreground mb-6 flex items-center gap-2">
                    <Lock className="h-5 w-5 text-primary" />
                    Changer le mot de passe
                  </h2>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showCurrentPassword ? "text" : "password"}
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      />
                    </div>
                    <Button className="mt-2">
                      Mettre a jour le mot de passe
                    </Button>
                  </div>
                </div>

                {/* Data Management */}
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h2 className="font-semibold text-foreground mb-6 flex items-center gap-2">
                    <Download className="h-5 w-5 text-primary" />
                    Gestion des donnees
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl">
                      <div>
                        <p className="font-medium text-foreground">Telecharger mes donnees</p>
                        <p className="text-sm text-muted-foreground">Obtenir une copie de toutes vos donnees</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Exporter
                      </Button>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <div className="flex items-center justify-between p-4 bg-destructive/5 border border-destructive/20 rounded-xl cursor-pointer hover:bg-destructive/10 transition-colors">
                          <div>
                            <p className="font-medium text-destructive">Supprimer mon compte</p>
                            <p className="text-sm text-muted-foreground">Cette action est irreversible</p>
                          </div>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Supprimer
                          </Button>
                        </div>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Supprimer votre compte ?</DialogTitle>
                          <DialogDescription>
                            Cette action est irreversible. Toutes vos donnees, favoris et telechargements seront definitivement supprimes.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant="outline">Annuler</Button>
                          <Button variant="destructive">Supprimer definitivement</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </motion.div>
            </TabsContent>

            {/* Help Tab */}
            <TabsContent value="aide">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* FAQ */}
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h2 className="font-semibold text-foreground mb-6 flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-primary" />
                    Questions frequentes
                  </h2>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>Comment telecharger une video ?</AccordionTrigger>
                      <AccordionContent>
                        Pour telecharger une video, rendez-vous dans la section Videos, selectionnez la video souhaitee et cliquez sur le bouton de telechargement. La video sera disponible dans votre espace &quot;Telecharges&quot;.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger>Puis-je regarder les videos hors ligne ?</AccordionTrigger>
                      <AccordionContent>
                        Oui, une fois telecharges, les contenus sont accessibles sans connexion internet dans l&apos;onglet &quot;Telecharges&quot; de votre espace membre.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger>Comment changer mon mot de passe ?</AccordionTrigger>
                      <AccordionContent>
                        Rendez-vous dans l&apos;onglet Securite des parametres, puis remplissez le formulaire de changement de mot de passe avec votre mot de passe actuel et le nouveau.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4">
                      <AccordionTrigger>Comment contacter l&apos;eglise ?</AccordionTrigger>
                      <AccordionContent>
                        Vous pouvez nous contacter par email a contact@plenitude-tabernacle.com ou nous rendre visite pendant les horaires de culte indiques dans la section Localisation.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>

                {/* Contact */}
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h2 className="font-semibold text-foreground mb-6 flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    Nous contacter
                  </h2>
                  <div className="space-y-3">
                    <Link href="mailto:contact@plenitude-tabernacle.com">
                      <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl hover:bg-secondary/50 transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                          <Mail className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium text-foreground">Email</p>
                            <p className="text-sm text-muted-foreground">contact@plenitude-tabernacle.com</p>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </Link>
                    <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Smartphone className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium text-foreground">Telephone</p>
                          <p className="text-sm text-muted-foreground">+243 999 123 456</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Legal */}
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h2 className="font-semibold text-foreground mb-6 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Informations legales
                  </h2>
                  <div className="space-y-3">
                    <Link href="#">
                      <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl hover:bg-secondary/50 transition-colors cursor-pointer">
                        <p className="font-medium text-foreground">Conditions d&apos;utilisation</p>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </Link>
                    <Link href="#">
                      <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl hover:bg-secondary/50 transition-colors cursor-pointer">
                        <p className="font-medium text-foreground">Politique de confidentialite</p>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </Link>
                    <div className="p-4 bg-secondary/30 rounded-xl">
                      <p className="text-sm text-muted-foreground">
                        Version de l&apos;application : 1.0.0
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
