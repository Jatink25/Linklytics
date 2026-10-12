function StatCard({ label, value, detail, icon, tone }) {
  const colors = tone === 'violet'
    ? 'bg-violet-50 text-violet-600 ring-violet-100'
    : 'bg-blue-50 text-blue-600 ring-blue-100'

  return (
    <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.025)] sm:p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{value}</p>
        </div>
        <span className={`flex h-11 w-11 items-center justify-center rounded-xl ring-1 ${colors}`}>
          {icon === 'link' ? (
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.6 13.4a4.1 4.1 0 0 0 5.8 0l2.1-2.1a4.1 4.1 0 0 0-5.8-5.8l-1.2 1.2" />
              <path d="M13.4 10.6a4.1 4.1 0 0 0-5.8 0l-2.1 2.1a4.1 4.1 0 0 0 5.8 5.8l1.2-1.2" />
            </svg>
          ) : (
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3.5 12s3.1-6 8.5-6 8.5 6 8.5 6-3.1 6-8.5 6-8.5-6-8.5-6Z" />
              <circle cx="12" cy="12" r="2.5" />
            </svg>
          )}
        </span>
      </div>
      <p className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-400">{detail}</p>
    </article>
  )
}

export default StatCard
