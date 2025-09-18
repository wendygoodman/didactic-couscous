import React, { useMemo, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Search, Table, LayoutGrid, ArrowUpDown, RefreshCcw, Download, Copy as CopyIcon, Store, X } from 'lucide-react'

type Product = {
  name: string
  category: string[]
  prices: { sixMonth: number | null; oneYear: number | null; lifetime: number | null }
  devices: number
  description: string
  link: string
}

const PRODUCTS: Product[] = [/* ... keep your products array ... */]

const currencyFormatter = new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })
const MATCHA = '#BDECC6'

export default function App(){
  const [query,setQuery] = useState('')
  const [view,setView] = useState<'grid'|'table'>('grid')
  const [onlyLifetime,setOnlyLifetime] = useState(false)
  const [selectedCats,setSelectedCats] = useState<string[]>([])
  const [sortKey,setSortKey] = useState<'name'|'sixMonth'|'oneYear'|'lifetime'|'devices'>('name')
  const [sortDir,setSortDir] = useState<'asc'|'desc'>('asc')
  const [copiedName,setCopiedName] = useState<string|null>(null)

  const categories = useMemo(
    () => Array.from(new Set(PRODUCTS.flatMap(p=>p.category))).sort(),
    []
  )

  const filtered = useMemo(()=>{
    let list = PRODUCTS.filter(p => (p.name+' '+p.description+' '+p.category.join(' ')).toLowerCase().includes(query.toLowerCase()))
    if (onlyLifetime) list = list.filter(p=>p.prices.lifetime!=null)
    if (selectedCats.length) list = list.filter(p=> selectedCats.some(c=>p.category.includes(c))) // OR match
    // sort
    list = [...list].sort((a,b)=>{
      const dir = sortDir === 'asc' ? 1 : -1
      const val = (p: Product) => {
        if (sortKey === 'name') return p.name.toLowerCase()
        if (sortKey === 'devices') return p.devices ?? -Infinity
        return (p.prices as any)[sortKey] ?? Infinity
      }
      const av = val(a)
      const bv = val(b)
      if (av == null && bv == null) return 0
      if (av == null) return 1
      if (bv == null) return -1
      if (av < bv) return -1 * dir
      if (av > bv) return 1 * dir
      return 0
    })
    return list
  },[query,onlyLifetime,selectedCats,sortKey,sortDir])

  const lastUpdated = useMemo(()=> new Date().toLocaleString(), [])

  const toggleCat = (cat:string) => {
    setSelectedCats(prev => prev.includes(cat) ? prev.filter(c=>c!==cat) : [...prev, cat])
  }

  const clearFilters = () => {
    setSelectedCats([])
    setOnlyLifetime(false)
    setQuery('')
    setSortKey('name')
    setSortDir('asc')
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100">
      <style>{`
        .pill {
          display:inline-flex;align-items:center;gap:8px;padding:8px 12px;border-radius:9999px;
          border:1px solid #2f2f2f;background:#0f0f0f;font-size:12px;font-weight:600;cursor:pointer;
          user-select:none;transition:all .15s ease;
        }
        .pill:hover{border-color:#3a3a3a;background:#151515}
        .pill.active{border-color:${MATCHA}; color:${MATCHA}; box-shadow:0 0 12px ${MATCHA}55}
        .pill .dot{width:14px;height:14px;border-radius:9999px;border:2px solid currentColor;display:inline-block;position:relative}
        .pill.active .dot::after{
          content:""; position:absolute; inset:2px; border-radius:9999px; background:currentColor;
        }
        .chip{border:1px solid #2f2f2f;background:#0f0f0f}
        .chip.active{border-color:${MATCHA}; color:${MATCHA}; box-shadow:0 0 10px ${MATCHA}44}
        .header-btn{border:1px solid #2f2f2f;background:#0f0f0f}
        .header-btn:hover{background:#151515}
        .input{background:#0f0f0f;border:1px solid #2f2f2f;border-radius:14px;color:#e5e5e5}
        .input:focus{outline:none; box-shadow:0 0 0 2px #444}
      `}</style>

      {/* HEADER */}
      <header className="flex justify-between items-center px-6 py-4 border-b border-zinc-800 bg-zinc-950 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Logo" className="h-8 w-8 rounded" />
          <span className="text-xl font-bold">Pricing Catalog</span>
        </div>
        <a href="/shop" className="inline-flex items-center gap-2 rounded-full header-btn px-4 py-2 transition">
          <Store className="h-4 w-4"/> Shop
        </a>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <p className="text-sm text-zinc-400 mb-4">Updated daily, Last update: {lastUpdated}</p>

        {/* SEARCH + FILTERS */}
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"/>
            <input
              value={query}
              onChange={(e)=> setQuery(e.target.value)}
              placeholder="Search products, features, categories..."
              className="w-full input pl-10 pr-9 py-2"
            />
            {query && (
              <button
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-zinc-800"
                onClick={()=> setQuery('')}
              >
                <X className="h-4 w-4 text-zinc-400" />
              </button>
            )}
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 items-start">
            <button
              className={`pill ${selectedCats.length===0 ? 'active' : ''}`}
              onClick={()=> setSelectedCats([])}
              title="Show all categories"
            >
              All
            </button>
            <div className="flex flex-wrap gap-2">
              {categories.map(c=>(
                <button
                  key={c}
                  onClick={()=> toggleCat(c)}
                  className={`px-3 py-2 rounded-2xl chip ${selectedCats.includes(c)?'active':''}`}
                  title={c}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Lifetime + Sort */}
          <div className="flex items-stretch gap-2">
            <button
              className={`pill ${onlyLifetime ? 'active':''}`}
              onClick={()=> setOnlyLifetime(v=>!v)}
              aria-pressed={onlyLifetime}
              title="Show Lifetime only"
            >
              <span className="dot" />
              <span>Lifetime only</span>
            </button>

            <div className="flex-1 rounded-2xl border border-zinc-800 bg-zinc-900 px-3 py-2">
              <div className="text-sm mb-1 inline-flex items-center gap-1">
                <ArrowUpDown className="h-4 w-4" /> Sort by
              </div>
              <div className="flex gap-2">
                <select value={sortKey} onChange={(e)=> setSortKey(e.target.value as any)} className="flex-1 rounded-lg bg-black/40 border border-zinc-800 px-2 py-1">
                  <option value="name">Name</option>
                  <option value="sixMonth">6-Month price</option>
                  <option value="oneYear">1-Year price</option>
                  <option value="lifetime">Lifetime price</option>
                  <option value="devices">Devices</option>
                </select>
                <select value={sortDir} onChange={(e)=> setSortDir(e.target.value as any)} className="rounded-lg bg-black/40 border border-zinc-800 px-2 py-1">
                  <option value="asc">ASC</option>
                  <option value="desc">DESC</option>
                </select>
              </div>
            </div>

            <button onClick={clearFilters} className="pill" title="Reset filters">
              <RefreshCcw className="h-4 w-4" /> Reset
            </button>
          </div>
        </div>

        {/* TODO: keep rest of your grid/table product rendering code here, consume `filtered` instead of PRODUCTS */}
        {/* Example: {view==='grid' ? <Grid products={filtered}/> : <TableView products={filtered}/>} */}
      </div>
    </div>
  )
}
