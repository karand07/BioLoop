# ♻️ BioLoop

**BioLoop** is a comprehensive B2B Agricultural Waste Marketplace designed to connect farmers, bio-waste processing companies, and logistics providers. By turning agricultural waste into a valuable resource, BioLoop promotes a sustainable, circular economy while providing additional income streams for farmers.

---

## 🌟 Key Features

*   **Role-Based Access Control**: Tailored portals for **Farmers**, **Companies**, **Logistics Partners**, and **Admins**.
*   **Dynamic Marketplace**: Real-time listings of available agricultural waste with advanced filtering and search.
*   **Negotiation Engine**: Built-in system allowing companies and farmers to negotiate prices before confirming an order.
*   **Integrated Logistics**: Automated delivery cost calculation based on distance, with pickup and delivery tracking.
*   **Secure Payments & Payouts**: End-to-end payment processing powered by Razorpay, including automated payouts to farmers and logistics providers.
*   **Multilingual Support**: Fully localized in **English**, **Hindi**, and **Marathi** to ensure accessibility for local farmers.
*   **Interactive Maps**: Location pickers and routing maps for accurate distance calculations and logistics planning.

---

## 🛠️ Technology Stack

### Frontend
*   **Framework**: React 18 with TypeScript
*   **Build Tool**: Vite
*   **Styling**: Tailwind CSS, Lucide React (Icons)
*   **State Management & Data Fetching**: React Query, Zustand (or context)
*   **Routing**: React Router DOM
*   **Localization**: i18next

### Backend
*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Language**: TypeScript
*   **ORM**: Prisma
*   **Database**: PostgreSQL (hosted on Neon)
*   **Authentication**: JSON Web Tokens (JWT)
*   **Third-Party Services**: 
    *   **Cloudinary**: Image storage for waste listings.
    *   **Razorpay**: Payment gateway and automated payouts.

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
*   Node.js (v18 or higher recommended)
*   npm or yarn
*   PostgreSQL database (or a Neon database URL)
*   Cloudinary Account
*   Razorpay Account

### 1. Clone the Repository
```bash
git clone https://github.com/karand07/BioLoop.git
cd BioLoop
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the following variables:
```env
PORT=5000
DATABASE_URL="postgresql://user:password@host:port/dbname"
JWT_SECRET="your_super_secret_jwt_key"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# Razorpay
RAZORPAY_KEY_ID="your_razorpay_key_id"
RAZORPAY_KEY_SECRET="your_razorpay_key_secret"
RAZORPAY_ACCOUNT_NUMBER="your_merchant_account_number"
```

Initialize the database and start the server:
```bash
npx prisma db push
# or npx prisma migrate dev

npm run dev
```

### 3. Frontend Setup
Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL="http://localhost:5000/api"
VITE_MAP_API_KEY="your_map_provider_key_if_applicable"
```

Start the frontend development server:
```bash
npm run dev
```

---

## 📦 Project Structure

```
BioLoop/
├── backend/               # Node.js + Express backend
│   ├── prisma/            # Database schema and migrations
│   ├── src/
│   │   ├── middleware/    # Auth and validation middlewares
│   │   ├── modules/       # Domain-driven feature modules (waste, orders, payouts)
│   │   └── index.ts       # App entry point
│   └── package.json
└── frontend/              # React frontend
    ├── src/
    │   ├── components/    # Reusable UI components
    │   ├── hooks/         # Custom React Query hooks
    │   ├── lib/           # Utilities, i18n configuration
    │   ├── pages/         # Role-specific pages (Company, Farmer, etc.)
    │   └── App.tsx        # Main router setup
    └── package.json
```

---

## 🤝 Contributing

Contributions are welcome! Please ensure you follow the existing code formatting (ESLint/Prettier) and submit pull requests with clear descriptions of your changes.
