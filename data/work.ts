export type WorkItem = {
  slug: string;
  title: string;
  year: string;
  summary: string;
  services: string[];
  previewVideo: string;
  accent: string;
};

export const workItems: WorkItem[] = [
  {
    slug: "jazmin-wong",
    title: "Jazmin Wong",
    year: "2025",
    summary:
      "Designed and developed a personal website for Jazmin Wong, a creative content strategist. The project emphasized a bold, engaging layout with playful micro-interactions to reflect her dynamic approach to content creation.",
    services: ["Direzione artistica", "Voice & Tone", "UI", "UX", "Next.js", "Tailwind CSS", "GSAP", "Motion design"],
    previewVideo: "/videos/jazmin-wong-preview-compressed.mp4",
    accent: "#d3c2a6"
  },
  {
    slug: "trackstack",
    title: "Trackstack",
    year: "2025",
    summary:
      "Redesigned the website for a UK-based software company supporting 10,000+ high-performance DJs and labels. The goal was to communicate their mission of streamlining career growth. I currently work on their product team as a developer.",
    services: ["Direzione artistica", "Naming & Copywriting", "Voice & Tone", "Brand Design", "Strategy", "UX", "UI", "Web design"],
    previewVideo: "/videos/trackstack-preview-compressed.mp4",
    accent: "#bab2ef"
  },
  {
    slug: "socialstats",
    title: "Socialstats",
    year: "2024",
    summary:
      "Designed the home and pricings page for a social media analytics platform that helps artists and creators track their social media performance. This 4-week project focused on seamless UX and efficient developer handoff.",
    services: ["Research & Insights", "Naming & Copywriting", "Analisi competitiva", "Voice & Tone", "Strategy", "UX", "UI", "Web design"],
    previewVideo: "/videos/socialstats-preview-compressed.mp4",
    accent: "#7dc2d4"
  },
  {
    slug: "kick-bass",
    title: "Kick & Bass",
    year: "2024",
    summary:
      "Designed and developed the primary website for an artist-run tech house coaching and mentoring community. The focus was on creating a visually striking and intuitive user experience to optimize visitor-to-paid-member conversion.",
    services: ["Direzione artistica", "Web design", "Responsive Design", "Next.js", "Tailwind CSS", "GSAP", "Motion design", "Lenis"],
    previewVideo: "/videos/kickbass-preview-compressed.mp4",
    accent: "#9ce8ff"
  },
  {
    slug: "westend",
    title: "Westend",
    year: "2024",
    summary:
      "Designed and developed the official website for professional DJ and producer Westend, focusing on showcasing his latest releases, past performances, and upcoming tour dates.",
    services: ["Direzione artistica", "Web design", "Responsive Design", "Next.js", "Tailwind CSS", "GSAP", "Lenis", "Contentful"],
    previewVideo: "/videos/westend-preview-compressed.mp4",
    accent: "#e5bf93"
  },
  {
    slug: "delivrd",
    title: "DELIVRD",
    year: "2023",
    summary:
      "Developed a website that helps aspiring EDM producers easily find and submit demos to popular labels. Designed with a clean, minimal aesthetic and subtle micro-interactions for an engaging user experience. I continue to maintain and improve the site.",
    services: ["Next.js", "Tailwind CSS", "GSAP", "Lenis", "Supabase", "Vercel", "Web design", "Responsive Design"],
    previewVideo: "/videos/delivrd-preview-compressed.mp4",
    accent: "#9fd6bf"
  }
];

export function getWorkItem(slug: string) {
  return workItems.find((item) => item.slug === slug);
}
