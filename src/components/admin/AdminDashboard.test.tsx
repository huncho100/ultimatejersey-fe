import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import AdminLayout from "./AdminLayout";
import { ImagePreview, stockState } from "./AdminShared";
import AdminDashboard from "../../pages/admin/Dashboard";
import AdminProducts from "../../pages/admin/Products";
import AdminProductEditor from "../../pages/admin/ProductEditor";
import AdminOrderDetails from "../../pages/admin/OrderDetails";
import AdminOrders from "../../pages/admin/Orders";
import AdminCustomers from "../../pages/admin/Customers";
import { useAuth } from "../../context/AuthContext";
import { useProducts } from "../../context/ProductsContext";
import { adminService, type AdminOrder, type AdminOverview } from "../../services/adminService";
import type { ApiProduct } from "../../services/productServices";
import { ApiRequestError } from "../../services/api";
import { PLACEHOLDER_IMAGE } from "../../utils/catalog";
import { toProduct } from "../../services/productServices";

vi.mock("../../context/AuthContext", () => ({ useAuth: vi.fn() }));
vi.mock("../../context/ProductsContext", () => ({ useProducts: vi.fn() }));
vi.mock("../ui/Toast", () => ({ useToast: () => ({ success: vi.fn() }) }));

const product: ApiProduct = {
  id: 9, name: "Chelsea Home Jersey", sport: "Football", category: "Jerseys",
  team: "Chelsea", league: "Premier League", brand: "Nike",
  description: null, price: "25000.00", old_price: null, rating: 4.6,
  development_placeholder: false,
  image: "/images/products/football/chelsea-home.webp", in_stock: true,
  gallery: ["/images/products/football/chelsea-home.webp"],
  stock_quantity: 5, is_featured: true, is_new: false, is_best_seller: false,
  created_at: "2026-10-20T12:00:00Z", updated_at: "2026-10-20T12:00:00Z",
};
const overview: AdminOverview = {
  inventory: { total: 51, in_stock: 48, out_of_stock: 3, low_stock: 2, uncounted: 4, low_stock_threshold: 5 },
  total_orders: 10, awaiting_processing: 2,
  sales: { verified_orders: 1, verified_sales_ngn: "25000.00", cancelled_verified_orders: 0, cancelled_verified_ngn: "0.00" },
  recent_orders: [],
};
const order: AdminOrder = {
  id: 7, user_id: 2, status: "paid", total_amount: "25000.00",
  created_at: "2026-10-20T12:00:00Z", updated_at: "2026-10-20T12:00:00Z",
  customer: { id: 2, first_name: "Test", last_name: "Customer", email: "customer@example.com", is_active: true },
  payment_status: "success", available_actions: ["cancelled", "processing"],
  product_names: { "9": "Chelsea Home Jersey" },
  items: [{ id: 1, product_id: 9, quantity: 1, unit_price: "25000.00", subtotal: "25000.00" }],
  payments: [{ reference: "verified-reference", status: "success", amount: "25000.00", currency: "NGN", created_at: "2026-10-20T12:00:00Z" }],
};
const reloadCatalog = vi.fn();

function renderAdmin(path = "/admin") {
  return render(<MemoryRouter initialEntries={[path]}>
    <Routes>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="products/new" element={<AdminProductEditor />} />
        <Route path="products/:id" element={<AdminProductEditor />} />
        <Route path="inventory" element={<AdminProducts inventory />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="orders/:id" element={<AdminOrderDetails />} />
        <Route path="customers" element={<AdminCustomers />} />
      </Route>
      <Route path="/login" element={<p>Sign in page</p>} />
    </Routes>
  </MemoryRouter>);
}

beforeEach(() => {
  vi.restoreAllMocks();
  reloadCatalog.mockClear();
  vi.mocked(useAuth).mockReturnValue({
    user: { id: 1, firstName: "Store", lastName: "Owner", email: "owner@example.com", role: "admin" },
    isAuthenticated: true, loading: false, logout: vi.fn(),
    login: vi.fn(), register: vi.fn(), forgotPassword: vi.fn(), resetPassword: vi.fn(),
  });
  vi.mocked(useProducts).mockReturnValue({
    products: [toProduct(product)], loading: false, error: null, reload: reloadCatalog,
  });
  vi.spyOn(adminService, "me").mockResolvedValue({ role: "admin", is_active: true });
  vi.spyOn(adminService, "overview").mockResolvedValue(overview);
  vi.spyOn(adminService, "products").mockResolvedValue([toProduct(product)]);
  vi.spyOn(adminService, "product").mockResolvedValue(product);
  vi.spyOn(adminService, "order").mockResolvedValue(order);
});

describe("protected admin dashboard", () => {
  it("redirects anonymous visitors before any admin data request", async () => {
    vi.mocked(useAuth).mockReturnValue({ ...useAuth(), user: null, isAuthenticated: false });
    renderAdmin();
    expect(await screen.findByText("Sign in page")).toBeInTheDocument();
    expect(adminService.me).not.toHaveBeenCalled();
    expect(adminService.overview).not.toHaveBeenCalled();
  });

  it("rejects a cached admin role when the server reports a customer", async () => {
    vi.mocked(adminService.me).mockResolvedValue({ role: "customer", is_active: true });
    renderAdmin();
    expect(await screen.findByText("Administrator access required")).toBeInTheDocument();
    expect(adminService.overview).not.toHaveBeenCalled();
    expect(screen.queryByRole("navigation", { name: "Admin navigation" })).not.toBeInTheDocument();
  });

  it("does not expose protected content for an expired token", async () => {
    vi.mocked(adminService.me).mockRejectedValue(new ApiRequestError("Invalid or expired token.", 401));
    renderAdmin();
    expect(await screen.findByRole("alert")).toHaveTextContent("Invalid or expired token.");
    expect(screen.getByText("Sign in again")).toBeInTheDocument();
    expect(adminService.overview).not.toHaveBeenCalled();
  });

  it("renders server metrics in NGN with report definitions and empty orders", async () => {
    renderAdmin();
    expect(await screen.findByText("₦25,000.00")).toBeInTheDocument();
    expect(screen.getByText("51")).toBeInTheDocument();
    expect(screen.getByText("Low stock (1–5)")).toBeInTheDocument();
    expect(screen.getByText("No orders match these filters.")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Admin navigation" })).toBeInTheDocument();
    expect(screen.getByText(/Pending, failed and unverified payments do not count/)).toBeInTheDocument();
  });

  it("provides an actionable retry when overview loading fails", async () => {
    vi.mocked(adminService.overview).mockRejectedValueOnce(new Error("Database unavailable"));
    renderAdmin();
    expect(await screen.findByRole("alert")).toHaveTextContent("Database unavailable");
    await userEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(await screen.findByText("₦25,000.00")).toBeInTheDocument();
  });
});

describe("catalog and inventory management", () => {
  it("searches and filters products using the backend stock threshold", async () => {
    renderAdmin("/admin/products");
    expect(await screen.findByText("Chelsea Home Jersey")).toBeInTheDocument();
    await userEvent.selectOptions(screen.getByLabelText("Stock filter"), "low");
    expect(screen.getByText("Chelsea Home Jersey")).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText("Search products"), "United");
    expect(screen.getByText("No products match these filters.")).toBeInTheDocument();
  });

  it("saves metadata through the API without sending stale stock or server fields", async () => {
    const save = vi.spyOn(adminService, "saveProduct").mockResolvedValue(product);
    renderAdmin("/admin/products/9");
    const name = await screen.findByDisplayValue("Chelsea Home Jersey");
    await userEvent.clear(name);
    await userEvent.type(name, "Chelsea Home Updated");
    await userEvent.click(screen.getByRole("button", { name: "Save product" }));
    await waitFor(() => expect(save).toHaveBeenCalledOnce());
    const payload = save.mock.calls[0][0];
    expect(payload.name).toBe("Chelsea Home Updated");
    expect(payload.price).toBe("25000.00");
    expect(payload).not.toHaveProperty("stock_quantity");
    expect(payload).not.toHaveProperty("id");
    expect(payload).not.toHaveProperty("created_at");
    expect(save.mock.calls[0][1]).toBe(9);
    expect(reloadCatalog).toHaveBeenCalled();
  });

  it("creates products through the backend and preserves values after a validation error", async () => {
    const save = vi.spyOn(adminService, "saveProduct").mockRejectedValue(new Error("image: Use a root-relative URL."));
    renderAdmin("/admin/products/new");
    await screen.findByRole("button", { name: "Save product" });
    await userEvent.type(screen.getByLabelText("Product name *"), "New kit");
    await userEvent.type(screen.getByLabelText("Sport *"), "Football");
    await userEvent.type(screen.getByLabelText("Category *"), "Jerseys");
    await userEvent.type(screen.getByLabelText("Selling price (NGN) *"), "15000");
    await userEvent.click(screen.getByRole("button", { name: "Save product" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("image: Use a root-relative URL.");
    expect(save.mock.calls[0][1]).toBeUndefined();
    expect(screen.getByDisplayValue("New kit")).toBeInTheDocument();
  });

  it("shows a stock conflict instead of claiming a failed update succeeded", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    const save = vi.spyOn(adminService, "inventory").mockRejectedValue(
      new ApiRequestError("Stock changed since this page loaded. Reload before saving.", 409)
    );
    renderAdmin("/admin/inventory");
    const quantity = await screen.findByLabelText("Stock quantity for Chelsea Home Jersey");
    await userEvent.clear(quantity);
    await userEvent.type(quantity, "8");
    await userEvent.click(screen.getByRole("button", { name: "Save inventory" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Stock changed");
    expect(save).toHaveBeenCalledWith(9, {
      stock_quantity: 8, in_stock: true, expected_stock_quantity: 5, expected_in_stock: true,
    });
    expect(screen.queryByText("Inventory saved to the server.")).not.toBeInTheDocument();
    expect(reloadCatalog).not.toHaveBeenCalled();
  });

  it("persists inventory and refreshes the storefront after success", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    vi.spyOn(adminService, "inventory").mockResolvedValue({ ...product, stock_quantity: 8 });
    renderAdmin("/admin/inventory");
    await screen.findByRole("button", { name: "Save inventory" });
    await userEvent.click(screen.getByRole("button", { name: "Save inventory" }));
    expect(await screen.findByText("Inventory saved to the server.")).toBeInTheDocument();
    expect(reloadCatalog).toHaveBeenCalledOnce();
  });

  it("clears a previous stock success message when a later save fails", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    vi.spyOn(adminService, "inventory")
      .mockResolvedValueOnce(product)
      .mockRejectedValueOnce(new ApiRequestError("Stock changed. Reload before saving.", 409));
    renderAdmin("/admin/inventory");
    await screen.findByRole("button", { name: "Save inventory" });
    await userEvent.click(screen.getByRole("button", { name: "Save inventory" }));
    await screen.findByText("Inventory saved to the server.");
    await screen.findByRole("button", { name: "Save inventory" });
    await userEvent.click(screen.getByRole("button", { name: "Save inventory" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Stock changed");
    expect(screen.queryByText("Inventory saved to the server.")).not.toBeInTheDocument();
  });
});

describe("orders and customer records", () => {
  it("only exposes server-authorized transitions and read-only payment records", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(false);
    const update = vi.spyOn(adminService, "updateOrder").mockResolvedValue({ id: 7, status: "processing" });
    renderAdmin("/admin/orders/7");
    const process = await screen.findByRole("button", { name: "Move to processing" });
    expect(screen.queryByRole("button", { name: /paid/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Move to shipped" })).not.toBeInTheDocument();
    expect(screen.getByText("verified-reference")).toBeInTheDocument();
    expect(screen.getByText(/Shipping information is not collected/)).toBeInTheDocument();
    await userEvent.click(process);
    expect(update).not.toHaveBeenCalled();
    vi.mocked(window.confirm).mockReturnValue(true);
    await userEvent.click(process);
    await waitFor(() => expect(update).toHaveBeenCalledWith(7, "processing"));
  });

  it("passes order filters and pagination to the backend", async () => {
    const load = vi.spyOn(adminService, "orders").mockResolvedValue({
      items: [order], total: 21, page: 1, page_size: 20,
    });
    renderAdmin("/admin/orders");
    await screen.findByText("#7");
    await userEvent.selectOptions(screen.getByLabelText("Payment filter"), "verified");
    await waitFor(() => expect(load.mock.lastCall?.[0].get("payment_status")).toBe("verified"));
    await userEvent.click(screen.getByRole("button", { name: "Next" }));
    await waitFor(() => expect(load.mock.lastCall?.[0].get("page")).toBe("2"));
  });

  it("shows read-only customers and links to their order filter", async () => {
    vi.spyOn(adminService, "customers").mockResolvedValue({
      items: [{ ...order.customer, order_count: 3 }], total: 1, page: 1, page_size: 20,
    });
    renderAdmin("/admin/customers");
    expect(await screen.findByText("customer@example.com")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View customer orders" })).toHaveAttribute("href", "/admin/orders?customer_id=2");
    expect(screen.queryByRole("button", { name: /delete|promote/i })).not.toBeInTheDocument();
  });
});

describe("stock boundaries and image diagnostics", () => {
  it("treats five as low, six as normal, zero as out and null as uncounted", () => {
    const p = toProduct(product);
    expect(stockState(p, 5)).toBe("low");
    expect(stockState({ ...p, stockQuantity: 6 }, 5)).toBe("in");
    expect(stockState({ ...p, stockQuantity: 0 }, 5)).toBe("out");
    expect(stockState({ ...p, stockQuantity: null }, 5)).toBe("uncounted");
    expect(stockState({ ...p, inStock: false }, 5)).toBe("out");
  });

  it("identifies broken files and does not request external images", () => {
    const { rerender } = render(<ImagePreview path="/images/products/missing.webp" />);
    fireEvent.error(screen.getByRole("img"));
    expect(screen.getByText("Image failed to load. Check the path and file.")).toBeInTheDocument();
    rerender(<ImagePreview path="https://example.com/photo.jpg" />);
    expect(screen.getByRole("img")).toHaveAttribute("src", PLACEHOLDER_IMAGE);
    expect(screen.getByText("Use a local /images/ photograph URL.")).toBeInTheDocument();
  });
});
