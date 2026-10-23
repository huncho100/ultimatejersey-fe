import { useCallback, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useProducts } from "../../context/ProductsContext";
import { useAdminData } from "../../hooks/useAdminData";
import { adminService, type ProductWrite } from "../../services/adminService";
import { AdminHeading, AdminState, ImagePreview, inputClass, panelClass } from "../../components/admin/AdminShared";
import Button from "../../components/ui/Button";
import { useToast } from "../../components/ui/Toast";

const emptyProduct: ProductWrite = {
  name: "", sport: "", category: "", team: null, league: null, brand: null,
  description: null, price: "", old_price: null, rating: 0, image: null,
  is_featured: false, is_new: false, is_best_seller: false,
};

function ProductForm({ initial, id }: { initial: ProductWrite; id?: number }) {
  const [form, setForm] = useState<ProductWrite>({
    name: initial.name, sport: initial.sport, category: initial.category,
    team: initial.team, league: initial.league, brand: initial.brand,
    description: initial.description, price: initial.price, old_price: initial.old_price,
    rating: initial.rating, image: initial.image,
    is_featured: initial.is_featured, is_new: initial.is_new,
    is_best_seller: initial.is_best_seller,
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const catalog = useProducts();
  const toast = useToast();
  const navigate = useNavigate();
  function change<K extends keyof ProductWrite>(key: K, value: ProductWrite[K]) {
    setForm(previous => ({ ...previous, [key]: value }));
  }
  async function save(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const saved = await adminService.saveProduct(form, id);
      catalog.reload();
      toast.success("Product saved to the server.");
      navigate(`/admin/products/${saved.id}`, { replace: true });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Product could not be saved.");
    } finally { setBusy(false); }
  }
  const textFields = [
    ["name", "Product name", 255, true],
    ["sport", "Sport", 100, true],
    ["category", "Category", 100, true],
    ["team", "Team", 150, false],
    ["league", "League", 150, false],
    ["brand", "Brand", 100, false],
  ] as const;
  return <form onSubmit={save} className={`${panelClass} space-y-6`}>
    <fieldset disabled={busy} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {textFields.map(([key, label, max, required]) => <label key={key} className="block font-semibold">
          {label}{required ? " *" : ""}
          <input className={`${inputClass} mt-1`} value={form[key] ?? ""} required={required} minLength={required ? 2 : undefined} maxLength={max}
            onChange={e => change(key, e.target.value || (required ? "" : null))} />
        </label>)}
      </div>
      <label className="block font-semibold">Description
        <textarea className={`${inputClass} mt-1`} rows={6} value={form.description ?? ""} onChange={e => change("description", e.target.value || null)} />
      </label>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block font-semibold">Selling price (NGN) *
          <input className={`${inputClass} mt-1`} type="number" required min="0.01" max="99999999.99" step="0.01" value={form.price} onChange={e => change("price", e.target.value)} />
        </label>
        <label className="block font-semibold">Previous / compare-at price (NGN)
          <input className={`${inputClass} mt-1`} type="number" min="0.01" max="99999999.99" step="0.01" value={form.old_price ?? ""} onChange={e => change("old_price", e.target.value || null)} />
        </label>
        <label className="block font-semibold">Published rating (0–5)
          <input className={`${inputClass} mt-1`} type="number" required min="0" max="5" step="0.01" value={form.rating} onChange={e => change("rating", Number(e.target.value))} />
        </label>
      </div>
      <p className="text-sm text-slate-600">Selling price is the amount charged. The previous price is optional display metadata, not a separate discount calculation.</p>
      <label className="block font-semibold">Primary image URL
        <input className={`${inputClass} mt-1`} maxLength={500} placeholder="/images/products/football/example.webp" value={form.image ?? ""}
          onChange={e => change("image", e.target.value || null)} />
      </label>
      <ImagePreview path={form.image} />
      <p className="text-sm text-slate-600">Use a root-relative photograph under /images/. Files must be deployed in the frontend public directory. A preview failure identifies a missing file; the backend validates the URL format, not file availability on the frontend host. Gallery editing is unavailable in this branch.</p>
      <div className="flex flex-wrap gap-5">
        {([["is_featured", "Featured"], ["is_new", "New"], ["is_best_seller", "Best seller"]] as const).map(([key, label]) =>
          <label key={key} className="flex items-center gap-2"><input type="checkbox" checked={form[key]} onChange={e => change(key, e.target.checked)} />{label}</label>)}
      </div>
    </fieldset>
    <p className="text-sm text-slate-600">Manage stock and availability separately in <Link className="text-blue-700 underline" to="/admin/inventory">Inventory</Link>. Newly created products start available with uncounted stock.</p>
    {error && <p role="alert" className="text-red-700">{error}</p>}
    <div className="flex gap-4">
      <Button type="submit" disabled={busy}>{busy ? "Saving..." : "Save product"}</Button>
      <Link className="self-center text-blue-700 underline" to="/admin/products">Back to products</Link>
    </div>
  </form>;
}

function ExistingProduct({ id }: { id: number }) {
  const load = useCallback(() => adminService.product(id), [id]);
  const result = useAdminData(load);
  return <>
    <AdminState {...result} />
    {result.data && <ProductForm key={id} id={id} initial={result.data} />}
  </>;
}

export default function AdminProductEditor() {
  const { id } = useParams();
  const productId = Number(id);
  return <>
    <AdminHeading title={id ? `Edit product #${id}` : "Create product"} />
    {id ? (
      Number.isInteger(productId) && productId > 0
        ? <ExistingProduct id={productId} />
        : <p role="alert">Invalid product ID.</p>
    ) : <ProductForm initial={emptyProduct} />}
  </>;
}
