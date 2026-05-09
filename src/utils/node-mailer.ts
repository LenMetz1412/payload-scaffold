import { env } from '@env'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import nodemailer from 'nodemailer'

// Function to create the Nodemailer transport
const createTransporter = () => {
  const {
    NODE_MAILER_SMTP_HOST,
    NODE_MAILER_SMTP_PORT,
    NODE_MAILER_SMTP_USER,
    NODE_MAILER_SMTP_PWD,
    NODE_MAILER_SMTP_SECURE,
  } = env

  const transporterSecurityOptions =
    NODE_MAILER_SMTP_SECURE === 'true'
      ? {
          secure: true,
          tls: {
            rejectUnauthorized: false,
          },
        }
      : {}

  return nodemailer.createTransport({
    host: NODE_MAILER_SMTP_HOST,
    port: Number(NODE_MAILER_SMTP_PORT),
    auth: {
      user: NODE_MAILER_SMTP_USER,
      pass: NODE_MAILER_SMTP_PWD,
    },
    ...transporterSecurityOptions,
  })
}

export const getNodeMailerAdapter = (disabled?: boolean) => {
  if (disabled) return undefined

  const { PAYLOAD_MAILER_FROM, PAYLOAD_MAILER_NAME } = env

  return nodemailerAdapter({
    defaultFromAddress: PAYLOAD_MAILER_FROM,
    defaultFromName: PAYLOAD_MAILER_NAME,
    transport: createTransporter(),
  })
}
