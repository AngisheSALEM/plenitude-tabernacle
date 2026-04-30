"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Church, Heart, Users, BookOpen } from "lucide-react"
import Image from "next/image"

const values = [
  {
    icon: BookOpen,
    title: "La Parole Restauree",
    description: "Ramener le coeur des enfants a la foi des peres apostoliques",
  },
  {
    icon: Heart,
    title: "L'Unicite de Dieu",
    description: "Jesus-Christ, le Dieu unique manifeste dans la chair",
  },
  {
    icon: Users,
    title: "Communion Fraternelle",
    description: "Une famille de croyants unis par l'amour de la Verite",
  },
  {
    icon: Church,
    title: "Vie de Saintete",
    description: "Une marche quotidienne guidee par le Saint-Esprit",
  },
]

export function AboutSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="a-propos" className="relative py-32 overflow-hidden" ref={ref}>
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="relative container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Pastor Image & Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative aspect-[3/4] max-w-md mx-auto lg:mx-0">
              {/* Image container with decorative elements */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/10 transform rotate-3" />
              <div className="absolute inset-0 rounded-3xl bg-card border border-border overflow-hidden transform -rotate-3 hover:rotate-0 transition-transform duration-500 group">
                <Image
                  src="/image2.png"
                  alt="Pasteur Joel Mugisho"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent z-10" />
                <div className="absolute inset-0 flex items-end justify-center">
                  <div className="text-center p-8 z-20">
                    <h3 className="font-serif text-2xl font-bold text-foreground">Pasteur Joel Mugisho Balagizi</h3>
                    <p className="text-muted-foreground mt-2">Pasteur Principal</p>
                  </div>
                </div>
              </div>
              
              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 }}
                className="absolute -bottom-6 -right-6 lg:right-auto lg:-left-6 bg-primary text-primary-foreground p-6 rounded-2xl shadow-xl shadow-primary/20"
              >
                <p className="font-serif text-3xl font-bold">15+</p>
                <p className="text-sm opacity-90">Années de ministère</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.3 }}
                className="text-primary font-medium mb-4 tracking-wider uppercase text-sm"
              >
                L&apos;Identite de l&apos;Epouse
              </motion.p>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
                Plenitude Tabernacle
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
                Plenitude Tabernacle est une assemblee de croyants devoues au Message du Temps 
                de la Fin, tel que restitue par le ministere prophetique de William Marion Branham, 
                le messager d&apos;Apocalypse 10:7 et de Malachie 4:5-6.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mt-4 text-pretty">
                Notre eglise n&apos;est pas une denomination, mais un lieu de rassemblement pour ceux 
                qui aspirent a la maturite spirituelle et a la pleine stature de Christ. Nous croyons 
                que nous vivons l&apos;age de l&apos;Aigle, ou les mysteres scelles depuis la fondation 
                du monde sont maintenant devoiles pour preparer l&apos;Epouse a l&apos;Enlevement.
              </p>
            </div>

            {/* Values Grid */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="group p-4 rounded-xl bg-card/50 border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
                >
                  <value.icon className="h-8 w-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
                  <h4 className="font-semibold text-foreground">{value.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
