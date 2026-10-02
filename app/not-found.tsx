import Link from "next/link"

export default function NotFound() {
  return (
    <section className="wrap grid min-h-[80svh] place-content-center gap-6 py-32">
      <p className="label">404</p>
      <h1 className="display text-5xl md:text-7xl">Nothing here.</h1>
      <p className="max-w-md text-lg text-muted">That page doesn&rsquo;t exist, or it moved.</p>
      <div><Link href="/" className="btn btn-lg btn-primary">Back home</Link></div>
    </section>
  )
}
