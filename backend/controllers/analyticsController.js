const db = require('../db');

exports.getKPIs = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        SUM(revenue) as total_revenue, 
        COUNT(*) as total_transactions,
        SUM(revenue) / NULLIF(COUNT(*), 0) as average_order_value
      FROM sales_records
    `);
    
    res.json({
      totalRevenue: result.rows[0].total_revenue || 0,
      totalTransactions: parseInt(result.rows[0].total_transactions || 0, 10),
      averageOrderValue: result.rows[0].average_order_value || 0
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
        TO_CHAR(transaction_date, 'YYYY-MM') as month,
        SUM(revenue) as revenue
      FROM sales_records
      WHERE transaction_date IS NOT NULL
      GROUP BY TO_CHAR(transaction_date, 'YYYY-MM')
      ORDER BY month ASC
    `);
    
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch monthly trend', details: err.message });
  }
};
