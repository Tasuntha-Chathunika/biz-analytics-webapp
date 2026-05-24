# Operational Analytics Visualization Engine

![Project Status](https://img.shields.io/badge/Status-Active-brightgreen)
![Tech Stack](https://img.shields.io/badge/Tech-React_|_Node.js_|_PostgreSQL-blue)

## 📌 Project Overview
Contemporary corporate entities possess massive repositories of raw operational metrics but frequently struggle to interpret this data efficiently. This project translates dense, unstructured numeric datasets (CSV files) into actionable, visually coherent business intelligence. 

The **Operational Analytics Visualization Engine** eradicates decision-making paralysis by parsing raw CSV exports and rendering instantaneous graphical representations of corporate velocity, regional sales distributions, and longitudinal performance metrics.

## 🏗️ Architectural Blueprint
This full-stack application incorporates:
- **Frontend**: React.js (Vite), Chart.js (react-chartjs-2)
- **Backend**: Node.js, Express.js, Multer (for CSV stream ingestion)
- **Database**: PostgreSQL (hosted on Supabase)

### Core Features
- **High-Performance Ingestion**: Intercepts, validates, and injects heavy CSV metric files directly into relational tables via streams without blocking the Node.js event loop.
- **Dynamic Dashboards**: Interactive bar, line, and pie topological charts.
- **SQL Aggregations**: Highly complex SQL aggregations utilizing advanced queries and window functions to dynamically extract summarized comparative insights.
- **Rate Limiting**: Implementation of API protocols utilizing `express-rate-limit` middleware to protect analytical endpoints from programmatic abuse.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- A Supabase account (or local PostgreSQL setup)

### 1. Database Setup (Supabase)
1. Create a new project on [Supabase](https://supabase.com/).
2. Navigate to the **SQL Editor** and run the query found in `backend/schema.sql` to initialize the `sales_records` table and indexes.
3. Obtain your Database Connection String (Transaction Pooler IPv4) from `Settings -> Database`.

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
PORT=5000
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:6543/postgres
```
Start the backend server:
```bash
node index.js
```

### 3. Frontend Setup
Navigate to the frontend directory and install dependencies:
```bash
cd frontend
npm install
```
Start the frontend development server:
```bash
npm run dev
```
Navigate to `http://localhost:5173` in your browser.

## 📊 Using the Dashboard
1. Drag and drop your Corporate Sales CSV file into the Upload Dashboard.
2. The Node.js backend will stream the payload securely to PostgreSQL.
3. The React application will automatically request aggregated metrics and generate the premium Analytics Dashboard.

## 📄 License
This project is open-source and available under the MIT License.
