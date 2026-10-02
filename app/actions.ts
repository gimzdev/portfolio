"use server"

import nodemailer, { type Transporter } from "nodemailer"
import { headers } from "next/headers"
import { TOPICS, validateContact } from "@/lib/contact"
import { site } from "@/lib/site"

export type ContactResult = { ok: true } | { ok: false; error: string }

// Five messages per hour per visitor. In memory: fine for one instance, use Redis/Upstash to share across many.
const LIMIT = 5
const WINDOW = 60 * 60 * 1000
const seen = new Map<string, number[]>()
let mailer: Transporter | undefined

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`)
const shell = (body: string) => `<div style="font-family:-apple-system,Segoe UI,sans-serif;max-width:560px;margin:0 auto;color:#111">${body}</div>`

/** The real SMTP failure for the server log (code, server reply, failing step), with the password scrubbed out. */
function smtpError(error: unknown, user: string, pass: string) {
  const e = (error ?? {}) as { code?: string; responseCode?: number; response?: string; command?: string; message?: string }
  let text = [e.code, e.responseCode, e.response || e.message, e.command && `during ${e.command.split(" ").slice(0, 2).join(" ")}`].filter(Boolean).join(" · ")
  for (const secret of [pass, Buffer.from(pass).toString("base64"), Buffer.from(`\0${user}\0${pass}`).toString("base64")]) text = text.split(secret).join("[redacted]")
  return text || String(error)
}

export async function sendContact(input: unknown): Promise<ContactResult> {
  const h = await headers()
  const visitor = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown"
  const now = Date.now()
  const recent = (seen.get(visitor) ?? []).filter((t) => now - t < WINDOW)
  if (recent.length >= LIMIT) return { ok: false, error: "Too many messages. Please try again later." }
  seen.set(visitor, [...recent, now])
  if (seen.size > 10_000) for (const [k, t] of seen) if (now - t[t.length - 1] > WINDOW) seen.delete(k)

  const { data, errors } = validateContact(input)
  if (Object.keys(errors).length) return { ok: false, error: "Please check the highlighted fields." }
  if (data.website) return { ok: true } // honeypot filled by a bot: pretend it worked, send nothing

  const { EMAIL_HOST: host, EMAIL_PORT, EMAIL_SECURE, EMAIL_USER: user, EMAIL_PASSWORD: pass } = process.env
  if (!host || !user || !pass) {
    console.error("Contact form: SMTP is not configured (EMAIL_HOST, EMAIL_USER and EMAIL_PASSWORD are missing).")
    return { ok: false, error: `The form isn't set up yet. Email me at ${site.email} instead.` }
  }
  const port = Number(EMAIL_PORT || 587)
  const secure = EMAIL_SECURE === "true"
  const from = process.env.EMAIL_FROM || site.email
  // Short timeouts: a stuck connection fails in seconds with a clear log line, instead of hanging the form
  mailer ??= nodemailer.createTransport({ host, port, secure, requireTLS: !secure, auth: { user, pass }, connectionTimeout: 10_000, greetingTimeout: 10_000, socketTimeout: 20_000 })

  const { name, email, message } = data
  const topic = TOPICS.find((t) => t.id === data.topic)?.label
  const hi = /^[\p{L}\p{M}' .-]{1,40}$/u.test(name) ? name : "there" // never echo links or other junk to a stranger's inbox
  const reply = "Thanks for reaching out. I've got your message and will reply as soon as I can."
  // Your copy is what counts; the visitor's confirmation is a courtesy and must not fail the form if it bounces
  const [notice, receipt] = await Promise.allSettled([
    mailer.sendMail({
      from: `"${site.name} Portfolio" <${from}>`,
      to: process.env.EMAIL_TO || site.email,
      replyTo: email,
      subject: `New message from ${name}${topic ? ` · ${topic}` : ""}`,
      text: `Name: ${name}\nEmail: ${email}${topic ? `\nAbout: ${topic}` : ""}\n\n${message}`,
      html: shell(`<h2>New message</h2><p><b>${esc(name)}</b> &lt;${esc(email)}&gt;${topic ? `<br>About: ${esc(topic)}` : ""}</p><p style="white-space:pre-line;background:#f5f5f5;padding:14px;border-radius:8px">${esc(message)}</p>`),
    }),
    mailer.sendMail({
      from: `"${site.name}" <${from}>`,
      to: email,
      subject: "Thanks for your message",
      text: `Hi ${hi},\n\n${reply}\n\n${site.name}`,
      html: shell(`<p>Hi ${esc(hi)},</p><p>${reply}</p><p style="color:#666">${site.name}</p>`),
    }),
  ])
  const account = `${user} at ${host}:${port}`
  if (receipt.status === "rejected" && notice.status === "fulfilled") console.warn(`Contact form: the confirmation to the visitor was not sent (${account}): ${smtpError(receipt.reason, user, pass)}`)
  if (notice.status === "rejected") {
    console.error(`Contact form: SMTP send failed (${account}): ${smtpError(notice.reason, user, pass)}`)
    return { ok: false, error: `Couldn't send that. Please email me at ${site.email}.` }
  }
  return { ok: true }
}
