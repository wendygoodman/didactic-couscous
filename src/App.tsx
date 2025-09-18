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

const PRODUCTS: Product[] = [/* keep your big products array here */]

const currencyFormatter = new Intl.NumberFormat(undefined, {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})
const MATCHA = '#BDECC6'
const TITLE_COLORS: Record<string,string> = {
  'Canva Pro':'#a78bfa','CapCut':'#e5e7eb','Grammarly':'#00A82D',
  'Spotify':'#1DB954','QuillBot':'#2EAC68','Duolingo':'#78C800',
  'ChatGPT':'#10a37f','Gemini':'#22d3ee','Prime Video':'#00A8E1',
  'Netflix':'#E50914','YouTube':'#FF0000','NordVPN':'#2F6CE5',
  'IPVanish':'#8BC34A','Surfshark':'#00C3C1','Coursera':'#2A73CC',
  'MS Office':'#D83B01','Windows':'#00A4EF','Freepik':'#1C9CEA',
  'IDM':'#9BE489','Google Drive':'#F4B400'
}
const titleColor = (name: string) =>
  Object.entries(TITLE_COLORS).find(([k]) =>
    name.toLowerCase().includes(k.toLowerCase())
  )?.[1] ?? '#d1d5db'

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
    let list = PRODUCTS.filter(p =>
      (p.name+' '+p.description+' '+p.category.join(' ')).toLowerCase().includes(query.toLowerCase())
    )
    if (onlyLifetime) list = list.filter(p=>p.prices.lifetime!=null)
    if (selectedCats.length) list = list.filter(p=> selectedCats.some(c=>p.category.includes(c)))

    const getVal = (p:Product) => ({
      name:p.name.toLowerCase(),
      sixMonth:p.prices.sixMonth ?? Number.POSITIVE_INFINITY,
      oneYear:p.prices.oneYear ?? Number.POSITIVE_INFINITY,
      lifetime:p.prices.lifetime ?? Number.POSITIVE_INFINITY,
      devices:(p.devices as any)===Infinity?9999:p.devices
    }[sortKey] as any)

    list.sort((a,b)=> (getVal(a)<getVal(b)?-1:getVal(a)>getVal(b)?1:0)*(sortDir==='asc'?1:-1))
    return list
  },[query,onlyLifetime,selectedCats,sortKey,sortDir])

  const lastUpdated = useMemo(()=> new Date().toLocaleString(), [])

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
      await navigator.clipboard.writeText(formatForCopy(p))
      setCopiedName(p.name)
      setTimeout(()=> setCopiedName(null), 1500)
    }catch(e){ console.error('Copy failed', e) }
  }

  const toggleCat = (cat:string) => {
    setSelectedCats(prev => prev.includes(cat) ? prev.filter(c=>c!==cat) : [...prev, cat])
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100">
      <style>{`
        .cardFX{position:relative;border:1px solid rgb(39 39 42);background:linear-gradient(180deg,rgba(24,24,28,.75),rgba(8,8,10,.6));border-radius:1rem}
        .cardFX:hover{border-color:${MATCHA}}
        .priceFx{font-weight:800;color:${MATCHA};text-shadow:0 0 8px rgba(189,236,198,.25);}
        .priceFx:hover{font-weight:900;text-shadow:0 0 16px rgba(189,236,198,.6);}
        .pill{padding:6px 12px;border-radius:9999px;border:1px solid #333;cursor:pointer}
        .pill.active{border-color:${MATCHA};color:${MATCHA};box-shadow:0 0 10px ${MATCHA}55}
        .chip{padding:4px 10px;border-radius:9999px;border:1px solid #333;cursor:pointer;font-size:13px}
        .chip.active{border-color:${MATCHA};color:${MATCHA};box-shadow:0 0 6px ${MATCHA}44}
      `}</style>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-3xl font-bold">Pricing Catalog</h1>
        <p className="text-sm text-zinc-400">Updated daily • Last update: {lastUpdated}</p>

        {/* Filters */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"/>
            <input
              value={query}
              onChange={(e)=> setQuery(e.target.value)}
              placeholder="Search products, features, categories..."
              className="w-full pl-9 rounded-2xl bg-zinc-900 border border-zinc-800 px-3 py-2 focus:ring-2 focus:ring-zinc-600"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map(c=>(
              <button
                key={c}
                onClick={()=> toggleCat(c)}
                className={`chip ${selectedCats.includes(c)?'active':''}`}
              >{c}</button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={()=> setOnlyLifetime(v=>!v)}
              className={`pill ${onlyLifetime?'active':''}`}
            >Lifetime only</button>
            <div className="flex-1 rounded-2xl border border-zinc-800 bg-zinc-900 px-3 py-2">
              <div className="text-sm mb-1 inline-flex items-center gap-1">
                <ArrowUpDown className="h-4 w-4" /> Sort by
              </div>
              <div className="flex gap-2">
                <select value={sortKey} onChange={(e)=> setSortKey(e.target.value as SortKey)} className="flex-1 rounded-lg bg-black/40 border border-zinc-800 px-2 py-1">
                  <option value="name">Name</option>
                  <option value="sixMonth">6-Month</option>
                  <option value="oneYear">1-Year</option>
                  <option value="lifetime">Lifetime</option>
                  <option value="devices">Devices</option>
                </select>
                <select value={sortDir} onChange={(e)=> setSortDir(e.target.value as 'asc'|'desc')} className="rounded-lg bg-black/40 border border-zinc-800 px-2 py-1">
                  <option value="asc">ASC</option>
                  <option value="desc">DESC</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Grid View */}
        {view==='grid' && (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {filtered.map(p => (
                <div key={p.name} className="cardFX p-4 flex flex-col">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold" style={{ color: titleColor(p.name) }}>{p.name}</span>
                    <button onClick={()=> handleCopy(p)} className="text-sm text-zinc-300 hover:text-white flex items-center gap-1">
                      <CopyIcon className="h-4 w-4"/>{copiedName===p.name?'Copied!':'Copy'}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {p.category.map(c=> <span key={c} className="text-xs border border-zinc-700 px-2 py-0.5 rounded-full">{c}</span>)}
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm mt-3">
                    <div><div>6M</div><Price value={p.prices.sixMonth}/></div>
                    <div><div>1Y</div><Price value={p.prices.oneYear}/></div>
                    <div><div>Life</div><Price value={p.prices.lifetime}/></div>
                  </div>
                  <p className="mt-3 text-sm text-zinc-300">{p.description}</p>
                  <div className="mt-2 text-xs text-zinc-400">Devices: {(p.devices as any)===Infinity?'∞':p.devices}</div>
                </div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Table View */}
        {view==='table' && (
          <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-800">
            <table className="w-full text-sm">
              <thead className="bg-zinc-900/60 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Product</th>
                  <th className="px-4 py-3 text-left">Categories</th>
                  <th className="px-4 py-3 text-right">6M</th>
                  <th className="px-4 py-3 text-right">1Y</th>
                  <th className="px-4 py-3 text-right">Life</th>
                  <th className="px-4 py-3 text-left">Devices</th>
                  <th className="px-4 py-3 text-left">Copy</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p=>(
                  <tr key={p.name} className="border-t border-zinc-800 hover:bg-zinc-900/40">
                    <td className="px-4 py-3 font-medium" style={{ color: titleColor(p.name) }}>{p.name}</td>
                    <td className="px-4 py-3">{p.category.join(', ')}</td>
                    <td className="px-4 py-3 text-right"><Price value={p.prices.sixMonth}/></td>
                    <td className="px-4 py-3 text-right"><Price value={p.prices.oneYear}/></td>
                    <td className="px-4 py-3 text-right"><Price value={p.prices.lifetime}/></td>
                    <td className="px-4 py-3">{(p.devices as any)===Infinity?'∞':p.devices}</td>
                    <td className="px-4 py-3"><button onClick={()=> handleCopy(p)} className="text-sm text-zinc-300 hover:text-white flex items-center gap-1"><CopyIcon className="h-4 w-4"/>{copiedName===p.name?'Copied!':'Copy'}</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
