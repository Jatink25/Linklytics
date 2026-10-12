const backendOrigin = (import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/+$/, '')
const urlsEndpoint = `${backendOrigin}/api/v1/urls`

function requireBackendOrigin() {
  if (!backendOrigin) {
    throw new Error('Set VITE_API_BASE_URL in the frontend environment to connect to the backend.')
  }
}

async function requestJson(endpoint, options) {
  requireBackendOrigin()

  const response = await fetch(endpoint, options)
  let payload

  try {
    payload = await response.json()
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('The backend returned an invalid response.', { cause: error })
    }
    throw error
  }

  if (!response.ok || payload?.success === false) {
    throw new Error(payload?.message || `The request failed with status ${response.status}.`)
  }

  if (payload?.success !== true || !('data' in payload)) {
    throw new Error('The backend response did not match the expected format.')
  }

  return payload.data
}

export async function getUrls() {
  const data = await requestJson(urlsEndpoint)

  if (!Array.isArray(data)) {
    throw new Error('The backend did not return a list of links.')
  }

  return data
}

export async function createShortUrl(originalUrl) {
  const data = await requestJson(urlsEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ originalUrl }),
  })

  if (!data || typeof data.shortCode !== 'string' || typeof data.originalUrl !== 'string') {
    throw new Error('The backend did not return the created link.')
  }

  return data
}

export function getShortUrl(shortCode) {
  requireBackendOrigin()
  return `${backendOrigin}/${encodeURIComponent(shortCode)}`
}
