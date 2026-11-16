import { Home } from "@/components/home"
import { person } from "@/lib/content"
import { pageMeta } from "@/lib/meta"
import { site } from "@/lib/site"

// The same words as the title and the big heading ("Software developer in Montréal"): one page, one search phrase
export const metadata = pageMeta({ title: `${site.name} | ${person.headline}`, absolute: true, path: "/", description: person.description })

export default function Page() {
  return <Home />
}
