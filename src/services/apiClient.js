const DEFAULT_API_BASE = 'http://127.0.0.1:8000'

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE).replace(/\/$/, '')

export async function getJson(path) {
  const response = await fetch(`${API_BASE_URL}${path}`)

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }

  return response.json()
}
