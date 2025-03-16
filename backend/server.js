const express = require('express');
const cors = require('cors');  // CORS paketini dahil ediyoruz
const axios = require('axios');

const app = express();

// CORS'u aktif hale getiriyoruz
app.use(cors());  // Bu, tüm kaynaklardan gelen istekleri kabul eder

const port = process.env.PORT || 5000;

app.get('/api/stock-data/:symbol', async (req, res) => {
  const stockSymbol = req.params.symbol;
  try {
    const response = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${stockSymbol}?interval=1d&range=5y`);
    const data = response.data;
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching stock data');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
