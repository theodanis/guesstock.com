const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000; // Render'a uygun port

// CORS middleware
app.use(cors());

// API route'u
app.get('/api/stock-data/:stockSymbol', async (req, res) => {
  const { stockSymbol } = req.params; // Stock symbol'ı URL parametresinden alıyoruz

  try {
    const response = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${stockSymbol}?interval=1d&range=5y`);
    const data = response.data;
    res.json(data); // API'den aldığımız veriyi frontend'e gönderiyoruz
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Veri çekme hatası' });
  }
});

// Sunucuyu başlatıyoruz
app.listen(port, () => {
  console.log(`Sunucu http://localhost:${port} adresinde çalışıyor.`);
});
