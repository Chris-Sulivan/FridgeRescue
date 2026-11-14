// Small fetch wrapper: base URL, JSON, JWT header and readable errors.
const BASE_URL = import.meta.env.VITE_API_BASE || ''
const TOKEN_KEY = 'fridgerescue-token'

export const UNAUTHORIZED_EVENT = 'fridgerescue:unauthorized'

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  } catch {
    // Storage can be blocked (private mode). The user just has to log in again.
  }
}

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export async function request(path, { method = 'GET', body } = {}) {
  const headers = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'

  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`

  let response
  try {
    response = await fetch(BASE_URL + path, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError('Cannot reach the server. Check your connection and try again.', 0)
  }

  let data = null
  try {
    data = await response.json()
  } catch {
    // Empty or non-JSON body
  }

  if (!response.ok) {
    const isAuthCall = path.startsWith('/api/auth/login') || path.startsWith('/api/auth/register')
    if (response.status === 401 && !isAuthCall) {
      // Token expired or invalid: log the user out everywhere
      setToken(null)
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT))
    }
    throw new ApiError(data?.message || `Request failed (${response.status})`, response.status)
  }

  return data
}
