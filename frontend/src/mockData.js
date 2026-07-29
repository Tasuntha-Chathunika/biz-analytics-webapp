export const kpiData = {
  totalRevenue: { change: 18.2 },
  totalOrders: { change: 12.4 },
  aov: { change: 4.9 },
  activeCustomers: { change: -2.3 },
};

export const salesData = [
  { month: "Jan", revenue: 10000, target: 12000 },
  { month: "Feb", revenue: 15000, target: 13000 },
  { month: "Mar", revenue: 18000, target: 15000 },
  { month: "Apr", revenue: 22000, target: 18000 },
  { month: "May", revenue: 25000, target: 20000 },
  { month: "Jun", revenue: 30000, target: 25000 },
  { month: "Jul", revenue: 32000, target: 28000 },
  { month: "Aug", revenue: 35000, target: 30000 },
  { month: "Sep", revenue: 38000, target: 35000 },
  { month: "Oct", revenue: 42000, target: 38000 },
  { month: "Nov", revenue: 48000, target: 45000 },
  { month: "Dec", revenue: 55000, target: 50000 },
];

export const weeklyData = [
  { day: "Mon", revenue: 2500, target: 2000 },
  { day: "Tue", revenue: 3000, target: 2500 },
  { day: "Wed", revenue: 2800, target: 3000 },
  { day: "Thu", revenue: 3500, target: 3200 },
  { day: "Fri", revenue: 4200, target: 4000 },
  { day: "Sat", revenue: 5000, target: 4500 },
  { day: "Sun", revenue: 5500, target: 5000 },
];

export const categoryData = [
  { name: "Electronics", value: 40, color: "#6366f1" },
  { name: "Fashion", value: 25, color: "#10b981" },
  { name: "Software", value: 15, color: "#8b5cf6" },
  { name: "Home & Garden", value: 12, color: "#38bdf8" },
  { name: "Sports", value: 8, color: "#f59e0b" },
];

export const regionData = [
  { region: "North America", revenue: 65000 },
  { region: "Europe", revenue: 45000 },
  { region: "Asia Pacific", revenue: 35000 },
  { region: "Latin America", revenue: 15000 },
  { region: "Middle East", revenue: 10000 },
];

export const topProducts = [
  { name: "MacBook Pro 16\"", units: 145, revenue: 285000 },
  { name: "iPhone 15 Pro", units: 230, revenue: 230000 },
  { name: "Sony WH-1000XM5", units: 420, revenue: 168000 },
  { name: "iPad Air", units: 280, revenue: 168000 },
  { name: "Apple Watch Series 9", units: 350, revenue: 140000 },
];

export const transactions = [
  { id: "TX-9012", date: "2024-12-01", customer: "Alice Johnson", product: "MacBook Pro 16\"", category: "Electronics", unitPrice: 1999, quantity: 1, total: 1999, status: "Completed" },
  { id: "TX-9013", date: "2024-12-01", customer: "Bob Smith", product: "iPhone 15 Pro", category: "Electronics", unitPrice: 999, quantity: 2, total: 1998, status: "Pending" },
  { id: "TX-9014", date: "2024-12-02", customer: "Charlie Brown", product: "Sony WH-1000XM5", category: "Electronics", unitPrice: 400, quantity: 1, total: 400, status: "Processing" },
  { id: "TX-9015", date: "2024-12-02", customer: "Diana Prince", product: "Nike Air Max", category: "Fashion", unitPrice: 150, quantity: 2, total: 300, status: "Completed" },
  { id: "TX-9016", date: "2024-12-03", customer: "Ethan Hunt", product: "iPad Air", category: "Electronics", unitPrice: 600, quantity: 1, total: 600, status: "Refunded" },
  { id: "TX-9017", date: "2024-12-03", customer: "Fiona Gallagher", product: "Adidas Ultraboost", category: "Fashion", unitPrice: 180, quantity: 1, total: 180, status: "Completed" },
  { id: "TX-9018", date: "2024-12-04", customer: "George Costanza", product: "Office Chair", category: "Home & Garden", unitPrice: 250, quantity: 1, total: 250, status: "Pending" },
  { id: "TX-9019", date: "2024-12-04", customer: "Hannah Abbott", product: "Dumbbells Set", category: "Sports", unitPrice: 120, quantity: 1, total: 120, status: "Completed" },
];
