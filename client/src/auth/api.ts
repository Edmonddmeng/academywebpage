export class ApiError extends Error {
  status: number
  code: string
  /** The full JSON error body, e.g. field-level `errors` from a 422. */
  body: Record<string, unknown>
  constructor(status: number, code: string, message: string, body: Record<string, unknown> = {}) {
    super(message)
    this.status = status
    this.code = code
    this.body = body
  }
}

// Thin JSON wrapper. Sessions ride in httpOnly cookies the server sets, so there is no
// token handling here — the browser attaches them to same-origin requests automatically.
// With no body it is a GET; with a body it is a POST unless a method is given.
export async function api<T = { ok: true }>(
  path: string,
  body?: unknown,
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'POST',
): Promise<T> {
  const res = await fetch(`/api${path}`, {
    method: body === undefined ? 'GET' : method,
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new ApiError(res.status, data.code ?? 'error', data.error ?? 'Request failed', data)
  return data as T
}

/** Multipart upload (files). The browser sets the boundary header itself. */
export async function apiUpload<T = { ok: true }>(path: string, form: FormData): Promise<T> {
  const res = await fetch(`/api${path}`, { method: 'POST', body: form })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new ApiError(res.status, data.code ?? 'error', data.error ?? 'Request failed', data)
  return data as T
}
