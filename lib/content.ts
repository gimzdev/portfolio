import { site } from "@/lib/site"

// ═════════════════════════ CONTENT ═════════════════════════
// Everything the site says lives here. Change the words, run ./gimzdev.sh, done.

export const person = {
  role: "Software Developer",
  location: "Montréal, QC",
  started: 2016, // first professional year
  greeting: "Welcome to my portfolio.",
  lead: "Building interfaces for productivity & gaming. Working on both open source projects and enterprise solutions.",
  bio: [
    "I built web applications for enterprise clients at Xdemat for eight years: data management, integrations and a lot of UI.",
    `Since then I've been on my own as ${site.name}, building my own products, contributing to open source and taking on client projects.`,
  ],
}

export const skillGroups = [
  { name: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Three.js"] },
  { name: "Backend", items: ["Node.js", "Jakarta EE", "Symfony", "Django", "Python"] },
  { name: "Data & infra", items: ["PostgreSQL", "MongoDB", "Redis", "Docker", "IPFS", "Git"] },
]

export const experience = [
  {
    title: "Software Developer",
    company: `${site.name}dev`,
    period: "2024 – Present",
    description: "Building web apps and games, working on open source and consulting on technical problems.",
  },
  {
    title: "Software Developer",
    company: "Xdemat",
    period: "2019 – 2024",
    description: "Built web applications for enterprise clients, led data management and UI work, and shipped integrations.",
  },
  {
    title: "Junior Developer",
    company: "Xdemat",
    period: "2016 – 2019",
    description: "Built client web applications and set up a modern development workflow.",
  },
]

export const projects = [
  {
    id: "metaforge",
    title: "MetaForge",
    tagline: "Tools for Tacticians",
    description:
      "A TFT analytics and prediction platform where players vote on comps and techs. It has two ranking systems: League Points for competitive performance and Prediction Points for forecasting accuracy.",
    tags: ["React", "TypeScript", "Node.js", "PostgreSQL"],
    link: "https://metaforge.lol",
    github: `https://github.com/${site.github}/metaforge`,
    images: ["/images/metaforge_screen1.png", "/images/metaforge_screen2.png", "/images/metaforge_screen3.png"],
    highlights: ["Dual ranking system (LP and PP)", "Real-time analytics", "Team composition voting"],
  },
  {
    id: "mosaik",
    title: "Mosaïk",
    tagline: "Workspace organizer for Windows",
    description:
      "A free Windows app that gives every project its own workspace: your apps and windows arranged in one click, with zones, tabs for any app and a keyboard switcher. No account and no telemetry, and your layouts stay on your computer.",
    tags: ["Rust", "Tauri", "React", "TypeScript"],
    link: "https://mosaïk.com",
    github: `https://github.com/${site.github}/mosaik`,
    // The site first (its top, its features), then the app (Home, a workspace, its zones)
    images: ["/images/mosaik_screen1.png", "/images/mosaik_screen2.png", "/images/mosaik_screen3.png", "/images/mosaik_screen4.png", "/images/mosaik_screen5.png"],
    highlights: ["Zones and layouts for every project", "Tabs for any app", "Workspaces that open in one click"],
  },
  {
    id: "dropdate",
    title: "Dropdate",
    tagline: "Gaming calendar",
    description:
      "A calendar for game releases, patches, events and community milestones, with a personalized feed and notifications.",
    tags: ["Next.js", "Tailwind CSS", "MongoDB"],
    link: "https://dropdate.net",
    github: `https://github.com/${site.github}/dropdate`,
    images: ["/images/dropdate_screen1.png", "/images/dropdate_screen2.png", "/images/dropdate_screen3.png"],
    highlights: ["Personal release feed", "Event and patch tracking", "Calendar integration"],
  },
  {
    id: "grimoire",
    title: "Grimoire",
    tagline: "WoW Forever field guide",
    description:
      "A field guide for World of Warcraft: Forever, with a talent calculator for every class, a database of items, quests, zones and dungeons with drop chances, class guides, a leveling route and a raid composer. Its in-game add-on brings your build, what to train and dungeon loot into the game.",
    tags: ["Next.js", "TypeScript", "PostgreSQL", "Lua"],
    link: "https://wowgrimoire.app",
    github: `https://github.com/${site.github}/grimoire`,
    // Home, what Forever adds, the talent calculator, the item database, then a zone (Mount Hyjal)
    images: ["/images/grimoire_screen1.png", "/images/grimoire_screen2.png", "/images/grimoire_screen3.png", "/images/grimoire_screen4.png", "/images/grimoire_screen5.png"],
    highlights: ["Talent calculator for every class", "Item, quest and zone database with drop chances", "In-game add-on for WoW Forever"],
  },
]

// `topic` is the matching option in the contact form (see TOPICS in lib/contact.ts)
export const services = [
  {
    id: "websites",
    topic: "website",
    title: "Websites",
    blurb: "Fast, responsive sites that work on every device.",
    price: "$800 – $3,000",
    duration: "1–3 weeks",
    features: ["Responsive design", "Contact forms", "Basic SEO", "Easy to update"],
  },
  {
    id: "web-apps",
    topic: "web-app",
    title: "Web apps",
    blurb: "Interactive applications with accounts, a database and an admin.",
    price: "$2,000 – $8,000",
    duration: "3–8 weeks",
    features: ["User accounts", "Database and API", "Admin panel", "Payments and real-time"],
  },
  {
    id: "fixes-updates",
    topic: "fix",
    title: "Fixes & updates",
    blurb: "Bug fixes, new features and improvements to an existing codebase.",
    price: "$100 / hour",
    duration: "As needed",
    features: ["Bug fixes", "New features", "Performance and security", "Quick turnaround"],
  },
]
