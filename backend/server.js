const cors = require('cors');
const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// CORS yapılandırması
const corsOptions = {
  origin: '*', // Yalnızca bu domain'e izin ver
  methods: ['GET', 'POST'], // İzin verilen HTTP metotları
  allowedHeaders: ['Content-Type'], // İzin verilen başlıklar
};

app.use(cors(corsOptions)); // CORS'u aktif hale getir

// Ana sayfa rotası (GET /)
app.get('/', (req, res) => {
    res.send('Merhaba, dünya!');  // Ana sayfa için basit bir yanıt
});

// API endpoint'iniz
app.get('/stock-data/:symbol', async (req, res) => {
    const stockSymbol = req.params.symbol.toUpperCase(); // Hisse kodunu büyük harfe çevir

    try {
        const response = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${stockSymbol}?interval=1d&range=5y`);
        const data = response.data;

        if (data.chart && data.chart.result) {
            const stockData = data.chart.result[0].timestamp.map((timestamp, index) => ({
                date: new Date(timestamp * 1000),
                price: data.chart.result[0].indicators.quote[0].close[index],
            }));
            res.json(stockData);
        } else {
            res.status(500).json({ message: 'Veri alınamadı' });
        }
    } catch (error) {
        console.error("API hatası:", error.message);
        res.status(500).json({ message: 'API hatası', error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
