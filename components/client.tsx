"use client"

import Image from "next/image"
import { useEffect, useRef, useState, useTransition } from "react"
import { createPortal } from "react-dom"
import { sendContact } from "@/app/actions"
import { TOPICS, validateContact, type ContactErrors, type ContactField, type TopicId } from "@/lib/contact"
import { projects } from "@/lib/content"
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

// ── Header: blurs once scrolled, marks the section in view, scroll progress line, glow and theme switches ──
const links = [["#work", "Work"], ["#services", "Services"], ["#about", "About"], ["#contact", "Contact"]] as const

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState("")
  const [glow, setGlow] = useState(true)
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
    for (const [href] of links) { const el = document.querySelector(href); if (el) io.observe(el) }
    update()
    const offs = [on(window, "scroll", onScroll, { passive: true }), on(window, "resize", onScroll)]
    return () => { io.disconnect(); cancelAnimationFrame(frame); offs.forEach((off) => off()) }
  }, [])

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = "hidden"
    const off = on<KeyboardEvent>(window, "keydown", (e) => e.key === "Escape" && setOpen(false))
    return () => { document.body.style.overflow = ""; off() }
  }, [open])

  const flipTheme = () => {
    const next = root().dataset.theme === "dark" ? "light" : "dark"
    root().dataset.theme = next
    paintBar()
    save("theme", next)
  }
  const flipGlow = () => {
    if (glow) root().dataset.glow = "off"
    else delete root().dataset.glow
    save("glow", glow ? "off" : "on")
    setGlow(!glow)
  }
  const round = "grid size-10 place-items-center rounded-full border border-line"

  return (
    <header className={cn("fixed inset-x-0 top-0 z-50 border-b pt-[env(safe-area-inset-top)] transition-colors duration-300", scrolled || open ? "border-line bg-bg/80 backdrop-blur-xl" : "border-transparent")}>
      <div className="wrap flex h-16 items-center justify-between">
        <a href="#top" aria-label={`${site.name}, back to top`} className="gradient-text text-[1.7rem] leading-none font-semibold tracking-tight transition-opacity hover:opacity-80">{site.name}</a>
        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {links.map(([href, label]) => (
            <a key={href} href={href} className={cn("rounded-full px-4 py-2 text-sm transition-colors", active === href ? "bg-accent-soft text-fg" : "text-muted hover:text-fg")}>{label}</a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button type="button" role="switch" aria-checked={glow} aria-label="Cursor glow" title="Cursor glow" onClick={flipGlow} className="hidden h-10 cursor-pointer items-center gap-2 rounded-full px-3 text-sm text-muted transition hover:text-fg md:inline-flex pointer-coarse:hidden!">
            Glow
            <span className={cn("relative h-5 w-9 rounded-full transition-colors", glow ? "bg-accent" : "bg-line-strong")}>
              <span className={cn("absolute top-0.5 left-0.5 size-4 rounded-full bg-white shadow transition-transform", glow && "translate-x-4")} />
            </span>
          </button>
          <button type="button" onClick={flipTheme} aria-label="Switch between light and dark theme" title="Theme" className={cn(round, "text-muted transition hover:border-line-strong hover:text-fg")}>
            <Moon className="dark:hidden" />
            <Sun className="hidden dark:block" />
          </button>
          <button type="button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)} className={cn(round, "md:hidden")}>
            {open ? <Close /> : <Menu />}
          </button>
        </div>
      </div>
      <span ref={bar} aria-hidden style={{ transform: "scaleX(0)" }} className="absolute inset-x-0 -bottom-px h-px origin-left bg-linear-to-r from-accent to-accent-2" />
      {open && (
        <nav aria-label="Mobile" className="wrap flex h-[calc(100dvh-4rem)] flex-col gap-1 pt-6 md:hidden">
          {links.map(([href, label]) => (
            <a key={href} href={href} onClick={() => setOpen(false)} className="display border-b border-line py-4 text-4xl">{label}</a>
          ))}
        </nav>
      )}
    </header>
  )
}

// ── Page-wide effects ──

/** A soft glow trailing the cursor; nothing on touch screens or with reduced motion. */
export function PointerGlow() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const g = ref.current
    if (!g || !matchMedia("(pointer: fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let tx = innerWidth / 2, ty = innerHeight * 0.3, x = tx, y = ty, frame = 0
    const tick = () => {
      x += (tx - x) * 0.3
      y += (ty - y) * 0.3
      g.style.transform = `translate3d(${x}px, ${y}px, 0)`
      frame = Math.abs(tx - x) + Math.abs(ty - y) > 0.5 ? requestAnimationFrame(tick) : 0
    }
    const offs = [
      on<PointerEvent>(window, "pointermove", (e) => {
        if (e.pointerType !== "mouse") return
        tx = e.clientX
        ty = e.clientY
        g.classList.add("on")
        frame ||= requestAnimationFrame(tick)
      }, { passive: true }),
      on(root(), "pointerleave", () => g.classList.remove("on")),
    ]
    return () => { offs.forEach((off) => off()); cancelAnimationFrame(frame) }
  }, [])
  return <div ref={ref} className="glow" aria-hidden />
}

/** Anything with class "reveal" fades up once it scrolls into view. */
export function Reveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target) } }),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.06 },
    )
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
  return null
}

// ── Hero orb: three.js (its own chunk) and the lighting load in parallel once the page is interactive ──
export function HeroOrb() {
  const box = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)
  useEffect(() => {
    let orb: Orb | null = null
    let dead = false
    const dark = () => root().dataset.theme === "dark"
    const get = (url: string) => fetch(url).then((r) => (r.ok ? r.arrayBuffer() : Promise.reject()))
    const hdr = get(site.hdr[0]).catch(() => get(site.hdr[1])).catch(() => null)
    Promise.all([import("@/components/orb"), hdr])
      .then(([{ createOrb }, buffer]) => {
        if (dead || !box.current) return
        orb = createOrb(box.current, { dark: dark(), hdr: buffer, onReady: () => setReady(true) })
        if (!orb) setReady(true) // no WebGL: no orb, no spinner
      })
      .catch(() => setReady(true))
    const watch = new MutationObserver(() => orb?.setTheme(dark()))
    watch.observe(root(), { attributes: true, attributeFilter: ["data-theme"] })
    return () => { dead = true; watch.disconnect(); orb?.dispose() }
  }, [])
  return (
    <>
      {!ready && <div className="absolute inset-0 grid place-items-center"><span className="loader" role="status" aria-label="Loading 3D scene" /></div>}
      <div ref={box} aria-hidden className={cn("absolute inset-0 select-none transition-opacity duration-700", ready ? "opacity-100" : "opacity-0")} />
    </>
  )
}

// ── Screenshots: whole, at their own proportions ──
// Sized from the real aspect ratio: an <img>'s natural size depends on which srcset width the browser picked
// (a 1920 px file served for a 3840w slot reports half its size), so it can't be trusted for layout.
const FIT = { panel: "w-[min(100%,70svh*var(--r))]", full: "w-[min(100cqw,100cqh*var(--r))]" }

function Shot({ src, title, fit, sizes, className, onLoaded, onClick }: { src: string; title: string; fit: keyof typeof FIT; sizes: string; className?: string; onLoaded?: () => void; onClick?: React.MouseEventHandler<HTMLElement> }) {
  const [ratio, setRatio] = useState(0) // width / height once loaded, -1 when the file is missing
  if (ratio < 0)
    return (
      <div role="img" aria-label={`${title} preview`} onClick={onClick} className={cn("grid aspect-[16/10] w-[40rem] max-w-full place-items-center rounded-xl bg-[linear-gradient(135deg,var(--accent-soft),transparent),var(--surface-2)]", className)}>
        <span className="gradient-text text-3xl font-semibold tracking-tight">{title}</span>
      </div>
    )
  return (
    <Image
      src={src} alt={`${title} screenshot`} width={0} height={0} sizes={sizes} onClick={onClick}
      onLoad={(e) => { const i = e.currentTarget; setRatio(i.naturalWidth / i.naturalHeight || 1.6); onLoaded?.() }}
      onError={() => { setRatio(-1); onLoaded?.() }}
      style={{ "--r": ratio || undefined } as React.CSSProperties}
      className={cn("h-auto", FIT[fit], !ratio && "invisible", className)}
    />
  )
}

function Thumb({ src }: { src: string }) {
  const [failed, setFailed] = useState(false)
  if (failed) return <span aria-hidden className="block size-full bg-accent-soft" />
  return <Image src={src} alt="" fill sizes="140px" onError={() => setFailed(true)} className="object-cover object-top" />
}

/** One-finger swipes (dx, dy in px), ignored while the page is pinch-zoomed. */
function useSwipe(handle: (dx: number, dy: number) => void) {
  const start = useRef<{ x: number; y: number } | null>(null)
  return {
    onTouchStart: (e: React.TouchEvent) => {
      const t = e.touches[0]
      start.current = e.touches.length === 1 ? { x: t.clientX, y: t.clientY } : null
    },
    onTouchEnd: (e: React.TouchEvent) => {
      const s = start.current, t = e.changedTouches[0]
      start.current = null
      if (s && (visualViewport?.scale ?? 1) < 1.01) handle(t.clientX - s.x, t.clientY - s.y)
    },
  }
}

/** Projects on the left, the selected one on the right: one screenshot, three bars to switch, click for fullscreen. */
export function Projects() {
  const [active, setActive] = useState(0)
  const [shot, setShot] = useState(0)
  const [open, setOpen] = useState(false)
  const p = projects[active]
  const count = p.images.length
  const step = (d: number) => setShot((s) => (s + d + count) % count)
  const swipe = useSwipe((dx, dy) => { if (Math.abs(dx) > 40 && Math.abs(dx) > 1.5 * Math.abs(dy)) step(dx < 0 ? 1 : -1) })

  // The picture on screen only changes once the next one has loaded, and the two crossfade, so the spot never empties
  const target = p.images[shot]
  const [shown, setShown] = useState<string>(target)
  const [leaving, setLeaving] = useState("")
  const timer = useRef(0)
  useEffect(() => () => clearTimeout(timer.current), [])
  const commit = (src: string) => {
    setLeaving(shown)
    setShown(src)
    clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setLeaving(""), 400)
  }
  const stack = [...new Set([leaving, shown, target])].filter(Boolean)

  // The viewer gets its own history entry, so a phone's back button or gesture closes it instead of leaving the site
  const view = () => { history.pushState({ gzViewer: true }, ""); setOpen(true) }
  const close = () => {
    setOpen(false)
    if (history.state?.gzViewer) { history.replaceState({ ...history.state, gzViewer: false }, ""); history.back() }
  }
  useEffect(() => (open ? on(window, "popstate", () => setOpen(false)) : undefined), [open])

  return (
    <div className="reveal grid gap-10 lg:grid-cols-12 lg:gap-14">
      <div role="tablist" aria-label="Projects" className="flex flex-col lg:col-span-4">
        {projects.map((x, i) => (
          <button
            key={x.id} role="tab" id={`tab-${x.id}`} aria-selected={active === i} aria-controls="project-panel"
            onClick={() => { setActive(i); setShot(0) }}
            className={cn("group flex cursor-pointer items-baseline gap-4 border-l-2 py-4 pr-2 pl-5 text-left transition", active === i ? "border-accent" : "border-line hover:border-line-strong")}
          >
            <span className={cn("font-mono text-xs transition", active === i ? "text-accent" : "text-faint")}>{String(i + 1).padStart(2, "0")}</span>
            <span>
              <span className={cn("block text-xl font-medium tracking-tight transition md:text-2xl", active === i ? "text-fg" : "text-muted group-hover:text-fg")}>{x.title}</span>
              <span className="mt-0.5 block text-sm text-muted">{x.tagline}</span>
            </span>
          </button>
        ))}
      </div>

      <div id="project-panel" role="tabpanel" aria-labelledby={`tab-${p.id}`} className="min-w-0 lg:col-span-8">
        <div className="relative touch-pan-y touch-pinch-zoom" {...swipe}>
          <button type="button" onClick={view} aria-label={`View ${p.title} screenshot ${shot + 1} of ${count} fullscreen`} className="grid w-full cursor-zoom-in grid-cols-1">
            {stack.map((src) => (
              <Shot
                key={src} src={src} title={p.title} fit="panel" sizes="(min-width: 1024px) 1000px, 100vw"
                onLoaded={src === target && src !== shown ? () => commit(src) : undefined}
                className={cn("col-start-1 row-start-1 justify-self-center rounded-xl transition-opacity duration-300", src === shown ? "opacity-100" : "pointer-events-none opacity-0")}
              />
            ))}
          </button>
          {count > 1 && [-1, 1].map((d) => (
            <button key={d} type="button" aria-label={d < 0 ? "Previous screenshot" : "Next screenshot"} onClick={() => step(d)} className={cn("group absolute inset-y-0 z-10 flex w-[22%] min-w-16 cursor-pointer items-center text-white", d < 0 ? "left-0 justify-start pl-2" : "right-0 justify-end pr-2")}>
              <span className="grid size-11 place-items-center rounded-full bg-black/45 backdrop-blur transition group-hover:bg-black/65"><ArrowRight className={cn("size-5", d < 0 && "rotate-180")} /></span>
            </button>
          ))}
        </div>

        <div className="mt-1 flex max-w-xs gap-2" role="group" aria-label={`${p.title} screenshots`}>
          {p.images.map((src, i) => (
            <button key={src} type="button" aria-label={`Show screenshot ${i + 1}`} aria-current={shot === i} onClick={() => setShot(i)} className="group grid h-9 flex-1 cursor-pointer items-center">
              <span className={cn("block h-[3px] rounded-full transition", shot === i ? "bg-accent" : "bg-line-strong group-hover:bg-faint")} />
            </button>
          ))}
        </div>

        <div key={p.id} className="fade mt-6 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-xl">
            <h3 className="text-xl font-medium tracking-tight">{p.title}</h3>
            <p className="mt-2 leading-relaxed text-muted">{p.description}</p>
            <ul className="mt-4 flex flex-wrap gap-2" aria-label="Built with">
              {p.tags.map((t) => <li key={t} className="chip">{t}</li>)}
            </ul>
          </div>
          <div className="flex shrink-0 gap-3">
            <a href={p.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Visit <ArrowUpRight className="size-4" /></a>
            <a href={p.github} target="_blank" rel="noopener noreferrer" className="btn btn-ghost"><Github className="size-4" /> Source</a>
          </div>
        </div>
      </div>
      {open && <Lightbox images={p.images} index={shot} title={p.title} onIndex={setShot} onClose={close} />}
    </div>
  )
}

/**
 * Fullscreen viewer. Phones: edge to edge (true fullscreen where the browser allows it), tap the picture to hide the
 * controls, swipe sideways to move, swipe down or go back to close. Big screens: framed, arrows, keys, Esc or the backdrop.
 */
function Lightbox({ images, index, title, onIndex, onClose }: { images: readonly string[]; index: number; title: string; onIndex: (i: number) => void; onClose: () => void }) {
  const box = useRef<HTMLDivElement>(null)
  const closeButton = useRef<HTMLButtonElement>(null)
  const auto = useRef(false) // fullscreen entered on its own (phones): leaving it closes the viewer
  const [ui, setUi] = useState(true)
  const [full, setFull] = useState(false)
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
    const el = box.current!
    const back = document.activeElement as HTMLElement | null
    root().style.overflow = "hidden"
    closeButton.current?.focus({ preventScroll: true })
    const off = on(document, "fullscreenchange", () => {
      const isFull = document.fullscreenElement === el
      setFull(isFull)
      if (!isFull && auto.current) { auto.current = false; onClose() }
    })
    if (coarse() && document.fullscreenEnabled) el.requestFullscreen({ navigationUI: "hide" }).then(() => { auto.current = true }, () => {})
    return () => {
      root().style.overflow = ""
      off()
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {})
      back?.focus({ preventScroll: true })
    }
  }, [])

  const toggleFull = () => {
    auto.current = false
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {})
    else box.current?.requestFullscreen().catch(() => {})
  }
  const button = "grid shrink-0 cursor-pointer place-items-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/25"
  const fade = cn("transition-opacity duration-300", !ui && "pointer-events-none opacity-0")

  return createPortal(
    <div ref={box} role="dialog" aria-modal="true" aria-label={`${title} screenshots`} onClick={onClose} {...swipe} className="fade fixed inset-0 z-[100] overscroll-none bg-black text-white select-none roomy:bg-black/90 roomy:backdrop-blur-md">
      <div className="absolute inset-0 flex items-center justify-center pt-[env(safe-area-inset-top)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] [container-type:size] roomy:px-24 roomy:pt-20 roomy:pb-24">
        <Shot key={images[index]} src={images[index]} title={title} fit="full" sizes="100vw" className="pop roomy:rounded-xl roomy:shadow-2xl" onClick={(e) => { e.stopPropagation(); if (coarse()) setUi(!ui) }} />
      </div>

      <div className={cn("absolute inset-x-0 top-0 flex items-center justify-between gap-4 bg-linear-to-b from-black/60 pt-[max(1rem,env(safe-area-inset-top))] pr-[max(1rem,env(safe-area-inset-right))] pb-6 pl-[max(1.25rem,env(safe-area-inset-left))] roomy:bg-none roomy:px-8 roomy:pt-6", fade)}>
        <p className="truncate text-sm text-white/70"><span className="font-medium text-white">{title}</span> <span className="tabular-nums" aria-live="polite">· {index + 1} / {count}</span></p>
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          {document.fullscreenEnabled && (
            <button type="button" aria-label={full ? "Exit fullscreen" : "Fullscreen"} onClick={toggleFull} className={cn(button, "size-12")}>{full ? <Shrink className="size-5" /> : <Expand className="size-5" />}</button>
          )}
          <button ref={closeButton} type="button" aria-label="Close" onClick={onClose} className={cn(button, "size-12")}><Close className="size-5" /></button>
        </div>
      </div>

      {count > 1 && [-1, 1].map((d) => (
        <button key={d} type="button" aria-label={d < 0 ? "Previous screenshot" : "Next screenshot"} onClick={(e) => { e.stopPropagation(); go(d) }} className={cn(button, fade, "absolute top-1/2 z-10 size-11 -translate-y-1/2 roomy:size-14", d < 0 ? "left-[max(0.75rem,env(safe-area-inset-left))] roomy:left-6" : "right-[max(0.75rem,env(safe-area-inset-right))] roomy:right-6")}>
          <ArrowRight className={cn("size-5", d < 0 && "rotate-180")} />
        </button>
      ))}

      {count > 1 && (
        <div className={cn("absolute inset-x-0 bottom-0 flex justify-center gap-2 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] [@media(max-height:30rem)]:hidden", fade)}>
          {images.map((src, i) => (
            <button key={src} type="button" aria-label={`Screenshot ${i + 1}`} aria-current={i === index} onClick={(e) => { e.stopPropagation(); onIndex(i) }} className={cn("relative h-12 w-20 cursor-pointer overflow-hidden rounded-lg ring-2 transition", i === index ? "ring-accent-2" : "opacity-50 ring-transparent hover:opacity-90")}>
              <Thumb src={src} />
            </button>
          ))}
        </div>
      )}
    </div>,
    document.body,
  )
}

// ── Services: "Start" pre-selects the topic in the contact form, then scrolls to it ──
export function StartButton({ topic, title }: { topic: string; title: string }) {
  return (
    <button
      type="button" aria-label={`Start a ${title} project`}
      onClick={() => { dispatchEvent(new CustomEvent("gz:topic", { detail: topic })); document.getElementById("contact")?.scrollIntoView() }}
      className="group mt-8 inline-flex h-11 w-fit cursor-pointer items-center gap-1.5 text-sm font-medium text-accent"
    >
      Start <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
    </button>
  )
}

// ── Contact ──
export function ContactForm() {
  const [errors, setErrors] = useState<ContactErrors>({})
  const [error, setError] = useState("")
  const [sent, setSent] = useState(false)
  const [topic, setTopic] = useState<TopicId | "">("")
  const [pending, start] = useTransition()

  useEffect(() => on<CustomEvent<string>>(window, "gz:topic", (e) => {
    const t = TOPICS.find((x) => x.id === e.detail)
    if (t && t.id !== "other") setTopic(t.id)
  }), [])

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const input = { ...Object.fromEntries(new FormData(form)), topic }
    const { errors } = validateContact(input)
    setErrors(errors)
    setError("")
    if (Object.keys(errors).length) return
    start(async () => {
      try {
        const res = await sendContact(input)
        if (res.ok) { form.reset(); setTopic(""); setSent(true) }
        else setError(res.error)
      } catch {
        setError(`Couldn't reach the server. Please email me at ${site.email}.`)
      }
    })
  }

  if (sent)
    return (
      <div className="pop grid min-h-[16rem] content-center justify-items-start gap-3" role="status">
        <span className="grid size-11 place-items-center rounded-full bg-accent-soft text-accent"><Check className="size-5" /></span>
        <h3 className="text-2xl font-medium tracking-tight">Sent</h3>
        <p className="text-muted">Thanks, I&rsquo;ll get back to you soon.</p>
        <button type="button" onClick={() => setSent(false)} className="btn btn-ghost mt-2 h-10 text-sm">Send another</button>
      </div>
    )

  const field = (name: ContactField, label: string) => ({
    name, placeholder: label, "aria-label": label, "aria-invalid": !!errors[name],
    className: cn(
      "block w-full resize-none rounded-xl border bg-[color-mix(in_srgb,var(--surface)_50%,transparent)] px-4 py-3 text-base outline-none transition placeholder:text-faint focus:border-accent focus:ring-4 focus:ring-accent-soft",
      errors[name] ? "border-danger" : "border-line hover:border-line-strong",
    ),
  })
  const hint = (name: ContactField) => errors[name] && <p role="alert" className="mt-1.5 text-sm text-danger">{errors[name]}</p>

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      {/* honeypot: hidden from people, irresistible to bots */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" />
      {topic && (
        <p className="pop inline-flex items-center gap-2 rounded-full border border-accent-line bg-accent-soft py-1 pr-1 pl-3 text-sm text-accent">
          Re: {TOPICS.find((t) => t.id === topic)?.label}
          <button type="button" aria-label="Remove topic" onClick={() => setTopic("")} className="grid size-6 cursor-pointer place-items-center rounded-full transition hover:bg-accent-soft"><Close className="size-3.5" /></button>
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div><input type="text" autoComplete="name" {...field("name", "Name")} />{hint("name")}</div>
        <div><input type="email" autoComplete="email" {...field("email", "Email")} />{hint("email")}</div>
      </div>
      <div><textarea rows={6} {...field("message", "Message")} />{hint("message")}</div>
      <div className="flex flex-wrap items-center gap-4 pt-1">
        <button type="submit" disabled={pending} className="btn btn-primary">{pending ? "Sending…" : <>Send <ArrowRight className="size-4" /></>}</button>
        {error && <p role="alert" className="text-sm text-danger">{error}</p>}
      </div>
    </form>
  )
}

export function CopyEmail({ email }: { email: string }) {
  const [done, setDone] = useState(false)
  const copy = async () => {
    try { await navigator.clipboard.writeText(email); setDone(true); setTimeout(() => setDone(false), 1800) } catch {}
  }
  return (
    <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
      <a href={`mailto:${email}`} className="text-xl font-medium tracking-tight break-all transition hover:text-accent sm:text-2xl">{email}</a>
      <button type="button" onClick={copy} aria-label={done ? "Copied" : "Copy email address"} title={done ? "Copied" : "Copy email"} className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-full text-muted transition hover:bg-accent-soft hover:text-accent">
        {done ? <Check className="text-accent" /> : <Copy />}
      </button>
    </p>
  )
}
