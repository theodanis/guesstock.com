const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors({ origin: '*' }));  // CORS ayarlarını yapıyoruz

app.get('/stock-data/:symbol', async (req, res) => {
    const stockSymbol = req.params.symbol;

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
        res.status(500).json({ message: 'API hatası', error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
