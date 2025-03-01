export function handleApiError(error: unknown) {
  const message = error instanceof Error ? error.message : '未知错误'
  return { success: false, error: message }
}
