"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Mail, Lock, Eye, EyeOff, ArrowRight, Chrome, User } from "lucide-react"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ThemeToggle } from "@/components/theme-toggle"

export default function InscriptionPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      return
    }
    setIsLoading(true)
    setError("")
    const res = await fetch("/api/inscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      }),
    })
    const data = await res.json()
    if (!res.ok) {
      setIsLoading(false)
      setError(data.error || "Erreur lors de la creation du compte")
      return
    }
    const result = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
    })
    setIsLoading(false)
    if (result?.ok) {
      window.location.href = "/espace-membre"
    } else {
      setError("Erreur lors de la connexion automatique")
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    await signIn("google", { callbackUrl: "/espace-membre" })
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Visual */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-gradient-to-br from-primary/20 via-background to-primary/10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-primary/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="w-32 h-32 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center mb-8 mx-auto">
              <span className="font-serif text-6xl font-bold text-primary">P</span>
            </div>
            <h2 className="font-serif text-4xl font-bold text-foreground mb-4 text-balance">
              Commencez votre parcours spirituel
            </h2>
            <p className="text-lg text-muted-foreground max-w-md text-pretty">
              Creez votre compte et accedez immediatement a tous nos contenus exclusifs.
            </p>

            <div className="mt-12 space-y-4 text-left">
              {[
                "Acces illimite aux predications video",
                "Bibliotheque audio complete",
                "Telechargement hors-ligne",
                "Notifications des nouveaux contenus"
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <span className="text-foreground">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-12 xl:px-24">
        <div className="absolute top-6 right-6">
          <ThemeToggle />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md mx-auto"
        >
          <Link href="/" className="flex items-center gap-3 mb-12 group">
            <div className="relative w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden">
              <span className="font-serif text-2xl font-bold text-primary">P</span>
            </div>
            <div>
              <span className="font-serif text-xl font-bold text-foreground">Plenitude</span>
              <span className="block text-sm text-muted-foreground -mt-1">Tabernacle</span>
            </div>
          </Link>

          <div className="mb-8">
            <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
              Creer un compte
            </h1>
            <p className="text-muted-foreground">
              Rejoignez notre communaute et accedez a tous nos contenus.
            </p>
          </div>

          <Button
            variant="outline"
            className="w-full py-6 mb-6 border-border hover:bg-secondary group"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <Chrome className="mr-3 h-5 w-5" />
            Continuer avec Google
            <ArrowRight className="ml-auto h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
          </Button>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-background text-muted-foreground">
                ou creez un compte avec votre email
              </span>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">Nom complet</Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Votre nom"
                  className="pl-12 py-6 bg-secondary border-border focus:border-primary"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  className="pl-12 py-6 bg-secondary border-border focus:border-primary"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 caracteres"
                    className="pl-12 py-6 bg-secondary border-border focus:border-primary"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    minLength={8}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-foreground">Confirmer</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirmez"
                    className="pl-12 py-6 bg-secondary border-border focus:border-primary"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? "Masquer" : "Afficher"} les mots de passe
            </button>

            <div className="flex items-start gap-2 pt-2">
              <Checkbox
                id="terms"
                checked={formData.acceptTerms}
                onCheckedChange={(checked) => setFormData({ ...formData, acceptTerms: checked as boolean })}
                required
              />
              <Label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer leading-relaxed">
                J&apos;accepte les{" "}
                <Link href="/conditions" className="text-primary hover:underline">
                  conditions d&apos;utilisation
                </Link>{" "}
                et la{" "}
                <Link href="/confidentialite" className="text-primary hover:underline">
                  politique de confidentialite
                </Link>
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full py-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full mt-4"
              disabled={isLoading || !formData.acceptTerms}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Creation en cours...
                </div>
              ) : (
                <>
                  Creer mon compte
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-muted-foreground">
            Deja un compte ?{" "}
            <Link href="/connexion" className="text-primary font-medium hover:underline">
              Se connecter
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
