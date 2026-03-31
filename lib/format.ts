export function formatDate(dateStr: string | Date | null | undefined): string {
  if (!dateStr) return ""
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export function formatDateShort(dateStr: string | Date | null | undefined): string {
  if (!dateStr) return ""
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export function formatPlays(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(".0", "") + "K"
  return n.toString()
}

export function parseDurationToSeconds(duration: string | null | undefined): number {
  if (!duration) return 0
  const parts = duration.split(":").map(Number)
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]
  if (parts.length === 2) return parts[0] * 60 + parts[1]
  return 0
}

export function formatDateForInput(dateStr: string | Date | null | undefined): string {
  if (!dateStr) return ""
  return new Date(dateStr).toISOString().split("T")[0]
}
