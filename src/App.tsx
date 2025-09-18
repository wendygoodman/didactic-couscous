import React, { useMemo, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Search, Table, LayoutGrid, ArrowUpDown, RefreshCcw, Download, Copy as CopyIcon } from 'lucide-react'

type Product = {
  name: string
  category: string[]
  prices: { sixMonth: number | null; oneYear: number | null; lifetime: number | null }
  devices: number
  description: string
  link: string
}

const PRODUCTS: Product[] = [
  {"name":"Canva Pro","category":["Design"],"prices":{"sixMonth":null,"oneYear":null,"lifetime":10},"devices":Infinity,"description":"Upgrade on your own email. Premium templates, stock media & HQ download.","link":"#"},
  {"name":"Canva Pro + AI","category":["Design","AI"],"prices":{"sixMonth":null,"oneYear":null,"lifetime":30},"devices":Infinity,"description":"All Pro features + Magic Studio AI, background remover, custom fonts.","link":"#"},
  {"name":"CapCut Pro","category":["Video"],"prices":{"sixMonth":12,"oneYear":15,"lifetime":35},"devices":2,"description":"New shared account. Filters, effects, transitions, 4K export.","link":"#"},
  {"name":"Grammarly Premium","category":["Writing","AI"],"prices":{"sixMonth":null,"oneYear":20,"lifetime":35},"devices":2,"description":"New shared account. Advanced grammar, tone, plagiarism.","link":"#"},
  {"name":"Spotify Premium","category":["Streaming","Music"],"prices":{"sixMonth":null,"oneYear":30,"lifetime":40},"devices":Infinity,"description":"Upgrade on your email. Ad-free, offline, HQ audio.","link":"#"},
  {"name":"QuillBot Premium","category":["Writing","AI"],"prices":{"sixMonth":null,"oneYear":20,"lifetime":35},"devices":2,"description":"New shared account. Unlimited paraphrasing, Docs integration.","link":"#"},
  {"name":"Duolingo Plus","category":["Education"],"prices":{"sixMonth":8,"oneYear":15,"lifetime":20},"devices":Infinity,"description":"Upgrade on your email. Ad-free, offline lessons, progress sync.","link":"#"},
  {"name":"ChatGPT Plus","category":["AI"],"prices":{"sixMonth":20,"oneYear":40,"lifetime":60},"devices":2,"description":"Private Chat account. Priority access, faster replies.","link":"#"},
  {"name":"Gemini Pro + Veo 3","category":["AI","Video"],"prices":{"sixMonth":null,"oneYear":45,"lifetime":null},"devices":Infinity,"description":"New private account. Multimodal AI + Veo 3 cinema video AI.","link":"#"},
  {"name":"Prime Video","category":["Streaming"],"prices":{"sixMonth":20,"oneYear":30,"lifetime":50},"devices":2,"description":"New profile account. Premium streaming.","link":"#"},
  {"name":"Netflix Premium","category":["Streaming"],"prices":{"sixMonth":20,"oneYear":40,"lifetime":70},"devices":2,"description":"New profile account. Ultra HD streaming.","link":"#"},
  {"name":"YouTube Premium","category":["Streaming","Music"],"prices":{"sixMonth":null,"oneYear":40,"lifetime":80},"devices":Infinity,"description":"Upgrade on your email. Ad-free YouTube, downloads, background play.","link":"#"},
  {"name":"NordVPN Premium","category":["VPN","Security"],"prices":{"sixMonth":null,"oneYear":20,"lifetime":40},"devices":5,"description":"New shared account. Secure VPN service.","link":"#"},
  {"name":"IPVanish Premium","category":["VPN","Security"],"prices":{"sixMonth":null,"oneYear":20,"lifetime":40},"devices":5,"description":"New shared account. Unlimited bandwidth VPN.","link":"#"},
  {"name":"Surfshark VPN","category":["VPN","Security"],"prices":{"sixMonth":null,"oneYear":20,"lifetime":40},"devices":5,"description":"New shared account. Multi-device VPN.","link":"#"},
  {"name":"Coursera Plus","category":["Education"],"prices":{"sixMonth":null,"oneYear":25,"lifetime":null},"devices":2,"description":"New shared account. Unlimited access to 7,000+ courses.","link":"#"},
  {"name":"MS Office 365 + AI","category":["Productivity","AI"],"prices":{"sixMonth":null,"oneYear":30,"lifetime":null},"devices":5,"description":"New private account. Word, Excel, Outlook, Copilot AI.","link":"#"},
  {"name":"Windows Pro (Genuine)","category":["Utilities"],"prices":{"sixMonth":null,"oneYear":8,"lifetime":null},"devices":1,"description":"Activation key. Windows Professional license (genuine).","link":"#"},
  {"name":"Freepik Premium","category":["Design"],"prices":{"sixMonth":15,"oneYear":30,"lifetime":40},"devices":2,"description":"New personal account. Premium assets, daily downloads.","link":"#"},
  {"name":"IDM Premium","category":["Utilities"],"prices":{"sixMonth":null,"oneYear":null,"lifetime":10},"devices":1,"description":"Activation script. Internet Download Manager (Windows).","link":"#"},
  {"name":"Google Drive (Upgrade)","category":["Cloud","Productivity"],"prices":{"sixMonth":null,"oneYear":35,"lifetime":null},"devices":Infinity,"description":"Upgrade on your email. Extra storage & Workspace perks.","link":"#"}
]

const currencyFormatter = new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })
const MATCHA = '#BDECC6'
const TITLE_COLORS: Record<string,string> = {
  'Canva Pro':'#a78bfa','Canva Pro + AI':'#a78bfa','CapCut':'#e5e7eb',
  'Grammarly':'#00A82D','Spotify':'#1DB954','QuillBot':'#2EAC68',
  'Duolingo':'#78C800','ChatGPT':'#10a37f','Gemini':'#22d3ee',
  'Prime Video':'#00A8E1','Netflix':'#E50914','YouTube':'#FF0000',
  'NordVPN':'#2F6CE5','IPVanish':'#8BC34A','Surfshark':'#00C3C1',
  'Coursera':'#2A73CC','MS Office':'#D83B01','Windows':'#00A4EF',
  'Freepik':'#1C9CEA','IDM':'#9BE489','Google Drive':'#F4B400'
}
const titleColor = (name: string) => Object.entries(TITLE_COLORS).find(([k])=>name.toLowerCase().includes(k.toLowerCase()))?.[1] ?? '#d1d5db'
const adjustOneCent = (v:number) => Math.max(0, Math.round(v*100)-1)/100

function Price({ value }:{ value:number|null }){
  if (value == null) return <span className="text-zinc-500">—</span>
  return <span className="priceFx">{currencyFormatter.format(adjustOneCent(value))}</span>
}

const categories = Array.from(new Set(PRODUCTS.flatMap(p=>p.category))).sort()
type SortKey = 'name'|'sixMonth'|'oneYear'|'lifetime'|'devices'

export default function App(){
  const [query,setQuery] = useState('')
  const [view,setView] = useState<'grid'|'table'>('grid')
  const [onlyLifetime,setOnlyLifetime] = useState(false)
  const [selectedCats,setSelectedCats] = useState<string[]>([])
  const [sortKey,setSortKey] = useState<SortKey>('name')
  const [sortDir,setSortDir] = useState<'asc'|'desc'>('asc')
  const [copiedName,setCopiedName] = useState<string|null>(null)

  const filtered = useMemo(()=>{
    let list = PRODUCTS.filter(p => (p.name+' '+p.description+' '+p.category.join(' ')).toLowerCase().includes(query.toLowerCase()))
    if (onlyLifetime) list = list.filter(p=>p.prices.lifetime!=null)
    if (selectedCats.length) list = list.filter(p=> selectedCats.every(c=>p.category.includes(c)))
    const getVal = (p:Product) => ({name:p.name.toLowerCase(), sixMonth:p.prices.sixMonth ?? Number.POSITIVE_INFINITY, oneYear:p.prices.oneYear ?? Number.POSITIVE_INFINITY, lifetime:p.prices.lifetime ?? Number.POSITIVE_INFINITY, devices:(p.devices as any)===Infinity?9999:p.devices}[sortKey] as any)
    list.sort((a,b)=> (getVal(a)<getVal(b)?-1:getVal(a)>getVal(b)?1:0)*(sortDir==='asc'?1:-1))
    return list
  },[query,onlyLifetime,selectedCats,sortKey,sortDir])

  const lastUpdated = useMemo(()=> new Date().toLocaleString(), [])

  const exportCSV = () => {
    const rows = [['Product','Categories','6-Month','1-Year','Lifetime','Devices','Description'],
      ...filtered.map(p => [p.name, p.category.join('; '),
        p.prices.sixMonth==null?'':currencyFormatter.format(adjustOneCent(p.prices.sixMonth)),
        p.prices.oneYear==null?'':currencyFormatter.format(adjustOneCent(p.prices.oneYear)),
        p.prices.lifetime==null?'':currencyFormatter.format(adjustOneCent(p.prices.lifetime)),
        (p.devices as any)===Infinity?'∞':String(p.devices),
        p.description.replace(/\n/g,' ')
      ])]
    const csv = rows.map(r=> r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type:'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=`pricing-catalog-${Date.now()}.csv`; a.click(); URL.revokeObjectURL(url)
  }

  const formatForCopy = (p:Product) => {
    const lines:string[] = []
    if (p.prices.sixMonth != null) lines.push(`6-Month: ${currencyFormatter.format(adjustOneCent(p.prices.sixMonth))}`)
    if (p.prices.oneYear != null) lines.push(`1-Year: ${currencyFormatter.format(adjustOneCent(p.prices.oneYear))}`)
    if (p.prices.lifetime != null) lines.push(`Lifetime: ${currencyFormatter.format(adjustOneCent(p.prices.lifetime))}`)
    const devices = (p.devices as any) === Infinity ? '∞' : String(p.devices)
    return `${p.name}\n\n${lines.join('\n')}\n\nDevices: ${devices}\n\n${p.description}`
  }

  const handleCopy = async (p:Product) => {
    try{
      const text = formatForCopy(p)
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(text)
      else { const ta=document.createElement('textarea'); ta.value=text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove() }
      setCopiedName(p.name); setTimeout(()=> setCopiedName(null), 1500)
    }catch(e){ console.error('Copy failed', e) }
  }

  const clearFilters = () => {
    setSelectedCats([])
    setOnlyLifetime(false)
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black text-zinc-100">
      <style>{`
        .cardFX{position:relative;border:1px solid rgb(39 39 42);background:linear-gradient(180deg,rgba(24,24,28,.75),rgba(8,8,10,.6));border-radius:1rem}
        .cardFX::after{content:'';position:absolute;inset:0;border-radius:inherit;pointer-events:none;background:radial-gradient(600px 200px at var(--mx,50%) -20%,rgba(255,255,255,.06),transparent 40%);opacity:0;transition:opacity .2s}
        .cardFX:hover::after{opacity:1}
        .priceFx{font-weight:800;color:${MATCHA};text-shadow:0 0 8px rgba(189,236,198,.25);transition:text-shadow .15s ease,filter .15s ease,font-weight .15s ease}
        .priceFx:hover{font-weight:900;text-shadow:0 0 16px rgba(189,236,198,.6),0 0 32px rgba(189,236,198,.4);filter:drop-shadow(0 0 10px rgba(189,236,198,.35))}
      `}</style>
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Pricing Catalog</h1>
            <p className="text-sm text-zinc-400 mt-1">Updated daily • Last update: {lastUpdated}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={()=> setView(view==='grid'?'table':'grid')} className="rounded-2xl border border-zinc-700 bg-zinc-900/50 px-3 py-2 hover:bg-zinc-900 transition">{view==='grid' ? <Table className='h-4 w-4'/> : <LayoutGrid className='h-4 w-4'/>}</button>
            <button onClick={()=> location.reload()} className="rounded-2xl border border-zinc-700 bg-zinc-900/50 px-3 py-2 hover:bg-zinc-900 transition inline-flex items-center gap-2"><RefreshCcw className="h-4 w-4"/> Refresh</button>
            <button onClick={exportCSV} className="rounded-2xl border border-zinc-700 bg-zinc-900/50 px-3 py-2 hover:bg-zinc-900 transition inline-flex items-center gap-2"><Download className="h-4 w-4"/> Export CSV</button>
          </div>
        </div>

        {/* Search / Filters / Sorting */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"/>
            <input value={query} onChange={(e)=> setQuery(e.target.value)} placeholder="Search products, features, categories..." className="w-full pl-9 rounded-2xl bg-zinc-900/60 border border-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-600 px-3 py-2"/>
          </div>

          {/* Categories + Lifetime */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">Filters</span>
              {(selectedCats.length > 0 || onlyLifetime) && (
                <button
                  onClick={clearFilters}
                  className="text-xs px-2 py-1 rounded-full border border-zinc-700 bg-zinc-900/60 hover:bg-zinc-800/70 transition"
                >
                  Clear filters
                </button>
              )}
            </div>

            {/* Categories as pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map(c => {
                const active = selectedCats.includes(c)
                return (
                  <button
                    key={c}
                    onClick={() =>
                      setSelectedCats(
                        active
                          ? selectedCats.filter(sc => sc !== c)
                          : [...selectedCats, c]
                      )
                    }
                    className={`px-3 py-1 rounded-full border text-sm transition ${
                      active
                        ? "bg-zinc-700 border-zinc-500 text-white"
                        : "bg-zinc-900/50 border-zinc-800 text-zinc-300 hover:bg-zinc-800/70"
                    }`}
                  >
                    {c}
                  </button>
                )
              })}
            </div>

            {/* Lifetime only */}
            <label className="inline-flex items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900/50 px-3 py-2 w-fit">
              <input
                type="checkbox"
                checked={onlyLifetime}
                onChange={(e)=> setOnlyLifetime(e.target.checked)}
              />
              <span>Lifetime only</span>
            </label>
          </div>

          {/* Sorting */}
          <div className="flex items-center gap-2">
            <div className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/50 px-3 py-2">
              <div className="text-sm mb-1 inline-flex items-center gap-1"><ArrowUpDown className="h-4 w-4" /> Sort by</div>
              <div className="flex gap-2">
                <select value={sortKey} onChange={(e)=> setSortKey(e.target.value as SortKey)} className="flex-1 rounded-lg bg-black/40 border border-zinc-800 px-2 py-1">
                  <option value="name">Name</option>
                  <option value="sixMonth">6-Month price</option>
                  <option value="oneYear">1-Year price</option>
                  <option value="lifetime">Lifetime price</option>
                  <option value="devices">Devices</option>
                </select>
                <select value={sortDir} onChange={(e)=> setSortDir(e.target.value as 'asc'|'desc')} className="rounded-lg bg-black/40 border border-zinc-800 px-2 py-1">
