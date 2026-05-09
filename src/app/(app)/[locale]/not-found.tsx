import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="-mt-20 flex h-screen flex-col items-center justify-center">
      <h2 className="font-sans text-7xl lg:text-8xl">404</h2>
      <h2 className="font-sans text-4xl lg:text-5xl">NOT FOUND</h2>
      <Link href="/" className="font-sans text-lgf">
        Return Home
      </Link>
    </div>
  )
}
