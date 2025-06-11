import { Resend } from 'resend'
import { env, flags } from './env'

export const resend = flags.comment ? new Resend(env.RESEND_API_KEY) : null
