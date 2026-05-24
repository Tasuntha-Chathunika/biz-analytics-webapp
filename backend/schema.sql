-- Run this SQL in your Supabase SQL Editor to create the necessary tables

CREATE TABLE IF NOT EXISTS sales_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_date DATE,
    region VARCHAR(100),
    category VARCHAR(100),
    product_name VARCHAR(255),
    quantity_sold INTEGER,
    revenue NUMERIC(12, 2)
);

-- Indexes for performance optimization on large datasets
CREATE INDEX IF NOT EXISTS idx_sales_date ON sales_records(transaction_date);
CREATE INDEX IF NOT EXISTS idx_sales_region ON sales_records(region);
