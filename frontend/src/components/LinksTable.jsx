import { getShortUrl } from '../api.js'

function formatDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(date)
}

function LinksTable({ error, loading, onRetry, urls }) {
  if (loading) {
    return (
      <div className="flex min-h-56 flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white px-6 text-center shadow-[0_2px_12px_rgba(15,23,42,0.025)]">
        <span className="mb-3 h-8 w-8 animate-spin rounded-full border-[3px] border-violet-100 border-t-violet-600" />
        <p className="text-sm font-medium text-slate-700">Loading your links</p>
        <p className="mt-1 text-xs text-slate-400">Connecting to your workspace…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div role="alert" className="flex min-h-56 flex-col items-center justify-center rounded-2xl border border-rose-100 bg-white px-6 text-center shadow-[0_2px_12px_rgba(15,23,42,0.025)]">
        <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-rose-50 text-rose-600">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 8v4m0 4h.01M10.3 3.9 2.6 17.2A2 2 0 0 0 4.3 20h15.4a2 2 0 0 0 1.7-2.8L13.7 3.9a2 2 0 0 0-3.4 0Z" />
          </svg>
        </span>
        <p className="text-sm font-semibold text-slate-800">We couldn&apos;t load your links</p>
        <p className="mt-1 max-w-md text-sm text-slate-500">{error}</p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 cursor-pointer rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100"
        >
          Try again
        </button>
      </div>
    )
  }

  if (urls.length === 0) {
    return (
      <div className="flex min-h-60 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 text-center">
        <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.6 13.4a4.1 4.1 0 0 0 5.8 0l2.1-2.1a4.1 4.1 0 0 0-5.8-5.8l-1.2 1.2" />
            <path d="M13.4 10.6a4.1 4.1 0 0 0-5.8 0l-2.1 2.1a4.1 4.1 0 0 0 5.8 5.8l1.2-1.2" />
          </svg>
        </span>
        <p className="text-sm font-semibold text-slate-800">No links yet</p>
        <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">
          Your shortened URLs will show up here. Create your first one above to get started.
        </p>
        <a href="#create-link" className="mt-4 cursor-pointer text-sm font-semibold text-violet-700 hover:text-violet-900">
          Shorten a URL <span aria-hidden="true">→</span>
        </a>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.025)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70">
              <th scope="col" className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-400 sm:px-6">Original URL</th>
              <th scope="col" className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-400">Short URL</th>
              <th scope="col" className="px-5 py-3.5 text-right text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-400">Clicks</th>
              <th scope="col" className="px-5 py-3.5 text-right text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-400 sm:px-6">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {urls.map((url) => {
              const shortUrl = getShortUrl(url.shortCode)
              return (
                <tr key={url._id || url.shortCode} className="transition hover:bg-slate-50/70">
                  <td className="max-w-[300px] px-5 py-4 sm:px-6">
                    <a href={url.originalUrl} target="_blank" rel="noreferrer" title={url.originalUrl} className="block cursor-pointer truncate text-sm font-medium text-slate-700 hover:text-violet-700">
                      {url.originalUrl}
                    </a>
                  </td>
                  <td className="px-5 py-4">
                    <a href={shortUrl} target="_blank" rel="noreferrer" className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-violet-700 hover:text-violet-900">
                      {url.shortCode}
                      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5 text-violet-400" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 4h6v6m-11 5L20 4" />
                        <path d="M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5" />
                      </svg>
                    </a>
                  </td>
                  <td className="px-5 py-4 text-right text-sm font-semibold tabular-nums text-slate-700">
                    {(url.clickCount || 0).toLocaleString()}
                  </td>
                  <td className="px-5 py-4 text-right text-sm text-slate-500 sm:px-6">{formatDate(url.createdAt)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="border-t border-slate-100 px-5 py-3 text-xs text-slate-400 sm:px-6">
        {urls.length} {urls.length === 1 ? 'link' : 'links'} in your workspace
      </div>
    </div>
  )
}

export default LinksTable
