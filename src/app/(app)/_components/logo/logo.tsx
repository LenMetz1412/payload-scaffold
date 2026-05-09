import Link from 'next/link'

interface Props {
  href?: string
}

const Logo = ({ href }: Props) => {
  if (!href) return <span className="font-sans text-xl font-semibold tracking-tight">PageName</span>

  return (
    <Link href={href} className="font-sans text-xl font-semibold tracking-tight hover:opacity-75 transition-opacity">
      PageName
    </Link>
  )
}

export default Logo
