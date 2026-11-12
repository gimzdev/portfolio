import { Home } from "@/components/home"
import { person } from "@/lib/content"
import { pageMeta } from "@/lib/meta"
import { site } from "@/lib/site"

export const metadata = pageMeta({
  title: `${site.name} | ${person.fr.headline}`, absolute: true, lang: "fr", en: "/", fr: "/fr",
  description: `${person.fr.headline} : applications web, outils et jeux. Disponible pour de nouveaux projets.`,
})

export default function Page() {
  return <div lang="fr-CA"><Home lang="fr" /></div>
}
