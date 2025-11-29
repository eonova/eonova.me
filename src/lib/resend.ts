import { Resend } from 'resend'
import { env } from '~/lib/env'

interface SendEmailOptions {
  subject: string
  to: string
  react: React.ReactNode
}

export function sendEmail(options: SendEmailOptions) {
  if (!env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY is not set. Skipping email sending.')
    return
  }

  const { subject, to, react } = options
  const resend = new Resend(env.RESEND_API_KEY)

  return resend.emails.send({
    from: `Eonova <hi@eonova.me>`,
    to,
    subject,
    react,
  })
}
