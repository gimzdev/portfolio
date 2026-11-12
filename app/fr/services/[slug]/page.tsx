import { notFound } from "next/navigation"
import { OfferPage } from "@/components/pages"
import { offers } from "@/lib/content"
import { pageMeta } from "@/lib/meta"

export const dynamicParams = false
export const generateStaticParams = () => offers.map((o) => ({ slug: o.fr.slug }))
const find = (slug: string) => offers.find((o) => o.fr.slug === slug)

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const o = find((await params).slug)
  if (!o) return {}
  return pageMeta({ title: o.fr.search, description: `${o.fr.title} : ${o.fr.blurb} À partir de ${o.price}, ${o.fr.duration.toLowerCase()}.`, lang: "fr", en: `/services/${o.en.slug}`, fr: `/fr/services/${o.fr.slug}` })
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const o = find((await params).slug)
  if (!o) notFound()
  return <div lang="fr-CA"><OfferPage id={o.id} lang="fr" /></div>
}
