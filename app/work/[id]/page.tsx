import { notFound } from "next/navigation"
import { CaseStudy } from "@/components/pages"
import { projects } from "@/lib/content"
import { pageMeta } from "@/lib/meta"

export const dynamicParams = false
export const generateStaticParams = () => projects.map((p) => ({ id: p.id }))

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params, p = projects.find((x) => x.id === id)
  if (!p) return {}
  return pageMeta({ title: `${p.title}: ${p.en.tagline}, a case study`, description: `${p.en.problem} ${p.en.description}`.slice(0, 300), lang: "en", en: `/work/${p.id}`, fr: `/fr/work/${p.id}` })
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!projects.some((p) => p.id === id)) notFound()
  return <CaseStudy id={id} lang="en" />
}
