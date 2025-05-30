// backend/server.js
const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PRODUCTS_FILE = './products.json';
const STOCK_FILE = './stock.json';
const SALES_FILE = './sales.json';

app.get('/api/products', (req, res) => {
  const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE));
  res.json(products);
});

app.post('/api/sale', (req, res) => {
  const sale = req.body;
  const stock = JSON.parse(fs.readFileSync(STOCK_FILE));
  const sales = JSON.parse(fs.readFileSync(SALES_FILE));

  let total = 0;
  sale.items.forEach(item => {
    const product = stock.find(p => p.id === item.id);
    if (product) {
      product.stock -= item.quantity;
      total += item.quantity * (item.price - product.costPrice); // profit
    }
  });

  sales.push({ ...sale, totalProfit: total });
  fs.writeFileSync(STOCK_FILE, JSON.stringify(stock, null, 2));
  fs.writeFileSync(SALES_FILE, JSON.stringify(sales, null, 2));

  res.json({ message: 'Sale recorded', profit: total });
});

app.get('/api/report', (req, res) => {
  const sales = JSON.parse(fs.readFileSync(SALES_FILE));
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalProfit, 0);
  res.json({ totalSales: sales.length, totalRevenue });
});

app.get('/', (req, res) => {
  res.send('Welcome to the Zone51 backend API 👽');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
