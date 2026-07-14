const db = require('../db');

exports.getKPIs = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        SUM(revenue) as total_revenue, 
        COUNT(*) as total_transactions,
        SUM(revenue) / NULLIF(COUNT(*), 0) as average_order_value,
        SUM(quantity_sold) as total_quantity
      FROM sales_records
    `);
    
    const topRegionRes = await db.query(`
      SELECT region, SUM(revenue) as revenue
      FROM sales_records
      WHERE region IS NOT NULL AND region != ''
      GROUP BY region
      ORDER BY revenue DESC
      LIMIT 1
    `);
    
    const topRegion = topRegionRes.rows[0]?.region || 'N/A';
    
    res.json({
      totalRevenue: result.rows[0].total_revenue || 0,
      totalTransactions: parseInt(result.rows[0].total_transactions || 0, 10),
      averageOrderValue: result.rows[0].average_order_value || 0,
      totalQuantity: parseInt(result.rows[0].total_quantity || 0, 10),
      topRegion: topRegion
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch KPIs', details: err.message });
  }
};

exports.getRegionalSales = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT region, SUM(revenue) as revenue
      FROM sales_records
      WHERE region IS NOT NULL
      GROUP BY region
      ORDER BY revenue DESC
    `);
    
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch regional sales', details: err.message });
  }
};

exports.getMonthlyTrend = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        strftime('%Y-%m', transaction_date) as month,
        SUM(revenue) as revenue
      FROM sales_records
      WHERE transaction_date IS NOT NULL
      GROUP BY strftime('%Y-%m', transaction_date)
      ORDER BY month ASC
    `);
    
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch monthly trend', details: err.message });
  }
};

exports.getCategorySales = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT category, SUM(revenue) as revenue
      FROM sales_records
      WHERE category IS NOT NULL AND category != ''
      GROUP BY category
      ORDER BY revenue DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch category sales', details: err.message });
  }
};

exports.getTopProducts = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT product_name, SUM(revenue) as revenue, SUM(quantity_sold) as quantity
      FROM sales_records
      WHERE product_name IS NOT NULL AND product_name != ''
      GROUP BY product_name
      ORDER BY revenue DESC
      LIMIT 5
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch top products', details: err.message });
  }
};
