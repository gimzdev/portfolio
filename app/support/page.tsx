import { SupportPage } from "@/components/pages"
import { support } from "@/lib/content"
import { pageMeta } from "@/lib/meta"

export const metadata = pageMeta({ ...support.meta, path: "/support" })

export default function Page() {
  return <SupportPage />
}
