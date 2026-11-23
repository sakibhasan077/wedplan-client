# 💍 WedPlan – Wedding Planning Platform

WedPlan is a modern wedding planning platform designed to make wedding arrangements easier and more organized. It connects customers with professional wedding service vendors, allowing customers to explore services, manage booking requests, and plan their special day efficiently.

The platform provides dedicated dashboards for Customers, Vendors, and Admins, with role-based access and service management features.

---

## ✨ Important Features

### 👤 Authentication & User Management
- Secure user authentication and authorization.
- Role-based access for Admins, Vendors, and Customers.
- User profile management.
- Admin can block and unblock users.
- Protected routes and APIs.

### 🏪 Vendor Features
- Vendor dashboard with an overview of business activities.
- Add, update, and delete wedding services.
- Manage service availability (Active/Inactive).
- Track service approval status.
- Receive and manage customer booking requests.
- Accept or reject booking requests.
- Free and Premium subscription plans.
- Upgrade to Premium using Stripe Checkout.
- Premium Vendor Badge.

### 💒 Customer Features
- Browse approved and active wedding services.
- Search, filter, and sort services.
- View detailed service information.
- Submit booking requests with event details.
- Track booking request status.
- Cancel pending booking requests.
- Manage personal profile.

### 🛡️ Admin Features
- Admin dashboard with platform statistics.
- Manage registered users.
- Search and filter users by role.
- Block and unblock users.
- Review submitted services.
- Approve or reject services.
- Change published service status.
- Delete inappropriate services.
- View transaction information.

### 💳 Payment & Subscription
- Stripe Checkout integration in Test Mode.
- Premium subscription management.
- Secure payment verification using Stripe Webhooks.
- Transaction history management.
- Server-side subscription updates after verified payments.

---

## 🛠️ Technology Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- Shadcn UI / HeroUI
- Lucide React
- Framer Motion

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication

### Authentication & Payment
- Better Auth
- Stripe Checkout
- Stripe Webhooks

### Image Hosting
- ImgBB

---

## 📁 Project Structure

```text
WedPlan/
├── wedplan-client/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── services/
│   │   └── types/
│   ├── .env.local
│   └── package.json
│
└── wedplan-server/
    ├── index.js
    ├── package.json
    └── .env
```

*Note: The structure above is illustrative. Adjust it to match the actual project structure.*

---

## ⚙️ Installation Instructions

### Prerequisites

Make sure you have installed:

- Node.js (LTS version recommended)
- npm
- MongoDB account or local MongoDB server
- Stripe account
- ImgBB API Key

### 1. Clone the Client Repository

```bash
git clone YOUR_CLIENT_REPOSITORY_URL
cd wedplan-client
npm install
```

### 2. Clone the Server Repository

Open another terminal:

```bash
git clone YOUR_SERVER_REPOSITORY_URL
cd wedplan-server
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the client directory:

```env
NEXT_PUBLIC_API_URL=YOUR_BACKEND_API_URL
NEXT_PUBLIC_IMGBB_API_KEY=YOUR_IMGBB_API_KEY
```

Create a `.env` file in the server directory:

```env
PORT=5000
MONGODB_URI=YOUR_MONGODB_CONNECTION_STRING
STRIPE_SECRET_KEY=YOUR_STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET=YOUR_STRIPE_WEBHOOK_SECRET
```

Add other authentication-related environment variables required by your Better Auth configuration.

**Important:** Never commit secret keys, database credentials, or private environment variables to GitHub.

---

## 🚀 How to Run the Project Locally

### Start the Backend Server

Navigate to the server directory:

```bash
cd wedplan-server
npm run dev
```

The backend server should run at:

```text
http://localhost:5000
```

### Start the Frontend Application

Open another terminal and navigate to the client directory:

```bash
cd wedplan-client
npm run dev
```

Open your browser and visit:

```text
http://localhost:3000
```

---

## 🌐 Live Website

**Live Demo:** [WedPlan – Visit Website](https://wedplan-client-one.vercel.app)

---

## 📂 Repository Links

| Repository | Link |
|---|---|
| Client Repository | [GitHub – Client](https://github.com/sakibhasan077/wedplan-client) |
| Server Repository | [GitHub – Server](https://github.com/sakibhasan077/wedplan-server) |

---

## 🔐 Security & Validation

- Protected routes and role-based authorization.
- Backend-side JWT verification.
- Server-side input validation.
- Resource ownership verification.
- Secure Stripe payment verification through Webhooks.
- Sensitive credentials stored in environment variables.

---

## 👨‍💻 Author

**Sakib Hasan**

- GitHub: [sakibhasan077](https://github.com/sakibhasan077)
- LinkedIn: [Sakib Hasan](https://linkedin.com/in/sakibhasan-web)

---

⭐ If you find this project interesting, feel free to explore the repositories and share your feedback!