"use client"

import Image from "next/image"
import { useEffect, useId, useRef, useState, useTransition } from "react"
import { createPortal } from "react-dom"
import { usePathname } from "next/navigation"
import { track } from "@vercel/analytics"
import { sendContact } from "@/app/actions"
import { BUDGETS, TIMELINES, TOPICS, validateContact, type ContactErrors, type ContactField, type TopicId } from "@/lib/contact"
import { projects, ui, workHref, type Shot as Media } from "@/lib/content"
import { site } from "@/lib/site"
import type { Orb } from "@/components/orb"
import { ArrowRight, ArrowUpRight, Check, Close, Copy, Expand, Github, Menu, Moon, Shrink, Sun } from "@/components/icons"

const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ")
const root = () => document.documentElement
const coarse = () => matchMedia("(pointer: coarse)").matches
const save = (key: string, value: string) => { try { localStorage.setItem(key, value) } catch {} }
/** Adds a listener and returns its remover, ready to hand back from an effect. */
function on<E extends Event>(target: EventTarget, type: string, fn: (e: E) => void, options?: AddEventListenerOptions) {
  target.addEventListener(type, fn as EventListener, options)
  return () => target.removeEventListener(type, fn as EventListener, options)
}
// The browser bar follows the theme (dark by default)
const paintBar = () => document.querySelector('meta[name="theme-color"]')?.setAttribute("content", root().dataset.theme === "light" ? "#faf9fc" : "#0a0a0d")

// Header: blurs once scrolled, marks the section in view, scroll progress line, glow and theme switches
const SECTIONS = ["#work", "#services", "#about", "#contact"]

export function Header() {
  const path = usePathname() || "/", t = ui, onHome = path === "/"
  const links = SECTIONS.map((id, i) => [onHome ? id : `/${id}`, t.nav[i], id] as const)
  const [scrolled, setScrolled] = useState(false), [open, setOpen] = useState(false), [active, setActive] = useState(""), [glow, setGlow] = useState(true)
  const bar = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    setGlow(root().dataset.glow !== "off")
    paintBar()
    let frame = 0
    const update = () => {
      frame = 0
      const max = root().scrollHeight - innerHeight
      setScrolled(scrollY > 12)
      if (scrollY < 200) setActive("")
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? Math.min(scrollY / max, 1) : 0})`
    }
    const onScroll = () => { frame ||= requestAnimationFrame(update) }
    const io = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`)), { rootMargin: "-45% 0px -50% 0px" })
    for (const id of SECTIONS) { const el = document.querySelector(id); if (el) io.observe(el) }
    update()
    const offs = [on(window, "scroll", onScroll, { passive: true }), on(window, "resize", onScroll)]
    return () => { io.disconnect(); cancelAnimationFrame(frame); offs.forEach((off) => off()) }
  }, [])
  // The open menu covers the page: the page behind it can't be scrolled, tabbed into or read until it closes
  useEffect(() => {
    if (!open) return
    const behind = document.querySelectorAll("body > main, body > footer")
    document.body.style.overflow = "hidden"
    behind.forEach((el) => el.setAttribute("inert", ""))
    const offs = [on<KeyboardEvent>(window, "keydown", (e) => e.key === "Escape" && setOpen(false)), on(matchMedia("(min-width: 48rem)"), "change", () => setOpen(false))]
    return () => { document.body.style.overflow = ""; behind.forEach((el) => el.removeAttribute("inert")); offs.forEach((off) => off()) }
  }, [open])
  const flipTheme = () => {
    const next = root().dataset.theme === "dark" ? "light" : "dark"
    root().dataset.theme = next; paintBar(); save("theme", next)
  }
  const flipGlow = () => {
    if (glow) root().dataset.glow = "off"
    else delete root().dataset.glow
    save("glow", glow ? "off" : "on"); setGlow(!glow)
  }
  const round = "grid size-10 place-items-center rounded-full border border-line"
  return (
    <header className={cn("fixed inset-x-0 top-0 z-50 border-b pt-[env(safe-area-inset-top)] transition-colors duration-300", open ? "border-line bg-bg/95 backdrop-blur-xl" : scrolled ? "border-line bg-bg/80 backdrop-blur-xl" : "border-transparent")}>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:bg-fg focus:px-4 focus:py-2 focus:text-bg">{t.skip}</a>
      <div className="wrap flex h-16 items-center justify-between">
        <a href={onHome ? "#top" : "/"} aria-label={onHome ? `${site.name}, ${t.backToTop}` : site.name} className="gradient-text text-[1.7rem] leading-none font-semibold tracking-tight transition-opacity hover:opacity-80">{site.name}</a>
        <nav aria-label={t.primary} className="hidden items-center gap-1 md:flex">
          {links.map(([href, label, id]) => <a key={id} href={href} aria-current={active === id ? "true" : undefined} className={cn("rounded-full px-4 py-2 text-sm transition-colors", active === id ? "bg-accent-soft text-fg" : "text-muted hover:text-fg")}>{label}</a>)}
        </nav>
        <div className="flex items-center gap-2">
          <button type="button" role="switch" aria-checked={glow} aria-label={t.cursorGlow} title={t.cursorGlow} onClick={flipGlow} className="hidden h-10 cursor-pointer items-center gap-2 rounded-full px-3 text-sm text-muted transition hover:text-fg md:inline-flex pointer-coarse:hidden!">
            {t.glow}<span className={cn("relative h-5 w-9 rounded-full transition-colors", glow ? "bg-accent" : "bg-line-strong")}><span className={cn("absolute top-0.5 left-0.5 size-4 rounded-full bg-white shadow transition-transform", glow && "translate-x-4")} /></span>
          </button>
          <button type="button" onClick={flipTheme} aria-label={t.switchTheme} title={t.theme} className={cn(round, "cursor-pointer text-muted transition hover:border-line-strong hover:text-fg")}><Moon className="dark:hidden" /><Sun className="hidden dark:block" /></button>
          <button type="button" aria-label={open ? t.closeMenu : t.openMenu} aria-expanded={open} aria-controls={open ? "menu" : undefined} onClick={() => setOpen(!open)} className={cn(round, "cursor-pointer md:hidden")}>{open ? <Close /> : <Menu />}</button>
        </div>
      </div>
      <span ref={bar} aria-hidden style={{ transform: "scaleX(0)" }} className="absolute inset-x-0 -bottom-px h-px origin-left bg-linear-to-r from-accent to-accent-2" />
      {open && (
        <nav id="menu" aria-label={t.menu} className="wrap fade flex h-[calc(100dvh-4rem)] flex-col gap-1 overflow-y-auto pt-6 pb-10 md:hidden">
          {links.map(([href, label, id]) => <a key={id} href={href} onClick={() => setOpen(false)} className="display border-b border-line py-4 text-4xl">{label}</a>)}
        </nav>
      )}
    </header>
  )
}

/** A soft glow trailing the cursor; nothing on touch screens or with reduced motion. */
export function PointerGlow() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const g = ref.current
    if (!g || !matchMedia("(pointer: fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let tx = innerWidth / 2, ty = innerHeight * 0.3, x = tx, y = ty, frame = 0
    const tick = () => {
      x += (tx - x) * 0.3; y += (ty - y) * 0.3
      g.style.transform = `translate3d(${x}px, ${y}px, 0)`
      frame = Math.abs(tx - x) + Math.abs(ty - y) > 0.5 ? requestAnimationFrame(tick) : 0
    }
    const offs = [
      on<PointerEvent>(window, "pointermove", (e) => { if (e.pointerType !== "mouse") return; tx = e.clientX; ty = e.clientY; g.classList.add("on"); frame ||= requestAnimationFrame(tick) }, { passive: true }),
      on(root(), "pointerleave", () => g.classList.remove("on")),
    ]
    return () => { offs.forEach((off) => off()); cancelAnimationFrame(frame) }
  }, [])
  return <div ref={ref} className="glow" aria-hidden />
}

/** Anything with class "reveal" fades up once it scrolls into view. */
export function Reveal() {
  useEffect(() => {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target) } }), { rootMargin: "0px 0px -8% 0px", threshold: 0.06 })
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
  return null
}

// Hero orb: a still orb drawn in CSS holds its place from the first paint. three.js (its own chunk) and the lighting
// load once the orb is on screen (at once on a big screen, after a first scroll on a phone, where it sits under the
// text) and the browser is idle, so they never compete with the text; with data saver on or without WebGL 2 the still
// orb simply stays
export function HeroOrb() {
  const box = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const el = box.current
    if (!el || (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData) return
    // No WebGL 2 (three.js needs it): nothing is downloaded and nothing complains in the console, the still orb stays
    try { if (!document.createElement("canvas").getContext("webgl2")) return } catch { return }
    let orb: Orb | null = null, dead = false, idle = 0
    const dark = () => root().dataset.theme === "dark"
    const start = () => {
      const get = (url: string) => fetch(url).then((r) => (r.ok ? r.arrayBuffer() : Promise.reject()))
      const hdr = get(site.hdr[0]).catch(() => get(site.hdr[1])).catch(() => null)
      Promise.all([import("@/components/orb"), hdr]).then(([{ createOrb }, buffer]) => {
        if (dead || !box.current) return
        orb = createOrb(box.current, { dark: dark(), hdr: buffer, onReady: () => setReady(true) })
      }).catch(() => {})
    }
    const near = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return
      near.disconnect()
      idle = window.requestIdleCallback ? window.requestIdleCallback(start, { timeout: 1500 }) : window.setTimeout(start, 200)
    })
    near.observe(el)
    const watch = new MutationObserver(() => orb?.setTheme(dark()))
    watch.observe(root(), { attributes: true, attributeFilter: ["data-theme"] })
    return () => { dead = true; near.disconnect(); if (window.cancelIdleCallback) window.cancelIdleCallback(idle); clearTimeout(idle); watch.disconnect(); orb?.dispose() }
  }, [])
  return (
    <>
      <div aria-hidden className={cn("orb-still", ready && "opacity-0")}><span /></div>
      <div ref={box} aria-hidden className={cn("absolute inset-0 select-none transition-opacity duration-700", ready ? "opacity-100" : "opacity-0")} />
    </>
  )
}

// Screenshots and clips, whole and at their own proportions, sized from the real aspect ratio: an <img>'s natural size
// depends on which srcset width the browser picked, so it can't be trusted for layout. Until a file has loaded its spot
// is held at 16:10, so nothing below it moves when it arrives
const FIT = { panel: "w-[min(100%,70svh*var(--r))]", full: "w-[min(100cqw,100cqh*var(--r))]" }
type Project = (typeof projects)[number]
const isClip = (src: string) => src.endsWith(".mp4")
/** What a picture shows ("Grimoire: Talent calculator") */
const caption = (m: Media) => m[1]
const named = (title: string, m: Media) => `${title}: ${caption(m)}`

function Shot({ media, title, fit, sizes, className, onLoaded, onClick }: { media: Media; title: string; fit: keyof typeof FIT; sizes: string; className?: string; onLoaded?: () => void; onClick?: React.MouseEventHandler<HTMLElement> }) {
  const src = media[0], label = named(title, media)
  const [ratio, setRatio] = useState(0) // width / height once loaded, -1 when the file is missing
  const style = { "--r": ratio > 0 ? ratio : 1.6 } as React.CSSProperties, box = cn("aspect-[var(--r)] h-auto object-contain", FIT[fit], !ratio && "in-[.js]:invisible", className)
  if (ratio > -1 && isClip(src)) return <Clip src={src} label={label} player={fit === "full"} onClick={onClick} onRatio={setRatio} onLoaded={onLoaded} style={style} className={box} />
  if (ratio < 0)
    return (
      <div role="img" aria-label={label} onClick={onClick} className={cn("grid aspect-[16/10] w-[40rem] max-w-full place-items-center rounded-xl bg-[linear-gradient(135deg,var(--accent-soft),transparent),var(--surface-2)]", className)}>
        <span className="gradient-text text-3xl font-semibold tracking-tight">{title}</span>
      </div>
    )
  return (
    <Image src={src} alt={label} width={0} height={0} sizes={sizes} onClick={onClick} onLoad={(e) => { const i = e.currentTarget; setRatio(i.naturalWidth / i.naturalHeight || 1.6); onLoaded?.() }}
      onError={() => { setRatio(-1); onLoaded?.() }} style={style} className={box} />
  )
}

/** A short clip in a screenshot's place: muted, looping and inline. It plays only while it is on screen (a clip nobody
 * sees costs a phone its battery). With reduced motion it never plays on its own: it shows its first frame, and in the
 * fullscreen viewer it gets the player's controls. It can load before the page is hydrated, so its size and first frame
 * are also read when it mounts. */
function Clip({ src, label, player, className, style, onClick, onRatio, onLoaded }: { src: string; label: string; player: boolean; className: string; style: React.CSSProperties; onClick?: React.MouseEventHandler<HTMLElement>; onRatio: (r: number) => void; onLoaded?: () => void }) {
  const ref = useRef<HTMLVideoElement>(null), told = useRef(false)
  const [still, setStill] = useState(false)
  const sized = (v: HTMLVideoElement) => onRatio(v.videoWidth / v.videoHeight || 1.6)
  const ready = () => { if (!told.current) { told.current = true; onLoaded?.() } }
  useEffect(() => {
    const v = ref.current
    if (!v) return
    v.muted = true
    if (v.readyState >= 1) sized(v)
    if (v.readyState >= 2) ready()
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { v.preload = "auto"; setStill(true); return }
    const seen = new IntersectionObserver((entries) => { if (entries[entries.length - 1].isIntersecting) v.play().catch(() => {}); else v.pause() }, { threshold: 0.15 })
    seen.observe(v)
    return () => seen.disconnect()
  }, [])
  return (
    <video ref={ref} src={src} aria-label={label} muted loop playsInline controls={still && player} preload="metadata" onClick={onClick} onLoadedMetadata={(e) => sized(e.currentTarget)} onLoadedData={ready}
      onError={() => { onRatio(-1); ready() }} style={style} className={className} />
  )
}

function Thumb({ src }: { src: string }) {
  const [failed, setFailed] = useState(false)
  if (failed) return <span aria-hidden className="block size-full bg-accent-soft" />
  if (isClip(src)) return <video src={`${src}#t=0.5`} muted playsInline preload="metadata" aria-hidden tabIndex={-1} onError={() => setFailed(true)} className="absolute inset-0 size-full object-cover object-top" />
  return <Image src={src} alt="" fill sizes="140px" onError={() => setFailed(true)} className="object-cover object-top" />
}

/** One-finger swipes (dx, dy in px), ignored while the page is pinch-zoomed. */
function useSwipe(handle: (dx: number, dy: number) => void) {
  const start = useRef<{ x: number; y: number } | null>(null)
  return {
    onTouchStart: (e: React.TouchEvent) => { const t = e.touches[0]; start.current = e.touches.length === 1 ? { x: t.clientX, y: t.clientY } : null },
    onTouchEnd: (e: React.TouchEvent) => {
      const s = start.current, t = e.changedTouches[0]
      start.current = null
      if (s && (visualViewport?.scale ?? 1) < 1.01) handle(t.clientX - s.x, t.clientY - s.y)
    },
  }
}

/** One project's pictures: the one shown with what it is, arrows and a bar for each to switch, click for fullscreen. */
function Viewer({ p, shot, onShot }: { p: Project; shot: number; onShot: (i: number) => void }) {
  const t = ui, count = p.images.length
  const [open, setOpen] = useState(false)
  const step = (d: number) => onShot((shot + d + count) % count)
  const swipe = useSwipe((dx, dy) => { if (Math.abs(dx) > 40 && Math.abs(dx) > 1.5 * Math.abs(dy)) step(dx < 0 ? 1 : -1) })
  // The picture only changes once the next one has loaded, and the two crossfade, so the spot never empties
  const target = p.images[shot]
  const [shown, setShown] = useState<Media>(target), [leaving, setLeaving] = useState<Media | null>(null)
  const timer = useRef(0)
  useEffect(() => () => clearTimeout(timer.current), [])
  const commit = (m: Media) => { setLeaving(shown); setShown(m); clearTimeout(timer.current); timer.current = window.setTimeout(() => setLeaving(null), 400) }
  const stack = [...new Set([leaving, shown, target])].filter((m): m is Media => !!m)
  // The viewer gets its own history entry, so a phone's back button or gesture closes it instead of leaving the site
  const view = () => { history.pushState({ gzViewer: true }, ""); setOpen(true) }
  const close = () => {
    setOpen(false)
    if (history.state?.gzViewer) { history.replaceState({ ...history.state, gzViewer: false }, ""); history.back() }
  }
  useEffect(() => (open ? on(window, "popstate", () => setOpen(false)) : undefined), [open])

  return (
    <div className="min-w-0">
      <div className="relative touch-pan-y touch-pinch-zoom" {...swipe}>
        <button type="button" onClick={view} aria-label={`${named(p.title, target)}, ${shot + 1} ${t.of} ${count}, ${t.fullscreen}`} className="grid w-full cursor-zoom-in grid-cols-1">
          {stack.map((m) => (
            <Shot key={m[0]} media={m} title={p.title} fit="panel" sizes="(min-width: 1024px) 1000px, 100vw" onLoaded={m === target && m !== shown ? () => commit(m) : undefined}
              className={cn("col-start-1 row-start-1 justify-self-center rounded-xl transition-opacity duration-300", m === shown ? "opacity-100" : "pointer-events-none opacity-0")} />
          ))}
        </button>
        {count > 1 && [-1, 1].map((d) => (
          <button key={d} type="button" aria-label={d < 0 ? t.prev : t.next} onClick={() => step(d)} className={cn("group absolute inset-y-0 z-10 flex w-[22%] min-w-16 cursor-pointer items-center text-white", d < 0 ? "left-0 justify-start pl-2" : "right-0 justify-end pr-2")}>
            <span className="grid size-11 place-items-center rounded-full bg-black/45 backdrop-blur transition group-hover:bg-black/65"><ArrowRight className={cn("size-5", d < 0 && "rotate-180")} /></span>
          </button>
        ))}
      </div>
      <div className="mt-1 flex max-w-xs gap-2" role="group" aria-label={`${p.title}, ${t.shots}`}>
        {p.images.map((m, i) => (
          <button key={m[0]} type="button" aria-label={`${t.show} ${i + 1}, ${caption(m)}`} aria-current={shot === i} onClick={() => onShot(i)} className="group grid h-9 flex-1 cursor-pointer items-center">
            <span className={cn("block h-[3px] rounded-full transition", shot === i ? "bg-accent" : "bg-line-strong group-hover:bg-faint")} />
          </button>
        ))}
      </div>
      <p aria-live="polite" className="sr-only">{shot + 1}/{count} {caption(target)}</p>
      {open && <Lightbox images={p.images} index={shot} title={p.title} onIndex={onShot} onClose={close} />}
    </div>
  )
}

/** A case study's pictures: the home page's viewer, for one project */
export function Gallery({ id }: { id: string }) {
  const [shot, setShot] = useState(0), p = projects.find((x) => x.id === id)
  return p ? <Viewer p={p} shot={shot} onShot={setShot} /> : null
}

/** The projects as tabs (a row to swipe on phones, a list beside the viewer on big screens), then the selected one:
 * its pictures, what it is, two numbers a visitor can check, and where to go next. */
export function Projects() {
  const t = ui
  const [active, setActive] = useState(0), [shot, setShot] = useState(0)
  const tabs = useRef<HTMLDivElement>(null)
  const p = projects[active]
  const pick = (i: number, focus = false) => {
    setActive(i); setShot(0)
    const tab = tabs.current?.children[i] as HTMLElement | undefined
    if (focus) tab?.focus({ preventScroll: true })
    const row = tabs.current
    if (tab && row && row.scrollWidth > row.clientWidth) row.scrollTo({ left: tab.offsetLeft - (row.clientWidth - tab.offsetWidth) / 2 })
  }
  // Arrow keys move between the tabs, Home and End go to the first and the last (the tab key leaves the list)
  const keys = (e: React.KeyboardEvent) => {
    const d = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0
    const to = d ? (active + d + projects.length) % projects.length : e.key === "Home" ? 0 : e.key === "End" ? projects.length - 1 : -1
    if (to < 0) return
    e.preventDefault(); pick(to, true)
  }

  return (
    <div className="reveal grid gap-6 lg:grid-cols-12 lg:gap-14">
      <div ref={tabs} role="tablist" aria-label={t.projects} onKeyDown={keys} className="relative -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] lg:col-span-4 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden">
        {projects.map((x, i) => (
          <button key={x.id} type="button" role="tab" id={`tab-${x.id}`} aria-selected={active === i} aria-controls="project-panel" tabIndex={active === i ? 0 : -1} onClick={() => pick(i)}
            className={cn("group flex shrink-0 cursor-pointer items-baseline gap-2.5 rounded-full border px-4 py-2 text-left transition lg:gap-4 lg:rounded-none lg:border-0 lg:border-l-2 lg:py-4 lg:pr-2 lg:pl-5", active === i ? "border-accent bg-accent-soft lg:bg-transparent" : "border-line hover:border-line-strong")}>
            <span className={cn("font-mono text-xs transition", active === i ? "text-accent dark:text-accent-2" : "text-muted")}>{String(i + 1).padStart(2, "0")}</span>
            <span><span className={cn("block font-medium tracking-tight transition lg:text-xl xl:text-2xl", active === i ? "text-fg" : "text-muted group-hover:text-fg")}>{x.title}</span><span className="mt-0.5 hidden text-sm text-muted lg:block">{x.tagline}</span></span>
          </button>
        ))}
      </div>
      <div id="project-panel" role="tabpanel" aria-labelledby={`tab-${p.id}`} className="min-w-0 lg:col-span-8">
        <Viewer p={p} shot={shot} onShot={setShot} />
        {/* Every project's text is in the page, the others hidden: search engines read all five, not only the first */}
        {projects.map((x, i) => (
          <div key={x.id} hidden={active !== i}>
            <div className="fade mt-4 flex flex-col gap-6">
              <div className="max-w-xl">
                <h3 className="text-xl font-medium tracking-tight">{x.title}</h3>
                <p className="mt-0.5 text-sm text-muted lg:hidden">{x.tagline}</p>
                <p className="mt-2 leading-relaxed text-muted">{x.description}</p>
                <ul className="mt-5 flex flex-wrap gap-2" aria-label={t.stack}>{x.tags.map((tag) => <li key={tag} className="chip">{tag}</li>)}</ul>
              </div>
              <div className="flex shrink-0 flex-wrap gap-3">
                {x.action && <a href={x.action.href} target="_blank" rel="noopener noreferrer" className="btn btn-primary">{x.action.label} <ArrowUpRight className="size-4" /><span className="sr-only">({t.newTab})</span></a>}
                <a href={x.link} target="_blank" rel="noopener noreferrer" className={cn("btn", x.action ? "btn-ghost" : "btn-primary")}>{t.visit} <ArrowUpRight className="size-4" /><span className="sr-only">({t.newTab})</span></a>
                <a href={workHref(x.id)} className="btn btn-ghost">{t.caseStudy} <ArrowRight className="size-4" /></a>
                <a href={x.github} target="_blank" rel="noopener noreferrer" className="btn btn-ghost"><Github className="size-4" /> {t.source}<span className="sr-only">({t.newTab})</span></a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Fullscreen viewer. Phones: edge to edge (true fullscreen where allowed), tap the picture to hide the controls, swipe
 * sideways to move, swipe down or go back to close. Big screens: framed, arrows, keys, Esc or the backdrop. While it is
 * open the page behind it is inert, so the tab key stays inside.
 */
function Lightbox({ images, index, title, onIndex, onClose }: { images: readonly Media[]; index: number; title: string; onIndex: (i: number) => void; onClose: () => void }) {
  const t = ui
  const box = useRef<HTMLDivElement>(null), closeButton = useRef<HTMLButtonElement>(null)
  const auto = useRef(false) // fullscreen entered on its own (phones): leaving it closes the viewer
  const [controls, setControls] = useState(true), [full, setFull] = useState(false)
  const count = images.length
  const go = (d: number) => onIndex((index + d + count) % count)
  const swipe = useSwipe((dx, dy) => {
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) { if (count > 1) go(dx < 0 ? 1 : -1) }
    else if (dy > 80) onClose()
  })
  useEffect(() => on<KeyboardEvent>(window, "keydown", (e) => {
    if (e.key === "Escape") onClose()
    else if (e.key === "ArrowRight") go(1)
    else if (e.key === "ArrowLeft") go(-1)
  }))
  useEffect(() => {
    const el = box.current!, back = document.activeElement as HTMLElement | null
    const behind = document.querySelectorAll("body > header, body > main, body > footer")
    root().style.overflow = "hidden"
    behind.forEach((x) => x.setAttribute("inert", ""))
    closeButton.current?.focus({ preventScroll: true })
    const off = on(document, "fullscreenchange", () => {
      const isFull = document.fullscreenElement === el
      setFull(isFull)
      if (!isFull && auto.current) { auto.current = false; onClose() }
    })
    if (coarse() && document.fullscreenEnabled) el.requestFullscreen({ navigationUI: "hide" }).then(() => { auto.current = true }, () => {})
    return () => { root().style.overflow = ""; behind.forEach((x) => x.removeAttribute("inert")); off(); if (document.fullscreenElement) document.exitFullscreen().catch(() => {}); back?.focus({ preventScroll: true }) }
  }, [])
  const toggleFull = () => {
    auto.current = false
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {})
    else box.current?.requestFullscreen().catch(() => {})
  }
  const button = "grid shrink-0 cursor-pointer place-items-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/25"
  const fade = cn("transition-opacity duration-300", !controls && "pointer-events-none opacity-0")

  return createPortal(
    <div ref={box} role="dialog" aria-modal="true" aria-label={`${title}, ${t.shots}`} onClick={onClose} {...swipe} className="fade fixed inset-0 z-[100] overscroll-none bg-black text-white select-none roomy:bg-black/90 roomy:backdrop-blur-md">
      <div className="absolute inset-0 flex items-center justify-center pt-[env(safe-area-inset-top)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] [container-type:size] roomy:px-24 roomy:pt-20 roomy:pb-24">
        <Shot key={images[index][0]} media={images[index]} title={title} fit="full" sizes="100vw" className="pop roomy:rounded-xl roomy:shadow-2xl" onClick={(e) => { e.stopPropagation(); if (coarse()) setControls(!controls) }} />
      </div>
      <div className={cn("absolute inset-x-0 top-0 flex items-center justify-between gap-4 bg-linear-to-b from-black/60 pt-[max(1rem,env(safe-area-inset-top))] pr-[max(1rem,env(safe-area-inset-right))] pb-6 pl-[max(1.25rem,env(safe-area-inset-left))] roomy:bg-none roomy:px-8 roomy:pt-6", fade)}>
        <p className="truncate text-sm text-white/70" aria-live="polite"><span className="font-medium text-white">{title}</span> <span className="tabular-nums">· {index + 1} / {count}</span> · {caption(images[index])}</p>
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          {document.fullscreenEnabled && <button type="button" aria-label={full ? t.exitFullscreen : t.fullscreen} onClick={toggleFull} className={cn(button, "size-12")}>{full ? <Shrink className="size-5" /> : <Expand className="size-5" />}</button>}
          <button ref={closeButton} type="button" aria-label={t.close} onClick={onClose} className={cn(button, "size-12")}><Close className="size-5" /></button>
        </div>
      </div>
      {count > 1 && [-1, 1].map((d) => (
        <button key={d} type="button" aria-label={d < 0 ? t.prev : t.next} onClick={(e) => { e.stopPropagation(); go(d) }} className={cn(button, fade, "absolute top-1/2 z-10 size-11 -translate-y-1/2 roomy:size-14", d < 0 ? "left-[max(0.75rem,env(safe-area-inset-left))] roomy:left-6" : "right-[max(0.75rem,env(safe-area-inset-right))] roomy:right-6")}>
          <ArrowRight className={cn("size-5", d < 0 && "rotate-180")} />
        </button>
      ))}
      {count > 1 && (
        <div className={cn("absolute inset-x-0 bottom-0 flex justify-center gap-2 px-4 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] [@media(max-height:30rem)]:hidden", fade)}>
          {images.map((m, i) => (
            <button key={m[0]} type="button" aria-label={`${t.show} ${i + 1}, ${caption(m)}`} aria-current={i === index} onClick={(e) => { e.stopPropagation(); onIndex(i) }} className={cn("relative h-12 w-20 cursor-pointer overflow-hidden rounded-lg ring-2 transition", i === index ? "ring-accent-2" : "opacity-50 ring-transparent hover:opacity-90")}>
              <Thumb src={m[0]} />
            </button>
          ))}
        </div>
      )}
    </div>,
    document.body,
  )
}

// Services: "Start" pre-selects the topic in the contact form, then scrolls to it
export function StartButton({ topic, title, label = "Start" }: { topic: string; title: string; label?: string }) {
  return (
    <button type="button" aria-label={`${label}: ${title}`} onClick={() => { dispatchEvent(new CustomEvent("gz:topic", { detail: topic })); document.getElementById("contact")?.scrollIntoView() }}
      className="group inline-flex h-11 w-fit cursor-pointer items-center gap-1.5 text-sm font-medium text-accent">{label} <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" /></button>
  )
}

const FORM = { noScript: "This form needs JavaScript. Email me at", name: "Name", email: "Email", message: "Message", hint: "What do you want to build or fix?", budget: "Budget (optional)", timeline: "Timeline (optional)", pick: "Not sure yet", send: "Send", sending: "Sending…", sent: "Sent", thanks: "Thanks, I’ll answer within a day.", another: "Send another", re: "Re", remove: "Remove topic", offline: `Couldn't reach the server. Please email me at ${site.email}.` }
/** A message that names the email address, with the address as a link */
const withMail = (text: string) => { const [before, after] = text.split(site.email); return after === undefined ? text : <>{before}<a href={`mailto:${site.email}`} className="underline underline-offset-2">{site.email}</a>{after}</> }

/** The contact form. Every field has a visible label; a field with a mistake says so under itself and takes the focus;
 * "Sending…", "Sent" and a failure are announced to screen readers; a failure names the email address to write to. */
export function ContactForm({ topic: initial = "" }: { topic?: string }) {
  const t = ui, w = FORM, uid = useId()
  const [errors, setErrors] = useState<ContactErrors>({}), [error, setError] = useState(""), [sent, setSent] = useState(false)
  const [topic, setTopic] = useState<TopicId | "">(TOPICS.find((x) => x.id === initial && x.id !== "other")?.id ?? "")
  const [pending, start] = useTransition()
  const born = useRef(0), done = useRef<HTMLHeadingElement>(null)
  useEffect(() => on<CustomEvent<string>>(window, "gz:topic", (e) => {
    const t = TOPICS.find((x) => x.id === e.detail)
    if (t && t.id !== "other") setTopic(t.id)
  }), [])
  // When the form appeared (a person needs a few seconds to fill it in, a script does not); once sent, the focus goes to the confirmation
  useEffect(() => { if (sent) done.current?.focus(); else born.current = Date.now() }, [sent])
  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget, input = { ...Object.fromEntries(new FormData(form)), topic, elapsed: String(Date.now() - born.current) }
    const { errors } = validateContact(input)
    setErrors(errors); setError("")
    const first = (["name", "email", "message"] as const).find((k) => errors[k])
    if (first) { (form.elements.namedItem(first) as HTMLElement | null)?.focus(); return }
    start(async () => {
      try {
        const res = await sendContact(input)
        if (res.ok) { track("contact_sent", { topic: topic || "none" }); form.reset(); setTopic(""); setSent(true) }
        else setError(res.error)
      } catch { setError(w.offline) }
    })
  }
  if (sent)
    return (
      <div className="pop grid min-h-[16rem] content-center justify-items-start gap-3" role="status">
        <span className="grid size-11 place-items-center rounded-full bg-accent-soft text-accent"><Check className="size-5" /></span>
        <h3 ref={done} tabIndex={-1} className="text-2xl font-medium tracking-tight outline-none">{w.sent}</h3>
        <p className="text-muted">{w.thanks}</p>
        <button type="button" onClick={() => setSent(false)} className="btn btn-ghost mt-2 h-10 text-sm">{w.another}</button>
      </div>
    )
  const box = "block w-full rounded-xl border bg-[color-mix(in_srgb,var(--surface)_50%,transparent)] px-4 py-3 text-base outline-none transition placeholder:text-muted focus:border-accent focus:ring-4 focus:ring-accent-soft"
  const label = (name: string, text: string) => <label htmlFor={`${uid}${name}`} className="mb-1.5 block text-sm text-muted">{text}</label>
  const field = (name: ContactField) => ({ id: `${uid}${name}`, name, required: true, "aria-invalid": !!errors[name], "aria-describedby": errors[name] ? `${uid}${name}-error` : undefined, className: cn(box, "resize-none", errors[name] ? "border-danger" : "border-line hover:border-line-strong") })
  const hint = (name: ContactField) => errors[name] && <p id={`${uid}${name}-error`} className="mt-1.5 text-sm text-danger">{errors[name]}</p>
  return (
    <form onSubmit={submit} noValidate aria-busy={pending} className="space-y-4">
      {/* honeypot: hidden from people, irresistible to bots */}
      <input type="checkbox" name="trap" tabIndex={-1} autoComplete="off" data-lpignore="true" data-1p-ignore aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" />
      {topic && (
        <p className="pop inline-flex items-center gap-2 rounded-full border border-accent-line bg-accent-soft py-1 pr-1 pl-3 text-sm text-accent dark:text-accent-2">
          {w.re}: {TOPICS.find((x) => x.id === topic)?.label}<button type="button" aria-label={w.remove} onClick={() => setTopic("")} className="grid size-6 cursor-pointer place-items-center rounded-full transition hover:bg-accent-soft"><Close className="size-3.5" /></button>
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>{label("name", w.name)}<input type="text" autoComplete="name" {...field("name")} />{hint("name")}</div>
        <div>{label("email", w.email)}<input type="email" autoComplete="email" inputMode="email" {...field("email")} />{hint("email")}</div>
      </div>
      <div>{label("message", w.message)}<textarea rows={6} placeholder={w.hint} {...field("message")} />{hint("message")}</div>
      <div className="grid gap-4 sm:grid-cols-2">
        {([["budget", w.budget, BUDGETS], ["timeline", w.timeline, TIMELINES]] as const).map(([name, text, options]) => (
          <div key={name}>
            {label(name, text)}
            <select id={`${uid}${name}`} name={name} defaultValue="" className={cn(box, "cursor-pointer border-line hover:border-line-strong")}>
              <option value="">{w.pick}</option>
              {options.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
            </select>
          </div>
        ))}
      </div>
      <noscript><p className="text-sm text-muted">{w.noScript} <a href={`mailto:${site.email}`} className="text-fg underline underline-offset-2">{site.email}</a>.</p></noscript>
      <div className="flex flex-wrap items-center gap-4 pt-1">
        <button type="submit" disabled={pending} className="btn btn-primary">{pending ? w.sending : <>{w.send} <ArrowRight className="size-4" /></>}</button>
        <p className="text-sm text-muted">{t.answer}</p>
        {site.booking && <a href={site.booking} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-accent underline-offset-4 hover:underline">{t.book}</a>}
        <p role="status" className="sr-only">{pending ? w.sending : ""}</p>
        {error && <p role="alert" className="basis-full text-sm text-danger">{withMail(error)}</p>}
      </div>
    </form>
  )
}

export function CopyEmail({ email }: { email: string }) {
  const t = ui
  const [done, setDone] = useState(false)
  const copy = async () => { try { await navigator.clipboard.writeText(email); setDone(true); setTimeout(() => setDone(false), 1800) } catch {} }
  return (
    <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
      <a href={`mailto:${email}`} className="text-xl font-medium tracking-tight break-all transition hover:text-accent sm:text-2xl">{email}</a>
      <button type="button" onClick={copy} aria-label={t.copy} title={t.copy} className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-full text-muted transition hover:bg-accent-soft hover:text-accent">{done ? <Check className="text-accent" /> : <Copy />}</button>
      <span role="status" className="sr-only">{done ? t.copied : ""}</span>
    </p>
  )
}

export function SiteFooter() {
  const t = ui
  return (
    <footer className="py-10">
      <div className="wrap flex flex-col items-center justify-between gap-4 text-sm text-muted sm:flex-row">
        <p>© {new Date().getFullYear()} {site.name}dev</p>
        <p className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1">
          <a href="/support" className="transition hover:text-fg">{t.support}</a>
          <a href={site.repo} target="_blank" rel="noopener noreferrer" className="transition hover:text-fg">{t.source}<span className="sr-only"> ({t.newTab})</span></a>
          <a href="#top" className="transition hover:text-fg">{t.top} ↑</a>
        </p>
      </div>
    </footer>
  )
}

/** The 404 page */
export function NotFound() {
  const t = ui
  return (
    <section id="not-found" className="wrap grid min-h-[80svh] place-content-center gap-6 py-32">
      <p className="label">404</p>
      <h1 className="display text-5xl md:text-7xl">{t.notFound.title}</h1>
      <p className="max-w-md text-lg text-muted">{t.notFound.text}</p>
      <div><a href="/" className="btn btn-lg btn-primary">{t.notFound.back}</a></div>
    </section>
  )
}

/** An outside link counted as an event (Vercel Web Analytics, anonymous) */
export function TrackLink({ href, event, data, className, children }: { href: string; event: string; data?: Record<string, string>; className?: string; children: React.ReactNode }) {
  return <a href={href} target="_blank" rel="noopener noreferrer" className={className} onClick={() => track(event, data)}>{children}</a>
}
