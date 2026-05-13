# 🚀 Smart POS System - Enterprise Edition

A modern, high-performance, and scalable Point of Sale (POS) system designed for enterprise-level retail management. Built with a focus on **Clean Architecture**, **Type Safety**, and a **SaaS-inspired UI/UX**.

## ✨ Key Highlights
- **SaaS Modern UI:** Clean, professional dashboard with interactive analytics.
- **RBAC Security:** Enterprise-grade Role-Based Access Control (Admin, Manager, Cashier).
- **Clean Architecture:** Strict separation of concerns (Controllers, Services, Repositories).
- **Scalable Frontend:** Modular component architecture with reusable UI kits.
- **Production-Ready:** Built with React 19, TypeScript, and Tailwind CSS.

## 🛠️ Tech Stack
- **Frontend:** React 19, Vite, Tailwind CSS, Recharts, Framer Motion.
- **Backend:** Node.js, Express, TypeScript, Zod (Validation).
- **Architecture:** Controller-Service-Repository (CSR) Pattern.
- **Database:** Mock Memory Store (Architected for PostgreSQL/MongoDB migration).

## 🏗️ Technical Architecture

### Backend (Clean Architecture)
1. **Controllers:** Handle HTTP logic & input validation using Zod.
2. **Services:** Core business logic (Transaction processing, inventory math).
3. **Repositories:** Data access layer following the Data Mapper pattern.
4. **Models/Types:** Single source of truth for data contracts across the stack.

### Frontend (Modular Component Design)
- **Layouts:** Standardized SaaS layout with Sidebar and Navbar.
- **Views:** Page-level components (Dashboard, Inventory, POS).
- **UI Components:** Reusable "Atomic" components (Cards, Stats, Icons).
- **Hooks & Services:** Decoupled logic for API communication.

## 📁 Project Structure

```text
├── src/
│   ├── components/
│   │   ├── dashboard/    # Analytics, Stats, Charts
│   │   ├── layout/       # Sidebar, Navbar, Layout Wrapper
│   │   └── ui/           # Reusable Atomic UI (Cards, etc.)
│   ├── server/           # Express Backend
│   │   ├── controllers/  # API Entry Points
│   │   ├── services/     # Business Logic
│   │   └── repositories/ # Data Persistence
│   ├── App.tsx           # Main App Engine
│   └── main.tsx          # Client Entry Point
```

## 🚀 Getting Started

1. **Install Dependencies:**
   ```bash
   npm install
   ```
2. **Run Development Server:**
   ```bash
   npm run dev
   ```
3. **Build for Production:**
   ```bash
   npm run build
   ```

## 📡 Core API Endpoints

### 📦 Inventory
- `GET /api/products` - Filterable inventory list.
- `POST /api/products` - Add new enterprise resource.
- `PUT /api/products/:id` - Inventory reconciliation.

### 💰 Transactions
- `POST /api/transactions` - Process atomic checkout & stock deduction.
- `GET /api/transactions` - Audit trail of recent activities.

---
*Developed as a Fullstack Software Engineer Portfolio Project - 2026*
