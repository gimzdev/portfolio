import { notFound } from "next/navigation"
import { OfferPage } from "@/components/pages"
import { offers } from "@/lib/content"
import { pageMeta } from "@/lib/meta"

export const dynamicParams = false
export const generateStaticParams = () => offers.map((o) => ({ slug: o.en.slug }))
const find = (slug: string) => offers.find((o) => o.en.slug === slug)

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const o = find((await params).slug)
  if (!o) return {}
  return pageMeta({ title: o.en.search, description: `${o.en.title}: ${o.en.blurb} From ${o.price}, ${o.en.duration.toLowerCase()}.`, lang: "en", en: `/services/${o.en.slug}`, fr: `/fr/services/${o.fr.slug}` })
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const o = find((await params).slug)
  if (!o) notFound()
  return <OfferPage id={o.id} lang="en" />
}
