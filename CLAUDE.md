# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

WDC 2026 Platform - World Design Capital 2026 Frankfurt Rhine Main. A Next.js 15 + Payload CMS 3 application with MongoDB backend. Multi-language (German default, English), event management, location mapping, and complex filtering.

## Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm devsafe          # Clean .next cache and restart
pnpm dev:local        # Docker + dev (requires screen & Docker)

# Build & Production
pnpm build            # Build Next.js
pnpm start            # Start production server

# Type Generation (run after schema changes)
pnpm generate:types   # Generate TypeScript types from collections
pnpm generate:importmap

# Code Quality (Biome)
pnpm lint             # Biome check (lint + format + imports)
pnpm lint:fix         # Auto-fix Biome issues
pnpm format           # Biome format
pnpm lint:next        # Next.js-specific lint rules

# Database
pnpm db:indexes:create   # Create MongoDB indexes
pnpm db:indexes:verify   # Verify index creation
pnpm payloadcms:db:sync  # Sync production DB to local (requires .env.local)

# Cache Debugging
pnpm cache:inspect    # Inspect runtime cache state
pnpm cache:size       # Measure cache size
pnpm cache:clear      # Clear fetch cache
```

**Prerequisites**: `brew install poppler` (for PDF preview thumbnails)

## Critical Patterns

### Universal Timezone

All dates use `Europe/Berlin` timezone (Frankfurt). Never use local time or UTC directly for display.

```typescript
import { formatUniversalDate, isUniversalToday, parseUniversalDate } from '@/utils/date'

// Parse dates to timezone-aware TZDate
const tzDate = parseUniversalDate(isoString)

// Format with locale
formatUniversalDate(date, 'PPP', 'de') // "23. Januar 2026"

// Check if today in universal TZ
isUniversalToday(date)

// Get day boundaries (returns UTC for database queries)
getStartOfDayISO(date) // "2026-01-23T00:00:00.000Z"
getEndOfDayISO(date) // "2026-01-23T23:59:59.999Z"
```

**Date Precision**: Events can have varying precision (`time`, `day`, `month`, `trimester`, `year`). Use `getDayPrecision()`, `getMonthPrecision()`, etc. for display logic.

### Relation Validation

Always validate populated relations before accessing properties:

```typescript
import { filterPopulatedRelations, getRelationId, isRelationPopulated } from '@/utils/sanitize'

// Type guard for populated relation
if (isRelationPopulated(doc.location)) {
  console.log(doc.location.title) // Safe access
}

// Filter array to only populated relations
const populatedLocations = filterPopulatedRelations(doc.locations)

// Extract ID from relation (handles both string IDs and populated objects)
const locationId = getRelationId(doc.location)
```

## Architecture

### Directory Structure

```
/src
├── /app
│   ├── /(app)                    # Next.js frontend
│   │   ├── /[locale]             # Locale-based routing (de/en)
│   │   ├── /_components          # Frontend components
│   │   └── /_hooks               # Custom React hooks
│   │
│   └── /(payload)                # Payload CMS admin
│       ├── /api                  # API routes
│       ├── /_collections         # Collection configs
│       ├── /_globals             # Global configs (AppSettings, Footer)
│       ├── /_blocks              # Reusable content blocks
│       └── /_fields              # Custom field components
│
├── /config
│   ├── /collections             # Collection slugs, labels, permissions
│   ├── /permissions             # RBAC configs
│   └── /locales                 # i18n configuration
│
├── /utils
│   ├── /cache                   # Runtime cache system (critical)
│   ├── /local-api               # Server-side Payload API wrappers
│   ├── /rest                    # REST API utilities
│   └── /i18n                    # Localization utilities
│
└── /components                  # Shared React components
    └── /ui                      # shadcn/ui components
```

### Key Collections

- **Pages, Events, Locations, Cities, Frames, Constellations** - Main content
- **Media** - Images (md/lg/xl as webp)
- **EventTypes, FieldsOfAction, ProgramTrack, Tags** - Taxonomy
- **Users** - CMS users with roles: superAdmin, admin, editor, api

### Runtime Cache System

Located at `src/utils/cache/`. **Use this instead of `unstable_cache`** which has a 2MB limitation causing reliability issues in production.

```typescript
import { createCachedFunction } from '@/utils/cache/cache-wrapper'
import { runtimeCache } from '@/utils/cache/store'

// Wrap expensive queries
const cachedQuery = createCachedFunction(expensiveFn, {
  key: 'myKey',
  tags: ['events'], // For tag-based invalidation
})

// Invalidate by tag (e.g., after CMS edits)
runtimeCache.invalidateTag('events')
```

**Related Document Invalidation** (`src/utils/cache/invalidation.ts`): When events/frames/constellations change, related documents are automatically invalidated via hooks.

TTL: 10 mins (dev), 30 mins (prod). Includes 30s deduplication cooldown.

### Event Context Filter System

Located at `src/utils/events-aggregation/`. All Events, Frames, and Constellations are normalized to `EventContextDoc` for unified filtering.

```typescript
import { getEventContextFilteredDocs } from '@/utils/events-aggregation/query'

const { docs, totalDocs, page } = await getEventContextFilteredDocs({
  locale: 'de',
  collections: [CollectionSlugs.Events, CollectionSlugs.Frames],
  fieldsOfAction: ['design'],
  year: '2026',
  startDate: '2026-01-01',
  endDate: '2026-12-31',
  perimeter: { centerLat: 50.11, centerLng: 8.68, radius: 50 }, // km
  datePrecisions: ['day', 'time'], // Filter by date precision
  page: 1,
  limit: 20,
})
```

Uses in-memory filtering after initial cache load for performance.

### Data Fetching Patterns

**Server-side (use Local API - no network overhead):**

```typescript
import { queryDocument } from '@/utils/local-api/document'
import { queryDocuments } from '@/utils/local-api/documents'

const docs = await queryDocuments<DocType>({ collection, locale, limit })
const doc = await queryDocument<DocType>({ collection, slug, locale })
```

**Client-side:**

```typescript
import useSWR from 'swr'

import { swrCmsDataFetcher } from '@/utils/rest/fetcher'

const { data } = useSWR('/api/endpoint', swrCmsDataFetcher)
```

### RBAC - All Collections Must Include

```typescript
admin: {
  hidden: ({ user }) => !getCollectionAdminUiVisibility(collectionSlug, user),
},
access: getCollectionAccessControl(collectionSlug),
```

Permissions defined in:

- `src/config/permissions/collections.ts`
- `src/config/permissions/fields.ts`

### i18n

Locales: `['de', 'en']` with German as default. Configured in `src/config/locales.ts`.

Key utilities in `src/utils/i18n/`:

- `getLocalizedPath()` - Generate locale-aware URLs
- `getCollectionLocalizedLabels()` - Translated collection names
- `getCollectionByLocalizedSlug()` - Map slug back to collection

### Map Components

Located at `src/app/(app)/_components/map/`. Uses MobX for state management (not React Context).

```typescript
import { useMapStore } from '@/app/(app)/_components/map/store'

const mapStore = useMapStore()
mapStore.setCenter({ lat: 50.11, lng: 8.68 })
mapStore.setPointsOfInterest(locations)
mapStore.setUserLocation(coords)
```

Default center: Frankfurt (50.11055, 8.68228). Map style: `/styles/wdc2026-light/style.json`.

### Metadata

Use `getPageMeta()` from `src/utils/get-page-meta.ts` to generate Next.js metadata. Falls back to global `AppSettings` meta if document-specific meta is missing.

### Block System

Content blocks in `src/app/(payload)/_blocks/`. Common interface:

```typescript
interface BlockComponentBaseProps {
  searchParams?: AppPageParams
  locale: Locale
  docRef?: EventContextDocRef // Parent document reference for filtering
}
```

Key blocks: ProgramListBlock, LocationBlock, UpcomingEventsBlock (filter events), HeroBlock, ContentBlock, MediaBlock.

## Deployment

Deployed via **GitLab CI** (main branch) to Hetzner Cloud (Ubuntu 24.04 LTS).

### Infrastructure

- **Server**: Hetzner Cloud, Ubuntu 24.04.2 LTS
- **Containerization**: Docker & Docker Compose
- **Reverse Proxy**: Caddy (automatic HTTPS)
- **Registry**: `hub.meso.net/wdc26/wdc-2026-org/main_online_app`

### Production Containers

```
app       - Next.js application (127.0.0.1:3000)
db-mongo  - MongoDB 8 (27017)
```

### Domains

- **Production**: `wdc2026.org` (with `www` redirect)
- **API**: `api.wdc2026.org`
- **Analytics**: `plausible.wdc2026.org`
- **Staging**: `wdc2026.meso.design` (proxied, Authelia protected)

### URL Redirects

Legacy URL redirects are configured in Caddy (`/etc/caddy/Caddyfile`). When renaming routes or collections, add redirects there to preserve old URLs.

### MongoDB Connection Settings

Optimized for same-server Docker deployment in `src/payload.config.ts`:

| Setting                    | Value | Purpose                                                |
| -------------------------- | ----- | ------------------------------------------------------ |
| `maxPoolSize`              | 50    | Max concurrent connections (increase for high traffic) |
| `minPoolSize`              | 10    | Warm connections to reduce cold start latency          |
| `maxIdleTimeMS`            | 60000 | Close unused connections after 60s                     |
| `socketTimeoutMS`          | 45000 | Timeout for socket operations                          |
| `serverSelectionTimeoutMS` | 30000 | Timeout for server selection                           |
| `heartbeatFrequencyMS`     | 10000 | Health check interval                                  |
| `retryWrites`              | true  | Auto-retry failed writes                               |

**Intentionally omitted:**

- `compressors` (zlib/snappy) - Adds CPU overhead without benefit when MongoDB runs on the same server. Network compression only helps for remote/cloud database connections.
- `readPreference` - Only useful with replica sets, not single MongoDB instance.
- `w: 'majority'` - Only meaningful with replica sets; equivalent to `w: 1` on single node but with overhead.

## Conventions

- **GitFlow** branching: main (production), development (staging), feature/\*
- **Conventional Commits** format
- **pnpm** package manager (required)
- Environment variables validated at runtime via `@t3-oss/env-nextjs` + Zod
- Import env via `import { env } from '@env'`

## Creating New Collections

1. Add slug to `CollectionSlugs` in `src/config/collections/index.ts`
2. Add label to `collectionLabels` and translations to `localizedCollectionsSlugs`
3. Add permissions in `src/config/permissions/collections.ts`
4. Create collection config in `src/app/(payload)/_collections/`
5. Import and add to `src/payload.config.ts` collections array
6. Run `pnpm generate:types`
7. Create document template in `src/app/(app)/_components/doc-templates/collections/`
