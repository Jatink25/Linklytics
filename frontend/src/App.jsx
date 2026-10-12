import { useCallback, useEffect, useRef, useState } from 'react'
import './App.css'
import { createShortUrl, getUrls } from './api.js'
import LinksTable from './components/LinksTable.jsx'
import Sidebar from './components/Sidebar.jsx'
import StatCard from './components/StatCard.jsx'
import UrlShortener from './components/UrlShortener.jsx'

function App() {
  const [urls, setUrls] = useState([])
  const [loading, setLoading] = useState(true)
  const [listError, setListError] = useState('')
  const [createError, setCreateError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [createdUrl, setCreatedUrl] = useState(null)
  const fetchingUrls = useRef(false)

  const loadUrls = useCallback(async () => {
    if (fetchingUrls.current) return

    fetchingUrls.current = true

    try {
      setUrls(await getUrls())
      setListError('')
    } catch (error) {
      setListError(error.message || 'Unable to load your links.')
    } finally {
      fetchingUrls.current = false
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    async function fetchInitialUrls() {
      await loadUrls()
    }

    function handleVisibilityChange() {
      if (document.visibilityState === 'visible') {
        void loadUrls()
      }
    }

    void fetchInitialUrls()
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [loadUrls])

  function handleRetry() {
    setLoading(true)
    void loadUrls()
  }

  async function handleShorten(originalUrl) {
    setSubmitting(true)
    setCreateError('')
    setCreatedUrl(null)

    try {
      const url = await createShortUrl(originalUrl)
      setUrls((currentUrls) => [url, ...currentUrls])
      setListError('')
      setCreatedUrl(url)
      return true
    } catch (error) {
      setCreateError(error.message || 'Unable to create a short link.')
      return false
    } finally {
      setSubmitting(false)
    }
  }

  const totalClicks = urls.reduce((total, url) => total + (url.clickCount || 0), 0)

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-slate-900 lg:flex">
      <Sidebar />

      <main className="min-w-0 flex-1">
        <div className="mx-auto max-w-[1440px] px-5 pb-12 pt-8 sm:px-8 lg:px-12 lg:pt-12">
          <header id="overview" className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-violet-600">
                Workspace overview
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-[2.1rem]">
                Your links, at a glance
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
                Create short links and keep track of how often they&apos;re used.
              </p>
            </div>
            <div className="flex items-center gap-2 self-start rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-600 shadow-sm sm:self-auto">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              URL workspace
            </div>
          </header>

          <section aria-label="Link statistics" className="mb-8 grid gap-4 sm:grid-cols-2">
            <StatCard
              label="Total links"
              value={loading || listError ? '—' : urls.length.toLocaleString()}
              detail="Links created in your workspace"
              icon="link"
              tone="violet"
            />
            <StatCard
              label="Total clicks"
              value={loading || listError ? '—' : totalClicks.toLocaleString()}
              detail="Clicks recorded across your links"
              icon="click"
              tone="blue"
            />
          </section>

          <section id="create-link" className="mb-9">
            <UrlShortener
              createdUrl={createdUrl}
              error={createError}
              onShorten={handleShorten}
              submitting={submitting}
            />
          </section>

          <section id="links" aria-labelledby="links-heading">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 id="links-heading" className="text-lg font-semibold tracking-tight text-slate-900">
                  Your links
                </h2>
                <p className="mt-1 text-sm text-slate-500">Every short link you&apos;ve created, all in one place.</p>
              </div>
              {!loading && !listError && (
                <span className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-500 ring-1 ring-slate-200">
                  {urls.length} {urls.length === 1 ? 'link' : 'links'}
                </span>
              )}
            </div>
            <LinksTable error={listError} loading={loading} onRetry={handleRetry} urls={urls} />
          </section>

          <footer className="mt-8 border-t border-slate-200/80 pt-5 text-xs text-slate-400">
            Linklytics <span className="mx-1.5">·</span> Simple links, clearer reach.
          </footer>
        </div>
      </main>
    </div>
  )
}

export default App
