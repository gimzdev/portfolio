// Contact form rules, shared by the browser (instant feedback) and the server action (the real check)
export const TOPICS = [{ id: "website", label: "Website" }, { id: "web-app", label: "Web app" }, { id: "fix", label: "Fix or update" }, { id: "other", label: "Something else" }] as const
export type TopicId = (typeof TOPICS)[number]["id"]
export type ContactField = "name" | "email" | "message"
export type ContactErrors = Partial<Record<ContactField, string>>

export function validateContact(input: unknown) {
  const s = (input && typeof input === "object" ? input : {}) as Record<string, unknown>
  const t = (k: string) => (typeof s[k] === "string" ? (s[k] as string).trim() : "")
  const topic: TopicId | "" = TOPICS.find((x) => x.id === t("topic"))?.id ?? ""
  // The name goes into email headers, so it stays on one line. "trap" is a hidden checkbox honeypot (autofill never ticks it)
  const data = { name: t("name").replace(/\s+/g, " "), email: t("email"), message: t("message"), trap: t("trap"), topic }
  const errors: ContactErrors = {}
  if (data.name.length < 2) errors.name = "Tell me your name"
  else if (data.name.length > 100) errors.name = "That name is a bit long"
  if (data.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = "That email doesn't look right"
  if (data.message.length < 10) errors.message = "A few more words, please (10+ characters)"
  else if (data.message.length > 5000) errors.message = "Please keep it under 5,000 characters"
  return { data, errors }
}
