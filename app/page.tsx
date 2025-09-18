
'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, ShoppingCart, Plus, Minus, X, Check, ArrowUpDown, LayoutGrid, Table } from 'lucide-react'

type PlanLabel = '6-Month' | '1-Year' | 'Lifetime'
type CatalogSrc = {
  name: string
  category: string[]
  prices: { sixMonth: number | null; oneYear: number | null; lifetime: number | null }
  devices: number
  description: string
  link: string
}
type ShopProduct = {
  id: string
  name: string
  category: string[]
  description: string
  devices: number
  inStock: boolean
  plans: { label: PlanLabel; price: number }[]
  image: { src: string; alt: string; from: string; to: string }
}
type SortKey = 'relevance' | 'name' | 'priceAsc' | 'priceDesc'
type CartItem = { productId: string; plan: PlanLabel; unitPrice: number; qty: number }

const CATALOG_SRC: CatalogSrc[] = [
  { name: "Canva Pro", category: ["Design"], prices: { sixMonth: null, oneYear: null, lifetime: 10 }, devices: Number.POSITIVE_INFINITY, description: "Upgrade on your own email. Premium templates, stock media & HQ download.", link: "#" },
  { name: "Canva Pro + AI", category: ["Design", "AI"], prices: { sixMonth: null, oneYear: null, lifetime: 30 }, devices: Number.POSITIVE_INFINITY, description: "All Pro features + Magic Studio AI, background remover, custom fonts.", link: "#" },
  { name: "CapCut Pro", category: ["Video"], prices: { sixMonth: 12, oneYear: 15, lifetime: 35 }, devices: 2, description: "New shared account. Filters, effects, transitions, 4K export.", link: "#" },
  { name: "Grammarly Premium", category: ["Writing", "AI"], prices: { sixMonth: null, oneYear: 20, lifetime: 35 }, devices: 2, description: "New shared account. Advanced grammar, tone, plagiarism.", link: "#" },
  { name: "Spotify Premium", category: ["Streaming", "Music"], prices: { sixMonth: null, oneYear: 30, lifetime: 40 }, devices: Number.POSITIVE_INFINITY, description: "Upgrade on your email. Ad-free, offline, HQ audio.", link: "#" },
  { name: "QuillBot Premium", category: ["Writing", "AI"], prices: { sixMonth: null, oneYear: 20, lifetime: 35 }, devices: 2, description: "New shared account. Unlimited paraphrasing, Docs integration.", link: "#" },
  { name: "Duolingo Plus", category: ["Education"], prices: { sixMonth: 8, oneYear: 15, lifetime: 20 }, devices: Number.POSITIVE_INFINITY, description: "Upgrade on your email. Ad-free, offline lessons, progress sync.", link: "#" },
  { name: "ChatGPT Plus", category: ["AI"], prices: { sixMonth: 20, oneYear: 40, lifetime: 60 }, devices: 2, description: "Private Chat account. Priority access, faster replies.", link: "#" },
  { name: "Gemini Pro + Veo 3", category: ["AI", "Video"], prices: { sixMonth: null, oneYear: 45, lifetime: null }, devices: Number.POSITIVE_INFINITY, description: "New private account. Multimodal AI + Veo 3 cinema video AI.", link: "#" },
  { name: "Prime Video", category: ["Streaming"], prices: { sixMonth: 20, oneYear: 30, lifetime: 50 }, devices: 2, description: "New profile account. Premium streaming.", link: "#" },
  { name: "Netflix Premium", category: ["Streaming"], prices: { sixMonth: 20, oneYear: 40, lifetime: 70 }, devices: 2, description: "New profile account. Ultra HD streaming.", link: "#" },
  { name: "YouTube Premium", category: ["Streaming", "Music"], prices: { sixMonth: null, oneYear: 40, lifetime: 80 }, devices: Number.POSITIVE_INFINITY, description: "Upgrade on your email. Ad-free YouTube, downloads, background play.", link: "#" },
  { name: "NordVPN Premium", category: ["VPN", "Security"], prices: { sixMonth: null, oneYear: 20, lifetime: 40 }, devices: 5, description: "New shared account. Secure VPN service.", link: "#" },
  { name: "IPVanish Premium", category: ["VPN", "Security"], prices: { sixMonth: null, oneYear: 20, lifetime: 40 }, devices: 5, description: "New shared account. Unlimited bandwidth VPN.", link: "#" },
  { name: "Surfshark VPN", category: ["VPN", "Security"], prices: { sixMonth: null, oneYear: 20, lifetime: 40 }, devices: 5, description: "New shared account. Multi-device VPN.", link: "#" },
  { name: "Coursera Plus", category: ["Education"], prices: { sixMonth: null, oneYear: 25, lifetime: null }, devices: 2, description: "New shared account. Unlimited access to 7,000+ courses.", link: "#" },
  { name: "MS Office 365 + AI", category: ["Productivity", "AI"], prices: { sixMonth: null, oneYear: 30, lifetime: null }, devices: 5, description: "New private account. Word, Excel, Outlook, Copilot AI.", link: "#" },
  { name: "Windows Pro (Genuine)", category: ["Utilities"], prices: { sixMonth: null, oneYear: 8, lifetime: null }, devices: 1, description: "Activation key. Windows Professional license (genuine).", link: "#" },
  { name: "Freepik Premium", category: ["Design"], prices: { sixMonth: 15, oneYear: 30, lifetime: 40 }, devices: 2, description: "New personal account. Premium assets, daily downloads.", link: "#" },
  { name: "IDM Premium", category: ["Utilities"], prices: { sixMonth: null, oneYear: null, lifetime: 10 }, devices: 1, description: "Activation script. Internet Download Manager (Windows).", link: "#" },
  { name: "Google Drive (Upgrade)", category: ["Cloud", "Productivity"], prices: { sixMonth: null, oneYear: 35, lifetime: null }, devices: Number.POSITIVE_INFINITY, description: "Upgrade on your email. Extra storage & Workspace perks.", link: "#" },
]

const currency = new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })
const adjust = (v: number) => Math.max(0, Math.round(v * 100) - 1) / 100

const PRODUCTS: ShopProduct[] = CATALOG_SRC.map((s, i) => {
  const plans: { label: PlanLabel; price: number }[] = []
  if (s.prices.sixMonth != null) plans.push({ label: '6-Month', price: adjust(s.prices.sixMonth) })
  if (s.prices.oneYear != null) plans.push({ label: '1-Year', price: adjust(s.prices.oneYear) })
  if (s.prices.lifetime != null) plans.push({ label: 'Lifetime', price: adjust(s.prices.lifetime) })
  return {
    id: 'p' + (i + 1),
    name: s.name,
    category: s.category,
    description: s.description,
    devices: s.devices,
    inStock: plans.length > 0,
    plans,
    image: { src: '/hanuman-logo.png', alt: s.name + ' logo', from: '#333', to: '#000' },
  }
})

export default function Page() {
  // favicon
  useEffect(() => {
    const href = '/hanuman-logo.png'
    let link = document.querySelector(\"link[rel='icon']\") as HTMLLinkElement | null
    if (!link) {
      link = document.createElement('link')
      link.rel = 'icon'
      link.type = 'image/png'
      document.head.appendChild(link)
    }
    link.href = href
  }, [])

  const [query, setQuery] = useState('')
  const [selectedCats, setSelectedCats] = useState<string[]>([])
  const [sortKey, setSortKey] = useState<SortKey>('relevance')
  const [view, setView] = useState<'grid' | 'table'>('grid')

  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [picker, setPicker] = useState<{open:boolean, productId:string|null}>({open:false, productId:null})

  // QR modal
  const [qr, setQr] = useState<{open:boolean, url?:string, img?:string, amount?:number, orderId?:string}>({open:false})

  const categories = useMemo(() => Array.from(new Set(PRODUCTS.flatMap(p => p.category))).sort(), [])
  const filtered = useMemo(() => {
    let list = PRODUCTS.filter(p => {
      const bag = `${p.name} ${p.description} ${p.category.join(' ')}`.toLowerCase()
      const q = query.trim().toLowerCase()
      const matchesQ = !q || bag.includes(q)
      const matchesCats = selectedCats.length === 0 || selectedCats.every(c => p.category.includes(c))
      return matchesQ && matchesCats
    })
    switch (sortKey) {
      case 'name': list.sort((a,b)=>a.name.localeCompare(b.name)); break
      case 'priceAsc': list.sort((a,b)=> (a.plans[0]?.price||0) - (b.plans[0]?.price||0)); break
      case 'priceDesc': list.sort((a,b)=> (b.plans[0]?.price||0) - (a.plans[0]?.price||0)); break
      default: break
    }
    return list
  }, [query, selectedCats, sortKey])

  const cartCount = cart.reduce((s,i)=>s+i.qty,0)
  const map = new Map(PRODUCTS.map(p=>[p.id, p]))

  const addToCart = (id:string, plan:PlanLabel, unitPrice:number, qty=1)=>{
    setCart(prev=>{
      const idx = prev.findIndex(i=> i.productId===id && i.plan===plan && i.unitPrice===unitPrice)
      if (idx === -1) return [...prev, {productId:id, plan, unitPrice, qty}]
      const next = [...prev]; next[idx] = {...next[idx], qty: next[idx].qty + qty}; return next
    })
    setCartOpen(true)
  }
  const subtotal = cart.reduce((s,i)=> s + i.qty * i.unitPrice, 0)

  const checkout = async ()=>{
    const orderId = `HL-${Date.now()}`
    const res = await fetch('/api/payway/create-payment-link', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ orderId, amount: Number(subtotal.toFixed(2)) })})
    const data = await res.json()
    if (!res.ok) { alert(data.error || 'Payment error'); return }
    setQr({open:true, url: data.url, img: data.qr, amount: data.amount, orderId})
  }

  const lastUpdated = useMemo(()=> new Date().toLocaleString(), [])

  return (
    <div className="min-h-screen from-zinc-900 via-black to-black text-zinc-100">
      <style>{`
        .cardFX{position:relative;border:1px solid rgb(39 39 42);background:linear-gradient(180deg,rgba(24,24,28,.75),rgba(8,8,10,.6));border-radius:1rem}
        .pill{border:1px solid rgb(63 63 70);background:rgba(24,24,27,.5);border-radius:9999px}
        .logo-glow{color:#ab7e57;text-shadow:0 0 8px rgba(171,126,87,.9),0 0 22px rgba(171,126,87,.6),0 0 40px rgba(171,126,87,.45)}
        .price-mvp{font-weight:900;letter-spacing:.2px;color:#BDECC6;text-shadow:0 0 10px rgba(255,255,255,1),0 0 26px rgba(255,255,255,.85),0 0 48px rgba(255,255,255,.6)}
        .nav-btn{padding:.5rem 1rem;border-radius:9999px;border:1px solid rgb(63 63 70);background:rgba(24,24,27,.6);transition:all .2s ease}
        .nav-btn:hover{background:#18181b;border-color:#fff;color:#fff;box-shadow:0 0 12px rgba(255,255,255,.5)}
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-black/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <img src="/hanuman-logo.png" alt="Hanuman License" className="h-10 w-10 rounded-full" />
            <span className="font-bold tracking-wide text-lg logo-glow">Hanuman License</span>
          </a>
          <nav className="flex items-center gap-3">
            <a className="nav-btn" href="#shop" onClick={(e)=>{e.preventDefault(); document.querySelector('#shop')?.scrollIntoView({behavior:'smooth'})}}>Shop</a>
            <a className="nav-btn" href="https://t.me/hanumanlicense" target="_blank" rel="noopener noreferrer">Contact</a>
            <button className="nav-btn relative inline-flex items-center gap-2" onClick={()=>setCartOpen(true)}>
              <ShoppingCart className="h-4 w-4"/><span>Cart</span>
              {cartCount>0 && <span className="absolute -top-2 -right-2 rounded-full bg-emerald-500 text-black text-xs font-bold px-2 py-0.5">{cartCount}</span>}
            </button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 pt-10">
        <div className="rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900/70 to-black/60 p-6">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Discover premium digital kits</h1>
          <p className="text-zinc-400 mt-2">Hand-picked tools & assets to accelerate your work. Updated daily • Last update: {lastUpdated}</p>
        </div>
      </section>

      {/* Controls */}
      <section id="shop" className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 items-start">
          <div className="flex flex-col gap-4 sm:col-span-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
              <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search products, features, categories..." className="h-10 w-full rounded-2xl border border-zinc-800 bg-zinc-900/60 px-3 pl-10 focus:outline-none focus:ring-2 focus:ring-zinc-600" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">Filters</span>
              {(selectedCats.length>0 || query) && <button onClick={()=>{setSelectedCats([]);setQuery('')}} className="text-xs px-2 py-1 rounded-full border border-zinc-700 bg-zinc-900/60 hover:bg-zinc-800/70 transition">Clear</button>}
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map(c=>{
                const active = selectedCats.includes(c)
                return <button key={c} onClick={()=> setSelectedCats(prev=> prev.includes(c)? prev.filter(x=>x!==c) : [...prev,c])} className={`px-3 py-1 rounded-full border text-sm transition ${active?'bg-zinc-700 border-zinc-500 text-white':'bg-zinc-900/50 border-zinc-800 text-zinc-300 hover:bg-zinc-800/70'}`}>{c}</button>
              })}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/50 px-3 py-2">
              <div className="text-sm mb-1 inline-flex items-center gap-1"><ArrowUpDown className="h-4 w-4"/> Sort by</div>
              <select value={sortKey} onChange={e=>setSortKey(e.target.value as SortKey)} className="w-full rounded-lg bg-black/40 border border-zinc-800 px-2 py-2">
                <option value="relevance">Relevance</option>
                <option value="name">Name (A–Z)</option>
                <option value="priceAsc">Min Price (Low → High)</option>
                <option value="priceDesc">Min Price (High → Low)</option>
              </select>
            </div>
            <div className="inline-flex gap-2">
              <button onClick={()=>setView('grid')} className={`pill px-3 py-2 inline-flex items-center gap-2 ${view==='grid'?'border-emerald-500 text-emerald-400':''}`}><LayoutGrid className="h-4 w-4"/>Grid</button>
              <button onClick={()=>setView('table')} className={`pill px-3 py-2 inline-flex items-center gap-2 ${view==='table'?'border-emerald-500 text-emerald-400':''}`}><Table className="h-4 w-4"/>Table</button>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="mx-auto max-w-7xl px-4 pb-14">
        {view==='grid'? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {filtered.map(p=>(
                <motion.div key={p.id} layout initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} className="cardFX p-4">
                  <div className="mx-auto h-36 w-36 rounded-full overflow-hidden border border-zinc-800 flex items-center justify-center select-none" style={{background: `linear-gradient(135deg, ${p.image.from} 0%, ${p.image.to} 100%)`}}>
                    <img src={p.image.src} alt={p.image.alt} className="h-full w-full object-contain p-4 rounded-full" />
                  </div>
                  <div className="mt-3 flex items-start justify-between gap-2">
                    <div>
                      <div className="font-semibold leading-tight">{p.name}</div>
                      <div className="mt-1 text-sm text-zinc-400">{p.category.join(' • ')}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-white">
                        {p.plans.length>0 ? <span>from <span className="price-mvp">{currency.format(Math.min(...p.plans.map(pl=>pl.price)))}</span></span> : 'N/A'}
                      </div>
                      <div className={`text-xs ${p.inStock?'text-emerald-400':'text-zinc-500'}`}>{p.inStock?'In stock':'Out of stock'}</div>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-zinc-300">{p.description}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <button disabled={!p.inStock} onClick={()=> setPicker({open:true, productId:p.id})} className={`px-3 py-2 rounded-xl border transition inline-flex items-center gap-2 ${p.inStock?'border-emerald-600 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-300':'border-zinc-700 bg-zinc-900/40 text-zinc-500 cursor-not-allowed'}`}>
                      <Plus className="h-4 w-4"/>Add to cart
                    </button>
                    {cart.find(i=>i.productId===p.id) && <span className="text-xs text-emerald-400 inline-flex items-center gap-1"><Check className="h-4 w-4"/>In cart</span>}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-zinc-800">
            <table className="w-full text-sm">
              <thead className="bg-zinc-900/60 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Product</th>
                  <th className="px-4 py-3 text-left">Categories</th>
                  <th className="px-4 py-3 text-left">Description</th>
                  <th className="px-4 py-3 text-right">From</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p=>(
                  <tr key={p.id} className="border-t border-zinc-800">
                    <td className="px-4 py-3 font-medium">{p.name}</td>
                    <td className="px-4 py-3">{p.category.join(', ')}</td>
                    <td className="px-4 py-3 text-zinc-300">{p.description}</td>
                    <td className="px-4 py-3 text-right text-sm text-white">{p.plans.length>0 ? <span className="price-mvp">{currency.format(Math.min(...p.plans.map(pl=>pl.price)))}</span> : 'N/A'}</td>
                    <td className="px-4 py-3 text-right">
                      <button disabled={!p.inStock} onClick={()=> setPicker({open:true, productId:p.id})} className={`px-3 py-1.5 rounded-lg border transition inline-flex items-center gap-2 ${p.inStock?'border-emerald-600 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-300':'border-zinc-700 bg-zinc-900/40 text-zinc-500 cursor-not-allowed'}`}>
                        <Plus className="h-4 w-4"/>Add
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="mx-auto max-w-7xl px-4 pb-10">
        <div className="text-center text-xs text-zinc-500">© {new Date().getFullYear()} Hanuman License — MVP shop theme.</div>
      </footer>

      {/* Plan Picker Modal */}
      <AnimatePresence>
        {picker.open && picker.productId && (
          <>
            <motion.div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=> setPicker({open:false, productId:null})} />
            <motion.div role="dialog" aria-modal="true" initial={{y:50,opacity:0}} animate={{y:0,opacity:1}} exit={{y:50,opacity:0}} transition={{type:'spring', stiffness:240, damping:22}} className="fixed inset-x-4 top-20 z-[80] mx-auto max-w-lg rounded-2xl border border-zinc-800 bg-zinc-950">
              {(()=>{
                const p = map.get(picker.productId!)
                if (!p) return null
                const order = { '6-Month':0, '1-Year':1, 'Lifetime':2 } as any
                const plans = [...p.plans].sort((a,b)=> order[a.label]-order[b.label])
                return (
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="h-16 w-16 flex-shrink-0 rounded-full overflow-hidden border border-zinc-800 flex items-center justify-center" style={{background:`linear-gradient(135deg, ${p.image.from} 0%, ${p.image.to} 100%)`}}>
                        <img src={p.image.src} alt={p.image.alt} className="h-full w-full object-contain p-2 rounded-full"/>
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold">{p.name}</div>
                        <div className="text-xs text-zinc-400">{p.category.join(' • ')}</div>
                      </div>
                      <button className="pill px-2 py-1" onClick={()=> setPicker({open:false, productId:null})}><X className="h-4 w-4"/></button>
                    </div>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {plans.map(pl=>(
                        <button key={pl.label} onClick={()=>{ addToCart(p.id, pl.label, pl.price, 1); setPicker({open:false, productId:null}) }} className="rounded-xl border border-zinc-700 bg-zinc-900/40 hover:bg-zinc-900/70 transition p-3 text-left">
                          <div className="text-xs text-zinc-400">{pl.label}</div>
                          <div className="text-sm font-semibold text-white"><span className="price-mvp">{currency.format(pl.price)}</span></div>
                        </button>
                      ))}
                    </div>
                    <p className="mt-3 text-xs text-zinc-500 leading-relaxed">Choose a duration to add this product to your cart.</p>
                  </div>
                )
              })()}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {cartOpen && (
          <motion.aside initial={{x:420}} animate={{x:0}} exit={{x:420}} transition={{type:'spring', stiffness:260, damping:26}} className="fixed top-0 right-0 h-full w-[92vw] max-w-md bg-black/95 border-l border-zinc-800 z-[90] shadow-2xl">
            <div className="h-full flex flex-col">
              <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
                <div className="inline-flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5"/><span className="font-semibold">Your Cart</span><span className="text-xs text-zinc-400">({cartCount})</span>
                </div>
                <button className="pill px-3 py-1.5" onClick={()=> setCartOpen(false)}><X className="h-4 w-4"/></button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {cart.length===0? <div className="p-6 text-zinc-400">Your cart is empty.</div> : (
                  <ul className="divide-y divide-zinc-800">
                    {cart.map((line, idx)=>{
                      const p = map.get(line.productId)!
                      const total = line.qty * line.unitPrice
                      return (
                        <li key={idx} className="p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="font-medium leading-tight">{p.name}</div>
                              <div className="text-xs text-zinc-400 mt-0.5">{p.category.join(' • ')}</div>
                              <div className="text-xs text-zinc-400 mt-1">Plan: <span className="text-zinc-200">{line.plan}</span></div>
                              <div className="text-sm text-zinc-300 mt-2"><span className="price-mvp">{currency.format(line.unitPrice)}</span> each</div>
                            </div>
                            <button className="text-zinc-400 hover:text-white" onClick={()=> setCart(prev=> prev.filter((i,ii)=> ii!==idx))}><X className="h-4 w-4"/></button>
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <div className="inline-flex items-center gap-2">
                              <button className="pill px-2 py-1" onClick={()=> setCart(prev=> prev.map((i,ii)=> ii===idx? {...i, qty: Math.max(0, i.qty-1)}:i))}><Minus className="h-4 w-4"/></button>
                              <span className="w-8 text-center">{line.qty}</span>
                              <button className="pill px-2 py-1" onClick={()=> setCart(prev=> prev.map((i,ii)=> ii===idx? {...i, qty: i.qty+1}:i))}><Plus className="h-4 w-4"/></button>
                            </div>
                            <div className="font-semibold"><span className="price-mvp">{currency.format(total)}</span></div>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>

              <div className="p-4 border-t border-zinc-800">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400">Subtotal</span>
                  <span className="font-semibold price-mvp">{currency.format(subtotal)}</span>
                </div>
                <button disabled={cart.length===0} onClick={checkout} className={`mt-3 w-full rounded-xl border px-3 py-2 transition ${cart.length===0?'cursor-not-allowed border-zinc-700 bg-zinc-900/40 text-zinc-500':'border-emerald-600 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-300'}`}>
                  Proceed to checkout
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* QR Modal */}
      <AnimatePresence>
        {qr.open && (
          <>
            <motion.div className="fixed inset-0 z-[95] bg-black/60 backdrop-blur-sm" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=> setQr({open:false})}/>
            <motion.div role="dialog" aria-modal="true" initial={{scale:.95,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:.95,opacity:0}} className="fixed inset-x-4 top-24 z-[100] mx-auto max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
              <div className="text-center">
                <h3 className="font-semibold">Scan to Pay</h3>
                <div className="mt-1 text-sm text-zinc-400">Amount: <span className="price-mvp">{currency.format(qr.amount || 0)}</span></div>
                {qr.img? <img src={qr.img} alt="Payment QR" className="mx-auto mt-4 h-56 w-56 rounded-lg bg-white p-2"/> : <div className="mt-4 text-zinc-400">Preparing QR…</div>}
                <div className="mt-4 flex items-center justify-center gap-2">
                  <a className="nav-btn" href={qr.url} target="_blank" rel="noopener noreferrer">Open PayWay</a>
                  <button className="nav-btn" onClick={()=> navigator.clipboard.writeText(qr.url || '')}>Copy link</button>
                </div>
                <button className="mt-4 text-xs text-zinc-400 hover:text-white" onClick={()=> setQr({open:false})}>Close</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
