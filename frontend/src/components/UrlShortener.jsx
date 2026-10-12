import { useState } from 'react'
import { getShortUrl } from '../api.js'

function UrlShortener({ createdUrl, error, onShorten, submitting }) {
  const [originalUrl, setOriginalUrl] = useState('')
  const [validationError, setValidationError] = useState('')
  const [copyMessage, setCopyMessage] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setValidationError('')
    setCopyMessage('')

    try {
      const parsedUrl = new URL(originalUrl)
      if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
        setValidationError('Enter a URL that starts with http:// or https://.')
        return
      }
    } catch {
      setValidationError('Enter a valid web address, including https://.')
      return
    }

    const created = await onShorten(originalUrl)
    if (created) setOriginalUrl('')
  }

  async function handleCopy() {
    setCopyMessage('')
    try {
      await navigator.clipboard.writeText(getShortUrl(createdUrl.shortCode))
      setCopyMessage('Copied to clipboard')
    } catch {
      setCopyMessage('Could not copy. Check your browser clipboard permissions.')
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(41,37,99,0.055)]">
      <div className="border-b border-slate-100 px-5 py-5 sm:px-7 sm:py-6">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </span>
          <div>
            <h2 className="text-base font-semibold text-slate-900">Shorten a new link</h2>
            <p className="mt-1 text-sm text-slate-500">Paste a long URL and create a shareable short link.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-5">
          <label htmlFor="original-url" className="mb-2 block text-xs font-semibold text-slate-700">
            Destination URL
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative min-w-0 flex-1">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" />
                <path d="m16 16 4 4" />
              </svg>
              <input
                id="original-url"
                type="url"
                inputMode="url"
                autoComplete="url"
                required
                value={originalUrl}
                onChange={(event) => setOriginalUrl(event.target.value)}
                placeholder="https://example.com/your/long/link"
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                aria-invalid={Boolean(validationError || error)}
                aria-describedby={validationError || error ? 'shorten-error' : undefined}
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex h-12 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 text-sm font-semibold text-white shadow-sm shadow-violet-200 transition hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-200 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Creating…
                </>
              ) : (
                <>
                  Shorten URL
                  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14m-6-6 6 6-6 6" />
                  </svg>
                </>
              )}
            </button>
          </div>
          {(validationError || error) && (
            <p id="shorten-error" role="alert" className="mt-3 text-sm font-medium text-rose-600">
              {validationError || error}
            </p>
          )}
        </form>
      </div>

      {createdUrl && (
        <div role="status" className="flex flex-col gap-4 bg-violet-50/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <div className="min-w-0">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-violet-700">Your short link is ready</p>
            <a
              href={getShortUrl(createdUrl.shortCode)}
              target="_blank"
              rel="noreferrer"
              className="block cursor-pointer truncate text-sm font-semibold text-violet-800 hover:text-violet-950"
            >
              {getShortUrl(createdUrl.shortCode)}
            </a>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            {copyMessage && <span className="text-xs font-medium text-emerald-700">{copyMessage}</span>}
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-violet-200 bg-white px-3.5 text-xs font-semibold text-violet-700 transition hover:border-violet-300 hover:bg-violet-50 focus:outline-none focus:ring-4 focus:ring-violet-100"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="8" y="8" width="12" height="12" rx="2" />
                <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
              </svg>
              Copy link
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default UrlShortener
