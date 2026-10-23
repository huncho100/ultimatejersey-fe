# Ultimate Kits frontend

## Development

The frontend expects the API at `http://localhost:8000` by default. Set
`VITE_API_BASE_URL` to use a different API origin.

```powershell
npm install
npm run dev
```

Use `npm run build` to type-check and create the production bundle.

## Store administration

Visit `/admin` with an active administrator account. The interface verifies the
current role with the API, reuses the existing login flow and provides Dashboard,
Products, Inventory, Orders, Customers and Reports. Product and stock changes
persist through authenticated backend operations and refresh the current tab's
storefront catalog.

Primary image previews report missing/broken paths. This branch does not expose
gallery editing, shipping-address management, product archiving, refunds or role
editing. Availability can stop sales without deleting product history.

See the [store management guide](../ultimateKits-API/docs/admin-management.md)
for secure local provisioning, exact metric definitions, API contracts, migration
history warnings and the production launch checklist. Never place API/payment
secrets in `VITE_` variables.
