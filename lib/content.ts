import { site } from "@/lib/site"

// ═════════════════════════ CONTENT ═════════════════════════
// Everything the site says lives here. Change the words, run ./gimzdev.sh, done.

export const person = {
  role: "Software Developer",
  location: "Montréal, QC",
  started: 2016, // first professional year
  headline: "Software developer in Montréal", // under your name in the big title, and in the browser tab: what you do and where, in the words people search
  lead: "Building interfaces for productivity & gaming. Working on both open source projects and enterprise solutions.",
  bio: [
    "I built web applications for enterprise clients at Xdemat for eight years: data management, integrations and a lot of UI.",
    `Since then I’ve been on my own as ${site.name}, building my own products, contributing to open source and taking on client projects.`,
  ],
}

// Each section: a small label (the same word as the menu) above a heading that says what the section holds, in the words people search
export const sections = {
  work: { label: "Work", title: "Gaming and productivity apps" },
  services: { label: "Services", title: "Websites, web\u00a0apps and fixes", intro: "Typical ranges in USD. The final price depends on the project." },
  about: { label: "About", title: "Independent software developer" },
  contact: { label: "Contact", title: "Let’s talk about your project", intro: "Have a project in mind, a question, or something to fix? Email me or use the form and I’ll get back to you soon." },
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
    id: "mosaik",
    title: "Mosaïk",
    tagline: "Window manager for Windows",
    description:
      "A free Windows app that gives every project its own workspace: apps snap into numbered, coloured zones, any windows can share a tab strip, and a whole workspace comes back in one click. On the Microsoft Store, with no account and no telemetry.",
    tags: ["Rust", "Tauri", "React", "TypeScript"],
    link: "https://mosaïk.com",
    github: `https://github.com/${site.github}/mosaik`,
    // The first button: where to get it (Visit and Source follow)
    action: { label: "Download", href: "https://apps.microsoft.com/detail/9PHR0L7S1QVD" },
    // A clip (windows moved into zones), the site (its top, its features), then the app (Home, a workspace, its zones)
    images: ["/media/mosaik/mosaik-preview.mp4", "/media/mosaik/mosaik-site.png", "/media/mosaik/mosaik-site-features.png", "/media/mosaik/mosaik-app-home.png", "/media/mosaik/mosaik-app-workspace.png", "/media/mosaik/mosaik-app-zones.png"],
    highlights: ["Zones and layouts for every project", "Tabs for any app", "Workspaces that open in one click"],
  },
  {
    id: "dropdate",
    title: "Dropdate",
    tagline: "Game release calendar",
    description:
      "Every game release and esports tournament in one calendar. Search it in plain English, keep a wishlist, and add any view to Google, Apple or Outlook calendars so it follows a game when the date slips. With a free API, no key needed.",
    tags: ["Next.js", "TypeScript", "PostgreSQL"],
    link: "https://dropdate.net",
    github: `https://github.com/${site.github}/dropdate`,
    images: ["/media/dropdate/dropdate-preview.mp4", "/media/dropdate/dropdate-home.png", "/media/dropdate/dropdate-this-week.png", "/media/dropdate/dropdate-calendar.png"],
    highlights: ["Releases and tournaments in one calendar", "Plain-English search and a wishlist", "Free JSON and iCalendar API"],
  },
  {
    id: "metaforge",
    title: "MetaForge",
    tagline: "Tools for Tacticians",
    description:
      "Teamfight Tactics tier lists, a stats explorer and a team builder, graded from high-elo ranked games on the live patch, so the tier lists move when the game does.",
    tags: ["Next.js", "TypeScript", "PostgreSQL"],
    link: "https://metaforge.lol",
    github: `https://github.com/${site.github}/metaforge`,
    images: ["/media/metaforge/metaforge-preview.mp4", "/media/metaforge/metaforge-home.png", "/media/metaforge/metaforge-stats-explorer.png", "/media/metaforge/metaforge-team-builder.png"],
    highlights: ["Tier lists from real ranked games", "Stats explorer", "Team builder with shareable links"],
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
    action: { label: "Get the add-on", href: "https://www.curseforge.com/wow/addons/grimoire-field-guide" },
    // A clip (the talent calculator), Home, what Forever adds, the talent calculator, the item database, then a zone (Mount Hyjal)
    images: ["/media/grimoire/grimoire-preview.mp4", "/media/grimoire/grimoire-home.png", "/media/grimoire/grimoire-whats-new.png", "/media/grimoire/grimoire-talent-calculator.png", "/media/grimoire/grimoire-item-database.png", "/media/grimoire/grimoire-mount-hyjal.png"],
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
    price: "$500 – $1,500",
    duration: "1–2 weeks",
    features: ["Responsive design", "Contact forms", "Basic SEO", "Easy to update"],
  },
  {
    id: "web-apps",
    topic: "web-app",
    title: "Web apps",
    blurb: "Interactive applications with accounts, a database and an admin.",
    price: "$1,500 – $5,000",
    duration: "2–5 weeks",
    features: ["User accounts", "Database and API", "Admin panel", "Payments and real-time"],
  },
  {
    id: "fixes-updates",
    topic: "fix",
    title: "Fixes & updates",
    blurb: "Bug fixes, new features and improvements to an existing codebase.",
    price: "$80 / hour",
    duration: "As needed",
    features: ["Bug fixes", "New features", "Performance and security", "Quick turnaround"],
  },
]
