<div align="center">

# Gimzdev

Portfolio site and project index.

[gimzdev.com](https://gimzdev.com) · Next.js · TypeScript · Tailwind CSS · Three.js

</div>

<table>
<tr>
<td align="center" width="50%"><img src="docs/screenshots/gimzdev-hero.png" alt="Hero"><br><sub>Hero</sub></td>
<td align="center" width="50%"><img src="docs/screenshots/gimzdev-work.png" alt="Work"><br><sub>Work</sub></td>
</tr>
<tr>
<td align="center" width="50%"><img src="docs/screenshots/gimzdev-services.png" alt="Services"><br><sub>Services</sub></td>
<td align="center" width="50%"><img src="docs/screenshots/gimzdev-about.png" alt="About"><br><sub>About</sub></td>
</tr>
</table>

## On the page

- **Work**: MetaForge, Mosaïk, Dropdate and Grimoire, with screenshots and links
- **Services**: websites, web apps, fixes and updates, with typical prices and timelines
- **About**: background, skills and a career timeline
- **Contact**: a message form, email, GitHub, X and Discord

A 3D hero, a cursor glow and light and dark themes.

## Run it

```bash
npm install
npm run dev
```

Needs Node.js 20.9 or newer. The contact form sends mail over SMTP: set `EMAIL_HOST`, `EMAIL_PORT`,
`EMAIL_USER` and `EMAIL_PASSWORD` in `.env.local`.
