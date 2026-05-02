"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import { MapPin, Clock, Phone, Mail, Calendar } from "lucide-react"

const defaultSchedule = [
  { day: "Mardi", time: "17h30 - 19h30", title: "Culte" },
  { day: "Vendredi", time: "17h30 - 19h30", title: "Culte" },
  { day: "Dimanche", time: "09h00 - 11h30", title: "Culte Principal" },
]

export function LocationSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [settings, setSettings] = useState<any>(null)

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) setSettings(data)
      })
      .catch(console.error)
  }, [])

  const schedule = settings?.schedule || defaultSchedule

  return (
    <section id="localisation" className="relative py-32 overflow-hidden" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      
      <div className="relative container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <p className="text-primary font-medium mb-4 tracking-wider uppercase text-sm">
            Nous Rejoindre
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground text-balance">
            Localisation &amp; Horaires
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="aspect-[4/3] rounded-3xl overflow-hidden border border-border bg-card">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3978.472856525944!2d15.232468211029272!3d-4.352512146958869!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1a6a3130fa579c95%3A0x87a7ed5ea0d45413!2s-4.352517%2C%2015.234657!5e0!3m2!1sfr!2scd!4v1710000000000!5m2!1sfr!2scd"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "contrast(1.1)" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localisation Plénitude Tabernacle"
              />
            </div>
            
            {/* Address card overlay */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="absolute -bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-80 bg-card/95 backdrop-blur-xl rounded-2xl border border-border p-6 shadow-xl"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{settings?.churchName || "Plénitude Tabernacle"}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {settings?.address || "03 Av. Mafuta, Q. Mfinda, Commune de Ngaliema, Kinshasa"}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6 pt-8 lg:pt-0"
          >
            {/* Schedule */}
            <div className="bg-card/50 rounded-2xl border border-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-bold text-foreground">Horaires des Cultes</h3>
              </div>
              <div className="space-y-4">
                {schedule.map((item, index) => (
                  <motion.div
                    key={item.day}
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-center justify-between py-3 border-b border-border/50 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-foreground">{item.day}</p>
                      <p className="text-sm text-muted-foreground">{item.title}</p>
                    </div>
                    <div className="flex items-center gap-2 text-primary">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm font-medium">{item.time}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="grid sm:grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6 }}
                className="bg-card/50 rounded-2xl border border-border p-5 hover:border-primary/30 transition-colors"
              >
                <Phone className="h-5 w-5 text-primary mb-3" />
                <p className="text-sm text-muted-foreground">Téléphone</p>
                <p className="font-medium text-foreground">{settings?.phone || "+243 XXX XXX XXX"}</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.7 }}
                className="bg-card/50 rounded-2xl border border-border p-5 hover:border-primary/30 transition-colors"
              >
                <Mail className="h-5 w-5 text-primary mb-3" />
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium text-foreground truncate">{settings?.email || "contact@plenitude.cd"}</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
