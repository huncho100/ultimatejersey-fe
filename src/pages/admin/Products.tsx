import { useCallback, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../../context/ProductsContext";
import { useAdminData } from "../../hooks/useAdminData";
import { adminService } from "../../services/adminService";
import type { Product } from "../../types/product";
import { formatNaira } from "../../utils/currency";
import { AdminHeading, AdminState, Badge, ImagePreview, Pagination, inputClass, panelClass, stockState } from "../../components/admin/AdminShared";
import Button from "../../components/ui/Button";

function InventoryEditor({ product, onSaved, onSaving }: { product: Product; onSaved: () => void; onSaving: () => void }) {
  const [quantity, setQuantity] = useState(product.stockQuantity?.toString() ?? "");
  const [available, setAvailable] = useState(product.inStock ?? true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function save(event: FormEvent) {
    event.preventDefault();
    if (!window.confirm("Replace this product's recorded stock and availability? Stock is consumed when payment is verified; this is not a reservation adjustment.")) return;
    onSaving();
    setBusy(true);
    setError("");
    try {
      await adminService.inventory(product.id, {
        stock_quantity: quantity === "" ? null : Number(quantity),
        in_stock: available,
        expected_stock_quantity: product.stockQuantity ?? null,
        expected_in_stock: product.inStock ?? true,
      });
      onSaved();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Stock update failed.");
    } finally { setBusy(false); }
  }
  return <form onSubmit={save} className="space-y-3">
    <label className="block text-sm font-semibold">Stock quantity (blank = uncounted)
      <input aria-label={`Stock quantity for ${product.name}`} className={`${inputClass} mt-1`} type="number" min="0" max="2147483647" step="1"
        value={quantity} onChange={e => setQuantity(e.target.value)} disabled={busy} />
    </label>
    <label className="flex items-center gap-2"><input type="checkbox" checked={available} onChange={e => setAvailable(e.target.checked)} disabled={busy} /> Available for sale</label>
    {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
    <Button type="submit" size="sm" disabled={busy}>{busy ? "Saving..." : "Save inventory"}</Button>
  </form>;
}

export default function AdminProducts({ inventory = false }: { inventory?: boolean }) {
  const load = useCallback(async () => {
    const [products, overview] = await Promise.all([adminService.products(), adminService.overview()]);
    return { products, threshold: overview.inventory.low_stock_threshold };
  }, []);
  const result = useAdminData(load);
  const catalog = useProducts();
  const [q, setQ] = useState("");
  const [stock, setStock] = useState("all");
  const [sport, setSport] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState("");
  const data = result.data;
  const filtered = data?.products.filter(p =>
    [p.name, p.team, p.brand, p.league, String(p.id)].some(value => value?.toLowerCase().includes(q.toLowerCase().trim()))
    && (!sport || p.sport === sport) && (!category || p.category === category)
    && (stock === "all" || stockState(p, data.threshold) === stock)
  ) ?? [];
  const pageSize = 12;
  function saved() {
    setMessage("Inventory saved to the server.");
    result.reload();
    catalog.reload();
  }
  return <>
    <AdminHeading title={inventory ? "Inventory" : "Products"}>
      <div className="flex gap-2">
        <Button variant="outline" onClick={result.reload}>Reload</Button>
        {!inventory && <Link className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white" to="/admin/products/new">Create product</Link>}
      </div>
    </AdminHeading>
    <p className="text-slate-600">{inventory
      ? "Counted stock cannot be negative. Zero stock is unavailable; blank quantity preserves uncounted inventory."
      : "Edit existing catalog records. There is no archive flag on this branch; use availability in Inventory to stop sales without deleting product history."}</p>
    {message && <p role="status" className="text-green-800">{message}</p>}
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <input aria-label="Search products" placeholder="Search name, ID, team, brand..." className={inputClass} value={q} onChange={e => { setQ(e.target.value); setPage(1); }} />
      <select aria-label="Stock filter" className={inputClass} value={stock} onChange={e => { setStock(e.target.value); setPage(1); }}>
        <option value="all">All availability</option><option value="in">Counted stock above threshold</option>
        <option value="low">Low stock</option><option value="out">Out of stock / unavailable</option><option value="uncounted">Available, uncounted</option>
      </select>
      <select aria-label="Sport filter" className={inputClass} value={sport} onChange={e => { setSport(e.target.value); setPage(1); }}>
        <option value="">All sports</option>{[...new Set(data?.products.map(p => p.sport))].sort().map(s => <option key={s}>{s}</option>)}
      </select>
      <select aria-label="Category filter" className={inputClass} value={category} onChange={e => { setCategory(e.target.value); setPage(1); }}>
        <option value="">All categories</option>{[...new Set(data?.products.map(p => p.category))].sort().map(s => <option key={s}>{s}</option>)}
      </select>
    </div>
    <AdminState {...result} />
    {data && <>
      {filtered.length === 0 && <p className={panelClass}>No products match these filters.</p>}
      <div className="grid gap-4 xl:grid-cols-2">
        {filtered.slice((page - 1) * pageSize, page * pageSize).map(product =>
          <article className={`${panelClass} space-y-4`} key={product.id}>
            <div className="flex flex-wrap gap-4">
              <ImagePreview path={product.image} />
              <div className="min-w-0 flex-1 space-y-2">
                <h2 className="text-lg font-bold">{product.name}</h2>
                <p className="text-sm text-slate-600">#{product.id} · {product.sport} · {product.category}</p>
                <p className="font-semibold">{formatNaira(product.price)}</p>
                <Badge>{stockState(product, data.threshold)} · {product.stockQuantity ?? "Uncounted"}</Badge>
              </div>
            </div>
            <div className="flex gap-4">
              <Link className="text-blue-700 underline" to={`/admin/products/${product.id}`}>Edit product</Link>
              <Link className="text-blue-700 underline" to={`/products/${product.id}`}>View in store</Link>
            </div>
            {inventory && <InventoryEditor product={product} onSaved={saved} onSaving={() => setMessage("")} />}
          </article>)}
      </div>
      <Pagination page={page} total={filtered.length} pageSize={pageSize} onChange={setPage} />
    </>}
  </>;
}
