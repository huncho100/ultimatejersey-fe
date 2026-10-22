import { useCallback, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAdminData } from "../../hooks/useAdminData";
import { adminService } from "../../services/adminService";
import { AdminHeading, AdminState, OrderTable, Pagination, inputClass } from "../../components/admin/AdminShared";

export default function AdminOrders() {
  const [params] = useSearchParams();
  const customerId = params.get("customer_id");
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [payment, setPayment] = useState("");
  const load = useCallback(() => {
    const query = new URLSearchParams({ page: String(page), page_size: "20" });
    if (q) query.set("q", q);
    if (status) query.set("status", status);
    if (payment) query.set("payment_status", payment);
    if (customerId) query.set("customer_id", customerId);
    return adminService.orders(query);
  }, [page, q, status, payment, customerId]);
  const result = useAdminData(load);
  return <>
    <AdminHeading title={customerId ? `Orders for customer #${customerId}` : "Orders"} />
    <div className="grid gap-3 sm:grid-cols-3">
      <input className={inputClass} aria-label="Search orders" placeholder="Order ID, customer, payment reference..."
        value={q} onChange={e => { setQ(e.target.value); setPage(1); }} />
      <select className={inputClass} aria-label="Order status" value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}>
        <option value="">All order statuses</option>
        {["pending", "payment_failed", "paid", "processing", "shipped", "delivered", "cancelled"].map(s => <option key={s}>{s}</option>)}
      </select>
      <select className={inputClass} aria-label="Payment filter" value={payment} onChange={e => { setPayment(e.target.value); setPage(1); }}>
        <option value="">All payments</option><option value="verified">Verified payment</option><option value="unverified">No verified payment</option>
      </select>
    </div>
    <AdminState {...result} />
    {result.data && <>
      <OrderTable orders={result.data.items} />
      <Pagination page={result.data.page} total={result.data.total} pageSize={result.data.page_size} onChange={setPage} />
    </>}
  </>;
}
