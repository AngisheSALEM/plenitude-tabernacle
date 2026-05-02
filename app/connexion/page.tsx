"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Mail, Lock, Eye, EyeOff, ArrowRight, Chrome } from "lucide-react"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ThemeToggle } from "@/components/theme-toggle"

export default function ConnexionPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    const result = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      rememberMe: formData.rememberMe.toString(),
      redirect: false,
    })
    setIsLoading(false)
    if (result?.ok) {
      window.location.href = "/espace-membre"
    } else {
      setError("Email ou mot de passe incorrect")
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    await signIn("google", { callbackUrl: "/espace-membre" })
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-12 xl:px-24">
        <div className="absolute top-6 right-6">
          <ThemeToggle />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md mx-auto"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 mb-12 group">
            <div className="relative w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden">
              <span className="font-serif text-2xl font-bold text-primary">P</span>
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <span className="font-serif text-xl font-bold text-foreground">Plenitude</span>
              <span className="block text-sm text-muted-foreground -mt-1">Tabernacle</span>
            </div>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
              Bon retour parmi nous
            </h1>
            <p className="text-muted-foreground">
              Connectez-vous pour acceder a votre espace membre et profiter de tous nos contenus.
            </p>
          </div>

          {/* Google Login */}
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

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-background text-muted-foreground">
                ou continuez avec votre email
              </span>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
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

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-foreground">Mot de passe</Label>
                <Link href="/mot-de-passe-oublie" className="text-sm text-primary hover:underline">
                  Mot de passe oublie ?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Votre mot de passe"
                  className="pl-12 pr-12 py-6 bg-secondary border-border focus:border-primary"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={formData.rememberMe}
                onCheckedChange={(checked) => setFormData({ ...formData, rememberMe: checked as boolean })}
              />
              <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                Se souvenir de moi
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full py-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Connexion en cours...
                </div>
              ) : (
                <>
                  Se connecter
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>

          {/* Sign Up Link */}
          <p className="mt-8 text-center text-muted-foreground">
            Pas encore de compte ?{" "}
            <Link href="/inscription" className="text-primary font-medium hover:underline">
              Creer un compte
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-gradient-to-br from-primary/20 via-background to-primary/10">
        {/* Animated orbs */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-primary/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        
        {/* Content */}
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
              Rejoignez notre communaute spirituelle
            </h2>
            <p className="text-lg text-muted-foreground max-w-md text-pretty">
              Accedez a nos predications, enseignements audio, et connectez-vous avec notre communaute.
            </p>

          </motion.div>
        </div>
      </div>
    </div>
  )
}
