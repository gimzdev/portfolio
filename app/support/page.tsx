import { SupportPage } from "@/components/pages"
import { pageMeta } from "@/lib/meta"

export const metadata = { ...pageMeta({ title: "Support the free tools", description: "Grimoire, MetaForge, Patchlab, Dropdate and Mosaïk are free, with no ads. Support pays for hosting, data and the time to keep them current.", lang: "en", en: "/support", fr: "/support" }), alternates: { canonical: "/support" } }

export default function Page() {
  return <SupportPage />
}
