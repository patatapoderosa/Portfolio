export const siteContent = {
  name: "Carmine Carnevale",
  subtitle:
    "Ingegnere creativo del design, Cacciatore di Awwwards, Creatore di prodotti, Appassionato di Next.js",
  heroTitle: "CIAO! SONO CARMINE",
  heroVideo: "/videos/hero-video-compressed.mp4",
  aboutEyebrow: "Chi sono",
  aboutBody:
    "Appassionato dell'incontro tra design e sviluppo, progetto esperienze fluide e interattive con un obiettivo chiaro. Con grande attenzione per movimento, performance e dettaglio, do vita a prodotti digitali per brand ambiziosi e contemporanei.",
  aboutVideo: "/videos/about-video-compressed.mp4",
  aboutPoster: "/images/about-poster.jpg",
  socials: [
    {
      href: "https://github.com/patatapoderosa",
      label: "GitHub",
      icon: "/images/social/github.svg"
    },
    {
      href: "https://www.instagram.com/carmine.carnevale/",
      label: "Instagram",
      icon: "/images/social/instagram.svg"
    },
    {
      href: "https://www.linkedin.com/in/carminecarnevale/",
      label: "LinkedIn",
      icon: "/images/social/linkedin.svg"
    }
  ]
} as const;

export const menuLinks = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Lavori" }
] as const;
