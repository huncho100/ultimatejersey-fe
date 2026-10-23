import { useCallback, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAdminData } from "../../hooks/useAdminData";
import { adminService } from "../../services/adminService";
import { formatNaira, parseDecimal } from "../../utils/currency";
import { AdminHeading, AdminState, Badge, panelClass } from "../../components/admin/AdminShared";
import Button from "../../components/ui/Button";

function OrderContent({ id }: { id: number }) {
  const load = useCallback(() => adminService.order(id), [id]);
  const result = useAdminData(load);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const order = result.data;
  async function update(status: string) {
    const message = status === "cancelled"
      ? "Cancel this order? This does not refund any payment or restore stock. Reconcile any charged payment and returned goods manually."
      : `Move order #${id} to ${status}?`;
    if (!window.confirm(message)) return;
    setBusy(true);
    setError("");
    try {
      await adminService.updateOrder(id, status);
      result.reload();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Order update failed.");
    } finally { setBusy(false); }
  }
  return <>
    <AdminState {...result} />
    {order && <>
      <section className={`${panelClass} space-y-4`}>
        <p>{new Date(order.created_at).toLocaleString()} · Customer #{order.user_id}</p>
        <p>{order.customer.first_name} {order.customer.last_name} · {order.customer.email}</p>
        <p>Shipping information is not collected or stored by the current order model. Confirm delivery details through your established customer contact process.</p>
        <div className="flex flex-wrap gap-3"><Badge>Order: {order.status}</Badge><Badge>Payment: {order.payment_status}</Badge></div>
        <p className="text-2xl font-bold">{formatNaira(parseDecimal(order.total_amount))}</p>
      </section>
      <section className={`${panelClass} space-y-4`}>
        <h2 className="text-xl font-bold">Order items</h2>
        <p className="text-sm text-slate-600">Prices are immutable order snapshots. Product names below are current catalog names.</p>
        {order.items.length === 0 && <p>No item records are available for this order.</p>}
        {order.items.map(item => <div key={item.id} className="flex flex-wrap justify-between gap-3 border-t border-slate-200 pt-3">
          <Link className="text-blue-700 underline" to={`/admin/products/${item.product_id}`}>
            {order.product_names[String(item.product_id)] ?? `Product #${item.product_id}`}
          </Link>
          <span>{item.quantity} × {formatNaira(parseDecimal(item.unit_price))} = {formatNaira(parseDecimal(item.subtotal))}</span>
        </div>)}
      </section>
      <section className={`${panelClass} space-y-4`}>
        <h2 className="text-xl font-bold">Payment attempts</h2>
        <p>Read-only provider records. Payment status can only change through trusted verification or webhook processing.</p>
        {order.payments.length === 0 && <p>No payment attempt has been started.</p>}
        {order.payments.map(payment => <div key={payment.reference} className="space-y-1 border-t border-slate-200 pt-3">
          <p className="break-all font-mono text-sm">{payment.reference}</p>
          <p>{payment.status} · {payment.currency} {payment.amount} · {new Date(payment.created_at).toLocaleString()}</p>
        </div>)}
      </section>
      <section className={`${panelClass} space-y-4`}>
        <h2 className="text-xl font-bold">Available order actions</h2>
        <p>Only legal backend transitions are shown. Cancellation never issues a refund or automatically restocks goods.</p>
        {error && <p role="alert" className="text-red-700">{error}</p>}
        <div className="flex flex-wrap gap-3">
          {order.available_actions.map(action => <Button key={action} disabled={busy} variant={action === "cancelled" ? "outline" : "primary"} onClick={() => void update(action)}>
            {busy ? "Updating..." : `Move to ${action}`}
          </Button>)}
        </div>
        {order.available_actions.length === 0 && <p>No further transitions are supported.</p>}
      </section>
    </>}
  </>;
}

export default function AdminOrderDetails() {
  const { id } = useParams();
  const orderId = Number(id);
  return <>
    <AdminHeading title={`Order #${id}`}><Link className="text-blue-700 underline" to="/admin/orders">All orders</Link></AdminHeading>
    {Number.isInteger(orderId) && orderId > 0 ? <OrderContent id={orderId} /> : <p role="alert">Invalid order ID.</p>}
  </>;
}
