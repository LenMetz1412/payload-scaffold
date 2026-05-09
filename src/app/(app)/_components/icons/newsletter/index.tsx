export function NewsletterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="21" height="17" x="1.5" y="3.5" rx="2" ry="2" />
      <path d="m22 6-10 7L2 6" />
      <path d="m2 18 6-5" />
      <path d="m22 18-6-5" />
    </svg>
  )
}
