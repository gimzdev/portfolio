import { howItRunsLine, offerHref, offers, projects, support, ui, updated, when, workHref } from "@/lib/content"
import { site } from "@/lib/site"
import { ArrowRight, ArrowUpRight, Check, Github } from "@/components/icons"
import { ContactForm, Gallery, TrackLink } from "@/components/client"

const label = "font-mono text-xs tracking-[0.12em] text-accent uppercase"
const ld = (data: object) => <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
const crumbs = (items: [string, string][]) => ({
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: items.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: `${site.url}${path}` })),
})
const me = { "@type": "Person", "@id": `${site.url}/#person`, name: site.name, url: site.url }
// What each project is, in schema.org's words: a guide and a tier-list site are reference works, the others tools
const CATEGORY: Record<string, string> = { grimoire: "ReferenceApplication", metaforge: "ReferenceApplication" }

/** A page's frame: a back link, the title block, then its sections */
function Page({ back, kicker, title, lead, children }: { back: [string, string]; kicker: string; title: string; lead: string; children: React.ReactNode }) {
  return (
    <article className="pt-32 pb-20 md:pt-40">
      <div className="wrap max-w-4xl">
        <a href={back[0]} className="text-sm text-muted transition hover:text-fg">← {back[1]}</a>
        <p className={`${label} mt-10`}>{kicker}</p>
        <h1 className="display-m mt-3 text-4xl text-balance md:text-5xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-xl leading-relaxed text-muted">{lead}</p>
        {children}
      </div>
    </article>
  )
}

export function CaseStudy({ id }: { id: string }) {
  const p = projects.find((x) => x.id === id)!, w = p, t = ui
  const others = projects.filter((x) => x.id !== id)
  const app = p.id === "mosaik", stills = p.images.filter(([src]) => !src.endsWith(".mp4"))
  return (
    <Page back={["/#work", t.allWork]} kicker={`${t.caseStudy} · ${w.tagline}`} title={p.title} lead={w.description}>
      {ld(crumbs([[site.name, "/"], [t.nav[0], "/#work"], [p.title, workHref(id)]]))}
      {ld({
        "@context": "https://schema.org", "@type": app ? "SoftwareApplication" : "WebApplication", name: p.title, url: p.link, description: w.description,
        applicationCategory: CATEGORY[p.id] ?? "UtilitiesApplication", operatingSystem: app ? "Windows 10, Windows 11" : "Any", isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, author: me, creator: me, sameAs: [p.github, ...(p.action ? [p.action.href] : [])],
        ...(app && p.action && { downloadUrl: p.action.href }), ...(stills.length > 0 && { screenshot: stills.map(([src]) => `${site.url}${src}`) }),
        mainEntityOfPage: `${site.url}${workHref(id)}`,
      })}
      <div className="mt-8 flex flex-wrap gap-3">
        {p.action && <a href={p.action.href} target="_blank" rel="noopener noreferrer" className="btn btn-primary">{p.action.label} <ArrowUpRight className="size-4" /><span className="sr-only">({t.newTab})</span></a>}
        <a href={p.link} target="_blank" rel="noopener noreferrer" className={`btn ${p.action ? "btn-ghost" : "btn-primary"}`}>{t.visit} <ArrowUpRight className="size-4" /><span className="sr-only">({t.newTab})</span></a>
        <a href={p.github} target="_blank" rel="noopener noreferrer" className="btn btn-ghost"><Github className="size-4" /> {t.source}<span className="sr-only">({t.newTab})</span></a>
      </div>
      <div className="mx-auto mt-12 max-w-[112svh]"><Gallery id={id} /></div>
      <section className="mt-16 grid gap-x-10 gap-y-4 md:grid-cols-[12rem_1fr] md:gap-y-10">
        <h2 className={label}>{t.problem}</h2>
        <p className="mb-6 text-lg leading-relaxed md:mb-0">{w.problem}</p>
        <h2 className={label}>{t.built}</h2>
        <ul className="mb-6 space-y-3 md:mb-0">{w.built.map((b) => <li key={b} className="flex gap-3 leading-relaxed text-muted"><Check className="mt-1 size-4 shrink-0 text-accent" />{b}</li>)}</ul>
        <h2 className={label}>{t.stack}</h2>
        <ul className="flex flex-wrap gap-2">{p.tags.map((x) => <li key={x} className="chip">{x}</li>)}</ul>
      </section>
      <section className="mt-20 rounded-2xl border border-line p-8 md:p-10">
        <h2 className="display-m text-2xl md:text-3xl">{t.start}</h2>
        <p className="mt-3 max-w-xl text-muted">{howItRunsLine} {t.answer}</p>
        <a href="/#contact" className="btn btn-primary mt-6">{t.start} <ArrowRight className="size-4" /></a>
      </section>
      <nav aria-label={t.otherStudies} className="mt-16 flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-6 text-sm text-muted">
        {others.map((o) => <a key={o.id} href={workHref(o.id)} className="transition hover:text-fg">{o.title} · {o.tagline}</a>)}
      </nav>
    </Page>
  )
}

export function OfferPage({ id }: { id: string }) {
  const o = offers.find((x) => x.id === id)!, w = o, t = ui
  return (
    <Page back={["/#services", t.nav[1]]} kicker={w.search} title={w.title} lead={w.blurb}>
      {ld(crumbs([[site.name, "/"], [t.nav[1], "/#services"], [w.title, offerHref(o)]]))}
      {ld({
        "@context": "https://schema.org", "@type": "ProfessionalService", name: `${site.name}: ${w.title}`, url: `${site.url}${offerHref(o)}`, description: w.blurb,
        areaServed: [{ "@type": "City", name: "Montréal" }, { "@type": "Country", name: "Canada" }, { "@type": "Country", name: "United States" }],
        address: { "@type": "PostalAddress", addressLocality: "Montréal", addressRegion: "QC", addressCountry: "CA" }, email: site.email, priceRange: `${o.from ? "from " : ""}${o.price} USD`,
        provider: me, inLanguage: "en-CA",
      })}
      <div className="mt-10 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <p className="text-3xl font-medium tracking-tight">{o.from && <span className="mr-2 text-lg font-normal text-muted">{t.from}</span>}{o.price}</p>
        <p className="text-muted">{w.duration}</p>
      </div>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2">{w.features.map((f) => <li key={f} className="flex items-center gap-3"><Check className="size-4 shrink-0 text-accent" />{f}</li>)}</ul>
      <p className="mt-10 max-w-2xl text-muted">{howItRunsLine} {t.answer}</p>
      <section className="mt-12 grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className={label}>{t.nav[0]}</h2>
          <ul className="mt-4 space-y-3">{projects.map((p) => <li key={p.id}><a href={workHref(p.id)} className="group"><span className="font-medium transition group-hover:text-accent">{p.title}</span> <span className="text-muted">· {p.tagline}</span></a></li>)}</ul>
          <h2 className={`${label} mt-10`}>{t.other}</h2>
          <ul className="mt-4 space-y-3">{offers.filter((x) => x.id !== id).map((x) => <li key={x.id}><a href={offerHref(x)} className="transition hover:text-accent">{x.title}</a></li>)}</ul>
        </div>
        <div id="contact"><ContactForm topic={o.topic} /></div>
      </section>
    </Page>
  )
}

export function SupportPage() {
  const t = ui, w = support
  return (
    <Page back={["/", site.name]} kicker={t.support} title={w.title} lead={w.lead}>
      <section className="mt-12 grid gap-x-10 gap-y-4 md:grid-cols-[12rem_1fr] md:gap-y-10">
        <h2 className={label}>{w.pays}</h2>
        <ul className="mb-6 space-y-3 md:mb-0">{w.paysFor.map((x) => <li key={x} className="flex gap-3 text-muted"><Check className="mt-1 size-4 shrink-0 text-accent" />{x}</li>)}</ul>
        <h2 className={label}>{w.keeps}</h2>
        <ul className="space-y-3">{support.free.map((id) => { const p = projects.find((x) => x.id === id)!; return <li key={id}><a href={p.link} target="_blank" rel="noopener noreferrer" className="font-medium transition hover:text-accent">{p.title}</a> <span className="text-muted">· {p.tagline}</span></li> })}</ul>
      </section>
      <div className="mt-12 flex flex-wrap gap-3">
        <TrackLink href={site.patreon} event="support_click" data={{ via: "patreon" }} className="btn btn-primary">{w.patreon} <ArrowUpRight className="size-4" /></TrackLink>
        {site.supportOnce && <TrackLink href={site.supportOnce} event="support_click" data={{ via: "once" }} className="btn btn-ghost">{w.once} <ArrowUpRight className="size-4" /></TrackLink>}
      </div>
      <p className="mt-16 max-w-2xl text-muted">{w.instead} {t.answer} <a href="/#contact" className="text-fg underline decoration-line-strong underline-offset-4 transition hover:text-accent">{t.start}</a>.</p>
      <p className="mt-4 text-xs text-muted">{w.updated} <time dateTime={updated}>{when(updated)}</time>.</p>
    </Page>
  )
}
