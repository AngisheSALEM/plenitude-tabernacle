export interface Cantique {
  id: string
  title: string
  reference: string
  lyrics: any // Using any for Json compatibility in frontend
  chorus?: any
  category: string
}

// Static data is deprecated in favor of database fetching via /api/cantiques
export const cantiques: Cantique[] = []

export const categories = [
  "Tous",
  "Adoration",
  "Autres",
  "Chants de Victoire",
  "Collection",
  "Crois seulement",
  "Hosanna",
  "Louange",
  "Roc Séculaire",
  "Symphonie",
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
  "Marche",
  "Mission",
  "Priere",
  "Redemption",
  "Refuge",
  "Saint-Esprit",
  "Soumission",
  "Temoignage"
]
