<div align="center">

<h1>Gimzdev</h1>

<h3>Personal site and project hub</h3>

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org)

<hr>

<h2>About</h2>

<p>gimzdev.com is a one-page portfolio.<br>
It shows the projects, the freelance services on offer,<br>
the background behind them, and a contact form.</p>

<p>The hero has a 3D scene. The header has a cursor glow switch<br>
and a light and dark theme toggle.</p>

<table align="center">
<tr>
<td align="center" width="50%">

<h3>Work</h3>

MetaForge, Mosaïk,<br>
Dropdate, Grimoire<br>
Screenshot carousels<br>
Live and source links

</td>
<td align="center" width="50%">

<h3>Services</h3>

Websites, web apps,<br>
fixes and updates<br>
Typical prices and timelines

</td>
</tr>
<tr>
<td align="center" width="50%">

<h3>About</h3>

Background and skills<br>
by area<br>
Career timeline

</td>
<td align="center" width="50%">

<h3>Contact</h3>

Message form and email<br>
GitHub, X and Discord

</td>
</tr>
</table>

<hr>

<h2>Screenshots</h2>

<table align="center">
<tr>
<td align="center" width="50%">

<img src="docs/screenshots/gimzdev-hero.png" alt="Hero" width="100%">

<sub>Hero</sub>

</td>
<td align="center" width="50%">

<img src="docs/screenshots/gimzdev-work.png" alt="Work" width="100%">

<sub>Work</sub>

</td>
</tr>
<tr>
<td align="center" width="50%">

<img src="docs/screenshots/gimzdev-services.png" alt="Services" width="100%">

<sub>Services</sub>

</td>
<td align="center" width="50%">

<img src="docs/screenshots/gimzdev-about.png" alt="About" width="100%">

<sub>About</sub>

</td>
</tr>
</table>

<hr>


<h2>Stack</h2>

<table align="center">
<tr>
<td align="center" width="33%">

<h3>Framework</h3>

Next.js<br>
App Router<br>
TypeScript

</td>
<td align="center" width="33%">

<h3>Visuals</h3>

Tailwind CSS<br>
Three.js<br>
postprocessing<br>
Geist

</td>
<td align="center" width="33%">

<h3>Contact form</h3>

Nodemailer<br>
Any SMTP server

</td>
</tr>
</table>

<hr>

<h2>Setup</h2>

<p>Needs Node.js 20.9 or newer.</p>

```bash
git clone https://github.com/gimzdev/portfolio.git
cd portfolio

npm install
npm run dev
```

<hr>

<h2>Contact form</h2>

<p>The form sends mail over SMTP. Add your server to <code>.env.local</code>:</p>

```bash
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=you@example.com
EMAIL_PASSWORD=your-password

# optional
# EMAIL_FROM=
# EMAIL_TO=
```

<hr>

[![Live](https://img.shields.io/badge/Live-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://gimzdev.com)

</div>
