import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

// const echoEnv = () => {
//   console.log('PAYLOAD_DATABASE_URI', process.env.PAYLOAD_DATABASE_URI)
//   console.log('NEXT_PUBLIC_OG_TYPE', process.env.NEXT_PUBLIC_OG_TYPE)
//   console.log('NODE_SMTP_USER', process.env.NODE_SMTP_USER)
// }

// echoEnv()

export const env = createEnv({
  /*
   * Serverside Environment variables, not available on the client.
   * Will throw if you access these variables on the client.
   */
  server: {
    PAYLOAD_DATABASE_URI: z.string().url(),
    PAYLOAD_SECRET: z.string().min(1),
    PAYLOAD_PUBLIC_ASSETS_PATH: z.string().min(1),

    PAYLOAD_MAILER_FROM: z.string().min(1),
    PAYLOAD_MAILER_NAME: z.string().min(1),

    NODE_MAILER_SMTP_HOST: z.string().min(1),
    NODE_MAILER_SMTP_PORT: z.string().min(1),
    NODE_MAILER_SMTP_USER: z.string().min(1),
    NODE_MAILER_SMTP_PWD: z.string().min(1),
    NODE_MAILER_SMTP_SECURE: z.string(),
  },
  /*
   * Environment variables available on the client (and server).
   *
   * 💡 You'll get type errors if these are not prefixed with NEXT_PUBLIC_.
   */
  client: {
    NEXT_PUBLIC_SERVER_URL: z.string().url(),
    NEXT_PUBLIC_META_NAME: z.string().min(1),
    NEXT_PUBLIC_META_TITLE: z.string().min(1),
    NEXT_PUBLIC_META_DESCRIPTION: z.string().min(1),
    NEXT_PUBLIC_META_TYPE: z.enum([
      'website',
      'article',
      'book',
      'profile',
      'music.song',
      'music.album',
      'music.playlist',
      'music.radio_station',
      'video.movie',
      'video.episode',
      'video.tv_show',
      'video.other',
    ]),
  },
  /*
   * Due to how Next.js bundles environment variables on Edge and Client,
   * we need to manually destructure them to make sure all are included in bundle.
   *
   * 💡 You'll get type errors if not all variables from `server` & `client` are included here.
   */
  runtimeEnv: {
    PAYLOAD_DATABASE_URI: process.env.PAYLOAD_DATABASE_URI,
    PAYLOAD_SECRET: process.env.PAYLOAD_SECRET,
    PAYLOAD_PUBLIC_ASSETS_PATH: process.env.PAYLOAD_PUBLIC_ASSETS_PATH,

    PAYLOAD_MAILER_FROM: process.env.PAYLOAD_MAILER_FROM,
    PAYLOAD_MAILER_NAME: process.env.PAYLOAD_MAILER_NAME,

    NODE_MAILER_SMTP_HOST: process.env.NODE_MAILER_SMTP_HOST,
    NODE_MAILER_SMTP_PORT: process.env.NODE_MAILER_SMTP_PORT,
    NODE_MAILER_SMTP_USER: process.env.NODE_MAILER_SMTP_USER,
    NODE_MAILER_SMTP_PWD: process.env.NODE_MAILER_SMTP_PWD,
    NODE_MAILER_SMTP_SECURE: process.env.NODE_MAILER_SMTP_SECURE,

    NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
    NEXT_PUBLIC_META_NAME: process.env.NEXT_PUBLIC_META_NAME,
    NEXT_PUBLIC_META_TITLE: process.env.NEXT_PUBLIC_META_TITLE,
    NEXT_PUBLIC_META_DESCRIPTION: process.env.NEXT_PUBLIC_META_DESCRIPTION,
    NEXT_PUBLIC_META_TYPE: process.env.NEXT_PUBLIC_META_TYPE,
  },
})
