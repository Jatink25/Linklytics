function BrandMark() {
  return (
    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500 text-white shadow-lg shadow-violet-950/30">
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <path d="M10.6 13.4a4.1 4.1 0 0 0 5.8 0l2.1-2.1a4.1 4.1 0 0 0-5.8-5.8l-1.2 1.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M13.4 10.6a4.1 4.1 0 0 0-5.8 0l-2.1 2.1a4.1 4.1 0 0 0 5.8 5.8l1.2-1.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </span>
  )
}

const navigation = [
  {
    label: 'Overview',
    href: '#overview',
    icon: <path d="M3.5 10.5 12 3.8l8.5 6.7v9a1 1 0 0 1-1 1h-5v-6h-5v6H4.5a1 1 0 0 1-1-1v-9Z" />,
  },
  {
    label: 'Your links',
    href: '#links',
    icon: <><path d="M10.6 13.4a4.1 4.1 0 0 0 5.8 0l2.1-2.1a4.1 4.1 0 0 0-5.8-5.8l-1.2 1.2" /><path d="M13.4 10.6a4.1 4.1 0 0 0-5.8 0l-2.1 2.1a4.1 4.1 0 0 0 5.8 5.8l1.2-1.2" /></>,
  },
]

function Sidebar() {
  return (
    <aside className="border-b border-white/10 bg-[#11162a] text-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-[260px] lg:shrink-0 lg:flex-col lg:border-b-0 lg:border-r lg:border-white/5">
      <div className="flex items-center justify-between px-5 py-4 sm:px-7 lg:px-7 lg:pb-9 lg:pt-8">
        <a href="#overview" className="flex cursor-pointer items-center gap-3" aria-label="Linklytics home">
          <BrandMark />
          <span className="text-[17px] font-semibold tracking-tight">
            Linklytics<span className="text-violet-400">.</span>
          </span>
        </a>
        <span className="hidden rounded-full border border-white/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400 lg:inline-flex">
          Workspace
        </span>
      </div>

      <div className="px-4 pb-3 lg:px-4">
        <p className="hidden px-3 pb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 lg:block">
          Menu
        </p>
        <nav aria-label="Main navigation" className="flex gap-2 lg:flex-col">
          {navigation.map((item, index) => (
            <a
              key={item.label}
              href={item.href}
              className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                index === 0
                  ? 'bg-white/10 text-white shadow-sm ring-1 ring-white/5'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
              aria-current={index === 0 ? 'page' : undefined}
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px]" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                {item.icon}
              </svg>
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="mt-auto hidden px-5 pb-6 lg:block">
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.035] p-4">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px]" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1m0-12.8-2.1 2.1m-8.6 8.6-2.1 2.1" />
              <circle cx="12" cy="12" r="4" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-white">Keep it simple</p>
          <p className="mt-1.5 text-xs leading-5 text-slate-400">
            One place for the links you share every day.
          </p>
        </div>
        <p className="px-1 pt-5 text-[11px] text-slate-600">Linklytics · Link workspace</p>
      </div>
    </aside>
  )
}

export default Sidebar
