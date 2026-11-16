import { notFound } from "next/navigation"
import { CaseStudy } from "@/components/pages"
import { projects, ui, workHref } from "@/lib/content"
import { clip, pageMeta } from "@/lib/meta"

export const dynamicParams = false
export const generateStaticParams = () => projects.map((p) => ({ id: p.id }))

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params, p = projects.find((x) => x.id === id)
  if (!p) return { title: ui.notFound.name }
  return pageMeta({ title: `${p.title}: ${p.tagline}, a case study`, description: clip(`${p.tagline}. ${p.highlights.join(". ")}. ${p.problem}`, 200), own: true, path: workHref(p.id) })
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!projects.some((p) => p.id === id)) notFound()
  return <CaseStudy id={id} />
}
