/**
 * Utilitaires pour YouTube
 */

/**
 * Retourne une URL de redirection vers un service de téléchargement sécurisé.
 * Utilise l'ID de la vidéo YouTube.
 */
export function getVideoDownloadUrl(youtubeUrl: string | null): string | null {
  if (!youtubeUrl) return null;

  const videoId = extractYoutubeId(youtubeUrl);
  if (!videoId) return null;

  // Utilisation d'un service de redirection simple et connu
  return `https://www.ssyoutube.com/watch?v=${videoId}`;
}

/**
 * Extrait l'ID d'une vidéo à partir d'une URL YouTube.
 */
export function extractYoutubeId(url: string): string | null {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
}
