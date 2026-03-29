"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Book, Home, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { HymnBook } from "@/components/cantiques/hymn-book"

export default function CantiquesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/" className="flex items-center gap-3 group">
                <div className="relative w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <span className="font-serif text-xl font-bold text-primary">P</span>
                </div>
                <div className="hidden sm:block">
                  <span className="font-serif text-lg font-bold text-foreground">Plenitude</span>
                  <span className="block text-xs text-muted-foreground -mt-1">Recueil de Cantiques</span>
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <Home className="h-5 w-5" />
                </Button>
              </Link>
              <ThemeToggle />
              <Link href="/espace-membre">
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  <User className="mr-2 h-4 w-4" />
                  Espace Membre
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
            <Book className="h-4 w-4" />
            Collection Complete
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            Recueil de Cantiques
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Decouvrez notre collection de cantiques spirituels pour la louange et l&apos;adoration.
            Recherchez, lisez et partagez vos hymnes preferes.
          </p>
        </motion.div>

        {/* Hymn Book Component */}
        <HymnBook />
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} Plenitude Tabernacle. Tous droits reserves.</p>
        </div>
      </footer>
    </div>
  )
}
