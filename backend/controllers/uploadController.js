const fs = require('fs');
const csv = require('csv-parser');
const db = require('../db');

exports.processCSV = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const results = [];
  const filePath = req.file.path;

  // Stream the CSV file
  const readStream = fs.createReadStream(filePath);

  readStream.on('error', (err) => {
    console.error('File read error:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to read uploaded file' });
    }
  });

  readStream
    .pipe(csv({ mapHeaders: ({ header }) => header.trim() }))
    .on('data', (data) => {
      // Map CSV columns to our database structure
      const record = {
        transaction_date: data.transaction_date || data.Date || data.date,
        region: data.region || data.Region,
        category: data.category || data.Category,
        product_name: data.product_name || data['Product Name'] || data.product || data.Product,
        quantity_sold: parseInt(data.quantity_sold || data.Quantity || data.quantity || 1, 10),
        revenue: parseFloat(data.revenue || data.Revenue || data.Sales || data.sales || 0)
      };
      
      // මේ පේළිය අනිවාර්යයෙන්ම තියෙන්න ඕනේ!
      results.push(record);
    })
    .on('end', async () => {
      if (res.headersSent) return;

      let client;
      try {
        client = await db.getClient();
        await client.query('BEGIN');

        for (const row of results) {
          if (row.transaction_date && row.region && !isNaN(row.quantity_sold) && !isNaN(row.revenue)) {
            await client.query(
              `INSERT INTO sales_records (transaction_date, region, category, product_name, quantity_sold, revenue) 
               VALUES ($1, $2, $3, $4, $5, $6)`,
              [row.transaction_date, row.region, row.category, row.product_name, row.quantity_sold, row.revenue]
            );
          }
        }

        await client.query('COMMIT');
        if (!res.headersSent) {
          res.json({ message: 'Upload successful', rowsProcessed: results.length });
        }
      } catch (err) {
        if (client) {
          try {
            await client.query('ROLLBACK');
          } catch (rollbackErr) {
            console.error('Rollback error:', rollbackErr);
          }
        }
        console.error('Database insertion error:', err);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Failed to save data to database', details: err.message });
        }
      } finally {
        if (client) client.release();
        try {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        } catch (fsErr) {
          console.error('Failed to clean up temp file:', fsErr);
        }
      }
    })
    .on('error', (err) => {
      console.error('CSV Parsing error:', err);
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (fsErr) {
        console.error('Failed to clean up temp file:', fsErr);
      }
      
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to parse CSV file' });
      }
    });
};
