const fs = require('fs');
const csv = require('csv-parser');
const db = require('../db');

exports.uploadCSV = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const results = [];
  const filePath = req.file.path;

  // Stream the CSV file
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => {
      // Map CSV columns to our database structure
      const record = {
        transaction_date: data.Date || data.date || data.transaction_date,
        region: data.Region || data.region,
        category: data.Category || data.category,
        product_name: data['Product Name'] || data.product || data.Product,
        quantity_sold: parseInt(data.Quantity || data.quantity || 1, 10),
        revenue: parseFloat(data.Revenue || data.revenue || data.Sales || data.sales || 0)
      };
      results.push(record);
    })
    .on('end', async () => {
      try {
        await db.query('BEGIN');
        
        for (const row of results) {
          if (row.transaction_date && row.region && !isNaN(row.revenue)) {
            await db.query(
              `INSERT INTO sales_records (transaction_date, region, category, product_name, quantity_sold, revenue) 
               VALUES ($1, $2, $3, $4, $5, $6)`,
              [row.transaction_date, row.region, row.category, row.product_name, row.quantity_sold, row.revenue]
            );
          }
        }
        
        await db.query('COMMIT');
        fs.unlinkSync(filePath);
        
        res.json({ message: 'Upload successful', rowsProcessed: results.length });
      } catch (err) {
        await db.query('ROLLBACK');
        console.error('Database insertion error:', err);
        res.status(500).json({ error: 'Failed to save data to database', details: err.message });
      }
    })
    .on('error', (err) => {
      console.error('CSV Parsing error:', err);
      res.status(500).json({ error: 'Failed to parse CSV file' });
    });
};
