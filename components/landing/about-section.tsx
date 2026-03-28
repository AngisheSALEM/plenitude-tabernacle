"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Church, Heart, Users, BookOpen } from "lucide-react"

const values = [
  {
    icon: Heart,
    title: "Amour",
    description: "Un cœur ouvert pour accueillir chaque âme",
  },
  {
    icon: BookOpen,
    title: "Enseignement",
    description: "La Parole de Dieu comme fondement",
  },
  {
    icon: Users,
    title: "Communauté",
    description: "Une famille spirituelle unie",
  },
  {
    icon: Church,
    title: "Adoration",
    description: "Glorifier Dieu en esprit et en vérité",
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
              <div className="absolute inset-0 rounded-3xl bg-card border border-border overflow-hidden transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-32 h-32 mx-auto rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                      <span className="font-serif text-5xl font-bold text-primary">JM</span>
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-foreground">Pasteur Joel Mugisho</h3>
                    <p className="text-muted-foreground mt-2">Fondateur &amp; Pasteur Principal</p>
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
                Notre Histoire
              </motion.p>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
                Une vision pour transformer des vies
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
                Fondée au cœur de Kinshasa, Plénitude Tabernacle est née d&apos;une vision : 
                créer un lieu où chaque personne peut expérimenter la présence de Dieu et 
                découvrir son plein potentiel en Christ.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mt-4 text-pretty">
                Sous la direction spirituelle du Pasteur Joel Mugisho, notre église s&apos;est 
                développée pour devenir une communauté vibrante, engagée dans l&apos;enseignement 
                de la Parole et le service envers les autres.
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
