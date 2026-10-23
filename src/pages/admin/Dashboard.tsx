import { Link } from "react-router-dom";
import { useAdminData } from "../../hooks/useAdminData";
import { adminService } from "../../services/adminService";
import { formatNaira, parseDecimal } from "../../utils/currency";
import { AdminHeading, AdminState, OrderTable, panelClass } from "../../components/admin/AdminShared";
import Button from "../../components/ui/Button";

export default function AdminDashboard({ reports = false }: { reports?: boolean }) {
  const result = useAdminData(adminService.overview);
  const data = result.data;
  return <>
    <AdminHeading title={reports ? "Sales & inventory reports" : "Store overview"}>
      <Button variant="outline" onClick={result.reload}>Refresh</Button>
    </AdminHeading>
    <AdminState {...result} />
    {data && <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[
          ["Total products", data.inventory.total],
          ["Available products", data.inventory.in_stock],
          [`Low stock (1–${data.inventory.low_stock_threshold})`, data.inventory.low_stock],
          ["Out of stock / unavailable", data.inventory.out_of_stock],
          ["Uncounted inventory", data.inventory.uncounted],
          ["Total orders", data.total_orders],
          ["Verified orders awaiting processing", data.awaiting_processing],
          ["Verified sales (all time)", formatNaira(parseDecimal(data.sales.verified_sales_ngn))],
          ["Verified non-cancelled orders", data.sales.verified_orders],
        ].map(([label, value]) => <div key={label} className={panelClass}>
          <p className="text-sm font-medium text-slate-600">{label}</p>
          <p className="mt-2 text-3xl font-extrabold">{value}</p>
        </div>)}
      </div>
      <section className={`${panelClass} space-y-3`}>
        <h2 className="text-xl font-bold">Report definitions</h2>
        <p>Sales are the total order value, counted once per non-cancelled order, backed by a successful Paystack payment matching its customer, amount and NGN currency. Pending, failed and unverified payments do not count.</p>
        <p>Cancelled orders with verified payments: {data.sales.cancelled_verified_orders} ({formatNaira(parseDecimal(data.sales.cancelled_verified_ngn))}). These require manual payment/refund reconciliation; this system does not record refunds or calculate net profit.</p>
        <p>Low stock is a subset of available counted inventory. Uncounted means no quantity has been recorded, not zero. Stock is consumed on verified payment, not reserved at checkout.</p>
        <Link className="inline-block font-semibold text-blue-700 underline" to="/admin/inventory">Inspect inventory report</Link>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Recent orders</h2>
        <OrderTable orders={data.recent_orders} />
      </section>
    </>}
  </>;
}
