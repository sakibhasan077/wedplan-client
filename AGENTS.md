<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# wedplan-client & System Agent Instructions

Next.js 16 App Router client for a wedding-planning app.

---

## 1. Stack Quirks & Rules (STRICT COMPLIANCE)

- **Next 16.4.6**, **React 19.3**, App Router under `src/app`, Turbopack builder.
- `next.config.ts` turns on `cacheComponents`, `partialPrefetching`, and `reactCompiler`:
  - **PPR is default**: Uncached reads (`fetch`, `cookies()`, `headers()`, MongoDB) must be under `<Suspense>`, wrapped in `"use cache"` + `cacheLife`/`cacheTag`, or the route must export `instant = false` — otherwise `next build` fails prerendering.
  - **Do NOT export `runtime`** from routes/layouts (`edge` is unsupported under Cache Components).
  - **React Compiler is on**: do not manually add `useMemo` / `useCallback` for render performance.
- **Tailwind v4**: No `tailwind.config.*`. Tokens are CSS vars plus `@theme inline` in `src/app/globals.css`. CSS is compiled by `@tailwindcss/turbopack` loader in `next.config.ts` — do not remove that loader or add PostCSS config.
- **Route types**: Generated into `.next/types` and referenced by `next-env.d.ts`; `LayoutProps<"/">` / `PageProps` are globals. Don't edit `next-env.d.ts`. Run `npm run dev` or `npm run build` to regenerate route types before typechecking newly added routes.
- **UI Components (shadcn base-nova)**:
  - Base UI (`@base-ui/react`), **not Radix**.
  - Install components with `npx shadcn@latest add <component>`.
  - Do not import `@radix-ui/*` and do not use Radix APIs (`asChild` — Base UI uses `render` prop).
  - `cn` is from the `cn` npm package re-exported in `src/lib/utils.ts`. Do not import `clsx` or `tailwind-merge`.
  - Animation uses `motion`.
- **Commands & Verification**:
  ```bash
  npm run dev
  npm run lint        # bare eslint
  npx eslint --fix
  npx tsc --noEmit    # typecheck
  npm run build       # catches Cache Components / prerender errors
  ```

---

## 2. Project Specifications (docs/Assignment 9-Category_004.pdf)

### 2.1 Overview & Architecture
WedPlan is a role-based wedding planning platform with three user roles: **Customer**, **Vendor**, and **Admin**.
- **Client**: `wedplan-client` (Next.js 16, App Router, Base UI, Tailwind v4, Better Auth, Motion).
- **Server**: `wedplan-server` (Express.js, TypeScript/Node.js, JWT verification, MongoDB, Stripe, ImgBB).
- **Repositories**: Separate GitHub repos for client and server.
  - Minimum **20** meaningful client-side commits.
  - Minimum **12** meaningful server-side commits.

---

### 2.2 Database Collections (MongoDB)

Better Auth manages core auth collections (`user`, `session`, `account`, `verification`). The application business data uses:

1. **`users` (Better Auth User Collection)**:
   - `_id`: ObjectId
   - `name`: string
   - `email`: string (unique)
   - `image`: string (optional, ImgBB URL)
   - `role`: `"customer" | "vendor" | "admin"`
   - `isBlocked`: boolean (default `false`)
   - `businessName`: string (vendor only, optional)
   - `subscriptionPlan`: `"free" | "premium"` (default `"free"`)
   - `subscriptionExpiresAt`: Date | null
   - `createdAt`: Date, `updatedAt`: Date

2. **`services`**:
   - `_id`: ObjectId
   - `vendorId`: ObjectId (ref `users`)
   - `serviceName`: string
   - `category`: `"Photography & Videography" | "Wedding Venues" | "Decoration & Florist" | "Catering Services" | "Makeup & Styling" | "Wedding Fashion"`
   - `description`: string
   - `price`: number
   - `location`: string
   - `images`: string[] (ImgBB URLs)
   - `status`: `"pending" | "approved" | "rejected"` (default `"pending"`)
   - `isActive`: boolean (default `true`)
   - `createdAt`: Date, `updatedAt`: Date

3. **`bookings`**:
   - `_id`: ObjectId
   - `serviceId`: ObjectId (ref `services`)
   - `vendorId`: ObjectId (ref `users`)
   - `customerId`: ObjectId (ref `users`)
   - `eventDate`: Date
   - `eventLocation`: string
   - `message`: string
   - `status`: `"Pending" | "Accepted" | "Rejected" | "Cancelled"` (default `"Pending"`)
   - `createdAt`: Date, `updatedAt`: Date

4. **`transactions`**:
   - `_id`: ObjectId
   - `vendorId`: ObjectId (ref `users`)
   - `plan`: `"premium"`
   - `amount`: number
   - `currency`: string (e.g. `"usd"`)
   - `stripeSessionId`: string (unique)
   - `stripeSubscriptionId`: string | null
   - `status`: `"successful" | "failed" | "pending"`
   - `createdAt`: Date, `updatedAt`: Date

---

### 2.3 Frontend Routes & Page Requirements

#### Public Routes
- **`/` (Home)**:
  - Wedding-themed Hero Banner: headline, short description, CTA button ("Explore Wedding Services").
  - Dynamic Section 1: Featured Wedding Services ($\ge 6$ approved & active services from DB).
  - Dynamic Section 2: Wedding Service Categories (6 cards, clickable to filter `/services`).
  - Required Section: "Why Choose WedPlan?".
  - Additional Section: "How WedPlan Works" or "Customer Testimonials".
  - Smooth Framer Motion / Motion animations.
- **`/services` (Browse Services)**:
  - Search by service name.
  - Category-based filter.
  - Location-based filter.
  - Price sorting (Ascending / Descending).
  - Loading skeleton & empty states.
  - Unauthenticated click on "View Details" or "Book" $\rightarrow$ redirects to `/sign-in`.
- **`/sign-in`**:
  - Email/Password login + Google OAuth login.
  - Redirects to role-specific dashboard post-login.
  - Toast error and success feedback.
- **`/sign-up`**:
  - Fields: Full Name, Email, Password ($\ge 6$ chars, 1 uppercase, 1 lowercase), optional Profile Image (ImgBB file upload), Role selector (**Vendor** vs **Customer** only; Admin registration is forbidden).
  - Google OAuth signup.
- **Navbar & Footer**:
  - Navbar: Logo ("WedPlan"), Public Links (Home, Browse Services, Sign In, Sign Up), Authenticated state (Home, Browse Services, Profile Dropdown with Name, Image, Dashboard link, Profile Settings, Logout). Updates immediately on auth change.
  - Footer: Logo, description, navigation links, contact info, social links, copyright.

#### Protected Pages
- **`/services/[id]`**:
  - Service details: Name, Multiple Images, Category, Description, Price, Location, Vendor Info.
  - Booking form modal: Event Date, Event Location, Customer Message.
  - Only authenticated Customers can book. Vendors cannot book own services. Admins cannot book.
- **`/profile`**:
  - Update Name, Profile Image (ImgBB).
  - Read-only Role and Subscription status (strictly unmodifiable by user).
- **`/payment/success`**:
  - Shows payment confirmation, displays updated subscription status, CTA to Vendor Dashboard.
- **`/payment/cancel`**:
  - Shows cancellation message and option to retry.

#### Role-Based Dashboards (`/dashboard/*`)
- Persistent sidebar layout with responsive mobile support, role-based navigation, statistics cards.
- **Vendor Dashboard**:
  - `/dashboard/vendor` (Overview): Total Services, Active Services, Pending Booking Requests, Accepted Bookings, Current Subscription Plan.
  - `/dashboard/vendor/services` (My Services): View info, update, delete, approval status (`pending`/`approved`/`rejected`), toggle availability (`isActive`).
  - `/dashboard/vendor/services/add` (Add Service): Add service form with ImgBB upload. Status defaults to `pending`. Free vendor limited to 3 active services.
  - `/dashboard/vendor/services/[id]/edit` (Edit Service): Update service details.
  - `/dashboard/vendor/bookings` (Booking Requests): Customer info, service info, event date, location, message, status. Actions: **Accept** / **Reject** (for `Pending` requests only).
  - `/dashboard/vendor/subscription` (Subscription): Free vs Premium plan details. Upgrade to Premium button triggering Stripe Checkout.
- **Customer Dashboard**:
  - `/dashboard/customer` (Overview): Total Booking Requests, Pending Bookings, Accepted Bookings, Rejected Bookings.
  - `/dashboard/customer/bookings` (My Bookings): Service details, vendor info, date, location, status. Action: **Cancel** (allowed only for `Pending` bookings).
- **Admin Dashboard**:
  - `/dashboard/admin` (Overview): Total Users, Total Vendors, Total Customers, Total Services, Pending Services, Total Transactions.
  - `/dashboard/admin/users` (Manage Users): Search by name/email, filter by role, View user details, **Block/Unblock** user.
  - `/dashboard/admin/services` (Manage Services): Review all submitted services, filter by status, **Approve**, **Reject**, change status, **Delete** inappropriate services.
  - `/dashboard/admin/transactions` (Transactions): Read-only transaction log. Admin cannot manually mark transactions as successful.

---

### 2.4 Express Backend API Specification

#### Middleware & Security
- `verifyJWT`: Validates Bearer token from `Authorization` header. Attaches `req.user = { id, email, role, isBlocked }`.
- `requireRole(...roles)`: Enforces role permissions. Returns `403 Forbidden` if role is unauthorized.
- `checkBlocked`: Rejects requests from blocked users with `403 Forbidden: Account blocked`.

#### Endpoints
- **Services**:
  - `GET /api/services`: Public. Filters: `search`, `category`, `location`, `sort` (price asc/desc), `page`, `limit`. Only returns `status: "approved"` and `isActive: true`.
  - `GET /api/services/featured`: Public. Top 6 approved & active services.
  - `GET /api/services/:id`: Authenticated. Full service + vendor info.
  - `GET /api/vendor/services`: Vendor only. Services owned by vendor.
  - `POST /api/vendor/services`: Vendor only. Checks active services count $\ge 3$ for free plan. Sets `status: "pending"`.
  - `PATCH /api/vendor/services/:id`: Vendor only. Checks ownership. Updates details or `isActive`.
  - `DELETE /api/vendor/services/:id`: Vendor only. Checks ownership. Deletes service.
  - `GET /api/admin/services`: Admin only. Lists all services across all statuses.
  - `PATCH /api/admin/services/:id/status`: Admin only. Sets status to `approved` or `rejected`.
  - `DELETE /api/admin/services/:id`: Admin only. Deletes inappropriate services.
- **Bookings**:
  - `POST /api/bookings`: Customer only. Validates active/approved service, checks customer $\ne$ vendor, prevents duplicate pending/accepted booking for same `serviceId` + `eventDate`. Sets status to `Pending`.
  - `GET /api/customer/bookings`: Customer only. List customer's bookings.
  - `PATCH /api/customer/bookings/:id/cancel`: Customer only. Cancels booking if status is `Pending` and owned by customer.
  - `GET /api/vendor/bookings`: Vendor only. List booking requests for vendor's services.
  - `PATCH /api/vendor/bookings/:id/status`: Vendor only. Sets status to `Accepted` or `Rejected` if current status is `Pending` and owned by vendor.
- **Payments & Stripe**:
  - `POST /api/payments/create-checkout-session`: Vendor only. Creates Stripe Checkout session for Premium upgrade.
  - `POST /api/payments/webhook`: Public (Stripe Signature verification). On `checkout.session.completed`, logs transaction in `transactions` and sets `users.subscriptionPlan = "premium"`.
  - `GET /api/admin/transactions`: Admin only. Read-only transaction list.
- **Users & Admin**:
  - `GET /api/users/me`: Authenticated. Returns current user profile & role.
  - `PATCH /api/users/me`: Authenticated. Updates name, image, businessName. Disallows role/plan tampering.
  - `GET /api/admin/users`: Admin only. Search & filter registered users.
  - `PATCH /api/admin/users/:id/block`: Admin only. Toggles `isBlocked`. Disallows self-blocking.
  - `GET /api/admin/stats`: Admin only. Platform statistics.
  - `GET /api/vendor/stats`: Vendor only. Vendor-specific statistics.
  - `GET /api/customer/stats`: Customer only. Customer-specific statistics.

---

### 2.5 Strict Business Rules Summary

1. **Free Vendor Limits**: Max 3 active services. 4th active service rejected by server unless upgraded to Premium.
2. **Approval Workflow**: All newly added services start with `status: "pending"`. Only Admin can change to `approved` or `rejected`. Only `approved` + `isActive: true` services show publicly.
3. **Booking Guards**:
   - Customer cannot book own services.
   - Admin cannot book services.
   - Duplicate bookings for same service and same event date are blocked.
   - Customers can only cancel `Pending` bookings.
   - Vendors can only Accept or Reject `Pending` bookings; once accepted or rejected, status is locked.
4. **Stripe Webhook Security**:
   - Client redirect to `/payment/success` never activates Premium.
   - Premium activation happens strictly inside verified Stripe webhook `checkout.session.completed`.
   - Admin cannot manually edit payment records to mark them successful.
5. **Blocked User Enforcement**: Blocked users cannot perform any protected actions.
6. **Admin Access Security**: Admin accounts cannot be created via public registration. Admin is seeded securely via server environment variables.

---

## 3. Development Workflow & Git Guidelines

- Verify code with: `npm run lint && npx tsc --noEmit && npm run build`.
- Maintain separate client and server repositories.
- Client commits $\ge 20$ meaningful commits.
- Server commits $\ge 12$ meaningful commits.
- Never commit `.env` or sensitive credentials.
