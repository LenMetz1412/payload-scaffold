# Payload Scaffold

A Next.js 15 + Payload CMS 3 scaffold with MongoDB, multi-locale support, and a full content management setup ready to extend.

## Stack

- **Next.js 15** (App Router, standalone output)
- **Payload CMS 3** (MongoDB adapter)
- **Tailwind CSS v4**
- **TypeScript**
- **Biome** (lint + format)
- **pnpm**

## Getting started

```bash
# 1. Copy env file and fill in your values
cp .env.example .env.local

# 2. Start MongoDB
docker compose up

# 3. Install dependencies
pnpm i

# 4. Start the dev server
pnpm dev
```

- App: <http://localhost:3000>
- Admin: <http://localhost:3000/admin>

## Commands

```bash
pnpm dev                  # Start dev server
pnpm devsafe              # Clear .next cache and start dev server
pnpm build                # Build for production
pnpm start                # Start production server

pnpm generate:types       # Regenerate TypeScript types after schema changes
pnpm generate:importmap   # Regenerate Payload import map

pnpm lint                 # Biome check (lint + format + imports)
pnpm lint:fix             # Auto-fix Biome issues

pnpm payloadcms:db:backup   # Dump production DB to db.backups/
pnpm payloadcms:db:restore  # Restore latest backup into local Docker container
pnpm payloadcms:db:sync     # backup + restore in one step
pnpm payloadcms:media:sync  # Rsync production media to local
```

## Environment variables

All variables are validated at startup via `@t3-oss/env-nextjs` + Zod. The schema is defined in `env.mjs`. Missing or malformed variables throw at boot time.

| Variable | Description |
| --- | --- |
| `PAYLOAD_DATABASE_URI` | MongoDB connection string |
| `PAYLOAD_SECRET` | Payload encryption secret |
| `PAYLOAD_PUBLIC_ASSETS_PATH` | Path for uploaded assets |
| `NEXT_PUBLIC_SERVER_URL` | Public URL of the app |
| `PREVIEW_SECRET` | Secret for live preview |
| `PAYLOAD_MAILER_FROM` | Sender email address |
| `PAYLOAD_MAILER_NAME` | Sender display name |
| `NODE_MAILER_SMTP_*` | SMTP credentials |
| `NEXT_PUBLIC_META_*` | Default OG/meta fallback values |

## Project structure

```text
src/
├── app/
│   ├── (app)/              # Next.js frontend
│   │   ├── [locale]/       # Locale-based routing (de/en)
│   │   ├── _components/    # Frontend components
│   │   └── _styles/        # Global CSS, fonts, theme
│   └── (payload)/          # Payload CMS admin
│       ├── _blocks/        # Content blocks
│       ├── _collections/   # Collection configs
│       ├── _fields/        # Shared field configs
│       ├── _globals/       # Global configs (AppSettings, Footer)
│       └── _utils/         # CMS utilities (RBAC, hooks, meta)
├── components/             # Shared React components
├── config/                 # Collections, locales, breakpoints, permissions
└── utils/                  # App utilities (cache, i18n, search, sanitize)
```

## Collections

| Slug | Description |
| --- | --- |
| `pages` | Main content pages with layout blocks |
| `media` | Image uploads (md/lg/xl/og as webp) |
| `downloads` | File uploads for the DownloadBlock |
| `users` | CMS users with role-based access |

## Adding a collection

1. Add the slug to `CollectionSlugs` in `src/config/collections/index.ts`
2. Add labels to `collectionLabels`
3. Add permissions in `src/config/permissions/collections.ts`
4. Create the collection config in `src/app/(payload)/_collections/`
5. Import and register it in `src/payload.config.ts`
6. Run `pnpm generate:types`
7. Create a document template in `src/app/(app)/_components/doc-templates/collections/`

### Collection config example

```ts
import { CollectionSlugs } from '@/config/collections'
import { getBaseDocumentFields } from '@/payload/fields/base-document'
import {
  getCollectionAdminConfig,
  getCollectionConfig,
  livePreviewVersions,
} from '@/payload/utils/collection-config'
import { createRevalidateDocHook } from '@/payload/utils/revalidate'

export const Articles: CollectionConfig = {
  ...getCollectionConfig(CollectionSlugs.Articles),
  versions: livePreviewVersions,
  admin: getCollectionAdminConfig(CollectionSlugs.Articles, {
    preview: true,
    livePreview: true,
    group: AdminPanelsGroups.Main,
  }),
  hooks: {
    afterChange: [createRevalidateDocHook(CollectionSlugs.Articles)],
  },
  fields: [
    ...getBaseDocumentFields(CollectionSlugs.Articles),
    // your fields here
  ],
}
```

### Document template example

```tsx
// src/app/(app)/_components/doc-templates/collections/article.tsx
import type { Article } from '@/payload-types'
import type { DocTemplateProps } from '../common'

const ArticleTemplate = ({ doc }: DocTemplateProps) => {
  const { title } = doc as Article
  return <article><h1>{title}</h1></article>
}

export default ArticleTemplate
```

Then register it in `src/app/(app)/_components/doc-templates/index.tsx`.

## RBAC

Four roles: `superAdmin`, `admin`, `editor`, `api`.

All collections must include:

```ts
admin: {
  hidden: ({ user }) => !getCollectionAdminUiVisibility(collectionSlug, user),
},
access: getCollectionAccessControl(collectionSlug),
```

Permissions are defined in `src/config/permissions/collections.ts`.

## i18n

Locales are defined in `src/config/locales.ts`. Default locale is `de`. Slugs are localized — Payload's locale fallback is intentionally disabled to keep routes canonical.

Key utilities in `src/utils/i18n/`:

- `getLocalizedPath()` — generate locale-aware URLs
- `getCollectionByLocalizedSlug()` — map a URL slug back to a collection

## Metadata

Each page can define its own SEO metadata. Missing values fall back to the `AppSettings` global. Use `getPageMeta()` from `src/utils/get-page-meta.ts` to generate Next.js metadata objects.

## Runtime cache

Located at `src/utils/cache/`. Replaces `unstable_cache` (which has a 2MB limit).

```ts
import { createCachedFunction } from '@/utils/cache/cache-wrapper'

const cachedQuery = createCachedFunction(myFn, { key: 'myKey', tags: ['pages'] })
```

Invalidate by tag after CMS changes via `runtimeCache.invalidateTag('pages')`.

## Deployment

Production is containerised via Docker. The `compose-gitlab-ci/` directory contains the compose files used in CI/CD. The app container serves on `127.0.0.1:3000` behind a reverse proxy (e.g. Caddy).

```bash
# Build image (from CI or locally)
docker build -t my-app .

# Run with compose
docker compose -f compose-gitlab-ci/compose-app.yaml up
```
