import Image from 'next/image'

// Shared types and UI — no server-only imports here
export interface InstagramPost {
  id: string
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  media_url: string
  thumbnail_url?: string
  permalink: string
  caption?: string
  timestamp: string
}

export const PostCard = ({ post }: { post: InstagramPost }) => {
  const src =
    post.media_type === 'VIDEO' ? (post.thumbnail_url ?? post.media_url) : post.media_url

  return (
    <a
      href={post.permalink}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block aspect-square w-full overflow-hidden bg-gray-100"
    >
      <Image
        src={src}
        alt={post.caption ?? 'Instagram post'}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      {post.media_type === 'VIDEO' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 translate-x-0.5">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}
      {post.media_type === 'CAROUSEL_ALBUM' && (
        <div className="absolute right-2 top-2">
          <svg viewBox="0 0 24 24" fill="white" className="h-5 w-5 drop-shadow">
            <path d="M2 6h2v14h14v2H2V6zm4-4h16v16H6V2zm2 2v12h12V4H8z" />
          </svg>
        </div>
      )}
    </a>
  )
}
