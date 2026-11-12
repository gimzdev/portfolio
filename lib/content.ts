import { site } from "@/lib/site"

// ═════════════════════════ CONTENT ═════════════════════════
// Everything the site says lives here, in English and in Québec French. Change the words, run ./gimzdev.sh, done.
// Prices come from the block at the top of gimzdev.sh (site.prices).

export type Lang = "en" | "fr"
/** The day this content last changed: the sitemap's date, not the build's */
export const updated = "2026-11-11"

export const person = {
  role: "Software Developer",
  location: "Montréal, QC",
  started: 2016, // first professional year
  en: {
    headline: "Software developer in Montréal", // in the title and the browser tab: what you do and where, in the words people search
    lead: "Fast, data-heavy web apps and companion tools for games, communities and startups, by the developer of the five products below.",
    bio: [
      "I built web applications for enterprise clients at Xdemat for eight years: data management, integrations and a lot of UI.",
      `Since 2024 I’ve been on my own as ${site.name}, building my own products, contributing to open source and taking on client projects.`,
    ],
  },
  fr: {
    headline: "Développeur de logiciels à Montréal",
    lead: "Des applications web rapides, pleines de données, et des outils compagnons pour les jeux, les communautés et les jeunes entreprises, par le développeur des cinq produits ci-dessous.",
    bio: [
      "J’ai conçu des applications web pour des clients d’entreprise chez Xdemat pendant huit ans : gestion de données, intégrations et beaucoup d’interface.",
      `Depuis 2024, je travaille à mon compte sous le nom ${site.name} : mes propres produits, du logiciel libre et des projets pour des clients.`,
    ],
  },
}

// Each section: a small label (the same word as the menu) above a heading that says what the section holds
export const sections = {
  en: {
    work: { label: "Work", title: "Five products, built and run by one developer" },
    services: { label: "Services", title: "Websites, web apps and fixes", intro: "Prices in USD. Each project gets a quote for its own scope." },
    about: { label: "About", title: "Independent software developer" },
    contact: { label: "Contact", title: "Let’s talk about your project", intro: "Tell me what you want to build or fix. I answer within a day." },
  },
  fr: {
    work: { label: "Réalisations", title: "Cinq produits, conçus et exploités par un seul développeur" },
    services: { label: "Services", title: "Sites web, applications web et corrections", intro: "Prix en dollars américains. Chaque projet reçoit une soumission selon sa portée." },
    about: { label: "À propos", title: "Développeur de logiciels indépendant" },
    contact: { label: "Contact", title: "Parlons de votre projet", intro: "Dites-moi ce que vous voulez construire ou corriger. Je réponds en moins d’un jour." },
  },
}

export const skillGroups = [
  { name: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Three.js"] },
  { name: "Backend", items: ["Node.js", "Jakarta EE", "Symfony", "Django", "Python"] },
  { name: "Data & infra", items: ["PostgreSQL", "MongoDB", "Redis", "Docker", "IPFS", "Git"] },
]

export const experience = [
  { title: "Software Developer", company: `${site.name}dev`, period: "2024 –", en: "Building web apps and games, working on open source and consulting on technical problems.", fr: "Applications web et jeux, logiciel libre et conseils techniques." },
  { title: "Software Developer", company: "Xdemat", period: "2019 – 2024", en: "Built web applications for enterprise clients, led data management and UI work, and shipped integrations.", fr: "Applications web pour des clients d’entreprise, responsable de la gestion des données, de l’interface et des intégrations." },
  { title: "Junior Developer", company: "Xdemat", period: "2016 – 2019", en: "Built client web applications and set up a modern development workflow.", fr: "Applications web pour des clients et mise en place d’un flux de développement moderne." },
]

/** A number a visitor can check, with where it comes from and when it was read */
export type Proof = { value: string; en: string; fr: string; source: string; date: string; href?: string }
type Words = { tagline: string; description: string; highlights: string[]; problem: string; built: string[] }

export const projects: ({
  id: string; title: string; tags: string[]; link: string; github: string; images: string[]
  action?: { href: string; en: string; fr: string }; proof: Proof[]; en: Words; fr: Words
})[] = [
  {
    id: "grimoire",
    title: "Grimoire",
    tags: ["Next.js", "TypeScript", "PostgreSQL", "Lua"],
    link: "https://wowgrimoire.app",
    github: `https://github.com/${site.github}/grimoire`,
    action: { href: "https://www.curseforge.com/wow/addons/grimoire-field-guide", en: "Get the add-on", fr: "Obtenir l’add-on" },
    // A clip (the talent calculator), Home, what Forever adds, the talent calculator, the item database, then a zone (Mount Hyjal)
    images: ["/media/grimoire/grimoire-preview.mp4", "/media/grimoire/grimoire-home.png", "/media/grimoire/grimoire-whats-new.png", "/media/grimoire/grimoire-talent-calculator.png", "/media/grimoire/grimoire-item-database.png", "/media/grimoire/grimoire-mount-hyjal.png"],
    proof: [
      { value: "~100", en: "visitors a day, more than half outside the US and the UK", fr: "visiteurs par jour, plus de la moitié hors des États-Unis et du Royaume-Uni", source: "Vercel Analytics", date: "Oct 26 – Nov 11, 2026" },
      { value: "239", en: "add-on downloads in its first 20 days", fr: "téléchargements de l’add-on en 20 jours", source: "CurseForge", date: "Nov 11, 2026", href: "https://www.curseforge.com/wow/addons/grimoire-field-guide" },
    ],
    en: {
      tagline: "WoW Forever field guide",
      description: "A field guide for World of Warcraft: Forever, with a talent calculator for every class, a database of items, quests, zones and dungeons with drop chances, class guides, a leveling route and a raid composer. Its in-game add-on brings your build, what to train and dungeon loot into the game.",
      highlights: ["Talent calculator for every class", "Item, quest and zone database with drop chances", "In-game add-on for WoW Forever"],
      problem: "Forever rebuilt the talents, quests and dungeons of a game players thought they knew. They needed one place to plan a build and find where things drop, on the web and inside the game.",
      built: ["A talent calculator for the nine rebuilt classes, with links to share a build", "A database of items, quests, NPCs, zones and dungeons, with loot tables and drop chances", "Class guides, a leveling route, a raid composer and a Legacy planner", "An add-on in Lua that brings the build, what to train, dungeon maps and loot into the game"],
    },
    fr: {
      tagline: "Guide de terrain pour WoW Forever",
      description: "Un guide de terrain pour World of Warcraft: Forever : un calculateur de talents pour chaque classe, une base de données d’objets, de quêtes, de zones et de donjons avec les taux de butin, des guides de classe, une route de montée en niveau et un compositeur de raid. Son add-on apporte votre build, ce qu’il faut apprendre et le butin des donjons dans le jeu.",
      highlights: ["Calculateur de talents pour chaque classe", "Base de données d’objets, de quêtes et de zones", "Add-on en jeu pour WoW Forever"],
      problem: "Forever a refait les talents, les quêtes et les donjons d’un jeu que les joueurs croyaient connaître. Il leur fallait un seul endroit pour planifier un build et savoir où tombe chaque objet, sur le web et dans le jeu.",
      built: ["Un calculateur de talents pour les neuf classes refaites, avec des liens pour partager un build", "Une base de données d’objets, de quêtes, de PNJ, de zones et de donjons, avec les tables de butin", "Des guides de classe, une route de montée en niveau, un compositeur de raid et un planificateur Legacy", "Un add-on en Lua qui apporte le build, les sorts à apprendre, les cartes des donjons et le butin dans le jeu"],
    },
  },
  {
    id: "metaforge",
    title: "MetaForge",
    tags: ["Next.js", "TypeScript", "PostgreSQL", "Riot API"],
    link: "https://metaforge.lol",
    github: `https://github.com/${site.github}/metaforge`,
    images: ["/media/metaforge/metaforge-preview.mp4", "/media/metaforge/metaforge-home.png", "/media/metaforge/metaforge-stats-explorer.png", "/media/metaforge/metaforge-team-builder.png"],
    proof: [
      { value: "15", en: "regions read through the Riot Games API, every 3 hours", fr: "régions lues par l’API de Riot Games, toutes les 3 heures", source: "MetaForge’s source", date: "Nov 11, 2026", href: `https://github.com/${site.github}/metaforge` },
      { value: "~2 wk", en: "between patches: the tier lists move with the game", fr: "entre deux mises à jour : les classements suivent le jeu", source: "Riot’s patch schedule", date: "2026", href: "https://support.riotgames.com/en-us/tft/events/patch-schedule-teamfight-tactics" },
    ],
    en: {
      tagline: "Tools for Tacticians",
      description: "Teamfight Tactics tier lists, a stats explorer and a team builder, graded from high-elo ranked games on the live patch, so the tier lists move when the game does.",
      highlights: ["Tier lists from real ranked games", "Stats explorer", "Team builder with shareable links"],
      problem: "Teamfight Tactics changes every two weeks, and tier lists written by hand fall behind. Players want to know what wins on the live patch, from real games.",
      built: ["A collector that reads the final boards of high-elo ranked games from the Riot Games API and keeps them in PostgreSQL", "Tier lists and a meta report graded from those boards, per patch", "A stats explorer for champions, items, traits and augments", "A team builder with shareable links, player lookup, the ladder and patch notes"],
    },
    fr: {
      tagline: "Outils pour Teamfight Tactics",
      description: "Des classements, un explorateur de statistiques et un constructeur d’équipe pour Teamfight Tactics, établis à partir de parties classées de haut niveau sur la mise à jour en cours.",
      highlights: ["Classements tirés de vraies parties classées", "Explorateur de statistiques", "Constructeur d’équipe avec liens à partager"],
      problem: "Teamfight Tactics change toutes les deux semaines et les classements écrits à la main prennent du retard. Les joueurs veulent savoir ce qui gagne sur la mise à jour en cours, à partir de vraies parties.",
      built: ["Un collecteur qui lit les plateaux finaux des parties classées de haut niveau dans l’API de Riot Games et les garde dans PostgreSQL", "Des classements et un rapport de méta établis à partir de ces plateaux, par mise à jour", "Un explorateur de statistiques pour les champions, objets, traits et augments", "Un constructeur d’équipe avec liens à partager, la recherche de joueurs, l’échelle et les notes de mise à jour"],
    },
  },
  {
    id: "patchlab",
    title: "Patchlab",
    tags: ["Next.js", "TypeScript", "Web Workers"],
    link: "https://patchlab.metaforge.lol",
    github: `https://github.com/${site.github}/patchlab`,
    images: ["/media/patchlab/patchlab-preview.mp4", "/media/patchlab/patchlab-lab.png", "/media/patchlab/patchlab-results.png", "/media/patchlab/patchlab-fight.png", "/media/patchlab/patchlab-notes.png"],
    proof: [
      { value: "20,000", en: "seeded fights per run, in the browser, on every core", fr: "combats par essai, dans le navigateur, sur tous les cœurs", source: "Patchlab’s source", date: "Nov 11, 2026", href: `https://github.com/${site.github}/patchlab` },
    ],
    en: {
      tagline: "Balance sandbox for TFT",
      description: "Put two Teamfight Tactics comps on the board, tweak any champion, item or trait, and run thousands of fights in the browser, with the live numbers and with yours, to see what a change moves before players find out.",
      highlights: ["Two comps, one board", "Any number, changed", "Thousands of fights in seconds"],
      problem: "A balance change in an auto-battler is hard to judge before players find out. Fights play out on their own, so they can be simulated, if the engine follows the game closely enough.",
      built: ["A fight engine in TypeScript that plays a TFT set in steps of a twentieth of a second, every champion’s ability included", "Runs of thousands of seeded fights spread over Web Workers, live and patched numbers on the same seeds", "Boards built by drag and drop, with MetaForge’s meta comps one drag away", "Patch notes as numbers you can run"],
    },
    fr: {
      tagline: "Bac à sable d’équilibrage pour TFT",
      description: "Placez deux compositions de Teamfight Tactics sur le plateau, modifiez un champion, un objet ou un trait, et lancez des milliers de combats dans le navigateur, avec les chiffres du jeu et avec les vôtres.",
      highlights: ["Deux compositions, un plateau", "N’importe quel chiffre, modifié", "Des milliers de combats en quelques secondes"],
      problem: "Un changement d’équilibre dans un auto-battler est difficile à juger avant que les joueurs le découvrent. Les combats se jouent seuls, donc on peut les simuler, si le moteur suit le jeu d’assez près.",
      built: ["Un moteur de combat en TypeScript qui joue un ensemble de TFT par pas d’un vingtième de seconde, avec la capacité de chaque champion", "Des milliers de combats répartis sur des Web Workers, chiffres du jeu et chiffres modifiés sur les mêmes graines", "Des plateaux montés par glisser-déposer, avec les compositions de MetaForge à portée de main", "Des notes de mise à jour en chiffres que l’on peut lancer"],
    },
  },
  {
    id: "mosaik",
    title: "Mosaïk",
    tags: ["Rust", "Tauri", "React", "TypeScript"],
    link: "https://mosaïk.com",
    github: `https://github.com/${site.github}/mosaik`,
    action: { href: "https://apps.microsoft.com/detail/9PHR0L7S1QVD", en: "Download", fr: "Télécharger" },
    // A clip (windows moved into zones), the site (its top, its features), then the app (Home, a workspace, its zones)
    images: ["/media/mosaik/mosaik-preview.mp4", "/media/mosaik/mosaik-site.png", "/media/mosaik/mosaik-site-features.png", "/media/mosaik/mosaik-app-home.png", "/media/mosaik/mosaik-app-workspace.png", "/media/mosaik/mosaik-app-zones.png"],
    proof: [
      { value: "Store", en: "published on the Microsoft Store, free", fr: "publié sur le Microsoft Store, gratuit", source: "Microsoft Store", date: "Nov 11, 2026", href: "https://apps.microsoft.com/detail/9PHR0L7S1QVD" },
      { value: "0", en: "network requests made by the app: no account, no telemetry", fr: "requête réseau faite par l’application : aucun compte, aucune télémétrie", source: "Mosaïk’s source", date: "Nov 11, 2026", href: `https://github.com/${site.github}/mosaik` },
    ],
    en: {
      tagline: "Window manager for Windows",
      description: "A free Windows app that gives every project its own workspace: apps snap into numbered, coloured zones, any windows can share a tab strip, and a whole workspace comes back in one click. On the Microsoft Store, with no account and no telemetry.",
      highlights: ["Zones and layouts for every project", "Tabs for any app", "Workspaces that open in one click"],
      problem: "Windows snaps windows side by side, but it has no way to keep each project’s windows, tabs and layout together and bring them back later.",
      built: ["A native app in Rust and Tauri that moves real windows into numbered, coloured zones", "A tab strip that groups any windows, whatever app they come from", "Workspaces that reopen a whole layout in one click", "A Microsoft Store release with no account, no telemetry and no network request"],
    },
    fr: {
      tagline: "Gestionnaire de fenêtres pour Windows",
      description: "Une application gratuite pour Windows qui donne à chaque projet son espace de travail : les fenêtres se placent dans des zones numérotées et colorées, n’importe quelles fenêtres partagent une barre d’onglets, et tout un espace revient en un clic. Sur le Microsoft Store, sans compte ni télémétrie.",
      highlights: ["Des zones et des dispositions pour chaque projet", "Des onglets pour n’importe quelle application", "Des espaces de travail qui s’ouvrent en un clic"],
      problem: "Windows aligne les fenêtres côte à côte, mais rien ne garde ensemble les fenêtres, les onglets et la disposition d’un projet pour les retrouver plus tard.",
      built: ["Une application native en Rust et Tauri qui place de vraies fenêtres dans des zones numérotées et colorées", "Une barre d’onglets qui regroupe n’importe quelles fenêtres", "Des espaces de travail qui rouvrent toute une disposition en un clic", "Une version sur le Microsoft Store sans compte, sans télémétrie et sans requête réseau"],
    },
  },
  {
    id: "dropdate",
    title: "Dropdate",
    tags: ["Next.js", "TypeScript", "PostgreSQL"],
    link: "https://dropdate.net",
    github: `https://github.com/${site.github}/dropdate`,
    images: ["/media/dropdate/dropdate-preview.mp4", "/media/dropdate/dropdate-home.png", "/media/dropdate/dropdate-this-week.png", "/media/dropdate/dropdate-calendar.png"],
    proof: [
      { value: "1h", en: "between refreshes of releases and tournaments", fr: "entre deux mises à jour des sorties et des tournois", source: "Dropdate", date: "Nov 11, 2026", href: "https://dropdate.net" },
      { value: "3", en: "calendar apps a view can be added to: Google, Apple and Outlook", fr: "applications de calendrier où ajouter une vue : Google, Apple et Outlook", source: "Dropdate", date: "Nov 11, 2026", href: "https://dropdate.net" },
    ],
    en: {
      tagline: "Game release calendar",
      description: "Every game release and esports tournament in one calendar. Search it in plain English, keep a wishlist, and add any view to Google, Apple or Outlook calendars so it follows a game when the date slips.",
      highlights: ["Releases and tournaments in one calendar", "Plain-English search and a wishlist", "Calendar feeds for Google, Apple and Outlook"],
      problem: "Release dates and esports schedules are spread over many sites, and they move. People want one calendar that changes when a date does.",
      built: ["Releases and artwork from IGDB and Steam, tournaments from PandaScore, refreshed every hour", "Search in plain English (“ps5 releases next month”)", "Accounts with a wishlist and the games you played", "Calendar feeds for any view, which follow a game when its date slips"],
    },
    fr: {
      tagline: "Calendrier des sorties de jeux",
      description: "Toutes les sorties de jeux et tous les tournois d’esport dans un seul calendrier. Cherchez en langage courant, gardez une liste de souhaits, et ajoutez n’importe quelle vue à Google, Apple ou Outlook pour suivre un jeu quand sa date change.",
      highlights: ["Sorties et tournois dans un seul calendrier", "Recherche en langage courant et liste de souhaits", "Calendriers pour Google, Apple et Outlook"],
      problem: "Les dates de sortie et les horaires d’esport sont éparpillés sur plusieurs sites, et elles changent. Il faut un seul calendrier qui bouge quand une date bouge.",
      built: ["Les sorties et les images d’IGDB et de Steam, les tournois de PandaScore, mis à jour chaque heure", "Une recherche en langage courant", "Des comptes avec une liste de souhaits et les jeux terminés", "Des calendriers pour chaque vue, qui suivent un jeu quand sa date change"],
    },
  },
]

// The three offers. `topic` is the matching option in the contact form (TOPICS in lib/contact.ts); `slug` is its own page
export const offers = [
  {
    id: "web-apps", topic: "web-app", price: `$${site.prices.webApp}`, from: true,
    en: { slug: "web-app-developer-montreal", title: "A web app or companion tool", blurb: "For a game, a community or a startup: accounts, a database, data from an API, an admin.", duration: "From 2 weeks", features: ["Accounts and roles", "Database and API", "Data from game or business APIs", "Admin and analytics"], search: "Web app developer in Montréal" },
    fr: { slug: "developpeur-applications-web-montreal", title: "Une application web ou un outil compagnon", blurb: "Pour un jeu, une communauté ou une jeune entreprise : comptes, base de données, données d’une API, administration.", duration: "À partir de 2 semaines", features: ["Comptes et rôles", "Base de données et API", "Données d’API de jeux ou d’affaires", "Administration et statistiques"], search: "Développeur d’applications web à Montréal" },
  },
  {
    id: "websites", topic: "website", price: `$${site.prices.website}`, from: true,
    en: { slug: "website-developer-montreal", title: "A fast website", blurb: "A site that loads at once on every device and that you can update yourself.", duration: "From 1 week", features: ["Design and responsive layout", "Contact form", "Search basics and share cards", "Analytics"], search: "Website developer in Montréal" },
    fr: { slug: "conception-site-web-montreal", title: "Un site web rapide", blurb: "Un site qui s’affiche tout de suite sur tous les appareils et que vous pouvez mettre à jour vous-même.", duration: "À partir d’une semaine", features: ["Conception et mise en page adaptative", "Formulaire de contact", "Référencement de base et aperçus de liens", "Statistiques"], search: "Conception de site web à Montréal" },
  },
  {
    id: "fixes", topic: "fix", price: `$${site.prices.hourly}/h`, from: false,
    en: { slug: "web-app-fixes-and-updates", title: "Fixes and updates", blurb: "Bugs, new features, speed and security for a codebase you already have.", duration: "As needed", features: ["Bug fixes", "New features", "Performance and security", "A short report of what changed"], search: "Web app fixes and updates" },
    fr: { slug: "corrections-et-mises-a-jour", title: "Corrections et mises à jour", blurb: "Bogues, nouvelles fonctions, vitesse et sécurité pour un code que vous avez déjà.", duration: "Selon les besoins", features: ["Correction de bogues", "Nouvelles fonctions", "Performance et sécurité", "Un court rapport des changements"], search: "Corrections et mises à jour d’applications web" },
  },
]

/** How a project runs, in one line */
export const howItRuns = {
  en: "How it runs: a brief, a quote within a day, a demo every week, a handover.",
  fr: "Comment ça se passe : un brief, une soumission en moins d’un jour, une démo chaque semaine, une remise du projet.",
}

/** What support pays for (/support) */
export const support = {
  free: ["grimoire", "metaforge", "patchlab", "dropdate", "mosaik"],
  paysFor: ["Hosting, databases and the API keys behind the sites", "The time to keep each tool current when a game patches", "New tools, free and without ads"],
}

/** Words of the interface, in both languages */
export const ui = {
  en: { nav: ["Work", "Services", "About", "Contact"], seeWork: "See the work", start: "Start a project", startOne: "Start", caseStudy: "Case study", visit: "Visit", source: "Source", problem: "The problem", built: "What I built", stack: "Built with", numbers: "Numbers you can check", read: "Source", from: "from", allWork: "All work", other: "Other services", answer: "I answer within a day.", book: "Book a call", madeBy: "Made by", support: "Support", lang: "Français", langHref: "/fr", top: "Back to top" },
  fr: { nav: ["Réalisations", "Services", "À propos", "Contact"], seeWork: "Voir les réalisations", start: "Démarrer un projet", startOne: "Démarrer", caseStudy: "Étude de cas", visit: "Visiter", source: "Code source", problem: "Le problème", built: "Ce que j’ai construit", stack: "Construit avec", numbers: "Des chiffres vérifiables", read: "Source", from: "à partir de", allWork: "Toutes les réalisations", other: "Autres services", answer: "Je réponds en moins d’un jour.", book: "Réserver un appel", madeBy: "Fait par", support: "Soutenir", lang: "English", langHref: "/", top: "Haut de page" },
}

export const home = (lang: Lang) => (lang === "fr" ? "/fr" : "/")
export const workHref = (lang: Lang, id: string) => `${lang === "fr" ? "/fr" : ""}/work/${id}`
export const offerHref = (lang: Lang, o: (typeof offers)[number]) => `${lang === "fr" ? "/fr" : ""}/services/${o[lang].slug}`
