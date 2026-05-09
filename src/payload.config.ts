// storage-adapter-import-placeholder

import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { env } from '@env'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { de } from '@payloadcms/translations/languages/de'
import { en } from '@payloadcms/translations/languages/en'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { defaultLocale, locales } from '@/config/locales'
import { Downloads } from '@/payload/collections/media/downloads'
import { Media } from '@/payload/collections/media/media'
import { Pages } from '@/payload/collections/pages'
import { Users } from '@/payload/collections/users'
import { AppSettings } from '@/payload/globals/app-settings'
import { Footer } from '@/payload/globals/footer/config'
import { initSeoPlugin } from '@/payload/utils/seo'
import { getNodeMailerAdapter } from '@/utils/node-mailer'

import { initSearchPlugin } from './utils/search/init-plugin'

// import { seedSuperAdmin } from './seeds/initSuperAdmin'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const { PAYLOAD_SECRET, PAYLOAD_DATABASE_URI } = env

export default buildConfig({
  cors: '*',

  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      beforeDashboard: [
        {
          path: './app/(payload)/_components/BeforeDashboard.tsx#BeforeDashboard',
        },
      ],
    },
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        // {
        //   label: 'Desktop',
        //   name: 'desktop',
        //   width: 1440,
        //   height: 900,
        // },
      ],
    },
  },

  collections: [Downloads, Media, Pages, Users],

  globals: [AppSettings, Footer],

  // admin interface localization
  i18n: {
    supportedLanguages: { en, de },
  },
  // content localization
  localization: {
    locales: [...locales],
    defaultLocale,
  },

  editor: lexicalEditor(),

  secret: PAYLOAD_SECRET,

  email: getNodeMailerAdapter(process.env.NODE_ENV !== 'production'),

  db: mongooseAdapter({
    url: PAYLOAD_DATABASE_URI,
    // Connection pool optimization for same-server Docker deployment
    connectOptions: {
      // Maximum connections in the pool (increase for high traffic)
      maxPoolSize: 50,
      // Minimum connections to maintain (reduces cold start latency)
      minPoolSize: 10,
      // Close idle connections after 60s
      maxIdleTimeMS: 60000,
      // Socket timeout (ms)
      socketTimeoutMS: 45000,
      // Server selection timeout (ms)
      serverSelectionTimeoutMS: 30000,
      // Heartbeat frequency (ms)
      heartbeatFrequencyMS: 10000,
      // Enable retryable writes for resilience
      retryWrites: true,
      // Note: Network compression (zlib/snappy) omitted - adds CPU overhead
      // without benefit for same-server Docker deployments where network
      // is not a bottleneck. Enable for remote/cloud database connections.
    },
  }),

  sharp,

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  plugins: [initSeoPlugin(), initSearchPlugin()],

  graphQL: {
    disable: false,
  },

  // onInit: async (payload) => {
  //   await seedSuperAdmin(payload)
  // },

})
