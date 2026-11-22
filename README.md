# WedPlan

WedPlan is a wedding-planning platform that helps couples discover wedding services and manage bookings, while giving vendors tools to manage their services and administrators tools to oversee the marketplace.

## Important Features

- Browse wedding services and view service details.
- Register and sign in with email and password, with Google sign-in support.
- Manage vendor services, availability, and booking requests.
- Create and track customer bookings.
- Role-based customer, vendor, and admin dashboards.
- Admin tools for managing users and reviewing services.
- Vendor premium-plan checkout using Stripe.
- Profile image and service image uploads using ImgBB.

## Technology Stack

| Area | Technologies |
| --- | --- |
| Client | Next.js 16 (App Router), React 19, TypeScript |
| UI | Tailwind CSS 4, Base UI, Motion |
| Authentication | Better Auth, MongoDB |
| Server | Node.js, Express 5 |
| Data | MongoDB |
| Payments and uploads | Stripe, ImgBB |

## Project Links

- **Live website:** Not deployed yet.
- **Client repository:** [sakibhasan077/wedplan-client](https://github.com/sakibhasan077/wedplan-client)
- **Server repository:** [sakibhasan077/wedplan-server](https://github.com/sakibhasan077/wedplan-server)

## Installation

### Prerequisites

- Node.js 20.9 or later and npm.
- A MongoDB connection string.
- Stripe test credentials for payment features.
- Google OAuth credentials for Google sign-in (optional).
- An ImgBB API key for image uploads (optional).

Clone both repositories and install their dependencies:

```bash
git clone https://github.com/sakibhasan077/wedplan-client.git
git clone https://github.com/sakibhasan077/wedplan-server.git

cd wedplan-client
npm install

cd ../wedplan-server
npm install
```

## Run the Project Locally

The client and server run as separate processes. Configure the environment files before starting them.

### 1. Configure the server

Create a `.env` file in the `wedplan-server` directory:

```env
MONGODB_URI=your_mongodb_connection_string
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
port=5000
```

Start the server from that directory:

```bash
node index.js
```

### 2. Configure the client

Create a `.env.local` file in the `wedplan-client` directory:

```env
NEXT_PUBLIC_SERVER_URL=http://localhost:5000
BETTER_AUTH_URL=http://localhost:3000
MONGODB_URI=your_mongodb_connection_string
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key

# Optional: enable Google sign-in
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Optional: enable profile and service image uploads
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key
```

In a second terminal, start the client:

```bash
cd wedplan-client
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Keep `.env` and `.env.local` private; do not commit credentials or API keys.
