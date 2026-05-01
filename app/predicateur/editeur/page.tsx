"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Save, Tv, Split, ArrowLeft, Trash2, Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { useSearchParams } from "next/navigation"
import { useEffect } from "react"

export default function EditeurSermon() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sermonId = searchParams.get("id")

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [slides, setSlides] = useState<any[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (sermonId) {
      setIsLoading(true)
      fetch(`/api/sermons/${sermonId}`)
        .then(res => res.json())
        .then(data => {
          if (data.sermon) {
            setTitle(data.sermon.title)
            setContent(data.sermon.content)
            setSlides(data.sermon.slides || [])
          }
        })
        .finally(() => setIsLoading(false))
    }
  }, [sermonId])

  const handleGenerateSlides = async () => {
    if (!content.trim()) {
      toast.error("Veuillez entrer du contenu pour générer des slides.")
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch('/api/slides/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: content }),
      })
      const data = await response.json()
      if (data.slides) {
        setSlides(data.slides)
        toast.success(`${data.slides.length} slides générées avec succès !`)
      } else {
        throw new Error(data.error || "Erreur lors de la génération")
      }
    } catch (error) {
      toast.error("Erreur lors de la génération des slides.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSave = async (shareAfterSave = false) => {
    if (!title.trim()) {
      toast.error("Veuillez donner un titre à votre message.")
      return
    }

    if (shareAfterSave) setIsSharing(true)
    else setIsSaving(true)

    try {
      const response = await fetch(sermonId ? `/api/sermons/${sermonId}` : '/api/sermons', {
        method: sermonId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, slides }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Erreur lors de l'enregistrement")
      }

      const data = await response.json()
      const sermon = data.sermon

      if (sermon && sermon.id) {
        if (shareAfterSave) {
          const shareRes = await fetch(`/api/sermons/${sermon.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isShared: true }),
          })

          if (shareRes.ok) {
            toast.success("Enregistré et envoyé à l'admin !")
            router.push('/predicateur')
          } else {
            const shareError = await shareRes.json()
            toast.error(shareError.error || "Enregistré, mais erreur lors de l'envoi.")
            router.push(`/predicateur/live/${sermon.id}`)
          }
        } else {
          toast.success("Message enregistré avec succès !")
          if (!sermonId) {
            router.push(`/predicateur/live/${sermon.id}`)
          }
        }
      } else {
        throw new Error("Le serveur n'a pas renvoyé l'objet sermon attendu")
      }
    } catch (error: any) {
      console.error("Save error:", error)
      toast.error(error.message || "Erreur lors de l'enregistrement.")
    } finally {
      setIsSaving(false)
      setIsSharing(false)
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/predicateur">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <Input
              placeholder="Titre du message..."
              className="max-w-md border-none text-xl font-bold focus-visible:ring-0"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleGenerateSlides} disabled={isGenerating}>
              {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Split className="mr-2 h-4 w-4" />}
              Transformer en Slides
            </Button>
            <Button variant="outline" className="text-primary border-primary/20" onClick={() => handleSave(true)} disabled={isSharing || isSaving}>
              {isSharing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              Partager avec l&apos;Admin
            </Button>
            <Button className="bg-primary hover:bg-primary/90" onClick={() => handleSave(false)} disabled={isSaving || isSharing}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Enregistrer
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            Bloc-note
          </h2>
          <Textarea
            placeholder="Écrivez votre message ici... (Vous pouvez coller de longs textes)"
            className="min-h-[600px] text-lg leading-relaxed resize-none p-6"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            Slides ({slides.length})
          </h2>
          <div className="space-y-4 overflow-y-auto max-h-[600px] pr-2">
            {slides.length === 0 ? (
              <div className="h-[400px] border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center text-muted-foreground">
                <Split className="h-12 w-12 mb-4 opacity-20" />
                <p>Vos slides apparaîtront ici après la génération.</p>
              </div>
            ) : (
              slides.map((slide, index) => (
                <Card key={index} className="group hover:border-primary/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-mono text-muted-foreground">SLIDE {index + 1} - {slide.type}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                        onClick={() => {
                          const newSlides = [...slides]
                          newSlides.splice(index, 1)
                          setSlides(newSlides)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-sm line-clamp-4 whitespace-pre-wrap">
                      {slide.content}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
