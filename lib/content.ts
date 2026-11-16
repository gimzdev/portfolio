import { site } from "@/lib/site"

// ═════════════════════════ CONTENT ═════════════════════════
// Everything the site says lives here. Change the words, run ./gimzdev.sh, done.
// Prices come from the block at the top of gimzdev.sh (site.prices).

/** The day this content last changed: the sitemap's date, not the build's */
export const updated = "2026-11-15"

export const person = {
  role: "Software Developer",
  location: "Montréal, QC",
  started: 2016, // first professional year
  headline: "Software developer in Montréal", // in the title and the browser tab: what you do and where, in the words people search
  lead: "Building interfaces for productivity & gaming. Working on both open source projects and enterprise solutions.",
  description: "Software developer in Montréal. Interfaces for productivity and gaming, on open source projects and enterprise solutions.", // what search results and link previews say under the title
  bio: [
    "I built web applications for enterprise clients at Xdemat for eight years: data management, integrations and a lot of UI.",
    `Since 2024 I’ve been on my own as ${site.name}, building my own products, contributing to open source and taking on client projects.`,
  ],
}

// Each section: a small label (the same word as the menu) above a heading that says what the section holds
export const sections = {
  work: { label: "Work", title: "Gaming and productivity apps" },
  services: { label: "Services", title: "Websites, web apps and fixes", intro: "Prices in USD. Each project gets a quote for its own scope." },
  about: { label: "About", title: "Independent software developer" },
  contact: { label: "Contact", title: "Let’s talk about your project", intro: "Tell me what you want to build or fix. I answer within a day." },
}

export const skillGroups = [
  { name: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Three.js"] },
  { name: "Backend", items: ["Node.js", "Jakarta EE", "Symfony", "Django", "Python"] },
  { name: "Data & infra", items: ["PostgreSQL", "MongoDB", "Redis", "Docker", "IPFS", "Git"] },
]

export const experience = [
  { title: "Software Developer", company: `${site.name}dev`, period: "2024 –", text: "Building web apps and games, working on open source and consulting on technical problems." },
  { title: "Software Developer", company: "Xdemat", period: "2019 – 2024", text: "Built web applications for enterprise clients, led data management and UI work, and shipped integrations." },
  { title: "Junior Developer", company: "Xdemat", period: "2016 – 2019", text: "Built client web applications and set up a modern development workflow." },
]

type Words = { tagline: string; description: string; highlights: string[]; problem: string; built: string[] }
type OfferWords = { slug: string; title: string; blurb: string; duration: string; features: string[]; search: string }
/** A screenshot or a clip (H.264 .mp4, no sound): its file, then what it shows (read by screen readers) */
export type Shot = [src: string, caption: string]

export const projects: ({
  id: string; title: string; tags: string[]; link: string; github: string; images: Shot[]
  action?: { href: string; label: string }
} & Words)[] = [
  {
    id: "grimoire",
    title: "Grimoire",
    tags: ["Next.js", "TypeScript", "PostgreSQL", "Lua"],
    link: "https://wowgrimoire.app",
    github: `https://github.com/${site.github}/grimoire`,
    action: { href: "https://www.curseforge.com/wow/addons/grimoire-field-guide", label: "Get the add-on" },
    images: [
      ["/media/grimoire/grimoire-preview.mp4", "The talent calculator, spending points as a Fire Mage"],
      ["/media/grimoire/grimoire-home.png", "Home"],
      ["/media/grimoire/grimoire-whats-new.png", "What Forever adds"],
      ["/media/grimoire/grimoire-talent-calculator.png", "Talent calculator"],
      ["/media/grimoire/grimoire-item-database.png", "Item database"],
      ["/media/grimoire/grimoire-mount-hyjal.png", "A zone: Mount Hyjal"],
    ],
    tagline: "WoW Forever field guide",
    description: "A field guide for World of Warcraft: Forever, with a talent calculator for every class, a database of items, quests, zones and dungeons with drop chances, class guides, leveling routes and a raid composer. Its in-game add-on brings your build, your route and dungeon loot into the game.",
    highlights: ["Talent calculator for every class", "Item, quest and zone database with drop chances", "In-game add-on for WoW Forever"],
    problem: "Forever rebuilt the talents, quests and dungeons of a game players thought they knew. They needed one place to plan a build and find where things drop, on the web and inside the game.",
    built: ["A talent calculator for the nine rebuilt classes, with links to share a build", "A database of items, quests, NPCs, zones and dungeons, with loot tables and drop chances", "Class guides, leveling routes, a raid composer and a Legacy planner", "An add-on in Lua that brings the build, the route, dungeon maps and loot into the game"],
  },
  {
    id: "metaforge",
    title: "MetaForge",
    tags: ["Next.js", "TypeScript", "PostgreSQL", "Riot API"],
    link: "https://www.metaforge.lol",
    github: `https://github.com/${site.github}/metaforge`,
    images: [
      ["/media/metaforge/metaforge-preview.mp4", "A comp’s board in the meta report, a filter in the stats explorer, then a champion dragged into the team builder"],
      ["/media/metaforge/metaforge-home.png", "Home"],
      ["/media/metaforge/metaforge-stats-explorer.png", "Stats explorer"],
      ["/media/metaforge/metaforge-team-builder.png", "Team builder"],
    ],
    tagline: "Tools for Tacticians",
    description: "Teamfight Tactics tier lists, a stats explorer and a team builder, graded from high-elo ranked games on the live patch, so the tier lists move when the game does.",
    highlights: ["Tier lists from real ranked games", "Stats explorer", "Team builder with shareable links"],
    problem: "Teamfight Tactics changes every two weeks, and tier lists written by hand fall behind. Players want to know what wins on the live patch, from real games.",
    built: ["A collector that reads the final boards of high-elo ranked games from the Riot Games API and keeps them in PostgreSQL", "Tier lists and a meta report graded from those boards, per patch", "A stats explorer for champions, items, traits and augments", "A team builder with shareable links, player lookup, the ladder and patch notes"],
  },
  {
    id: "patchlab",
    title: "Patchlab",
    tags: ["Next.js", "TypeScript", "Web Workers"],
    link: "https://patchlab.metaforge.lol",
    github: `https://github.com/${site.github}/patchlab`,
    images: [
      ["/media/patchlab/patchlab-preview.mp4", "A meta comp dragged onto blue, fights run, an ability number patched, fights run again, one fight watched"],
      ["/media/patchlab/patchlab-lab.png", "An ability patched and what it moved"],
      ["/media/patchlab/patchlab-results.png", "Results, unit by unit"],
      ["/media/patchlab/patchlab-fight.png", "Watching a fight: Krug has split into Kruglettes"],
      ["/media/patchlab/patchlab-notes.png", "Patch notes"],
    ],
    tagline: "Balance sandbox for TFT",
    description: "Put two Teamfight Tactics comps on the board, tweak any champion, item or trait, and run thousands of fights in the browser, with the live numbers and with yours, to see what a change moves before players find out.",
    highlights: ["Two comps, one board", "Any number, changed", "Thousands of fights in seconds"],
    problem: "A balance change in an auto-battler is hard to judge before players find out. Fights play out on their own, so they can be simulated, if the engine follows the game closely enough.",
    built: ["A fight engine in TypeScript that plays a TFT set in steps of a twentieth of a second, every champion’s ability included", "Runs of thousands of seeded fights spread over Web Workers, live and patched numbers on the same seeds", "Boards built by drag and drop, with MetaForge’s meta comps one drag away", "Patch notes as numbers you can run"],
  },
  {
    id: "mosaik",
    title: "Mosaïk",
    tags: ["Rust", "Tauri", "React", "TypeScript"],
    link: "https://mosaïk.com",
    github: `https://github.com/${site.github}/mosaik`,
    action: { href: "https://apps.microsoft.com/detail/9PHR0L7S1QVD", label: "Download" },
    images: [
      ["/media/mosaik/mosaik-preview.mp4", "Three messy windows, the side menu at the edge of the screen, Half + stack, then Thirds"],
      ["/media/mosaik/mosaik-site.png", "mosaïk.com"],
      ["/media/mosaik/mosaik-site-features.png", "mosaïk.com: the features"],
      ["/media/mosaik/mosaik-app-home.png", "The app: Home"],
      ["/media/mosaik/mosaik-app-workspace.png", "A workspace"],
      ["/media/mosaik/mosaik-app-zones.png", "Zones"],
    ],
    tagline: "Window manager for Windows",
    description: "A free Windows app that gives every project its own workspace: apps snap into numbered, coloured zones, any windows can share a tab strip, and a whole workspace comes back in one click. On the Microsoft Store, with no account and no telemetry.",
    highlights: ["Zones and layouts for every project", "Tabs for any app", "Workspaces that open in one click"],
    problem: "Windows snaps windows side by side, but it has no way to keep each project’s windows, tabs and layout together and bring them back later.",
    built: ["A native app in Rust and Tauri that moves real windows into numbered, coloured zones", "A tab strip that groups any windows, whatever app they come from", "Workspaces that reopen a whole layout in one click", "A Microsoft Store release with no account, no telemetry and no network request"],
  },
  {
    id: "dropdate",
    title: "Dropdate",
    tags: ["Next.js", "TypeScript", "PostgreSQL"],
    link: "https://dropdate.net",
    github: `https://github.com/${site.github}/dropdate`,
    images: [
      ["/media/dropdate/dropdate-preview.mp4", "A featured game, this week’s releases, then a search for Red Dead in Browse"],
      ["/media/dropdate/dropdate-home.png", "Home"],
      ["/media/dropdate/dropdate-this-week.png", "This week"],
      ["/media/dropdate/dropdate-calendar.png", "Calendar"],
    ],
    tagline: "Game release calendar",
    description: "Every game release and esports tournament in one calendar. Search it in plain English, keep a wishlist, and add any view to Google, Apple or Outlook calendars so it follows a game when the date slips.",
    highlights: ["Releases and tournaments in one calendar", "Plain-English search and a wishlist", "Calendar feeds for Google, Apple and Outlook"],
    problem: "Release dates and esports schedules are spread over many sites, and they move. People want one calendar that changes when a date does.",
    built: ["Releases and artwork from IGDB and Steam, tournaments from PandaScore, refreshed every hour", "Search in plain English (“ps5 releases next month”)", "Accounts with a wishlist and the games you played", "Calendar feeds for any view, which follow a game when its date slips"],
  },
]

// The three offers. `topic` is the matching option in the contact form (TOPICS in lib/contact.ts); `slug` is its own page
export const offers: ({ id: string; topic: string; price: string; from: boolean } & OfferWords)[] = [
  {
    id: "web-apps", topic: "web-app", price: `$${site.prices.webApp}`, from: true,
    slug: "web-app-developer-montreal", title: "A web app or companion tool", blurb: "For a game, a community or a startup: accounts, a database, data from an API, an admin.", duration: "From 2 weeks", features: ["Accounts and roles", "Database and API", "Data from game or business APIs", "Admin and analytics"], search: "Web app developer in Montréal",
  },
  {
    id: "websites", topic: "website", price: `$${site.prices.website}`, from: true,
    slug: "website-developer-montreal", title: "A fast website", blurb: "A site that loads at once on every device and that you can update yourself.", duration: "From 1 week", features: ["Design and responsive layout", "Contact form", "Search basics and share cards", "Analytics"], search: "Website developer in Montréal",
  },
  {
    id: "fixes", topic: "fix", price: `$${site.prices.hourly}/h`, from: false,
    slug: "web-app-fixes-and-updates", title: "Fixes and updates", blurb: "Bugs, new features, speed and security for a codebase you already have.", duration: "As needed", features: ["Bug fixes", "New features", "Performance and security", "A short report of what changed"], search: "Web app fixes and updates",
  },
]

/** How a project runs: the label, then its four steps in order */
export const howItRuns = { label: "How it runs", steps: ["A brief", "A quote within a day", "A demo every week", "A handover"] }
/** The same, as one sentence (under the case studies and on the service pages) */
export const howItRunsLine = `${howItRuns.label}: ${howItRuns.steps.map((x) => x.charAt(0).toLowerCase() + x.slice(1)).join(", ")}.`

/** What support pays for (/support) */
export const support = {
  free: ["grimoire", "metaforge", "patchlab", "dropdate", "mosaik"],
  title: "Keep the tools free", lead: `${site.name}’s tools are free, with no ads, and none of them needs an account. Support pays for what keeps them running.`,
  paysFor: ["Hosting, databases and the API keys behind the sites", "The time to keep each tool current when a game patches", "New tools, free and without ads"],
  pays: "What it pays for", keeps: "What it keeps free", patreon: "Support on Patreon", once: "Give once", instead: "Need something built instead?", updated: "Updated",
  meta: { title: "Support the free tools", description: "Grimoire, MetaForge, Patchlab, Dropdate and Mosaïk are free, with no ads. Support pays for hosting, data and the time to keep them current." },
}

/** Words of the interface (labels read by screen readers included) */
export const ui = {
  nav: ["Work", "Services", "About", "Contact"], seeWork: "See the work", start: "Start a project", startOne: "Start", caseStudy: "Case study", visit: "Visit", source: "Source",
  problem: "The problem", built: "What I built", stack: "Built with", from: "from", allWork: "All work", other: "Other services",
  answer: "I answer within a day.", book: "Book a call", madeBy: "Made by", support: "Support", top: "Back to top",
  skip: "Skip to content", newTab: "opens in a new tab", otherStudies: "Other case studies",
  menu: "Menu", openMenu: "Open menu", closeMenu: "Close menu", primary: "Primary", theme: "Theme", switchTheme: "Switch between light and dark theme", glow: "Glow", cursorGlow: "Cursor glow", backToTop: "back to top",
  projects: "Projects", shots: "screenshots", of: "of", prev: "Previous screenshot", next: "Next screenshot", show: "Show screenshot",
  close: "Close", fullscreen: "Fullscreen", exitFullscreen: "Exit fullscreen", copy: "Copy email address", copied: "Copied",
  notFound: { name: "Page not found", title: "Nothing here.", text: "That page doesn’t exist, or it moved.", back: "Back home" },
}

export const workHref = (id: string) => `/work/${id}`
export const offerHref = (o: (typeof offers)[number]) => `/services/${o.slug}`

/** A day as the site writes it: "Nov 14, 2026", a range of two days, or a bare year */
export function when(date: string, year = true): string {
  const day = (d: string) => new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", ...(year && { year: "numeric" }), timeZone: "UTC" }).format(new Date(`${d}T00:00:00Z`))
  if (!date.includes("-")) return date
  const [from, to] = date.split("/")
  if (!to) return day(from)
  const a = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", ...(from.slice(0, 4) !== to.slice(0, 4) && { year: "numeric" }), timeZone: "UTC" }).format(new Date(`${from}T00:00:00Z`))
  return `${a} – ${day(to)}`
}
