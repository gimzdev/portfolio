import { notFound } from "next/navigation"
import { OfferPage } from "@/components/pages"
import { offerHref, offers, ui } from "@/lib/content"
import { pageMeta } from "@/lib/meta"

export const dynamicParams = false
export const generateStaticParams = () => offers.map((o) => ({ slug: o.slug }))
const find = (slug: string) => offers.find((o) => o.slug === slug)

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const o = find((await params).slug)
  if (!o) return { title: ui.notFound.name }
  return pageMeta({ title: o.search, description: `${o.title}: ${o.blurb} ${o.from ? "From " : ""}${o.price} USD, ${o.duration.toLowerCase()}.`, path: offerHref(o) })
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const o = find((await params).slug)
  if (!o) notFound()
  return <OfferPage id={o.id} />
}
