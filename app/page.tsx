import { Navbar } from "@/components/landing/navbar"
import { HeroSection } from "@/components/landing/hero-section"
import { AboutSection } from "@/components/landing/about-section"
import { VideosSection } from "@/components/landing/videos-section"
import { AudioSection } from "@/components/landing/audio-section"
import { NewsSection } from "@/components/landing/news-section"
import { LocationSection } from "@/components/landing/location-section"
import { CTASection } from "@/components/landing/cta-section"
import { Footer } from "@/components/landing/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <VideosSection />
      <AudioSection />
      <NewsSection />
      <LocationSection />
      <CTASection />
      <Footer />
    </main>
  )
}
