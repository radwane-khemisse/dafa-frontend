"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  Activity,
  Banknote,
  CalendarDays,
  Eye,
  Lock,
  MousePointerClick,
  PackageCheck,
  Search,
  ShoppingCart,
  TrendingUp,
  X,
  type LucideIcon,
} from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

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
  const [activeTab, setActiveTab] = useState<"overview" | "orders">("overview");
  const [data, setData] = useState<DashboardData | null>(null);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const headers = useMemo(() => (auth ? { Authorization: `Basic ${auth}` } : undefined), [auth]);

  async function loadDashboard(nextAuth = auth) {
    if (!nextAuth) return;
    setLoading(true);
    setError("");
    try {
      const query = buildQuery(start, end);
      const [dashboardResponse, ordersResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/admin/dashboard?${query}`, { headers: { Authorization: `Basic ${nextAuth}` } }),
        fetch(`${API_BASE_URL}/admin/orders?${query}`, { headers: { Authorization: `Basic ${nextAuth}` } }),
      ]);
      if (!dashboardResponse.ok || !ordersResponse.ok) throw new Error("Login failed or admin API is not ready.");
      const dashboardJson = (await dashboardResponse.json()) as DashboardData;
      const ordersJson = (await ordersResponse.json()) as { orders: AdminOrder[] };
      setData(dashboardJson);
      setOrders(ordersJson.orders);
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
            <button className="focus-ring inline-flex h-11 items-center gap-2 rounded-lg bg-olive px-4 font-black text-white" onClick={() => void loadDashboard()} disabled={loading}>
              <CalendarDays size={18} /> Apply
            </button>
          </div>
        </div>

        <div className="mb-5 inline-flex rounded-lg border border-charcoal/10 bg-white p-1">
          <TabButton active={activeTab === "overview"} onClick={() => setActiveTab("overview")}>Overview</TabButton>
          <TabButton active={activeTab === "orders"} onClick={() => setActiveTab("orders")}>Orders</TabButton>
        </div>

        {error ? <p className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</p> : null}

        {activeTab === "overview" ? <Overview data={data} /> : <OrdersTab orders={orders} onPreview={setSelectedOrder} />}
      </div>

      {selectedOrder ? <OrderPreview order={selectedOrder} onClose={() => setSelectedOrder(null)} /> : null}
    </section>
  );
}

function buildQuery(start: string, end: string) {
  const startDate = new Date(`${start}T00:00:00.000Z`).toISOString();
  const endDate = new Date(`${end}T23:59:59.999Z`).toISOString();
  return new URLSearchParams({ start: startDate, end: endDate }).toString();
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
        <Metric icon={Eye} label="Valid KSA visitors" value={data.metrics.visitors.toLocaleString()} />
        <Metric icon={MousePointerClick} label="Clicks" value={data.metrics.clicks.toLocaleString()} />
        <Metric icon={PackageCheck} label="Orders" value={data.metrics.orders.toLocaleString()} />
        <Metric icon={Banknote} label="Revenue" value={`${data.metrics.revenue.toLocaleString()} SAR`} />
        <Metric icon={TrendingUp} label="Conversion rate" value={`${data.metrics.conversion_rate}%`} />
        <Metric icon={ShoppingCart} label="Cart rate" value={`${data.metrics.cart_rate}%`} />
        <Metric icon={Activity} label="Checkout rate" value={`${data.metrics.checkout_rate}%`} />
        <Metric icon={Banknote} label="AOV" value={`${data.metrics.aov.toLocaleString()} SAR`} />
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
                <span className="text-right font-black">{row.revenue} SAR</span>
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
        <SimpleTable title="Top products" rows={data.top_products.map((item) => [item.title, `${item.orders} orders`, `${item.revenue} SAR`])} />
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
                    <p className="font-black">{item.total_price} SAR</p>
                  </div>
                  <p className="mt-2 text-sm text-charcoal/60">Qty {item.quantity} x {item.unit_price} SAR</p>
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
              <SummaryRow label="Location" value={[order.city, order.country].filter(Boolean).join(", ") || "KSA valid"} />
              <SummaryRow label="Campaign" value={order.utm_campaign || "direct"} />
              <SummaryRow label="Source" value={order.utm_source || "-"} />
              <SummaryRow label="Subtotal" value={`${order.subtotal} SAR`} />
              <SummaryRow label="Delivery" value={`${order.delivery_fee} SAR`} />
              <SummaryRow label="Discount" value={`${order.discount} SAR`} />
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
  return <p className="rounded-lg bg-warm-50 px-4 py-5 text-center text-sm font-bold text-charcoal/55">No valid KSA data in this range.</p>;
}
