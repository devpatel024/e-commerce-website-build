'use client'

export default function HeroCarousel() {
  const videoUrl = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/855854-hd_1280_720_24fps-MvGBt9GqY9xgxCvWeoIewloFZ0CZFn.mp4'

  return (
    <section className="relative w-full h-screen bg-background overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={videoUrl} type="video/mp4" />
      </video>

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40" />

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-5" />
    </section>
  )
}
