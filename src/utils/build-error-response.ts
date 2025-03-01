export function buildErrorResponse(message: string) {
  return { success: false, error: message }
}
