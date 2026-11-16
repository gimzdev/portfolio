// Contact form rules, shared by the browser (instant feedback) and the server action (the real check)
export const TOPICS = [{ id: "web-app", label: "Web app" }, { id: "website", label: "Website" }, { id: "fix", label: "Fix or update" }, { id: "other", label: "Something else" }] as const
// Optional: they help a quote come back fast. Nothing is required but a name, an email and a few words
export const BUDGETS = [{ id: "lt2k", label: "Under $2,000" }, { id: "2-5k", label: "$2,000 – $5,000" }, { id: "5-15k", label: "$5,000 – $15,000" }, { id: "gt15k", label: "Over $15,000" }] as const
export const TIMELINES = [{ id: "asap", label: "As soon as possible" }, { id: "month", label: "Within a month" }, { id: "quarter", label: "Within three months" }, { id: "open", label: "No date yet" }] as const
export type TopicId = (typeof TOPICS)[number]["id"]
export type ContactField = "name" | "email" | "message"
export type ContactErrors = Partial<Record<ContactField, string>>
/** A person needs longer than this to fill the form in (ms) */
export const MIN_FILL_MS = 2000

const w = { name: "Tell me your name", longName: "That name is a bit long", email: "That email doesn't look right", short: "A few more words, please (10+ characters)", long: "Please keep it under 5,000 characters" }

export function validateContact(input: unknown) {
  const s = (input && typeof input === "object" ? input : {}) as Record<string, unknown>
  const t = (k: string) => (typeof s[k] === "string" ? (s[k] as string).trim() : "")
  const topic: TopicId | "" = TOPICS.find((x) => x.id === t("topic"))?.id ?? ""
  const budget = BUDGETS.find((x) => x.id === t("budget"))?.id ?? "", timeline = TIMELINES.find((x) => x.id === t("timeline"))?.id ?? ""
  // The name goes into email headers, so it stays on one line. Two traps, no third party: "trap" is a hidden checkbox
  // honeypot (autofill never ticks it), and "elapsed" is how long the form was open, in ms (a script fills it in at once)
  const elapsed = Number(t("elapsed"))
  const data = { name: t("name").replace(/\s+/g, " "), email: t("email"), message: t("message"), trap: t("trap"), elapsed: Number.isFinite(elapsed) ? elapsed : 0, topic, budget, timeline } as const
  const errors: ContactErrors = {}
  if (data.name.length < 2) errors.name = w.name
  else if (data.name.length > 100) errors.name = w.longName
  if (data.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = w.email
  if (data.message.length < 10) errors.message = w.short
  else if (data.message.length > 5000) errors.message = w.long
  return { data, errors }
}
