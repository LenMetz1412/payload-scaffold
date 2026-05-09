import canUseDOM from './can-use-dom'

export const getServerSideURL = () => {
  const url = process.env.NEXT_PUBLIC_SERVER_URL

  if (!url && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }

  return url ?? 'http://localhost:3000'
}

export const getClientSideURL = () => {
  if (canUseDOM) {
    const protocol = window.location.protocol
    const domain = window.location.hostname
    const port = window.location.port

    return `${protocol}//${domain}${port ? `:${port}` : ''}`
  } else {
    return getServerSideURL()
  }
}

export const getAppUrl = (path?: string) => {
  return `${getClientSideURL()}${path}`
}

export const getMediaSrc = (resource?: { url?: string | null; filename?: string | null }) => {
  if (!resource) return undefined
  if (resource.url) return resource.url
  if (resource.filename) return `/media/${resource.filename}`
  return undefined
}
