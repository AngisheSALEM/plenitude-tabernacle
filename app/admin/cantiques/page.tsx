"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  Book, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Save,
  X,
  ChevronDown,
  Music
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const categories = [
  "Adoration",
  "Amour",
  "Aspiration",
  "Benediction",
  "Ciel",
  "Combat spirituel",
  "Communion",
  "Confiance",
  "Consecration",
  "Delivrance",
  "Esperance",
  "Foi",
  "Grace",
  "Jesus",
  "Louange",
  "Marche",
  "Mission",
  "Priere",
  "Redemption",
  "Refuge",
  "Saint-Esprit",
  "Soumission",
  "Temoignage"
]

// Sample existing cantiques for display
const existingCantiques = [
  { id: 1, title: "A TOI LA GLOIRE", reference: "Crois seulement 1", category: "Louange" },
  { id: 2, title: "JE LOUERAI L'ETERNEL", reference: "Crois seulement 5", category: "Louange" },
  { id: 3, title: "TOURNE LES YEUX VERS JESUS", reference: "Crois seulement 10", category: "Foi" },
  { id: 4, title: "TEL QUE JE SUIS", reference: "Crois seulement 15", category: "Grace" },
  { id: 5, title: "QUEL AMI FIDELE ET TENDRE", reference: "Crois seulement 75", category: "Amour" },
]

interface CantiqueForm {
  title: string
  reference: string
  category: string
  verses: string[]
  chorus: string[]
}

const emptyForm: CantiqueForm = {
  title: "",
  reference: "",
  category: "",
  verses: [""],
  chorus: [""]
}

export default function AdminCantiquesPage() {
  const [cantiques, setCantiques] = useState(existingCantiques)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Toutes")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false)
  const [selectedCantique, setSelectedCantique] = useState<typeof existingCantiques[0] | null>(null)
  const [formData, setFormData] = useState<CantiqueForm>(emptyForm)
  const [successMessage, setSuccessMessage] = useState("")

  const filteredCantiques = cantiques.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.reference.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "Toutes" || c.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleAddVerse = () => {
    setFormData(prev => ({
      ...prev,
      verses: [...prev.verses, ""]
    }))
  }

  const handleRemoveVerse = (index: number) => {
    setFormData(prev => ({
      ...prev,
      verses: prev.verses.filter((_, i) => i !== index)
    }))
  }

  const handleVerseChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      verses: prev.verses.map((v, i) => i === index ? value : v)
    }))
  }

  const handleChorusChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      chorus: [value]
    }))
  }

  const handleSubmit = () => {
    // Validate form
    if (!formData.title || !formData.reference || !formData.category || formData.verses.every(v => !v.trim())) {
      return
    }

    const newCantique = {
      id: cantiques.length + 1,
      title: formData.title.toUpperCase(),
      reference: formData.reference,
      category: formData.category
    }

    setCantiques(prev => [...prev, newCantique])
    setFormData(emptyForm)
    setIsAddDialogOpen(false)
    setSuccessMessage("Cantique ajoute avec succes!")
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  const handleDelete = () => {
    if (selectedCantique) {
      setCantiques(prev => prev.filter(c => c.id !== selectedCantique.id))
      setIsDeleteDialogOpen(false)
      setSelectedCantique(null)
      setSuccessMessage("Cantique supprime avec succes!")
      setTimeout(() => setSuccessMessage(""), 3000)
    }
  }

  const openAddDialog = () => {
    setFormData(emptyForm)
    setIsAddDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-foreground">
            Gestion des Cantiques
          </h2>
          <p className="text-muted-foreground">
            Ajoutez, modifiez ou supprimez les cantiques du recueil.
          </p>
        </div>
        <Button onClick={openAddDialog} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un cantique
        </Button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-600"
        >
          {successMessage}
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Book className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{cantiques.length}</p>
                <p className="text-sm text-muted-foreground">Total cantiques</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-500/10">
                <Music className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{categories.length}</p>
                <p className="text-sm text-muted-foreground">Categories</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-500/10">
                <Plus className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">3</p>
                <p className="text-sm text-muted-foreground">Ajoutes ce mois</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un cantique..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Categorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Toutes">Toutes les categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Cantiques Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">
            Liste des cantiques ({filteredCantiques.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Titre</TableHead>
                <TableHead className="hidden sm:table-cell">Reference</TableHead>
                <TableHead className="hidden md:table-cell">Categorie</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCantiques.map((cantique) => (
                <TableRow key={cantique.id}>
                  <TableCell className="font-medium">{cantique.id}</TableCell>
                  <TableCell className="font-medium">{cantique.title}</TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground">{cantique.reference}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      {cantique.category}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          setSelectedCantique(cantique)
                          setIsPreviewDialogOpen(true)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          setSelectedCantique(cantique)
                          setIsEditDialogOpen(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => {
                          setSelectedCantique(cantique)
                          setIsDeleteDialogOpen(true)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Cantique Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau cantique</DialogTitle>
            <DialogDescription>
              Remplissez les informations du cantique selon le format du recueil.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre du cantique *</Label>
                <Input
                  id="title"
                  placeholder="Ex: A TOI LA GLOIRE"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reference">Reference *</Label>
                <Input
                  id="reference"
                  placeholder="Ex: Crois seulement 1"
                  value={formData.reference}
                  onChange={(e) => setFormData(prev => ({ ...prev, reference: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Categorie *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selectionnez une categorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Verses */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Couplets *</Label>
                <Button type="button" variant="outline" size="sm" onClick={handleAddVerse}>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter un couplet
                </Button>
              </div>
              {formData.verses.map((verse, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm text-muted-foreground">Couplet {index + 1}</Label>
                    {formData.verses.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 text-destructive hover:text-destructive"
                        onClick={() => handleRemoveVerse(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <Textarea
                    placeholder="Entrez les paroles du couplet (une ligne par vers, utilisez \n pour les sauts de ligne)"
                    value={verse}
                    onChange={(e) => handleVerseChange(index, e.target.value)}
                    rows={4}
                  />
                </div>
              ))}
            </div>

            {/* Chorus */}
            <div className="space-y-2">
              <Label>Refrain (optionnel)</Label>
              <Textarea
                placeholder="Entrez les paroles du refrain"
                value={formData.chorus[0] || ""}
                onChange={(e) => handleChorusChange(e.target.value)}
                rows={4}
              />
            </div>

            {/* Format Example */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium text-foreground mb-2">Format attendu :</p>
              <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
{`{
  id: 1,
  title: "A TOI LA GLOIRE",
  reference: "Crois seulement 1",
  category: "Louange",
  lyrics: [
    "Couplet 1 ligne 1,\\nCouplet 1 ligne 2,\\n...",
    "Couplet 2 ligne 1,\\nCouplet 2 ligne 2,\\n..."
  ],
  chorus: [
    "Refrain ligne 1,\\nRefrain ligne 2,\\n..."
  ]
}`}
              </pre>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSubmit}>
              <Save className="mr-2 h-4 w-4" />
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer ce cantique ?</DialogTitle>
            <DialogDescription>
              Etes-vous sur de vouloir supprimer &quot;{selectedCantique?.title}&quot; ? Cette action est irreversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedCantique?.title}</DialogTitle>
            <DialogDescription>
              {selectedCantique?.reference} - {selectedCantique?.category}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground text-center">
              Apercu du cantique complet disponible dans le recueil.
            </p>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsPreviewDialogOpen(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
