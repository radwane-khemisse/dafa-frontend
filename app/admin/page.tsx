"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  Activity,
  Banknote,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  Lock,
  MousePointerClick,
  PackageCheck,
  RotateCcw,
  Search,
  ShoppingCart,
  TrendingUp,
  X,
  type LucideIcon,
} from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
const DEFAULT_CONFIRMATION_RATE = 55;
const DEFAULT_DELIVERY_RATE = 55;

type AdminTab = "overview" | "orders" | "markets" | "catalog" | "profit";

type MarketFees = {
  fxToUsd: number;
  leadFeeUsd: number;
  callCenterConfirmationFeeUsd: number;
  callCenterDeliveredFeeUsd: number;
  shippingDeliveredFeeUsd: number;
  shippingReturnedFeeUsd: number;
  codFeePercent: number;
};

const DEFAULT_MARKET_FEES: Record<string, MarketFees> = {
  ksa: { fxToUsd: 0.2667, leadFeeUsd: 0.5, callCenterConfirmationFeeUsd: 1, callCenterDeliveredFeeUsd: 2, shippingDeliveredFeeUsd: 4.99, shippingReturnedFeeUsd: 2.99, codFeePercent: 5 },
  kwt: { fxToUsd: 3.25, leadFeeUsd: 0.5, callCenterConfirmationFeeUsd: 1, callCenterDeliveredFeeUsd: 2, shippingDeliveredFeeUsd: 6.99, shippingReturnedFeeUsd: 5.99, codFeePercent: 5 },
  uae: { fxToUsd: 0.2723, leadFeeUsd: 0.5, callCenterConfirmationFeeUsd: 1, callCenterDeliveredFeeUsd: 2, shippingDeliveredFeeUsd: 5.99, shippingReturnedFeeUsd: 4.99, codFeePercent: 5 },
  qat: { fxToUsd: 0.2747, leadFeeUsd: 0.5, callCenterConfirmationFeeUsd: 1, callCenterDeliveredFeeUsd: 2, shippingDeliveredFeeUsd: 6.99, shippingReturnedFeeUsd: 5.99, codFeePercent: 5 },
  bhr: { fxToUsd: 2.65, leadFeeUsd: 0.5, callCenterConfirmationFeeUsd: 1, callCenterDeliveredFeeUsd: 2, shippingDeliveredFeeUsd: 6.99, shippingReturnedFeeUsd: 5.99, codFeePercent: 5 },
  omn: { fxToUsd: 2.6, leadFeeUsd: 0.5, callCenterConfirmationFeeUsd: 1, callCenterDeliveredFeeUsd: 2, shippingDeliveredFeeUsd: 6.99, shippingReturnedFeeUsd: 5.99, codFeePercent: 5 },
};

type DashboardData = {
  range: { start: string; end: string };
  metrics: {
    visitors: number;
    clicks: number;
    product_views: number;
    add_to_cart: number;
    checkout: number;
    orders: number;
    revenue: number;
    aov: number;
    conversion_rate: number;
    checkout_rate: number;
    cart_rate: number;
  };
  daily: Array<{
    date: string;
    visitors: number;
    clicks: number;
    add_to_cart: number;
    checkout: number;
    orders: number;
    revenue: number;
  }>;
  top_products: Array<{ product_id: string; title: string; orders: number; revenue: number }>;
  top_campaigns: Array<{ campaign: string; events: number; visitors: number }>;
  recent_orders: AdminOrder[];
};

type AdminOrder = {
  id: number;
  public_order_id: string;
  created_at: string;
  customer_name: string;
  phone_e164: string;
  status: string;
  subtotal: number;
  delivery_fee: number;
  discount: number;
  total: number;
  currency: string;
  market_code?: string;
  payment_method: string;
  upsell_accepted: boolean;
  source_url?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  city?: string;
  country?: string;
  items: Array<{
    product_id: string;
    title_ar: string;
    offer_id: string;
    quantity: number;
    unit_price: number;
    total_price: number;
  }>;
};

type CatalogItem = {
  type: "product" | "pack";
  id: string;
  slug: string;
  name_ar: string;
  name_en: string;
  hidden: boolean;
  market_codes: string[];
  product_ids?: string[];
  offers?: AdminOffer[];
  prices?: Record<string, number>;
  details?: Record<string, MarketDetail>;
};

type AdminOffer = {
  id: string;
  label_ar: string;
  quantity: number;
  prices: Record<string, number>;
};

type MarketDetail = {
  sku: string;
  cost: number;
};

type MarketConfig = {
  code: string;
  country_code: string;
  country_name_ar: string;
  country_name_en: string;
  active: boolean;
  currency: string;
  market_code: string;
};

type SkuOption = {
  key: string;
  item: CatalogItem;
  offer?: AdminOffer;
  market: MarketConfig;
  sku: string;
  costLocal: number;
  priceLocal: number;
  quantity: number;
  label: string;
  priceLabel: string;
};

function isoDate(daysAgo: number) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().slice(0, 10);
}

export default function AdminPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useState("");
  const [start, setStart] = useState(isoDate(7));
  const [end, setEnd] = useState(isoDate(0));
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [data, setData] = useState<DashboardData | null>(null);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [catalog, setCatalog] = useState<{ markets: MarketConfig[]; products: CatalogItem[]; packs: CatalogItem[] }>({ markets: [], products: [], packs: [] });
  const [marketFees, setMarketFees] = useState<Record<string, MarketFees>>(DEFAULT_MARKET_FEES);
  const [selectedMarkets, setSelectedMarkets] = useState<string[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const headers = useMemo(() => (auth ? { Authorization: `Basic ${auth}` } : undefined), [auth]);

  function updateMarketFees(marketCode: string, next: Partial<MarketFees>) {
    setMarketFees((current) => ({
      ...current,
      [marketCode]: { ...marketFeeFor(current, marketCode), ...next },
    }));
  }

  async function loadDashboard(nextAuth = auth) {
    if (!nextAuth) return;
    setLoading(true);
    setError("");
    try {
      const query = buildQuery(start, end, selectedMarkets);
      const [dashboardResponse, ordersResponse, catalogResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/admin/dashboard?${query}`, { headers: { Authorization: `Basic ${nextAuth}` } }),
        fetch(`${API_BASE_URL}/admin/orders?${query}`, { headers: { Authorization: `Basic ${nextAuth}` } }),
        fetch(`${API_BASE_URL}/admin/catalog`, { headers: { Authorization: `Basic ${nextAuth}` } }),
      ]);
      if (!dashboardResponse.ok || !ordersResponse.ok || !catalogResponse.ok) throw new Error("Login failed or admin API is not ready.");
      const dashboardJson = (await dashboardResponse.json()) as DashboardData;
      const ordersJson = (await ordersResponse.json()) as { orders: AdminOrder[] };
      const catalogJson = (await catalogResponse.json()) as { markets: MarketConfig[]; products: CatalogItem[]; packs: CatalogItem[] };
      setData(dashboardJson);
      setOrders(ordersJson.orders);
      setCatalog(catalogJson);
    } catch (exc) {
      setError(exc instanceof Error ? exc.message : "Could not load dashboard.");
    } finally {
      setLoading(false);
    }
  }

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextAuth = btoa(`${username}:${password}`);
    setAuth(nextAuth);
    void loadDashboard(nextAuth);
  }

  function toggleMarketFilter(marketCode: string, checked: boolean) {
    setSelectedMarkets((current) =>
      checked ? Array.from(new Set([...current, marketCode])) : current.filter((code) => code !== marketCode),
    );
  }

  async function updateCatalogItem(item: CatalogItem, hidden: boolean) {
    if (!headers) return;
    setError("");
    setCatalog((current) => ({
      ...current,
      products: current.products.map((product) => (product.type === item.type && product.id === item.id ? { ...product, hidden } : product)),
      packs: current.packs.map((pack) => (pack.type === item.type && pack.id === item.id ? { ...pack, hidden } : pack)),
    }));
    try {
      const response = await fetch(`${API_BASE_URL}/admin/catalog/${item.type}/${item.id}/visibility`, {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ hidden }),
      });
      if (!response.ok) throw new Error("Could not update catalog visibility.");
      void loadDashboard();
    } catch (exc) {
      setError(exc instanceof Error ? exc.message : "Could not update catalog visibility.");
      void loadDashboard();
    }
  }

  async function updateMarket(market: MarketConfig, next: Partial<Pick<MarketConfig, "active" | "currency">>) {
    if (!headers) return;
    const updated = { ...market, ...next, currency: (next.currency ?? market.currency).trim() };
    setCatalog((current) => ({
      ...current,
      markets: current.markets.map((item) => (item.code === market.code ? updated : item)),
    }));
    try {
      const response = await fetch(`${API_BASE_URL}/admin/markets/${market.code}`, {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ active: updated.active, currency: updated.currency }),
      });
      if (!response.ok) throw new Error("Could not update market.");
      void loadDashboard();
    } catch (exc) {
      setError(exc instanceof Error ? exc.message : "Could not update market.");
      void loadDashboard();
    }
  }

  async function updateCatalogMarkets(item: CatalogItem, marketCode: string, checked: boolean) {
    if (!headers) return;
    const nextMarketCodes = checked
      ? Array.from(new Set([...item.market_codes, marketCode]))
      : item.market_codes.filter((code) => code !== marketCode);
    setCatalog((current) => ({
      ...current,
      products: current.products.map((product) => (product.type === item.type && product.id === item.id ? { ...product, market_codes: nextMarketCodes } : product)),
      packs: current.packs.map((pack) => (pack.type === item.type && pack.id === item.id ? { ...pack, market_codes: nextMarketCodes } : pack)),
    }));
    try {
      const response = await fetch(`${API_BASE_URL}/admin/catalog/${item.type}/${item.id}/markets`, {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ market_codes: nextMarketCodes }),
      });
      if (!response.ok) throw new Error("Could not update market visibility.");
      void loadDashboard();
    } catch (exc) {
      setError(exc instanceof Error ? exc.message : "Could not update market visibility.");
      void loadDashboard();
    }
  }

  async function updateOfferPrice(item: CatalogItem, offer: AdminOffer, marketCode: string, price: number) {
    if (!headers || item.type !== "product" || !Number.isFinite(price) || price < 0) return;
    setCatalog((current) => ({
      ...current,
      products: current.products.map((product) => {
        if (product.id !== item.id) return product;
        return {
          ...product,
          offers: product.offers?.map((currentOffer) =>
            currentOffer.id === offer.id
              ? { ...currentOffer, prices: { ...currentOffer.prices, [marketCode]: price } }
              : currentOffer,
          ),
        };
      }),
    }));
    try {
      const response = await fetch(`${API_BASE_URL}/admin/catalog/products/${item.id}/offers/${offer.id}/prices`, {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ market_code: marketCode, price }),
      });
      if (!response.ok) throw new Error("Could not update offer price.");
      void loadDashboard();
    } catch (exc) {
      setError(exc instanceof Error ? exc.message : "Could not update offer price.");
      void loadDashboard();
    }
  }

  async function updatePackPrice(item: CatalogItem, marketCode: string, price: number) {
    if (!headers || item.type !== "pack" || !Number.isFinite(price) || price < 0) return;
    setCatalog((current) => ({
      ...current,
      packs: current.packs.map((pack) =>
        pack.id === item.id ? { ...pack, prices: { ...pack.prices, [marketCode]: price } } : pack,
      ),
    }));
    try {
      const response = await fetch(`${API_BASE_URL}/admin/catalog/packs/${item.id}/prices`, {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ market_code: marketCode, price }),
      });
      if (!response.ok) throw new Error("Could not update pack price.");
      void loadDashboard();
    } catch (exc) {
      setError(exc instanceof Error ? exc.message : "Could not update pack price.");
      void loadDashboard();
    }
  }

  async function updateCatalogDetail(item: CatalogItem, marketCode: string, detail: MarketDetail) {
    if (!headers || !Number.isFinite(detail.cost) || detail.cost < 0 || !detail.sku.trim()) return;
    const normalized = { sku: detail.sku.trim(), cost: detail.cost };
    const key = item.type === "product" ? "products" : "packs";
    setCatalog((current) => ({
      ...current,
      [key]: current[key].map((catalogItem) =>
        catalogItem.id === item.id ? { ...catalogItem, details: { ...catalogItem.details, [marketCode]: normalized } } : catalogItem,
      ),
    }));
    try {
      const endpoint =
        item.type === "product"
          ? `${API_BASE_URL}/admin/catalog/products/${item.id}/details`
          : `${API_BASE_URL}/admin/catalog/packs/${item.id}/details`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ market_code: marketCode, ...normalized }),
      });
      if (!response.ok) throw new Error("Could not update catalog SKU/cost.");
      void loadDashboard();
    } catch (exc) {
      setError(exc instanceof Error ? exc.message : "Could not update catalog SKU/cost.");
      void loadDashboard();
    }
  }

  if (!auth || !data) {
    return (
      <section dir="ltr" className="min-h-[70vh] bg-[#F6F4EC] px-4 py-12 text-charcoal">
        <form onSubmit={handleLogin} className="mx-auto grid max-w-sm gap-4 rounded-lg border border-charcoal/10 bg-white p-6 shadow-soft">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-lg bg-olive text-white">
              <Lock size={20} />
            </span>
            <div>
              <h1 className="text-xl font-black">Admin dashboard</h1>
              <p className="text-sm text-charcoal/60">Use backend env credentials.</p>
            </div>
          </div>
          <input className="focus-ring rounded-lg border border-charcoal/15 px-4 py-3" placeholder="Username" value={username} onChange={(event) => setUsername(event.target.value)} />
          <input className="focus-ring rounded-lg border border-charcoal/15 px-4 py-3" placeholder="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          {error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-bold text-red-700">{error}</p> : null}
          <button className="focus-ring rounded-lg bg-gold px-4 py-3 font-black text-charcoal" type="submit" disabled={loading}>
            {loading ? "Loading..." : "Login"}
          </button>
        </form>
      </section>
    );
  }

  return (
    <section dir="ltr" className="bg-[#F6F4EC] px-4 py-8 text-charcoal">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-olive">Dafa Kitchen</p>
            <h1 className="text-3xl font-black">COD admin dashboard</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <DateInput label="Start" value={start} onChange={setStart} />
            <DateInput label="End" value={end} onChange={setEnd} />
            <MarketFilter markets={catalog.markets} selectedMarkets={selectedMarkets} onToggle={toggleMarketFilter} onClear={() => setSelectedMarkets([])} />
            <button className="focus-ring inline-flex h-11 items-center gap-2 rounded-lg bg-olive px-4 font-black text-white" onClick={() => void loadDashboard()} disabled={loading}>
              <CalendarDays size={18} /> Apply
            </button>
          </div>
        </div>

        <div className="mb-5 inline-flex rounded-lg border border-charcoal/10 bg-white p-1">
          <TabButton active={activeTab === "overview"} onClick={() => setActiveTab("overview")}>Overview</TabButton>
          <TabButton active={activeTab === "orders"} onClick={() => setActiveTab("orders")}>Orders</TabButton>
          <TabButton active={activeTab === "markets"} onClick={() => setActiveTab("markets")}>Markets</TabButton>
          <TabButton active={activeTab === "catalog"} onClick={() => setActiveTab("catalog")}>Catalog</TabButton>
          <TabButton active={activeTab === "profit"} onClick={() => setActiveTab("profit")}>Profit calculator</TabButton>
        </div>

        {error ? <p className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</p> : null}

        {activeTab === "overview" ? <Overview data={data} /> : null}
        {activeTab === "orders" ? <OrdersTab orders={orders} onPreview={setSelectedOrder} /> : null}
        {activeTab === "markets" ? <MarketsTab catalog={catalog} marketFees={marketFees} onFeeUpdate={updateMarketFees} onDetailChange={updateCatalogDetail} onUpdate={updateMarket} /> : null}
        {activeTab === "catalog" ? <CatalogTab catalog={catalog} onToggle={updateCatalogItem} onMarketToggle={updateCatalogMarkets} onOfferPriceChange={updateOfferPrice} onPackPriceChange={updatePackPrice} onDetailChange={updateCatalogDetail} /> : null}
        {activeTab === "profit" ? <ProfitCalculator catalog={catalog} marketFees={marketFees} onFeeUpdate={updateMarketFees} /> : null}
      </div>

      {selectedOrder ? <OrderPreview order={selectedOrder} onClose={() => setSelectedOrder(null)} /> : null}
    </section>
  );
}

function buildQuery(start: string, end: string, marketCodes: string[]) {
  const startDate = new Date(`${start}T00:00:00.000Z`).toISOString();
  const endDate = new Date(`${end}T23:59:59.999Z`).toISOString();
  const params = new URLSearchParams({ start: startDate, end: endDate });
  marketCodes.forEach((code) => params.append("market", code));
  return params.toString();
}

function DateInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-1 text-xs font-black text-charcoal/60">
      {label}
      <input className="focus-ring h-11 rounded-lg border border-charcoal/10 bg-white px-3 text-sm text-charcoal" type="date" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function TabButton({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button className={`focus-ring rounded-md px-4 py-2 text-sm font-black ${active ? "bg-charcoal text-white" : "text-charcoal/65 hover:bg-warm-50"}`} onClick={onClick}>
      {children}
    </button>
  );
}

function Overview({ data }: { data: DashboardData }) {
  const maxRevenue = Math.max(...data.daily.map((row) => row.revenue), 1);
  return (
    <div className="grid gap-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Metric icon={Eye} label="Visitors" value={data.metrics.visitors.toLocaleString()} />
        <Metric icon={MousePointerClick} label="Clicks" value={data.metrics.clicks.toLocaleString()} />
        <Metric icon={PackageCheck} label="Orders" value={data.metrics.orders.toLocaleString()} />
        <Metric icon={Banknote} label="Revenue" value={data.metrics.revenue.toLocaleString()} />
        <Metric icon={TrendingUp} label="Conversion rate" value={`${data.metrics.conversion_rate}%`} />
        <Metric icon={ShoppingCart} label="Cart rate" value={`${data.metrics.cart_rate}%`} />
        <Metric icon={Activity} label="Checkout rate" value={`${data.metrics.checkout_rate}%`} />
        <Metric icon={Banknote} label="AOV" value={data.metrics.aov.toLocaleString()} />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-lg border border-charcoal/10 bg-white p-5 shadow-soft">
          <h2 className="mb-4 text-lg font-black">Daily performance</h2>
          <div className="grid gap-3">
            {data.daily.length === 0 ? <EmptyState /> : data.daily.map((row) => (
              <div key={row.date} className="grid grid-cols-[96px_1fr_92px] items-center gap-3 text-sm">
                <span className="font-bold text-charcoal/60">{row.date}</span>
                <span className="h-3 overflow-hidden rounded-full bg-warm-100">
                  <span className="block h-full rounded-full bg-gold" style={{ width: `${Math.max((row.revenue / maxRevenue) * 100, row.revenue ? 8 : 0)}%` }} />
                </span>
                <span className="text-right font-black">{row.revenue}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-charcoal/10 bg-white p-5 shadow-soft">
          <h2 className="mb-4 text-lg font-black">Funnel</h2>
          <FunnelRow label="Visitors" value={data.metrics.visitors} max={data.metrics.visitors} />
          <FunnelRow label="Add to cart" value={data.metrics.add_to_cart} max={data.metrics.visitors} />
          <FunnelRow label="Checkout" value={data.metrics.checkout} max={data.metrics.visitors} />
          <FunnelRow label="Orders" value={data.metrics.orders} max={data.metrics.visitors} />
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <SimpleTable title="Top products" rows={data.top_products.map((item) => [item.title, `${item.orders} orders`, `${item.revenue}`])} />
        <SimpleTable title="Top campaigns" rows={data.top_campaigns.map((item) => [item.campaign, `${item.visitors} visitors`, `${item.events} events`])} />
      </div>
    </div>
  );
}

function Metric({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-charcoal/10 bg-white p-4 shadow-soft">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-bold text-charcoal/55">{label}</span>
        <Icon size={18} className="text-olive" />
      </div>
      <p className="text-2xl font-black">{value}</p>
    </div>
  );
}

function FunnelRow({ label, value, max }: { label: string; value: number; max: number }) {
  const width = max ? Math.max((value / max) * 100, value ? 8 : 0) : 0;
  return (
    <div className="mb-4">
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="font-bold text-charcoal/65">{label}</span>
        <span className="font-black">{value.toLocaleString()}</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-warm-100">
        <div className="h-full rounded-full bg-olive" style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

function SimpleTable({ title, rows }: { title: string; rows: string[][] }) {
  return (
    <div className="rounded-lg border border-charcoal/10 bg-white p-5 shadow-soft">
      <h2 className="mb-4 text-lg font-black">{title}</h2>
      <div className="grid gap-2">
        {rows.length === 0 ? <EmptyState /> : rows.map((row) => (
          <div key={row.join("-")} className="grid grid-cols-[1fr_auto_auto] gap-3 rounded-lg bg-warm-50 px-3 py-2 text-sm">
            <span className="min-w-0 truncate font-bold">{row[0]}</span>
            <span>{row[1]}</span>
            <span className="font-black">{row[2]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function OrdersTab({ orders, onPreview }: { orders: AdminOrder[]; onPreview: (order: AdminOrder) => void }) {
  const [search, setSearch] = useState("");
  const filtered = orders.filter((order) => `${order.public_order_id} ${order.customer_name} ${order.phone_e164}`.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="rounded-lg border border-charcoal/10 bg-white p-5 shadow-soft">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-black">Orders</h2>
        <label className="flex h-11 items-center gap-2 rounded-lg border border-charcoal/10 px-3">
          <Search size={18} className="text-charcoal/45" />
          <input className="w-64 bg-transparent text-sm outline-none" placeholder="Search order, name, phone" value={search} onChange={(event) => setSearch(event.target.value)} />
        </label>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-charcoal/10 text-xs uppercase text-charcoal/50">
              <th className="py-3">Order</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Items</th>
              <th>Total</th>
              <th>Market</th>
              <th>Campaign</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => (
              <tr key={order.id} className="border-b border-charcoal/10">
                <td className="py-3 font-black">{order.public_order_id}</td>
                <td>{order.customer_name}<br /><span className="text-xs text-charcoal/50">{order.phone_e164}</span></td>
                <td><span className="rounded-full bg-warm-100 px-2 py-1 text-xs font-black">{order.status}</span></td>
                <td>{order.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
                <td className="font-black">{order.total} {order.currency}</td>
                <td className="font-black uppercase">{order.market_code || order.country || "ksa"}</td>
                <td>{order.utm_campaign || "direct"}</td>
                <td>{new Date(order.created_at).toLocaleDateString()}</td>
                <td><button className="focus-ring rounded-lg bg-charcoal px-3 py-2 text-xs font-black text-white" onClick={() => onPreview(order)}>Preview</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 ? <EmptyState /> : null}
      </div>
    </div>
  );
}

function MarketFilter({
  markets,
  selectedMarkets,
  onToggle,
  onClear,
}: {
  markets: MarketConfig[];
  selectedMarkets: string[];
  onToggle: (marketCode: string, checked: boolean) => void;
  onClear: () => void;
}) {
  if (markets.length === 0) return null;
  return (
    <div className="rounded-lg border border-charcoal/10 bg-white px-3 py-2">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-xs font-black uppercase text-charcoal/55">Countries</span>
        <button type="button" className="text-xs font-black text-olive" onClick={onClear}>
          All
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {markets.map((market) => (
          <label key={market.code} className="inline-flex items-center gap-2 rounded-md bg-warm-50 px-2 py-1 text-xs font-black uppercase">
            <input
              type="checkbox"
              checked={selectedMarkets.includes(market.code)}
              onChange={(event) => onToggle(market.code, event.target.checked)}
            />
            {market.code}
          </label>
        ))}
      </div>
    </div>
  );
}

function MarketsTab({
  catalog,
  marketFees,
  onFeeUpdate,
  onDetailChange,
  onUpdate,
}: {
  catalog: { markets: MarketConfig[]; products: CatalogItem[]; packs: CatalogItem[] };
  marketFees: Record<string, MarketFees>;
  onFeeUpdate: (marketCode: string, next: Partial<MarketFees>) => void;
  onDetailChange: (item: CatalogItem, marketCode: string, detail: MarketDetail) => void;
  onUpdate: (market: MarketConfig, next: Partial<Pick<MarketConfig, "active" | "currency">>) => void;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {catalog.markets.map((market) => {
        const fees = marketFeeFor(marketFees, market.code);
        const rows = marketSkuRows(catalog, market);
        return (
        <div key={market.code} className="rounded-lg border border-charcoal/10 bg-white p-5 shadow-soft">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase text-olive">/{market.code}</p>
              <h2 className="text-xl font-black">{market.country_name_en}</h2>
              <p className="text-sm font-bold text-charcoal/55" dir="rtl">{market.country_name_ar}</p>
            </div>
            <label className="flex items-center gap-2 text-sm font-black">
              <input
                type="checkbox"
                checked={market.active}
                onChange={(event) => onUpdate(market, { active: event.target.checked })}
              />
              Active
            </label>
          </div>
          <label className="grid gap-1 text-xs font-black uppercase text-charcoal/55">
            Currency
            <input
              className="focus-ring h-11 rounded-lg border border-charcoal/10 px-3 text-sm font-black"
              value={market.currency}
              onChange={(event) => onUpdate(market, { currency: event.target.value })}
            />
          </label>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <NumberField label="USD rate" value={fees.fxToUsd} step="0.0001" onChange={(value) => onFeeUpdate(market.code, { fxToUsd: value })} />
            <NumberField label="Lead fee USD" value={fees.leadFeeUsd} step="0.01" onChange={(value) => onFeeUpdate(market.code, { leadFeeUsd: value })} />
            <NumberField label="Confirmation USD" value={fees.callCenterConfirmationFeeUsd} step="0.01" onChange={(value) => onFeeUpdate(market.code, { callCenterConfirmationFeeUsd: value })} />
            <NumberField label="CC delivered USD" value={fees.callCenterDeliveredFeeUsd} step="0.01" onChange={(value) => onFeeUpdate(market.code, { callCenterDeliveredFeeUsd: value })} />
            <NumberField label="Shipping delivered USD" value={fees.shippingDeliveredFeeUsd} step="0.01" onChange={(value) => onFeeUpdate(market.code, { shippingDeliveredFeeUsd: value })} />
            <NumberField label="Shipping returned USD" value={fees.shippingReturnedFeeUsd} step="0.01" onChange={(value) => onFeeUpdate(market.code, { shippingReturnedFeeUsd: value })} />
            <NumberField label="COD fee %" value={fees.codFeePercent} step="0.1" onChange={(value) => onFeeUpdate(market.code, { codFeePercent: value })} />
          </div>
          <div className="mt-4 overflow-x-auto rounded-lg border border-charcoal/10">
            <table className="w-full min-w-[720px] border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-charcoal/10 bg-warm-50 text-charcoal/55">
                  <th className="px-3 py-2">SKU</th>
                  <th className="px-3 py-2">Item</th>
                  <th className="px-3 py-2">Cost</th>
                  <th className="px-3 py-2">Price</th>
                  <th className="px-3 py-2">Max BE CPL</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const result = calculateCodEconomics(row.option, fees, DEFAULT_CONFIRMATION_RATE, DEFAULT_DELIVERY_RATE, 0, 100);
                  const detail = row.option.item.details?.[market.code] ?? { sku: row.option.sku, cost: row.option.costLocal };
                  return (
                    <tr key={row.option.key} className="border-b border-charcoal/10 last:border-0">
                      <td className="px-3 py-2 font-black">{row.option.sku}</td>
                      <td className="px-3 py-2">
                        <span className="block font-black">{row.option.item.name_en}</span>
                        <span className="text-[11px] font-bold uppercase text-charcoal/45">{row.option.item.type}</span>
                      </td>
                      <td className="px-3 py-2">
                        <input
                          className="focus-ring h-9 w-24 rounded-lg border border-charcoal/10 px-2 font-black"
                          type="number"
                          min={0}
                          step="0.01"
                          defaultValue={detail.cost}
                          onBlur={(event) => onDetailChange(row.option.item, market.code, { sku: detail.sku, cost: Number(event.target.value) })}
                        />
                      </td>
                      <td className="px-3 py-2 font-black">{formatMoney(row.option.priceLocal, market.currency)}</td>
                      <td className={`px-3 py-2 font-black ${result.maxCplUsd >= 0 ? "text-emerald-700" : "text-red-700"}`}>
                        {formatUsd(result.maxCplUsd)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {rows.length === 0 ? <EmptyState /> : null}
          </div>
        </div>
      );
      })}
    </div>
  );
}

function CatalogTab({
  catalog,
  onToggle,
  onMarketToggle,
  onOfferPriceChange,
  onPackPriceChange,
  onDetailChange,
}: {
  catalog: { markets: MarketConfig[]; products: CatalogItem[]; packs: CatalogItem[] };
  onToggle: (item: CatalogItem, hidden: boolean) => void;
  onMarketToggle: (item: CatalogItem, marketCode: string, checked: boolean) => void;
  onOfferPriceChange: (item: CatalogItem, offer: AdminOffer, marketCode: string, price: number) => void;
  onPackPriceChange: (item: CatalogItem, marketCode: string, price: number) => void;
  onDetailChange: (item: CatalogItem, marketCode: string, detail: MarketDetail) => void;
}) {
  return (
    <div className="grid gap-5">
      <CatalogList title="Products" items={catalog.products} markets={catalog.markets} onToggle={onToggle} onMarketToggle={onMarketToggle} onOfferPriceChange={onOfferPriceChange} onPackPriceChange={onPackPriceChange} onDetailChange={onDetailChange} />
      <CatalogList title="Packs" items={catalog.packs} markets={catalog.markets} onToggle={onToggle} onMarketToggle={onMarketToggle} onOfferPriceChange={onOfferPriceChange} onPackPriceChange={onPackPriceChange} onDetailChange={onDetailChange} />
    </div>
  );
}

function CatalogList({
  title,
  items,
  markets,
  onToggle,
  onMarketToggle,
  onOfferPriceChange,
  onPackPriceChange,
  onDetailChange,
}: {
  title: string;
  items: CatalogItem[];
  markets: MarketConfig[];
  onToggle: (item: CatalogItem, hidden: boolean) => void;
  onMarketToggle: (item: CatalogItem, marketCode: string, checked: boolean) => void;
  onOfferPriceChange: (item: CatalogItem, offer: AdminOffer, marketCode: string, price: number) => void;
  onPackPriceChange: (item: CatalogItem, marketCode: string, price: number) => void;
  onDetailChange: (item: CatalogItem, marketCode: string, detail: MarketDetail) => void;
}) {
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  function toggleExpanded(id: string) {
    setExpandedIds((current) => (current.includes(id) ? current.filter((itemId) => itemId !== id) : [...current, id]));
  }

  return (
    <div className="min-w-0 rounded-lg border border-charcoal/10 bg-white p-4 shadow-soft sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-black">{title}</h2>
        <span className="rounded-full bg-warm-100 px-3 py-1 text-xs font-black text-charcoal/60">
          {items.filter((item) => item.hidden).length} hidden
        </span>
      </div>
      <div className="grid gap-3">
        {items.length === 0 ? <EmptyState /> : null}
        {items.map((item) => {
          const expanded = expandedIds.includes(item.id);
          return (
          <div key={`${item.type}-${item.id}`} className="min-w-0 rounded-lg border border-charcoal/10 p-4">
            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto_auto] md:items-start">
              <button
                type="button"
                className="focus-ring -m-2 flex min-w-0 items-start gap-3 rounded-lg p-2 text-left"
                onClick={() => toggleExpanded(item.id)}
                aria-expanded={expanded}
              >
                <span className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-md bg-warm-100 text-charcoal/65">
                  {expanded ? <ChevronDown size={17} /> : <ChevronRight size={17} />}
                </span>
                <span className="min-w-0">
                  <span className="mb-2 flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-2 py-1 text-xs font-black ${item.hidden ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
                      {item.hidden ? "Hidden" : "Visible"}
                    </span>
                    <span className="text-xs font-bold uppercase text-charcoal/45">{item.type}</span>
                  </span>
                  <span className="block truncate font-black" dir="rtl">{item.name_ar}</span>
                  <span className="mt-1 block truncate text-sm font-bold text-charcoal/55">{item.name_en}</span>
                  <span className="mt-1 block text-xs text-charcoal/45">{item.id}</span>
                </span>
              </button>
              <div className="flex min-w-0 flex-wrap gap-2">
                {markets.map((market) => (
                  <span key={market.code} className={`rounded-md px-2 py-1 text-xs font-black uppercase ${item.market_codes.includes(market.code) ? "bg-emerald-50 text-emerald-700" : "bg-warm-50 text-charcoal/35"}`}>
                    {market.code}
                  </span>
                ))}
              </div>
              <button
                className={`focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-black ${item.hidden ? "bg-olive text-white" : "bg-charcoal text-white"}`}
                onClick={() => onToggle(item, !item.hidden)}
              >
                {item.hidden ? <RotateCcw size={17} /> : <EyeOff size={17} />}
                {item.hidden ? "Restore" : "Hide"}
              </button>
            </div>
            {expanded ? (
            <div className="mt-4 min-w-0 border-t border-charcoal/10 pt-4">
              <div className="mt-3 flex flex-wrap gap-2">
                {markets.map((market) => (
                  <label key={market.code} className="inline-flex items-center gap-2 rounded-lg bg-warm-50 px-2 py-1 text-xs font-black uppercase">
                    <input
                      type="checkbox"
                      checked={item.market_codes.includes(market.code)}
                      onChange={(event) => onMarketToggle(item, market.code, event.target.checked)}
                    />
                    {market.code}
                  </label>
                ))}
              </div>
              <div className="mt-4 rounded-lg border border-charcoal/10 p-3">
                <p className="mb-2 text-xs font-black uppercase text-charcoal/50">SKU and cost</p>
                <div className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {markets.map((market) => {
                    const detail = item.details?.[market.code] ?? { sku: "", cost: 0 };
                    return (
                      <div key={market.code} className="grid min-w-0 gap-2 rounded-lg bg-warm-50 p-3">
                        <p className="text-xs font-black uppercase text-charcoal/55">{market.code}</p>
                        <label className="grid gap-1 text-[11px] font-black uppercase text-charcoal/45">
                          SKU
                          <input
                            className="focus-ring h-9 min-w-0 rounded-lg border border-charcoal/10 bg-white px-2 text-xs font-black"
                            defaultValue={detail.sku}
                            onBlur={(event) => onDetailChange(item, market.code, { sku: event.target.value, cost: Number(detail.cost) })}
                          />
                        </label>
                        <label className="grid gap-1 text-[11px] font-black uppercase text-charcoal/45">
                          Cost
                          <input
                            className="focus-ring h-9 min-w-0 rounded-lg border border-charcoal/10 bg-white px-2 text-xs font-black"
                            type="number"
                            min={0}
                            step="0.01"
                            defaultValue={detail.cost}
                            onBlur={(event) => onDetailChange(item, market.code, { sku: detail.sku, cost: Number(event.target.value) })}
                          />
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
              {item.offers?.length ? (
                <div className="mt-4 overflow-x-auto rounded-lg border border-charcoal/10">
                  <table className="w-full min-w-[880px] border-collapse text-left text-xs">
                    <thead>
                      <tr className="border-b border-charcoal/10 bg-warm-50 text-charcoal/55">
                        <th className="px-3 py-2">Offer</th>
                        {markets.map((market) => (
                          <th key={market.code} className="px-3 py-2 uppercase">{market.code}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {item.offers.map((offer) => (
                        <tr key={offer.id} className="border-b border-charcoal/10 last:border-0">
                          <td className="px-3 py-2 font-black">
                            <span dir="rtl">{offer.label_ar}</span>
                            <span className="block text-[11px] font-bold text-charcoal/45">{offer.id} / qty {offer.quantity}</span>
                          </td>
                          {markets.map((market) => (
                            <td key={`${offer.id}-${market.code}`} className="px-3 py-2">
                              <input
                                className="focus-ring h-9 w-24 rounded-lg border border-charcoal/10 px-2 font-black"
                                type="number"
                                min={0}
                                defaultValue={offer.prices[market.code] ?? 0}
                                onBlur={(event) => onOfferPriceChange(item, offer, market.code, Number(event.target.value))}
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
              {item.prices ? (
                <div className="mt-4 rounded-lg border border-charcoal/10 p-3">
                  <p className="mb-2 text-xs font-black uppercase text-charcoal/50">Pack prices</p>
                  <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {markets.map((market) => (
                      <label key={market.code} className="grid min-w-0 gap-1 text-xs font-black uppercase text-charcoal/55">
                        {market.code}
                        <input
                          className="focus-ring h-9 min-w-0 rounded-lg border border-charcoal/10 px-2 font-black"
                          type="number"
                          min={0}
                          defaultValue={item.prices?.[market.code] ?? 0}
                          onBlur={(event) => onPackPriceChange(item, market.code, Number(event.target.value))}
                        />
                      </label>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
            ) : null}
          </div>
          );
        })}
      </div>
    </div>
  );
}

function ProfitCalculator({
  catalog,
  marketFees,
  onFeeUpdate,
}: {
  catalog: { markets: MarketConfig[]; products: CatalogItem[]; packs: CatalogItem[] };
  marketFees: Record<string, MarketFees>;
  onFeeUpdate: (marketCode: string, next: Partial<MarketFees>) => void;
}) {
  const items = useMemo(() => [...catalog.products, ...catalog.packs], [catalog.products, catalog.packs]);
  const allOptions = useMemo(() => catalogSkuOptions(catalog), [catalog]);
  const [itemId, setItemId] = useState("");
  const selectedItem = items.find((item) => item.id === itemId) ?? items[0];
  const marketOptions = selectedItem ? catalog.markets.filter((market) => selectedItem.market_codes.includes(market.code)) : catalog.markets;
  const [marketCode, setMarketCode] = useState("");
  const selectedMarket = marketOptions.find((market) => market.code === marketCode) ?? marketOptions[0] ?? catalog.markets[0];
  const skuOptions = selectedItem && selectedMarket
    ? allOptions.filter((option) => option.item.id === selectedItem.id && option.item.type === selectedItem.type && option.market.code === selectedMarket.code)
    : [];
  const [optionKey, setOptionKey] = useState("");
  const selectedOption = skuOptions.find((option) => option.key === optionKey) ?? skuOptions[0];
  const [priceOverride, setPriceOverride] = useState("");
  const [leads, setLeads] = useState(1000);
  const [costPerLeadUsd, setCostPerLeadUsd] = useState(1);
  const [confirmationRate, setConfirmationRate] = useState(DEFAULT_CONFIRMATION_RATE);
  const [deliveryRate, setDeliveryRate] = useState(DEFAULT_DELIVERY_RATE);

  useEffect(() => {
    if (!itemId && items[0]) setItemId(items[0].id);
  }, [itemId, items]);

  useEffect(() => {
    if (!selectedMarket) return;
    if (marketCode !== selectedMarket.code) setMarketCode(selectedMarket.code);
  }, [marketCode, selectedMarket]);

  useEffect(() => {
    if (!selectedOption) return;
    if (optionKey !== selectedOption.key) setOptionKey(selectedOption.key);
  }, [optionKey, selectedOption]);

  if (!selectedOption || !selectedMarket) {
    return <EmptyState />;
  }

  const fees = marketFeeFor(marketFees, selectedMarket.code);
  const simulatedOption = {
    ...selectedOption,
    priceLocal: priceOverride === "" ? selectedOption.priceLocal : Number(priceOverride),
  };
  const breakeven = calculateCodEconomics(simulatedOption, fees, confirmationRate, deliveryRate, 0, 100);
  const scaled = calculateCodEconomics(simulatedOption, fees, confirmationRate, deliveryRate, costPerLeadUsd, leads);
  const maxCplLocal = fees.fxToUsd ? breakeven.maxCplUsd / fees.fxToUsd : 0;

  return (
    <div className="grid gap-5">
      <div className="rounded-lg border border-charcoal/10 bg-white p-5 shadow-soft">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-black">Profit calculator</h2>
            <p className="text-sm font-bold text-charcoal/55">Select the exact SKU, market, and offer you want to simulate.</p>
          </div>
          <span className="rounded-full bg-warm-100 px-3 py-1 text-xs font-black uppercase text-charcoal/60">{selectedOption.sku}</span>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <label className="grid gap-1 text-xs font-black uppercase text-charcoal/55">
            Product or pack
            <select
              className="focus-ring h-11 rounded-lg border border-charcoal/10 bg-white px-3 text-sm font-black"
              value={selectedItem?.id ?? ""}
              onChange={(event) => {
                setItemId(event.target.value);
                setMarketCode("");
                setOptionKey("");
                setPriceOverride("");
              }}
            >
              {items.map((item) => (
                <option key={`${item.type}-${item.id}`} value={item.id}>{item.name_en}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-xs font-black uppercase text-charcoal/55">
            Country
            <select
              className="focus-ring h-11 rounded-lg border border-charcoal/10 bg-white px-3 text-sm font-black uppercase"
              value={selectedMarket.code}
              onChange={(event) => {
                setMarketCode(event.target.value);
                setOptionKey("");
                setPriceOverride("");
              }}
            >
              {marketOptions.map((market) => (
                <option key={market.code} value={market.code}>{market.code.toUpperCase()} - {market.country_name_en}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-xs font-black uppercase text-charcoal/55">
            SKU / offer
            <select
              className="focus-ring h-11 rounded-lg border border-charcoal/10 bg-white px-3 text-sm font-black"
              value={selectedOption.key}
              onChange={(event) => {
                setOptionKey(event.target.value);
                setPriceOverride("");
              }}
            >
              {skuOptions.map((option) => (
                <option key={option.key} value={option.key}>{option.priceLabel}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg border border-charcoal/10 bg-white p-5 shadow-soft">
          <h3 className="mb-4 text-lg font-black">Country service fees</h3>
          <div className="mb-4 overflow-x-auto rounded-lg border border-charcoal/10">
            <table className="w-full min-w-[760px] border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-charcoal/10 bg-warm-50 text-charcoal/55">
                  <th className="px-3 py-2">Lead</th>
                  <th className="px-3 py-2">Confirmation</th>
                  <th className="px-3 py-2">CC delivered</th>
                  <th className="px-3 py-2">Ship delivered</th>
                  <th className="px-3 py-2">Ship returned</th>
                  <th className="px-3 py-2">COD</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-3 py-3 font-black">{formatUsd(fees.leadFeeUsd)}</td>
                  <td className="px-3 py-3 font-black">{formatUsd(fees.callCenterConfirmationFeeUsd)}</td>
                  <td className="px-3 py-3 font-black">{formatUsd(fees.callCenterDeliveredFeeUsd)}</td>
                  <td className="px-3 py-3 font-black">{formatUsd(fees.shippingDeliveredFeeUsd)}</td>
                  <td className="px-3 py-3 font-black">{formatUsd(fees.shippingReturnedFeeUsd)}</td>
                  <td className="px-3 py-3 font-black">{fees.codFeePercent}%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <NumberField label="USD rate" value={fees.fxToUsd} step="0.0001" onChange={(value) => onFeeUpdate(selectedMarket.code, { fxToUsd: value })} />
            <NumberField label="Lead fee USD" value={fees.leadFeeUsd} step="0.01" onChange={(value) => onFeeUpdate(selectedMarket.code, { leadFeeUsd: value })} />
            <NumberField label="Confirmation USD" value={fees.callCenterConfirmationFeeUsd} step="0.01" onChange={(value) => onFeeUpdate(selectedMarket.code, { callCenterConfirmationFeeUsd: value })} />
            <NumberField label="CC delivered USD" value={fees.callCenterDeliveredFeeUsd} step="0.01" onChange={(value) => onFeeUpdate(selectedMarket.code, { callCenterDeliveredFeeUsd: value })} />
            <NumberField label="Shipping delivered USD" value={fees.shippingDeliveredFeeUsd} step="0.01" onChange={(value) => onFeeUpdate(selectedMarket.code, { shippingDeliveredFeeUsd: value })} />
            <NumberField label="Shipping returned USD" value={fees.shippingReturnedFeeUsd} step="0.01" onChange={(value) => onFeeUpdate(selectedMarket.code, { shippingReturnedFeeUsd: value })} />
            <NumberField label="COD fee %" value={fees.codFeePercent} step="0.1" onChange={(value) => onFeeUpdate(selectedMarket.code, { codFeePercent: value })} />
            <NumberField label={`Selling price ${selectedMarket.currency}`} value={simulatedOption.priceLocal} step="0.01" onChange={(value) => setPriceOverride(String(value))} />
          </div>
        </div>

        <div className="rounded-lg border border-charcoal/10 bg-white p-5 shadow-soft">
          <h3 className="mb-4 text-lg font-black">Breakeven</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <NumberField label="Confirmation %" value={confirmationRate} step="1" onChange={setConfirmationRate} />
            <NumberField label="Delivery %" value={deliveryRate} step="1" onChange={setDeliveryRate} />
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <MetricBox label="Max CPL USD" value={formatUsd(breakeven.maxCplUsd)} tone={breakeven.maxCplUsd >= 0 ? "good" : "bad"} />
            <MetricBox label={`Max CPL ${selectedMarket.currency}`} value={formatMoney(maxCplLocal, selectedMarket.currency)} tone={breakeven.maxCplUsd >= 0 ? "good" : "bad"} />
            <MetricBox label="Profit before ads / lead" value={formatUsd(breakeven.maxCplUsd)} />
            <MetricBox label="Price USD" value={formatUsd(scaled.priceUsd)} />
            <MetricBox label="Product cost USD" value={formatUsd(scaled.costUsd)} />
            <MetricBox label="Delivered per 100 leads" value={breakeven.delivered.toFixed(1)} />
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-charcoal/10 bg-white p-5 shadow-soft">
        <h3 className="mb-4 text-lg font-black">Scale profit</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <NumberField label="Leads" value={leads} step="1" onChange={setLeads} />
          <NumberField label="Cost per lead USD" value={costPerLeadUsd} step="0.01" onChange={setCostPerLeadUsd} />
          <NumberField label="Confirmation %" value={confirmationRate} step="1" onChange={setConfirmationRate} />
          <NumberField label="Delivery %" value={deliveryRate} step="1" onChange={setDeliveryRate} />
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricBox label="Net profit" value={formatUsd(scaled.profitUsd)} tone={scaled.profitUsd >= 0 ? "good" : "bad"} />
          <MetricBox label="Revenue" value={formatUsd(scaled.revenueUsd)} />
          <MetricBox label="Ad spend" value={formatUsd(scaled.adSpendUsd)} />
          <MetricBox label="Service fees" value={formatUsd(scaled.serviceFeesUsd)} />
          <MetricBox label="Provider lead fees" value={formatUsd(scaled.providerLeadFeesUsd)} />
          <MetricBox label="Call center fees" value={formatUsd(scaled.callCenterFeesUsd)} />
          <MetricBox label="Shipping fees" value={formatUsd(scaled.shippingFeesUsd)} />
          <MetricBox label="COD fees" value={formatUsd(scaled.codFeesUsd)} />
          <MetricBox label="Product cost" value={formatUsd(scaled.productCostUsd)} />
          <MetricBox label="Confirmed" value={scaled.confirmed.toFixed(1)} />
          <MetricBox label="Delivered" value={scaled.delivered.toFixed(1)} />
          <MetricBox label="Profit / lead" value={formatUsd(scaled.profitUsd / Math.max(leads, 1))} />
        </div>
      </div>
    </div>
  );
}

function NumberField({
  label,
  value,
  step,
  onChange,
}: {
  label: string;
  value: number;
  step: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="grid min-w-0 gap-1 text-xs font-black uppercase text-charcoal/55">
      {label}
      <input
        className="focus-ring h-11 min-w-0 rounded-lg border border-charcoal/10 bg-white px-3 text-sm font-black"
        type="number"
        min={0}
        step={step}
        value={Number.isFinite(value) ? value : 0}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

function MetricBox({ label, value, tone }: { label: string; value: string; tone?: "good" | "bad" }) {
  return (
    <div className="rounded-lg bg-warm-50 p-4">
      <p className="text-xs font-black uppercase text-charcoal/50">{label}</p>
      <p className={`mt-2 text-xl font-black ${tone === "good" ? "text-emerald-700" : tone === "bad" ? "text-red-700" : ""}`}>{value}</p>
    </div>
  );
}

function marketFeeFor(fees: Record<string, MarketFees>, marketCode: string) {
  return fees[marketCode] ?? DEFAULT_MARKET_FEES[marketCode] ?? DEFAULT_MARKET_FEES.ksa;
}

function catalogSkuOptions(catalog: { markets: MarketConfig[]; products: CatalogItem[]; packs: CatalogItem[] }): SkuOption[] {
  const options: SkuOption[] = [];
  const activeMarkets = catalog.markets;
  catalog.products.forEach((item) => {
    activeMarkets.forEach((market) => {
      if (!item.market_codes.includes(market.code)) return;
      const detail = item.details?.[market.code] ?? { sku: item.id, cost: 0 };
      item.offers?.forEach((offer) => {
        const price = offer.prices[market.code] ?? 0;
        options.push({
          key: `${item.type}:${item.id}:${market.code}:${offer.id}`,
          item,
          offer,
          market,
          sku: detail.sku,
          costLocal: Number(detail.cost) || 0,
          priceLocal: price,
          quantity: offer.quantity,
          label: item.name_en,
          priceLabel: `${detail.sku} - ${offer.id} / qty ${offer.quantity} - ${formatMoney(price, market.currency)}`,
        });
      });
    });
  });
  catalog.packs.forEach((item) => {
    activeMarkets.forEach((market) => {
      if (!item.market_codes.includes(market.code)) return;
      const detail = item.details?.[market.code] ?? { sku: item.id, cost: 0 };
      const price = item.prices?.[market.code] ?? 0;
      options.push({
        key: `${item.type}:${item.id}:${market.code}:pack`,
        item,
        market,
        sku: detail.sku,
        costLocal: Number(detail.cost) || 0,
        priceLocal: price,
        quantity: 1,
        label: item.name_en,
        priceLabel: `${detail.sku} - pack - ${formatMoney(price, market.currency)}`,
      });
    });
  });
  return options;
}

function marketSkuRows(catalog: { markets: MarketConfig[]; products: CatalogItem[]; packs: CatalogItem[] }, market: MarketConfig) {
  return [
    ...catalog.products.flatMap((item) => {
      if (!item.market_codes.includes(market.code)) return [];
      const offer = item.offers?.find((candidate) => candidate.id === "one") ?? item.offers?.[0];
      if (!offer) return [];
      const detail = item.details?.[market.code] ?? { sku: item.id, cost: 0 };
      return [{
        option: {
          key: `${item.type}:${item.id}:${market.code}:base`,
          item,
          offer,
          market,
          sku: detail.sku,
          costLocal: Number(detail.cost) || 0,
          priceLocal: offer.prices[market.code] ?? 0,
          quantity: offer.quantity,
          label: item.name_en,
          priceLabel: `${detail.sku} - ${offer.id}`,
        } satisfies SkuOption,
      }];
    }),
    ...catalog.packs.flatMap((item) => {
      if (!item.market_codes.includes(market.code)) return [];
      const detail = item.details?.[market.code] ?? { sku: item.id, cost: 0 };
      return [{
        option: {
          key: `${item.type}:${item.id}:${market.code}:base`,
          item,
          market,
          sku: detail.sku,
          costLocal: Number(detail.cost) || 0,
          priceLocal: item.prices?.[market.code] ?? 0,
          quantity: 1,
          label: item.name_en,
          priceLabel: `${detail.sku} - pack`,
        } satisfies SkuOption,
      }];
    }),
  ];
}

function calculateCodEconomics(
  option: SkuOption,
  fees: MarketFees,
  confirmationRate: number,
  deliveryRate: number,
  costPerLeadUsd: number,
  leads: number,
) {
  const safeLeads = Math.max(leads, 0);
  const confirmation = Math.max(Math.min(confirmationRate, 100), 0) / 100;
  const delivery = Math.max(Math.min(deliveryRate, 100), 0) / 100;
  const priceUsd = option.priceLocal * fees.fxToUsd;
  const costUsd = option.costLocal * fees.fxToUsd;
  const confirmed = safeLeads * confirmation;
  const delivered = confirmed * delivery;
  const returned = Math.max(confirmed - delivered, 0);
  const revenueUsd = delivered * priceUsd;
  const productCostUsd = delivered * costUsd;
  const providerLeadFeesUsd = safeLeads * fees.leadFeeUsd;
  const callCenterFeesUsd = confirmed * fees.callCenterConfirmationFeeUsd + delivered * fees.callCenterDeliveredFeeUsd;
  const shippingFeesUsd = delivered * fees.shippingDeliveredFeeUsd + returned * fees.shippingReturnedFeeUsd;
  const codFeesUsd = revenueUsd * (fees.codFeePercent / 100);
  const serviceFeesUsd = providerLeadFeesUsd + callCenterFeesUsd + shippingFeesUsd + codFeesUsd;
  const adSpendUsd = safeLeads * costPerLeadUsd;
  const profitBeforeAdsUsd = revenueUsd - productCostUsd - serviceFeesUsd;
  const profitUsd = profitBeforeAdsUsd - adSpendUsd;

  return {
    priceUsd,
    costUsd,
    confirmed,
    delivered,
    revenueUsd,
    productCostUsd,
    serviceFeesUsd,
    providerLeadFeesUsd,
    callCenterFeesUsd,
    shippingFeesUsd,
    codFeesUsd,
    adSpendUsd,
    profitUsd,
    maxCplUsd: safeLeads ? profitBeforeAdsUsd / safeLeads : 0,
  };
}

function formatUsd(value: number) {
  return `$${formatNumber(value)}`;
}

function formatMoney(value: number, currency: string) {
  return `${formatNumber(value)} ${currency}`;
}

function formatNumber(value: number) {
  return (Number.isFinite(value) ? value : 0).toLocaleString(undefined, {
    maximumFractionDigits: 2,
    minimumFractionDigits: Math.abs(value) < 10 ? 2 : 0,
  });
}

function OrderPreview({ order, onClose }: { order: AdminOrder; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-charcoal/55 p-4" dir="ltr">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white shadow-soft">
        <div className="sticky top-0 flex items-start justify-between border-b border-charcoal/10 bg-white p-5">
          <div>
            <p className="text-sm font-black text-olive">{order.public_order_id}</p>
            <h2 className="text-2xl font-black">{order.customer_name}</h2>
          </div>
          <button className="focus-ring rounded-lg bg-warm-100 p-2" onClick={onClose} aria-label="Close preview"><X size={20} /></button>
        </div>
        <div className="grid gap-5 p-5 md:grid-cols-[1fr_0.8fr]">
          <div>
            <h3 className="mb-3 font-black">Items</h3>
            <div className="grid gap-3">
              {order.items.map((item) => (
                <div key={`${item.product_id}-${item.offer_id}`} className="rounded-lg border border-charcoal/10 p-4">
                  <div className="flex justify-between gap-3">
                    <div>
                      <p className="font-black" dir="rtl">{item.title_ar}</p>
                      <p className="text-sm text-charcoal/55">{item.product_id} / {item.offer_id}</p>
                    </div>
                    <p className="font-black">{item.total_price} {order.currency}</p>
                  </div>
                  <p className="mt-2 text-sm text-charcoal/60">Qty {item.quantity} x {item.unit_price} {order.currency}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-3 font-black">Order summary</h3>
            <dl className="grid gap-2 rounded-lg bg-warm-50 p-4 text-sm">
              <SummaryRow label="Phone" value={order.phone_e164} />
              <SummaryRow label="Status" value={order.status} />
              <SummaryRow label="Payment" value={order.payment_method} />
              <SummaryRow label="Upsell" value={order.upsell_accepted ? "Accepted" : "No"} />
              <SummaryRow label="Location" value={[order.city, order.country].filter(Boolean).join(", ") || order.market_code || "-"} />
              <SummaryRow label="Campaign" value={order.utm_campaign || "direct"} />
              <SummaryRow label="Source" value={order.utm_source || "-"} />
              <SummaryRow label="Subtotal" value={`${order.subtotal} ${order.currency}`} />
              <SummaryRow label="Delivery" value={`${order.delivery_fee} ${order.currency}`} />
              <SummaryRow label="Discount" value={`${order.discount} ${order.currency}`} />
              <div className="mt-2 flex justify-between border-t border-charcoal/10 pt-3 text-lg font-black">
                <dt>Total</dt>
                <dd>{order.total} {order.currency}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-charcoal/55">{label}</dt>
      <dd className="text-right font-bold">{value}</dd>
    </div>
  );
}

function EmptyState() {
  return <p className="rounded-lg bg-warm-50 px-4 py-5 text-center text-sm font-bold text-charcoal/55">No data in this range.</p>;
}
