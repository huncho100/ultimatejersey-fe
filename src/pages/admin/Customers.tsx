import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { useAdminData } from "../../hooks/useAdminData";
import { adminService } from "../../services/adminService";
import { AdminHeading, AdminState, Pagination, inputClass, panelClass } from "../../components/admin/AdminShared";

export default function AdminCustomers() {
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const load = useCallback(() => adminService.customers(
    new URLSearchParams({ page: String(page), page_size: "20", q })
  ), [page, q]);
  const result = useAdminData(load);
  return <>
    <AdminHeading title="Customers" />
    <p className="text-slate-600">Read-only customer records. Role changes, account deletion and account impersonation are not exposed.</p>
    <input className={inputClass} aria-label="Search customers" placeholder="Search name or email..." value={q} onChange={e => { setQ(e.target.value); setPage(1); }} />
    <AdminState {...result} />
    {result.data && <>
      {result.data.items.length === 0 && <p className={panelClass}>No customers match this search.</p>}
      <div className="grid gap-4 md:grid-cols-2">
        {result.data.items.map(customer => <article key={customer.id} className={`${panelClass} space-y-2`}>
          <h2 className="font-bold">{customer.first_name} {customer.last_name}</h2>
          <p className="break-all">{customer.email}</p>
          <p>#{customer.id} · {customer.is_active ? "Active" : "Inactive"} · {customer.order_count} orders</p>
          <Link className="inline-block text-blue-700 underline" to={`/admin/orders?customer_id=${customer.id}`}>View customer orders</Link>
        </article>)}
      </div>
      <Pagination page={result.data.page} total={result.data.total} pageSize={result.data.page_size} onChange={setPage} />
    </>}
  </>;
}
