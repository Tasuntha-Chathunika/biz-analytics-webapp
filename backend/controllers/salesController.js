const db = require('../db');

exports.getSales = async (req, res) => {
  try {
    const page = parseInt(req.query.page || 1, 10);
    const limit = parseInt(req.query.limit || 10, 10);
    const search = req.query.search || '';
    const offset = (page - 1) * limit;

    let rowsResult;
    let countResult;

    if (search.trim()) {
      const searchPattern = `%${search.trim()}%`;
      rowsResult = await db.query(
        `SELECT * FROM sales_records 
         WHERE region LIKE $1 OR category LIKE $2 OR product_name LIKE $3
         ORDER BY transaction_date DESC LIMIT $4 OFFSET $5`,
        [searchPattern, searchPattern, searchPattern, limit, offset]
      );
      countResult = await db.query(
        `SELECT COUNT(*) as count FROM sales_records 
         WHERE region LIKE $1 OR category LIKE $2 OR product_name LIKE $3`,
        [searchPattern, searchPattern, searchPattern]
      );
    } else {
      rowsResult = await db.query(
        `SELECT * FROM sales_records ORDER BY transaction_date DESC LIMIT $1 OFFSET $2`,
        [limit, offset]
      );
      countResult = await db.query(
        `SELECT COUNT(*) as count FROM sales_records`
      );
    }

    const totalCount = parseInt(countResult.rows[0]?.count || 0, 10);
    res.json({
      data: rowsResult.rows,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (err) {
    console.error('Error fetching sales:', err);
    res.status(500).json({ error: 'Failed to fetch sales records', details: err.message });
  }
};

exports.deleteSale = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query(`DELETE FROM sales_records WHERE id = $1`, [id]);
    res.json({ message: 'Record deleted successfully' });
  } catch (err) {
    console.error('Error deleting record:', err);
    res.status(500).json({ error: 'Failed to delete record', details: err.message });
  }
};

exports.clearSales = async (req, res) => {
  try {
    await db.query(`DELETE FROM sales_records`);
    res.json({ message: 'All records cleared successfully' });
  } catch (err) {
    console.error('Error clearing database:', err);
    res.status(500).json({ error: 'Failed to clear database', details: err.message });
  }
};

exports.getRecentTransactions = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, transaction_date, region, category, product_name, quantity_sold, revenue
       FROM sales_records
       ORDER BY transaction_date DESC
       LIMIT 5`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching recent transactions:', err);
    res.status(500).json({ error: 'Failed to fetch recent transactions', details: err.message });
  }
};
