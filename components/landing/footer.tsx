"use client"

import Link from "next/link"
import { Facebook, Youtube, Instagram, Heart } from "lucide-react"

const footerLinks = {
  navigation: [
    { label: "Accueil", href: "/" },
    { label: "À Propos", href: "#a-propos" },
    { label: "Vidéos", href: "/videos" },
    { label: "Audio", href: "/audio" },
    { label: "Cantiques", href: "/cantiques" },
    { label: "Espace Membre", href: "/espace-membre" },
  ],
  legal: [
    { label: "Mentions Légales", href: "#" },
    { label: "Politique de Confidentialité", href: "#" },
    { label: "Conditions d'Utilisation", href: "#" },
  ],
}

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Youtube, href: "#", label: "YouTube" },
  { icon: Instagram, href: "#", label: "Instagram" },
]

export function Footer() {
  return (
    <footer className="relative bg-card border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                <span className="font-serif text-2xl font-bold text-primary">P</span>
              </div>
              <div>
                <span className="font-serif text-xl font-bold text-foreground">Plénitude Tabernacle</span>
                <span className="block text-sm text-muted-foreground">Église de Kinshasa</span>
              </div>
            </Link>
            <p className="text-muted-foreground max-w-md leading-relaxed">
              Une communauté de foi dédiée à l&apos;enseignement de la Parole de Dieu et 
              à l&apos;édification des vies. Rejoignez-nous pour découvrir votre plein potentiel en Christ.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="p-3 rounded-full bg-muted/50 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Navigation</h4>
            <ul className="space-y-3">
              {footerLinks.navigation.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Légal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Plénitude Tabernacle. Tous droits réservés.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Fait avec <Heart className="h-4 w-4 text-primary fill-primary" /> à Kinshasa
          </p>
        </div>
      </div>
    </footer>
  )
}
