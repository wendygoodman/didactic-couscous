import React, { useMemo, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Search, Table, LayoutGrid, ArrowUpDown, RefreshCcw, Download, Copy as CopyIcon, Store } from 'lucide-react'

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

  const categories = Array.from(new Set(PRODUCTS.flatMap(p=>p.category))).sort()

  const filtered = useMemo(()=>{
    let list = PRODUCTS.filter(p => (p.name+' '+p.description+' '+p.category.join(' ')).toLowerCase().includes(query.toLowerCase()))
    if (onlyLifetime) list = list.filter(p=>p.prices.lifetime!=null)
    if (selectedCats.length) list = list.filter(p=> selectedCats.every(c=>p.category.includes(c)))
    return list
  },[query,onlyLifetime,selectedCats,sortKey,sortDir])

  const lastUpdated = useMemo(()=> new Date().toLocaleString(), [])

  return (
    <div className="min-h-screen bg-black text-zinc-100">
      <style>{`
        .toggleMVP {
          position: relative;
          display: inline-flex;
          align-items: center;
          cursor: pointer;
          padding: 6px 14px;
          border-radius: 9999px;
          border: 1px solid #333;
          background: linear-gradient(135deg,#1f1f1f,#111);
          font-size: 14px;
          font-weight: 600;
        }
        .toggleMVP input {
          display: none;
        }
        .toggleMVP span {
          margin-left: 8px;
        }
        .toggleMVP.active {
          border-color: ${MATCHA};
          color: ${MATCHA};
          box-shadow: 0 0 10px ${MATCHA}55;
        }
      `}</style>

      {/* HEADER */}
      <header className="flex justify-between items-center px-6 py-4 border-b border-zinc-800 bg-zinc-950 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Logo" className="h-8 w-8 rounded" />
          <span className="text-xl font-bold">Pricing Catalog</span>
        </div>
        <button className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 hover:bg-zinc-800 transition">
          <Store className="h-4 w-4"/> Shop
        </button>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <p className="text-sm text-zinc-400 mb-4">Updated daily • Last update: {lastUpdated}</p>

        {/* SEARCH + FILTERS */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"/>
            <input value={query} onChange={(e)=> setQuery(e.target.value)} placeholder="Search products, features, categories..." className="w-full pl-9 rounded-2xl bg-zinc-900 border border-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-600 px-3 py-2"/>
          </div>

          {/* Categories + Lifetime */}
          <div className="flex gap-2">
            <select multiple size={3} onChange={(e)=> setSelectedCats(Array.from(e.target.selectedOptions).map(o=>o.value))} className="w-full rounded-2xl bg-zinc-900 border border-zinc-800 px-3 py-2">
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <label className={`toggleMVP ${onlyLifetime?'active':''}`}>
              <input type="checkbox" checked={onlyLifetime} onChange={(e)=> setOnlyLifetime(e.target.checked)} />
              <span>Lifetime only</span>
            </label>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <div className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-3 py-2">
              <div className="text-sm mb-1 inline-flex items-center gap-1"><ArrowUpDown className="h-4 w-4" /> Sort by</div>
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
          </div>
        </div>

        {/* TODO: keep rest of your grid/table product rendering code here */}
      </div>
    </div>
  )
}
