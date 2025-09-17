import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Copy as CopyIcon, Table, LayoutGrid, ArrowUpDown, RefreshCcw, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Toggle } from "@/components/ui/toggle";

// --- Sample data (replace with your real data or fetch from an API) ---
const PRODUCTS = [
  {
    name: "Canva Pro",
    category: ["Design"],
    prices: { sixMonth: null, oneYear: null, lifetime: 10 },
    devices: Infinity,
    description: "Upgrade on your own email. Premium templates, stock media & HQ download.",
    link: "#",
  },
  {
    name: "Canva Pro + AI",
    category: ["Design", "AI"],
    prices: { sixMonth: null, oneYear: null, lifetime: 30 },
    devices: Infinity,
    description: "All Pro features + Magic Studio AI, background remover, custom fonts.",
    link: "#",
  },
  {
    name: "CapCut Pro",
    category: ["Video"],
    prices: { sixMonth: 12, oneYear: 15, lifetime: 35 },
    devices: 2,
    description: "New shared account. Filters, effects, transitions, 4K export.",
    link: "#",
  },
  {
    name: "Grammarly Premium",
    category: ["Writing", "AI"],
    prices: { sixMonth: null, oneYear: 20, lifetime: 35 },
    devices: 2,
    description: "New shared account. Advanced grammar, tone, plagiarism.",
    link: "#",
  },
  {
    name: "Spotify Premium",
    category: ["Streaming", "Music"],
    prices: { sixMonth: null, oneYear: 30, lifetime: 40 },
    devices: Infinity,
    description: "Upgrade on your email. Ad-free, offline, HQ audio.",
    link: "#",
  },
  {
    name: "QuillBot Premium",
    category: ["Writing", "AI"],
    prices: { sixMonth: null, oneYear: 20, lifetime: 35 },
    devices: 2,
    description: "New shared account. Unlimited paraphrasing, Docs integration.",
    link: "#",
  },
  {
    name: "Duolingo Plus",
    category: ["Education"],
    prices: { sixMonth: 8, oneYear: 15, lifetime: 20 },
    devices: Infinity,
    description: "Upgrade on your email. Ad-free, offline lessons, progress sync.",
    link: "#",
  },
  {
    name: "ChatGPT Plus",
    category: ["AI"],
    prices: { sixMonth: 20, oneYear: 40, lifetime: 60 },
    devices: 2,
    description: "Private Chat account. Priority access, faster replies.",
    link: "#",
  },
  {
    name: "Gemini Pro + Veo 3",
    category: ["AI", "Video"],
    prices: { sixMonth: null, oneYear: 45, lifetime: null },
    devices: Infinity,
    description: "New private account. Multimodal AI + Veo 3 cinema video AI.",
    link: "#",
  },
  {
    name: "Prime Video",
    category: ["Streaming"],
    prices: { sixMonth: 20, oneYear: 30, lifetime: 50 },
    devices: 2,
    description: "New profile account. Premium streaming.",
    link: "#",
  },
  {
    name: "Netflix Premium",
    category: ["Streaming"],
    prices: { sixMonth: 20, oneYear: 40, lifetime: 70 },
    devices: 2,
    description: "New profile account. Ultra HD streaming.",
    link: "#",
  },
  {
    name: "YouTube Premium",
    category: ["Streaming", "Music"],
    prices: { sixMonth: null, oneYear: 40, lifetime: 80 },
    devices: Infinity,
    description: "Upgrade on your email. Ad-free YouTube, downloads, background play.",
    link: "#",
  },
  {
    name: "NordVPN Premium",
    category: ["VPN", "Security"],
    prices: { sixMonth: null, oneYear: 20, lifetime: 40 },
    devices: 5,
    description: "New shared account. Secure VPN service.",
    link: "#",
  },
  {
    name: "IPVanish Premium",
    category: ["VPN", "Security"],
    prices: { sixMonth: null, oneYear: 20, lifetime: 40 },
    devices: 5,
    description: "New shared account. Unlimited bandwidth VPN.",
    link: "#",
  },
  {
    name: "Surfshark VPN",
    category: ["VPN", "Security"],
    prices: { sixMonth: null, oneYear: 20, lifetime: 40 },
    devices: 5,
    description: "New shared account. Multi-device VPN.",
    link: "#",
  },
  {
    name: "Coursera Plus",
    category: ["Education"],
    prices: { sixMonth: null, oneYear: 25, lifetime: null },
    devices: 2,
    description: "New shared account. Unlimited access to 7,000+ courses.",
    link: "#",
  },
  {
    name: "MS Office 365 + AI",
    category: ["Productivity", "AI"],
    prices: { sixMonth: null, oneYear: 30, lifetime: null },
    devices: 5,
    description: "New private account. Word, Excel, Outlook, Copilot AI.",
    link: "#",
  },
  {
    name: "Windows Pro (Genuine)",
    category: ["Utilities"],
    prices: { sixMonth: null, oneYear: 8, lifetime: null },
    devices: 1,
    description: "Activation key. Windows Professional license (genuine).",
    link: "#",
  },
  {
    name: "Freepik Premium",
    category: ["Design"],
    prices: { sixMonth: 15, oneYear: 30, lifetime: 40 },
    devices: 2,
    description: "New personal account. Premium assets, daily downloads.",
    link: "#",
  },
  {
    name: "IDM Premium",
    category: ["Utilities"],
    prices: { sixMonth: null, oneYear: null, lifetime: 10 },
    devices: 1,
    description: "Activation script. Internet Download Manager (Windows).",
    link: "#",
  },
  {
    name: "Google Drive (Upgrade)",
    category: ["Cloud", "Productivity"],
    prices: { sixMonth: null, oneYear: 35, lifetime: null },
    devices: Infinity,
    description: "Upgrade on your email. Extra storage & Workspace perks.",
    link: "#",
  },
];

const currencyFormatter = new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });

// --- Color system ---
// Light matcha green for prices
const MATCHA = "#BDECC6"; // tweak if you want it brighter/dimmer

// Brand-inspired title colors to match your reference screenshot
const TITLE_COLORS: Record<string, string> = {
  "Canva Pro": "#a78bfa", // violet
  "Canva Pro + AI": "#a78bfa",
  "CapCut": "#e5e7eb", // light gray
  "Grammarly": "#00A82D",
  "Spotify": "#1DB954",
  "QuillBot": "#2EAC68",
  "Duolingo": "#78C800",
  "ChatGPT": "#10a37f",
  "Gemini": "#22d3ee",
  "Prime Video": "#00A8E1",
  "Netflix": "#E50914",
  "YouTube": "#FF0000",
  "NordVPN": "#2F6CE5",
  "IPVanish": "#8BC34A",
  "Surfshark": "#00C3C1",
  "Coursera": "#2A73CC",
  "MS Office": "#D83B01",
  "Windows": "#00A4EF",
  "Freepik": "#1C9CEA",
  "IDM": "#9BE489",
  "Google Drive": "#F4B400",
};

const titleColor = (name: string) => {
  const matched = Object.entries(TITLE_COLORS).find(([key]) => name.toLowerCase().includes(key.toLowerCase()));
  return matched ? matched[1] : "#d1d5db"; // default zinc-300 if no match
};

function Price({ value }: { value: number | null }) {
  if (value === null || value === undefined) return <span className="text-muted-foreground">—</span>;
  return (
    <span className="font-bold drop-shadow" style={{ color: MATCHA }}>
      {currencyFormatter.format((Math.max(0, Math.round((value as number) * 100) - 1) / 100))}
    </span>
  );
}

const currencyCopyFmt = new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });

const adjustOneCent = (v: number) => Math.max(0, Math.round(v * 100) - 1) / 100;

const formatForCopy = (p: typeof PRODUCTS[number]) => {
  const lines: string[] = [];
  if (p.prices.sixMonth != null) lines.push(`6-Month: ${currencyCopyFmt.format(adjustOneCent(p.prices.sixMonth))}`);
  if (p.prices.oneYear != null) lines.push(`1-Year: ${currencyCopyFmt.format(adjustOneCent(p.prices.oneYear))}`);
  if (p.prices.lifetime != null) lines.push(`Lifetime: ${currencyCopyFmt.format(adjustOneCent(p.prices.lifetime))}`);
  const devices = p.devices === Infinity ? "∞" : String(p.devices);
  return `${p.name}

${lines.join("\n")}

Devices: ${devices}

${p.description}`;
};

const categories = Array.from(new Set(PRODUCTS.flatMap((p) => p.category))).sort();

type SortKey = "name" | "sixMonth" | "oneYear" | "lifetime" | "devices";

export default function PricingCatalog() {
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"grid" | "table">("grid");
  const [onlyLifetime, setOnlyLifetime] = useState(false);
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const [copiedName, setCopiedName] = useState<string | null>(null);

  const handleCopy = async (p: typeof PRODUCTS[number]) => {
    try {
      const text = formatForCopy(p);
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
      }
      setCopiedName(p.name);
      setTimeout(() => setCopiedName(null), 1500);
    } catch (e) {
      console.error('Copy failed', e);
    }
  };

  const filtered = useMemo(() => {
    let list = PRODUCTS.filter((p) =>
      [p.name, p.description, p.category.join(" ")]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase())
    );

    if (onlyLifetime) {
      list = list.filter((p) => p.prices.lifetime !== null);
    }
    if (selectedCats.length) {
      list = list.filter((p) => selectedCats.every((c) => p.category.includes(c)));
    }

    const getVal = (p: (typeof PRODUCTS)[number]) => {
      switch (sortKey) {
        case "name":
          return p.name.toLowerCase();
        case "sixMonth":
          return p.prices.sixMonth ?? Number.POSITIVE_INFINITY;
        case "oneYear":
          return p.prices.oneYear ?? Number.POSITIVE_INFINITY;
        case "lifetime":
          return p.prices.lifetime ?? Number.POSITIVE_INFINITY;
        case "devices":
          return p.devices === Infinity ? 9999 : p.devices;
      }
    };

    list.sort((a, b) => {
      const va = getVal(a);
      const vb = getVal(b);
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return list;
  }, [query, onlyLifetime, selectedCats, sortKey, sortDir]);

  const lastUpdated = useMemo(() => new Date().toLocaleString(), []);

  const exportCSV = () => {
    const rows = [
      ["Product", "Categories", "6-Month", "1-Year", "Lifetime", "Devices", "Description"],
      ...filtered.map((p) => [
        p.name,
        p.category.join("; "),
        p.prices.sixMonth ?? "",
        p.prices.oneYear ?? "",
        p.prices.lifetime ?? "",
        p.devices === Infinity ? "∞" : String(p.devices),
        p.description.replace(/\n/g, " "),
      ]),
    ];
    const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pricing-catalog-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black text-zinc-100">
      <div className="mx-auto max-w-7xl px-4 py-10">
        {/* Header */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Pricing Catalog</h1>
            <p className="text-sm text-zinc-400 mt-1">Updated daily • Last update: {lastUpdated}</p>
          </div>

          <div className="flex items-center gap-2">
            <Toggle
              pressed={view === "grid"}
              onPressedChange={() => setView(view === "grid" ? "table" : "grid")}
              className="rounded-2xl"
              aria-label="Toggle view"
            >
              {view === "grid" ? <Table className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
            </Toggle>

            <Button variant="secondary" className="rounded-2xl" onClick={() => window.location.reload()}>
              <RefreshCcw className="mr-2 h-4 w-4" /> Refresh
            </Button>
            <Button className="rounded-2xl" onClick={exportCSV}>
              <Download className="mr-2 h-4 w-4" /> Export CSV
            </Button>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <Input
              placeholder="Search products, features, categories..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9 bg-zinc-900/60 border-zinc-800 focus-visible:ring-zinc-600"
            />
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-start rounded-2xl border-zinc-800 bg-zinc-900/50">
                  <Filter className="mr-2 h-4 w-4" /> Filters
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64 bg-black/95 border-zinc-800">
                <DropdownMenuLabel>Categories</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {categories.map((c) => (
                  <DropdownMenuItem key={c} onSelect={(e) => { e.preventDefault(); setSelectedCats((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]); }}>
                    <div className={`mr-2 h-2 w-2 rounded-full ${selectedCats.includes(c) ? "bg-zinc-100" : "bg-zinc-700"}`} />
                    {c}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setOnlyLifetime((v) => !v); }}>
                  <div className={`mr-2 h-2 w-2 rounded ${onlyLifetime ? "bg-zinc-100" : "bg-zinc-700"}`} />
                  Has Lifetime pricing
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setSelectedCats([]); setOnlyLifetime(false); }}>Clear all</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-start rounded-2xl border-zinc-800 bg-zinc-900/50">
                  <ArrowUpDown className="mr-2 h-4 w-4" /> Sort by
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-black/95 border-zinc-800">
                {([
                  ["name", "Name"],
                  ["sixMonth", "6-Month price"],
                  ["oneYear", "1-Year price"],
                  ["lifetime", "Lifetime price"],
                  ["devices", "Devices"],
                ] as [SortKey, string][]).map(([key, label]) => (
                  <DropdownMenuItem key={key} onSelect={(e) => { e.preventDefault(); setSortKey(key); }}>
                    {label}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setSortDir((d) => (d === "asc" ? "desc" : "asc")); }}>
                  Direction: {sortDir.toUpperCase()}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Selected Filters */}
        {(selectedCats.length > 0 || onlyLifetime) && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {selectedCats.map((c) => (
              <Badge key={c} variant="secondary" className="rounded-full bg-zinc-800/80">
                {c}
              </Badge>
            ))}
            {onlyLifetime && (
              <Badge variant="secondary" className="rounded-full bg-zinc-800/80">Lifetime</Badge>
            )}
          </div>
        )}

        {/* Results */}
        {view === "grid" ? (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {filtered.map((p) => (
                <motion.div key={p.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
                  <Card className="group rounded-2xl border-zinc-800 bg-gradient-to-b from-zinc-900/70 to-black/60 backdrop-blur-sm hover:shadow-2xl hover:shadow-zinc-900/30 transition-all">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between gap-2">
                        <span className="truncate" style={{ color: titleColor(p.name) }}>{p.name}</span>
                        <button type="button" onClick={() => handleCopy(p)} className="inline-flex items-center gap-1 text-zinc-300 hover:text-white transition"><CopyIcon className="h-4 w-4" /><span className="text-sm">{copiedName === p.name ? 'Copied!' : 'Copy'}</span></button>
                      </CardTitle>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {p.category.map((c) => (
                          <Badge key={c} variant="outline" className="rounded-full border-zinc-700 text-zinc-300">
                            {c}
                          </Badge>
                        ))}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <div className="text-white font-bold">6-Month</div>
                          <div className="font-bold"><Price value={p.prices.sixMonth} /></div>
                        </div>
                        <div>
                          <div className="text-white font-bold">1-Year</div>
                          <div className="font-bold"><Price value={p.prices.oneYear} /></div>
                        </div>
                        <div>
                          <div className="text-white font-bold">Lifetime</div>
                          <div className="font-bold"><Price value={p.prices.lifetime} /></div>
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-zinc-300 leading-relaxed">
                        {p.description}
                      </p>
                      <div className="mt-3 text-xs text-zinc-400">Devices: {p.devices === Infinity ? "∞" : p.devices}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-800">
            <table className="w-full text-sm">
              <thead className="bg-zinc-900/60 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Product</th>
                  <th className="px-4 py-3 text-left">Categories</th>
                  <th className="px-4 py-3 text-left">6-Month</th>
                  <th className="px-4 py-3 text-left">1-Year</th>
                  <th className="px-4 py-3 text-left">Lifetime</th>
                  <th className="px-4 py-3 text-left">Devices</th>
                  <th className="px-4 py-3 text-left">Description</th>
                  <th className="px-4 py-3 text-left">Copy</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.name} className="border-t border-zinc-800 hover:bg-zinc-900/40">
                    <td className="px-4 py-3 font-medium" style={{ color: titleColor(p.name) }}>{p.name}</td>
                    <td className="px-4 py-3">{p.category.join(", ")}</td>
                    <td className="px-4 py-3"><Price value={p.prices.sixMonth} /></td>
                    <td className="px-4 py-3"><Price value={p.prices.oneYear} /></td>
                    <td className="px-4 py-3"><Price value={p.prices.lifetime} /></td>
                    <td className="px-4 py-3">{p.devices === Infinity ? "∞" : p.devices}</td>
                    <td className="px-4 py-3 text-zinc-300 max-w-[420px]">{p.description}</td>
                    <td className="px-4 py-3"><button type="button" onClick={() => handleCopy(p)} className="inline-flex items-center gap-1 text-zinc-200 hover:underline"><CopyIcon className="h-4 w-4" /><span>{copiedName === p.name ? 'Copied!' : 'Copy'}</span></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer note */}
        <div className="mt-10 text-center text-xs text-zinc-500">
          Made with ❤ — replace the sample data with your real prices or connect an API.
        </div>
      </div>
    </div>
  );
}
