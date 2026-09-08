# Ambrosia Architectural Showroom — Animated MERN Showroom Catalog

> A production-grade, architectural, visual-first digital showroom catalog built with the **MERN stack (MongoDB, Express, React, Node.js)** + **TypeScript**, **Tailwind CSS**, and **Framer Motion**.

Inspired by luxury architectural materials and ceramic brands (such as Varmora), featuring 85% visual photography, dense editorial layouts, live multi-faceted filtering, instant WhatsApp specification inquiries, and a full-featured Admin CMS with real-time homepage builder.

---

## 🌟 Key Features

### 1. Customer-Facing Animated Digital Showroom
- **85% Visual / 15% Editorial Typography**: Tight architectural grid, zero wasteful empty hero banners, dense visual compositions.
- **Cinematic Framer Motion Animations**: Smooth page transitions, staggered card reveals, subtle zoom pans, and layout reflow without bounce or tacky AI styling.
- **Structured Multi-Facet Filtering**: Live filtering by **Category**, **Surface Application**, **Dimensions / Slices**, **Finish**, **Material Composition**, **Brand Partner**, and **Availability**.
- **Granite & Stone Slab Lightbox**: Fullscreen high-resolution texture inspection and zoom mode for natural stone, marble, and quartzite slabs.
- **Dedicated Material Showcases**:
  - `/tiles`: Large format porcelain slabs (1200x2400 mm), bookmatched Statuario, and honed travertines.
  - `/granite`: Black Galaxy, Colonial White, honed basalt, and gang-saw slabs.
  - `/wood`: Solid Burma teak pivot entrance doors, smoked oak acoustic louvers, and IS 710 marine plywood.
  - `/electrical`: Brushed brass switchboards, low-voltage magnetic track lights, and BLDC silent ceiling fans.
  - `/inspired-spaces`: Realized spaces of distinction with full room inspection.
- **60/40 Luxury Product Spread**: Zoomable image gallery, performance data matrix (water absorption, MOHS hardness, thickness), applications, related materials, and direct 1-click WhatsApp quote links.
- **Instant Specification Enquiry Modal**: Prepopulates SKU and product specs and sends leads directly to the Admin CMS.
- **Dynamic Site Settings Integration**: Logo, WhatsApp number, phone, address, and opening hours update throughout the frontend dynamically without touching code.

---

### 2. Powerful Admin CMS Dashboard (`/admin`)
- **Secure Authentication**: JWT-based bearer authentication with bcrypt password hashing and token validation.
- **Product Management**: Full CRUD, duplicate products, instant feature / visibility toggles, key-value technical specifications builder, and category selector.
- **Multi-Image Pipeline**: Cloudinary SDK integration with memory streaming + automatic local disk fallback (`/uploads`), supporting reordering, deleting, and setting primary cover images.
- **Homepage Builder**: Reorder sections (Hero, Featured, Categories, Collections, Granite, Wood, Electrical, Inspiration, Brands, Contact), toggle visibility, and customize hero slides with live frontend synchronization.
- **Category & Collection CMS**: Create, update, hide, and manage order of product disciplines and curated master suites.
- **Brand Management**: Add and reorder partner brands (e.g., Varmora, Kajaria, Schneider, Legrand, Century Ply).
- **Lead / Enquiry Manager**: Filter specification leads by status (`NEW`, `CONTACTED`, `CLOSED`), direct 1-click WhatsApp reply to the customer, and notes tracking.
- **Global Contact & SEO Settings**: Live control over business name, WhatsApp quote number, Google Maps location, opening hours, and meta titles.
- **Preview Live Website Button**: Instant access to live customer catalog spread.

---

## 🛠 Tech Stack

### Frontend (`/client`)
- **React 18** + **Vite** + **TypeScript**
- **Tailwind CSS** (Custom architectural stone & teak color tokens, dense aspect ratios)
- **Framer Motion** (Layout animations, modal entries, cinematic reveals)
- **React Router DOM v6**
- **Lucide React**
- **Axios** (With JWT interceptors and base URL configurations)

### Backend (`/server`)
- **Node.js** & **Express.js** + **TypeScript** (ES Modules)
- **MongoDB** & **Mongoose**
- **JWT** (`jsonwebtoken`) & **bcryptjs**
- **Multer** & **Cloudinary SDK** (with automatic fallback to local `/uploads`)
- **Helmet**, **CORS**, & **Express-Rate-Limit**
- **tsx** (Zero-config TypeScript script execution)

---

## 🚀 Quick Start & Installation

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** running locally (`mongodb://127.0.0.1:27017`) or a MongoDB Atlas URI.

---

### 2. Environment Variables Setup

#### Backend (`/server/.env`):
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/showroom_db
JWT_SECRET=super_secret_showroom_jwt_key_2026_production
CLIENT_URL=http://localhost:5173
ADMIN_EMAIL=admin@showroom.com
ADMIN_PASSWORD=Admin@12345

# Optional: Cloudinary configuration (if empty, uploads fallback locally to /uploads)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

### 3. Install Dependencies & Seed Database

```bash
# Install Server Dependencies
cd server
npm install

# Run Master Database Seed (Inserts 30+ Tiles, 15+ Granites, 15+ Woods, 15+ Electricals, Categories, Collections, Admin)
npm run seed

# Install Client Dependencies
cd ../client
npm install
```

---

### 4. Run Development Servers

#### Terminal 1 (Express API Server):
```bash
cd server
npm run dev
# Server running at http://localhost:5000
```

#### Terminal 2 (Vite React Client):
```bash
cd client
npm run dev
# Frontend running at http://localhost:5173
```

---

## 🔐 Default Admin Credentials

| Role | Email | Password | URL |
|---|---|---|---|
| **Managing Director / Admin** | `admin@showroom.com` | `Admin@12345` | `http://localhost:5173/admin/login` |

---

## 📂 Project Architecture

```
permium/
├── server/
│   ├── src/
│   │   ├── config/          # db.ts, cloudinary.ts
│   │   ├── models/          # Product, Category, Collection, Brand, Gallery, Homepage, Navigation, Enquiry, SiteSettings, User
│   │   ├── controllers/     # CRUD logic for all models & upload pipeline
│   │   ├── middleware/      # auth (JWT), upload (Multer/Cloudinary), errorHandler, rateLimiter
│   │   ├── routes/          # REST API endpoints
│   │   ├── seeds/           # seed.ts, seedData.ts, productSeeds.ts (80+ items)
│   │   └── server.ts        # Express entry point
│   └── package.json
├── client/
│   ├── src/
│   │   ├── api/             # axiosClient.ts, endpoints.ts
│   │   ├── context/         # AuthContext, SettingsContext, QuickViewContext, ToastContext
│   │   ├── types/           # Full TypeScript data definitions
│   │   ├── components/
│   │   │   ├── common/      # Navbar, Footer, ProductCard, AsymmetricGrid, QuickViewModal, EnquiryModal, Lightbox, WhatsAppFloating
│   │   │   └── admin/       # AdminLayout, AdminSidebar, ImageUploader, ConfirmModal
│   │   ├── sections/        # HeroSection, CategoriesSection, AsymmetricCatalogSection, GraniteShowcaseSection, WoodPanoramaSection, ElectricalStripSection, CollectionsSection, InspiredSpacesSection, BrandMarqueeSection, ContactStripSection
│   │   ├── pages/
│   │   │   ├── customer/    # HomePage, CatalogPage, CategoryShowcasePage, ProductDetailPage, InspiredSpacesPage, ContactPage
│   │   │   └── admin/       # AdminLoginPage, AdminDashboardPage, AdminProductsPage, ProductFormPage, AdminCategoriesPage, AdminCollectionsPage, AdminBrandsPage, AdminHomepageBuilderPage, AdminGalleryPage, AdminNavigationPage, AdminEnquiriesPage, AdminSettingsPage
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
└── README.md
```

---

## 🛡️ API Endpoints Summary

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/login` | Admin Login | Public |
| `GET` | `/api/products` | Filtered Catalog Products | Public |
| `GET` | `/api/products/slug/:slug` | Product Detail | Public |
| `POST` | `/api/products` | Create Product | Protected (Admin) |
| `PUT` | `/api/products/:id` | Update Product | Protected (Admin) |
| `DELETE` | `/api/products/:id` | Delete Product | Protected (Admin) |
| `GET` | `/api/homepage` | Dynamic Homepage Config | Public |
| `PUT` | `/api/homepage` | Update Sections & Hero | Protected (Admin) |
| `POST` | `/api/enquiries` | Submit Customer Lead | Public |
| `GET` | `/api/enquiries` | View Leads | Protected (Admin) |
| `GET` | `/api/settings` | Get Live Site & Contact Settings | Public |
| `PUT` | `/api/settings` | Update Site & WhatsApp Settings | Protected (Admin) |
| `POST` | `/api/upload/single` | Upload Single Image | Protected (Admin) |
| `POST` | `/api/upload/multiple` | Upload Multiple Images | Protected (Admin) |

---

## 📜 License
MIT License. Crafted for Indian architectural showrooms and material trading enterprises.
