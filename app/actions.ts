"use server"

import nodemailer, { type Transporter } from "nodemailer"
import { headers } from "next/headers"
import { after } from "next/server"
import { TOPICS, validateContact } from "@/lib/contact"
import { site } from "@/lib/site"

export type ContactResult = { ok: true } | { ok: false; error: string }

// Five messages per hour per visitor. In memory: fine for one instance, use Redis/Upstash to share across many.
const LIMIT = 5, WINDOW = 60 * 60 * 1000, seen = new Map<string, number[]>()
let mailer: Transporter | undefined

// Email look: light, plain and readable. Table layout + inline styles so Gmail, Outlook and Apple Mail agree
const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif"
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`)
const link = (href: string, html: string) => `<a href="${esc(href)}" style="color:#8b5cf6;text-decoration:none">${html}</a>`
const title = (html: string) => `<div style="font:600 24px/1.25 ${FONT};letter-spacing:-0.4px;color:#14121b">${html}</div>`
const box = (t: string) => `<div style="background:#f5f4f8;border-radius:10px;padding:16px 18px;font:15px/1.65 ${FONT};color:#1b1926;white-space:pre-wrap;word-break:break-word">${esc(t)}</div>`
const shell = (preheader: string, body: string, footer: string) => `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light"></head>
<body style="margin:0;padding:0;background:#ffffff" bgcolor="#ffffff">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#ffffff">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="background:#ffffff"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="520" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:520px">
<tr><td style="padding:0 0 22px;font:700 17px ${FONT};letter-spacing:-0.2px;color:#8b5cf6">${esc(site.name)}</td></tr>
<tr><td style="font:15px/1.6 ${FONT};color:#1b1926">${body}</td></tr>
<tr><td style="padding:34px 0 0;font:12px/1.6 ${FONT};color:#8a869a"><div style="border-top:1px solid #ece9f2;padding:14px 0 0">${footer}</div></td></tr>
</table></td></tr></table></body></html>`

/** The real SMTP failure for the server log (code, server reply, failing step), with the password scrubbed out. */
function smtpError(error: unknown, user: string, pass: string) {
  const e = (error ?? {}) as { code?: string; responseCode?: number; response?: string; command?: string; message?: string }
  let text = [e.code, e.responseCode, e.response || e.message, e.command && `during ${e.command.split(" ").slice(0, 2).join(" ")}`].filter(Boolean).join(" · ")
  for (const secret of [pass, Buffer.from(pass).toString("base64"), Buffer.from(`\0${user}\0${pass}`).toString("base64")]) text = text.split(secret).join("[redacted]")
  return text || String(error)
}

export async function sendContact(input: unknown): Promise<ContactResult> {
  const h = await headers(), visitor = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown"
  const now = Date.now(), recent = (seen.get(visitor) ?? []).filter((t) => now - t < WINDOW)
  if (recent.length >= LIMIT) return { ok: false, error: "Too many messages. Please try again later." }
  seen.set(visitor, [...recent, now])
  if (seen.size > 10_000) for (const [k, t] of seen) if (now - t[t.length - 1] > WINDOW) seen.delete(k)

  const { data, errors } = validateContact(input)
  if (Object.keys(errors).length) return { ok: false, error: "Please check the highlighted fields." }
  if (data.trap) { console.warn("Contact form: a bot ticked the hidden checkbox; nothing was sent."); return { ok: true } } // only a bot ticks it
  const { EMAIL_HOST: host, EMAIL_PORT, EMAIL_SECURE, EMAIL_USER: user, EMAIL_PASSWORD: pass, EMAIL_FROM, EMAIL_TO } = process.env
  if (!host || !user || !pass) {
    console.error("Contact form: SMTP is not configured (EMAIL_HOST, EMAIL_USER and EMAIL_PASSWORD are missing).")
    return { ok: false, error: `The form isn't set up yet. Email me at ${site.email} instead.` }
  }
  const port = Number(EMAIL_PORT) || 587, secure = EMAIL_SECURE === "true", account = `${user} at ${host}:${port}`, from = EMAIL_FROM || site.email
  // Short timeouts: a stuck connection fails in seconds with a clear log line, instead of hanging the form
  const smtp = (mailer ??= nodemailer.createTransport({ host, port, secure, requireTLS: !secure, auth: { user, pass }, connectionTimeout: 10_000, greetingTimeout: 10_000, socketTimeout: 20_000 }))
  const { name, email, message } = data, topic = TOPICS.find((t) => t.id === data.topic)?.label
  const first = /^[\p{L}\p{M}' .-]{1,40}$/u.test(name) ? name.split(" ")[0] : "there" // never echo links or other junk to a stranger's inbox
  const when = new Date().toLocaleString("en-CA", { dateStyle: "medium", timeStyle: "short", timeZone: "America/Toronto" }), domain = site.url.replace(/^https?:\/\//, "")

  // Your copy first: the form only says "Sent" once it's on its way. Visitor addresses go in as address objects, never
  // read as a list of recipients
  try {
    await smtp.sendMail({ from: { name: `${site.name} Portfolio`, address: from }, to: EMAIL_TO || site.email, replyTo: { name, address: email }, subject: `New message from ${name}${topic ? ` · ${topic}` : ""}`,
      text: `New message from ${name} <${email}>${topic ? `\nAbout: ${topic}` : ""}\n\n${message}\n\n${when}`,
      html: shell(`${name}: ${message}`.slice(0, 110), `${title(esc(name))}
<div style="margin:4px 0 0;font:15px ${FONT}">${link(`mailto:${email}`, esc(email))}${topic ? `<span style="color:#8a869a"> &nbsp;&middot;&nbsp; ${esc(topic)}</span>` : ""}</div>
<div style="margin:22px 0 0">${box(message)}</div>
<div style="margin:22px 0 0;font:600 15px ${FONT}">${link(`mailto:${email}?subject=${encodeURIComponent(`Re: ${topic || "your message"}`)}`, "Reply &rarr;")}</div>`, `Sent from the contact form on ${esc(domain)} &middot; ${esc(when)}`) })
  } catch (error) {
    console.error(`Contact form: SMTP send failed (${account}): ${smtpError(error, user, pass)}`)
    return { ok: false, error: `Couldn't send that. Please email me at ${site.email}.` }
  }
  console.info(`Contact form: sent (${account})`)
  // The visitor's confirmation is a courtesy: it goes out after the response, only once yours did, and a bounce never fails the form
  after(() => smtp.sendMail({ from: { name: site.name, address: from }, to: { name: "", address: email }, subject: "Thanks for your message",
    text: `Hi ${first},\n\nThanks for reaching out. I've got your message and will reply as soon as I can.\n\nYour message:\n${message}\n\n${site.name}\n${site.url}`,
    html: shell("Got it. I'll reply as soon as I can.", `${title(`Thanks, ${esc(first)}.`)}
<p style="margin:10px 0 0;font:16px/1.65 ${FONT};color:#4a4658">I&rsquo;ve got your message and will reply as soon as I can.</p>
<div style="margin:26px 0 8px;font:600 12px ${FONT};color:#8a869a">Your message</div>
${box(message.length > 700 ? `${message.slice(0, 700)}…` : message)}
<p style="margin:26px 0 0;font:15px ${FONT};color:#1b1926">${esc(site.name)}<br>${link(site.url, esc(domain))}</p>`, `You&rsquo;re getting this because this address was used on the contact form at ${esc(domain)}. Reply to this email if you want to add something.`) })
    .catch((error) => console.warn(`Contact form: the confirmation to the visitor was not sent (${account}): ${smtpError(error, user, pass)}`)))
  return { ok: true }
}
