export function getIp(headers: Headers) {
  return headers.get('x-forwarded-for') ?? '0.0.0.0'
}
