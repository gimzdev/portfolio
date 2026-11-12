// Contact form rules, shared by the browser (instant feedback) and the server action (the real check)
export const TOPICS = [{ id: "web-app", en: "Web app", fr: "Application web" }, { id: "website", en: "Website", fr: "Site web" }, { id: "fix", en: "Fix or update", fr: "Correction ou mise à jour" }, { id: "other", en: "Something else", fr: "Autre chose" }] as const
// Optional: they help a quote come back fast. Nothing is required but a name, an email and a few words
export const BUDGETS = [{ id: "lt2k", en: "Under $2,000", fr: "Moins de 2 000 $" }, { id: "2-5k", en: "$2,000 – $5,000", fr: "2 000 $ – 5 000 $" }, { id: "5-15k", en: "$5,000 – $15,000", fr: "5 000 $ – 15 000 $" }, { id: "gt15k", en: "Over $15,000", fr: "Plus de 15 000 $" }] as const
export const TIMELINES = [{ id: "asap", en: "As soon as possible", fr: "Dès que possible" }, { id: "month", en: "Within a month", fr: "D’ici un mois" }, { id: "quarter", en: "Within three months", fr: "D’ici trois mois" }, { id: "open", en: "No date yet", fr: "Pas encore de date" }] as const
export type TopicId = (typeof TOPICS)[number]["id"]
export type ContactField = "name" | "email" | "message"
export type ContactErrors = Partial<Record<ContactField, string>>

const WORDS = {
  en: { name: "Tell me your name", longName: "That name is a bit long", email: "That email doesn't look right", short: "A few more words, please (10+ characters)", long: "Please keep it under 5,000 characters" },
  fr: { name: "Votre nom, s’il vous plaît", longName: "Ce nom est un peu long", email: "Ce courriel ne semble pas valide", short: "Quelques mots de plus, s’il vous plaît (10 caractères et plus)", long: "Moins de 5 000 caractères, s’il vous plaît" },
}

export function validateContact(input: unknown) {
  const s = (input && typeof input === "object" ? input : {}) as Record<string, unknown>
  const t = (k: string) => (typeof s[k] === "string" ? (s[k] as string).trim() : "")
  const lang = t("lang") === "fr" ? "fr" : "en", w = WORDS[lang]
  const topic: TopicId | "" = TOPICS.find((x) => x.id === t("topic"))?.id ?? ""
  const budget = BUDGETS.find((x) => x.id === t("budget"))?.id ?? "", timeline = TIMELINES.find((x) => x.id === t("timeline"))?.id ?? ""
  // The name goes into email headers, so it stays on one line. "trap" is a hidden checkbox honeypot (autofill never ticks it)
  const data = { name: t("name").replace(/\s+/g, " "), email: t("email"), message: t("message"), trap: t("trap"), topic, budget, timeline, lang }
  const errors: ContactErrors = {}
  if (data.name.length < 2) errors.name = w.name
  else if (data.name.length > 100) errors.name = w.longName
  if (data.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = w.email
  if (data.message.length < 10) errors.message = w.short
  else if (data.message.length > 5000) errors.message = w.long
  return { data, errors }
}
