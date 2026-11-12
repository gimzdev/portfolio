import { home, offerHref, offers, projects, support, ui, updated, workHref, howItRuns, type Lang } from "@/lib/content"
import { site } from "@/lib/site"
import { ArrowRight, ArrowUpRight, Check, Github } from "@/components/icons"
import { ContactForm, TrackLink } from "@/components/client"

const label = "font-mono text-xs tracking-[0.12em] text-accent uppercase"
const ld = (data: object) => <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
const crumbs = (items: [string, string][]) => ({
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: items.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: `${site.url}${path}` })),
})

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

export function CaseStudy({ id, lang }: { id: string; lang: Lang }) {
  const p = projects.find((x) => x.id === id)!, w = p[lang], t = ui[lang]
  const others = projects.filter((x) => x.id !== id)
  return (
    <Page back={[`${home(lang)}#work`, t.allWork]} kicker={`${t.caseStudy} · ${w.tagline}`} title={p.title} lead={w.description}>
      {ld(crumbs([[site.name, home(lang)], [t.nav[0], `${home(lang)}#work`], [p.title, workHref(lang, id)]]))}
      {ld({ "@context": "https://schema.org", "@type": p.id === "mosaik" ? "SoftwareApplication" : "WebApplication", name: p.title, url: p.link, description: w.description, applicationCategory: p.id === "mosaik" ? "UtilitiesApplication" : "GameApplication", operatingSystem: p.id === "mosaik" ? "Windows 10, Windows 11" : "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, author: { "@type": "Person", name: site.name, url: site.url } })}
      <div className="mt-8 flex flex-wrap gap-3">
        {p.action && <a href={p.action.href} target="_blank" rel="noopener noreferrer" className="btn btn-primary">{p.action[lang]} <ArrowUpRight className="size-4" /></a>}
        <a href={p.link} target="_blank" rel="noopener noreferrer" className={`btn ${p.action ? "btn-ghost" : "btn-primary"}`}>{t.visit} <ArrowUpRight className="size-4" /></a>
        <a href={p.github} target="_blank" rel="noopener noreferrer" className="btn btn-ghost"><Github className="size-4" /> {t.source}</a>
      </div>
      <dl className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
        {p.proof.map((n) => (
          <div key={n.en} className="bg-bg p-6">
            <dt className="text-3xl font-medium tracking-tight">{n.value}</dt>
            <dd className="mt-2 text-muted">{n[lang]}</dd>
            <dd className="mt-3 text-xs text-faint">{t.read}: {n.href ? <a href={n.href} target="_blank" rel="noopener noreferrer" className="underline decoration-line-strong underline-offset-2 transition hover:text-fg">{n.source}</a> : n.source}, {n.date}</dd>
          </div>
        ))}
      </dl>
      <section className="mt-16 grid gap-10 md:grid-cols-[12rem_1fr]">
        <h2 className={label}>{t.problem}</h2>
        <p className="text-lg leading-relaxed">{w.problem}</p>
        <h2 className={label}>{t.built}</h2>
        <ul className="space-y-3">{w.built.map((b) => <li key={b} className="flex gap-3 leading-relaxed text-muted"><Check className="mt-1 size-4 shrink-0 text-accent" />{b}</li>)}</ul>
        <h2 className={label}>{t.stack}</h2>
        <ul className="flex flex-wrap gap-2">{p.tags.map((x) => <li key={x} className="chip">{x}</li>)}</ul>
      </section>
      <section className="mt-20 rounded-2xl border border-line p-8 md:p-10">
        <h2 className="display-m text-2xl md:text-3xl">{t.start}</h2>
        <p className="mt-3 max-w-xl text-muted">{howItRuns[lang]} {t.answer}</p>
        <a href={`${home(lang)}#contact`} className="btn btn-primary mt-6">{t.start} <ArrowRight className="size-4" /></a>
      </section>
      <nav aria-label={t.allWork} className="mt-16 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
        {others.map((o) => <a key={o.id} href={workHref(lang, o.id)} className="transition hover:text-fg">{o.title}: {o[lang].tagline}</a>)}
      </nav>
    </Page>
  )
}

export function OfferPage({ id, lang }: { id: string; lang: Lang }) {
  const o = offers.find((x) => x.id === id)!, w = o[lang], t = ui[lang]
  return (
    <Page back={[`${home(lang)}#services`, t.nav[1]]} kicker={w.search} title={w.title} lead={w.blurb}>
      {ld(crumbs([[site.name, home(lang)], [t.nav[1], `${home(lang)}#services`], [w.title, offerHref(lang, o)]]))}
      {ld({
        "@context": "https://schema.org", "@type": "ProfessionalService", name: `${site.name}: ${w.title}`, url: `${site.url}${offerHref(lang, o)}`, description: w.blurb,
        areaServed: [{ "@type": "City", name: "Montréal" }, { "@type": "Country", name: "Canada" }, { "@type": "Country", name: "United States" }],
        address: { "@type": "PostalAddress", addressLocality: "Montréal", addressRegion: "QC", addressCountry: "CA" }, email: site.email, priceRange: `${o.from ? (lang === "fr" ? "à partir de " : "from ") : ""}${o.price} USD`,
        provider: { "@type": "Person", name: site.name, url: site.url }, inLanguage: lang === "fr" ? "fr-CA" : "en-CA",
      })}
      <div className="mt-10 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <p className="text-3xl font-medium tracking-tight">{o.from && <span className="mr-2 text-lg font-normal text-muted">{t.from}</span>}{o.price}</p>
        <p className="text-muted">{w.duration}</p>
      </div>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2">{w.features.map((f) => <li key={f} className="flex items-center gap-3"><Check className="size-4 shrink-0 text-accent" />{f}</li>)}</ul>
      <p className="mt-10 max-w-2xl text-muted">{howItRuns[lang]} {t.answer}</p>
      <section className="mt-12 grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className={label}>{t.nav[0]}</h2>
          <ul className="mt-4 space-y-3">{projects.map((p) => <li key={p.id}><a href={workHref(lang, p.id)} className="group"><span className="font-medium transition group-hover:text-accent">{p.title}</span> <span className="text-muted">· {p[lang].tagline}</span></a></li>)}</ul>
          <h2 className={`${label} mt-10`}>{t.other}</h2>
          <ul className="mt-4 space-y-3">{offers.filter((x) => x.id !== id).map((x) => <li key={x.id}><a href={offerHref(lang, x)} className="transition hover:text-accent">{x[lang].title}</a></li>)}</ul>
        </div>
        <div id="contact"><ContactForm lang={lang} topic={o.topic} /></div>
      </section>
    </Page>
  )
}

export function SupportPage() {
  const t = ui.en
  return (
    <Page back={["/", site.name]} kicker="Support" title="Keep the tools free" lead={`${site.name}’s tools are free, with no ads and nothing to sign up for. Support pays for what keeps them running.`}>
      <section className="mt-12 grid gap-10 md:grid-cols-[12rem_1fr]">
        <h2 className={label}>What it pays for</h2>
        <ul className="space-y-3">{support.paysFor.map((x) => <li key={x} className="flex gap-3 text-muted"><Check className="mt-1 size-4 shrink-0 text-accent" />{x}</li>)}</ul>
        <h2 className={label}>What it keeps free</h2>
        <ul className="space-y-3">{support.free.map((id) => { const p = projects.find((x) => x.id === id)!; return <li key={id}><a href={p.link} target="_blank" rel="noopener noreferrer" className="font-medium transition hover:text-accent">{p.title}</a> <span className="text-muted">· {p.en.tagline}</span></li> })}</ul>
      </section>
      <div className="mt-12 flex flex-wrap gap-3">
        <TrackLink href={site.patreon} event="support_click" data={{ via: "patreon" }} className="btn btn-primary">Support on Patreon <ArrowUpRight className="size-4" /></TrackLink>
        {site.supportOnce && <TrackLink href={site.supportOnce} event="support_click" data={{ via: "once" }} className="btn btn-ghost">Give once <ArrowUpRight className="size-4" /></TrackLink>}
      </div>
      <p className="mt-16 max-w-2xl text-muted">Need something built instead? {t.answer} <a href="/#contact" className="text-fg underline decoration-line-strong underline-offset-4 transition hover:text-accent">{t.start}</a>.</p>
      <p className="mt-4 text-xs text-faint">Updated {updated}.</p>
    </Page>
  )
}
