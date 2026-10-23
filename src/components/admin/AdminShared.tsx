import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";

import Button from "../ui/Button";
import { PLACEHOLDER_IMAGE } from "../../utils/catalog";
import { formatNaira, parseDecimal } from "../../utils/currency";
import type { AdminOrder } from "../../services/adminService";
import type { Product } from "../../types/product";

export const inputClass = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200";
export const panelClass = "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6";

export function AdminState({ loading, error, reload }: {
  loading: boolean; error: string | null; reload: () => void;
}) {
  if (loading) return <p role="status" className={panelClass}>Loading store data...</p>;
  if (error) return (
    <div role="alert" className={panelClass}>
      <p className="mb-4 text-red-700">{error}</p>
      <Button onClick={reload}>Try again</Button>
    </div>
  );
  return null;
}

export function AdminHeading({ title, children }: { title: string; children?: ReactNode }) {
  return <div className="flex flex-wrap items-center justify-between gap-4">
    <h1 className="text-3xl font-extrabold text-slate-900">{title}</h1>{children}
  </div>;
}

export function Badge({ children }: { children: ReactNode }) {
  return <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">{children}</span>;
}

export function ImagePreview({ path }: { path: string | null | undefined }) {
  return <ImagePreviewContent key={path || "missing"} path={path} />;
}

export function isLocalImagePath(path: string) {
  return /^\/images\/(?:[A-Za-z0-9_-]+\/)*[A-Za-z0-9_.-]+\.(?:jpg|jpeg|png|webp|avif|gif)$/i.test(path)
    && !path.includes("..");
}

function ImagePreviewContent({ path }: { path: string | null | undefined }) {
  const [broken, setBroken] = useState(false);
  const invalid = Boolean(path && !isLocalImagePath(path));
  return <div className="space-y-2">
    <img src={!path || broken || invalid ? PLACEHOLDER_IMAGE : path} alt="Product preview"
      className="h-28 w-28 rounded-lg border border-slate-200 bg-white object-contain"
      onError={() => setBroken(true)} />
    {(!path || broken || invalid) && <p className="text-sm text-amber-800">
      {invalid ? "Use a local /images/ photograph URL." : path ? "Image failed to load. Check the path and file." : "No primary image set."}
    </p>}
  </div>;
}

export function stockState(product: Product, threshold: number) {
  if (!product.inStock || (product.stockQuantity != null && product.stockQuantity <= 0)) return "out";
  if (product.stockQuantity == null) return "uncounted";
  return product.stockQuantity <= threshold ? "low" : "in";
}

export function Pagination({ page, total, pageSize, onChange }: {
  page: number; total: number; pageSize: number; onChange: (page: number) => void;
}) {
  return <div className="flex flex-wrap items-center justify-between gap-3">
    <p className="text-sm text-slate-600">{total} records · Page {page} of {Math.max(1, Math.ceil(total / pageSize))}</p>
    <div className="flex gap-2">
      <Button variant="outline" disabled={page <= 1} onClick={() => onChange(page - 1)}>Previous</Button>
      <Button variant="outline" disabled={page * pageSize >= total} onClick={() => onChange(page + 1)}>Next</Button>
    </div>
  </div>;
}

export function OrderTable({ orders }: { orders: AdminOrder[] }) {
  if (orders.length === 0) return <p className={panelClass}>No orders match these filters.</p>;
  return <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
    <table className="w-full text-left text-sm">
      <thead className="bg-slate-100 text-slate-700"><tr>
        {["Order", "Date", "Customer", "Total (NGN)", "Payment", "Fulfilment"].map(h =>
          <th key={h} className="whitespace-nowrap p-4">{h}</th>)}
      </tr></thead>
      <tbody>{orders.map(order => <tr key={order.id} className="border-t border-slate-200">
        <td className="p-4"><Link className="font-semibold text-blue-700 underline" to={`/admin/orders/${order.id}`}>#{order.id}</Link></td>
        <td className="whitespace-nowrap p-4">{new Date(order.created_at).toLocaleString()}</td>
        <td className="p-4">{order.customer.first_name} {order.customer.last_name}<br />{order.customer.email}</td>
        <td className="whitespace-nowrap p-4">{formatNaira(parseDecimal(order.total_amount))}</td>
        <td className="p-4"><Badge>{order.payment_status}</Badge></td>
        <td className="p-4"><Badge>{order.status}</Badge></td>
      </tr>)}</tbody>
    </table>
  </div>;
}
