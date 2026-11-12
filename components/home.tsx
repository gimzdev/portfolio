import { preload } from "react-dom"
import { experience, howItRuns, offerHref, offers, person, sections, skillGroups, ui, type Lang } from "@/lib/content"
import { site } from "@/lib/site"
import { ArrowDown, ArrowRight, Check, Discord, Github, X } from "@/components/icons"
import { ContactForm, CopyEmail, HeroOrb, Projects, Reveal, StartButton } from "@/components/client"

const delay = (s: number) => ({ "--d": `${s}s` }) as React.CSSProperties
const socials = [{ name: "GitHub", href: `https://github.com/${site.github}`, Icon: Github }, { name: "X", href: `https://x.com/${site.x}`, Icon: X }, { name: "Discord", href: site.discord, Icon: Discord }]

/** The one-page site, in either language: hero, work, services, about, contact */
export function Home({ lang }: { lang: Lang }) {
  const s = sections[lang], t = ui[lang], me = person[lang]
  return (
    <>
      <Hero lang={lang} />
      <Section id="work" {...s.work} className="overflow-x-clip"><Projects lang={lang} /></Section>
      <Section id="services" {...s.services}>
        <div className="reveal grid gap-12 md:grid-cols-3 md:gap-10">
          {offers.map((o) => (
            <div key={o.id} className="flex flex-col border-t border-line-strong pt-6 transition-colors duration-300 hover:border-accent">
              <h3 className="text-xl font-medium tracking-tight"><a href={offerHref(lang, o)} className="transition hover:text-accent">{o[lang].title}</a></h3>
              <p className="mt-2 min-h-[3.5rem] text-muted">{o[lang].blurb}</p>
              <p className="mt-6 text-2xl font-medium tracking-tight">{o.from && <span className="mr-1.5 text-base font-normal text-muted">{t.from}</span>}{o.price}</p>
              <p className="mt-1 text-sm text-muted">{o[lang].duration}</p>
              <ul className="mt-6 space-y-2.5 text-sm text-muted">{o[lang].features.map((f) => <li key={f} className="flex items-center gap-3"><Check className="size-4 shrink-0 text-accent" />{f}</li>)}</ul>
              <StartButton topic={o.topic} title={o[lang].title} label={t.startOne} />
            </div>
          ))}
        </div>
        <p className="reveal mt-12 max-w-2xl text-muted">{howItRuns[lang]}</p>
      </Section>
      <Section id="about" {...s.about}>
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="reveal lg:col-span-7">
            <p className="text-xl leading-relaxed tracking-tight text-pretty md:text-2xl md:leading-relaxed">{me.bio[0]}</p>
            {me.bio.slice(1).map((x) => <p key={x} className="mt-5 max-w-xl leading-relaxed text-muted">{x}</p>)}
            <div className="mt-10 space-y-5">
              {skillGroups.map((g) => (
                <div key={g.name} className="grid gap-3 sm:grid-cols-[8rem_1fr]">
                  <p className="pt-1.5 font-mono text-xs tracking-[0.12em] text-accent uppercase">{g.name}</p>
                  <ul className="flex flex-wrap gap-2">{g.items.map((i) => <li key={i} className="chip">{i}</li>)}</ul>
                </div>
              ))}
            </div>
          </div>
          <ol className="reveal relative lg:col-span-4 lg:col-start-9" style={delay(0.1)}>
            <span aria-hidden className="absolute top-2 bottom-2 left-[5px] w-px bg-linear-to-b from-accent via-line-strong to-line" />
            {experience.map((e, i) => (
              <li key={`${e.company}-${e.period}`} className="relative pb-10 pl-9 last:pb-0">
                <span aria-hidden className={`absolute top-1.5 left-0 size-[11px] rounded-full border-2 border-bg ${i ? "bg-faint" : "bg-accent ring-4 ring-accent-soft"}`} />
                <p className={`font-mono text-xs tracking-[0.1em] uppercase ${i ? "text-muted" : "text-accent"}`}>{e.period}</p>
                <h3 className="mt-1.5 font-medium">{e.title} <span className="font-normal text-muted">· {e.company}</span></h3>
                <p className="mt-2 text-muted">{e[lang]}</p>
              </li>
            ))}
          </ol>
        </div>
      </Section>
      <Section id="contact" {...s.contact}>
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="reveal lg:col-span-6">
            <CopyEmail email={site.email} />
            <ul className="mt-8 flex flex-wrap gap-2">
              {socials.map(({ name, href, Icon }) => <li key={name}><a href={href} target="_blank" rel="noopener noreferrer" className="btn btn-ghost"><Icon className="size-4" />{name}</a></li>)}
            </ul>
          </div>
          <div className="reveal lg:col-span-6" style={delay(0.1)}><ContactForm lang={lang} /></div>
        </div>
      </Section>
      <Reveal />
    </>
  )
}

function Hero({ lang }: { lang: Lang }) {
  preload(site.hdr[0], { as: "fetch", crossOrigin: "anonymous", fetchPriority: "low" }) // the orb's lighting downloads with the page
  const me = person[lang], t = ui[lang], hi = lang === "fr" ? ["Bonjour,", "je suis"] : ["Hi,", "I’m"]
  return (
    <section id="top" className="relative flex min-h-svh items-center overflow-hidden pt-28 pb-20">
      <div className="ambient" />
      <div className="wrap">
        <div className="flex flex-col items-center gap-10 lg:flex-row">
          <div className="z-10 flex min-h-[calc(100svh-7rem)] flex-col justify-center lg:block lg:min-h-0 lg:w-[62%]">
            <h1 className="display text-[clamp(3rem,7vw,5.5rem)]">
              <span className="block">
                {hi.map((w, i) => <span key={w} className="rise inline-block" style={delay(0.05 + i * 0.07)}>{w}&nbsp;</span>)}
                <span className="rise gradient-text inline-block" style={delay(0.2)}>{site.name}</span>
                {/* Read as one sentence by search engines and screen readers: "Hi, I’m Gimz, software developer in Montréal." */}
                <span className="sr-only">, </span>
              </span>
              <span className="rise mt-2 block text-[0.58em] text-balance" style={delay(0.32)}>{me.headline}.</span>
            </h1>
            <p className="rise mt-8 max-w-2xl text-xl leading-relaxed text-muted md:text-2xl" style={delay(0.42)}>{me.lead}</p>
            <div className="rise mt-10 flex flex-col gap-3 sm:flex-row" style={delay(0.52)}>
              <a href="#work" className="btn btn-lg btn-primary">{t.seeWork} <ArrowRight className="size-5" /></a>
              <a href="#contact" className="btn btn-lg btn-ghost">{t.start}</a>
            </div>
          </div>
          {/* A little wider than its column so the rings' glow never reaches the canvas edge */}
          <div className="rise relative h-[380px] w-full sm:h-[440px] lg:h-[560px] lg:w-[38%]" style={delay(0.6)}><div className="absolute inset-y-0 -inset-x-[12%]"><HeroOrb /></div></div>
        </div>
      </div>
      <a href="#work" aria-label={t.seeWork} className="bob absolute bottom-7 left-1/2 hidden size-11 -translate-x-1/2 place-items-center rounded-full border border-line text-muted transition-colors hover:border-line-strong hover:text-fg md:grid"><ArrowDown className="size-5" /></a>
    </section>
  )
}

// The small label names the section, the heading says what it holds (both come from `sections` in lib/content.ts)
export function Section({ id, title, label, intro, className = "", children }: { id: string; title: string; label: string; intro?: React.ReactNode; className?: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`py-20 md:py-28 ${className}`}>
      <div className="wrap">
        <div className="reveal mb-10 md:mb-14">
          <p className="label mb-4">{label}</p>
          <h2 id={`${id}-title`} className="display-m max-w-3xl text-3xl text-balance md:text-4xl">{title}</h2>
          {intro && <p className="mt-3 max-w-xl text-muted">{intro}</p>}
        </div>
        {children}
      </div>
    </section>
  )
}
