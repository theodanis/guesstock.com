const STOCKS = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "NVDA", "META", "NFLX", "BABA", "IBM"];
let selectedStock = "";
let timeframe = "5Y";
let score = 0;

// 📌 X ekseninde tarih formatını zaman dilimine göre ayarla
function formatDate(date) {
    let options;
    if (timeframe === "1M" || timeframe === "3M") {
        options = { month: 'short', day: 'numeric' }; // 📌 1 ay & 3 ay → Gün ve Ay
    } else {
        options = { month: 'short', year: '2-digit' }; // 📌 1 yıl ve üstü → Ay ve Yıl
    }
    return new Intl.DateTimeFormat('en-US', options).format(date);
}

// 📌 Zaman dilimini değiştir
function setTimeframe(tf) {
    timeframe = tf;
    generateStock();
}

// 📌 Dummy veri üretimi
function generateDummyData(days) {
    let data = [];
    let price = Math.random() * 100 + 100;

    for (let i = 0; i < days; i++) {
        let date = new Date();
        date.setDate(date.getDate() - (days - i));

        price += (Math.random() - 0.5) * 5;
        data.push({ date, price });
    }
    return data;
}

// 📌 Hisse seç ve grafik oluştur
function generateStock() {
    selectedStock = STOCKS[Math.floor(Math.random() * STOCKS.length)];
    const stockData = generateDummyData(1825); // 5 yıl için veri
    drawChart(stockData);

    // 📌 Önceki mesajları ve butonları sıfırla
    document.getElementById("resultMessage").textContent = "";
    document.getElementById("guessInput").value = "";
    document.getElementById("retryButton").classList.add("d-none");
    document.getElementById("optionsContainer").classList.add("d-none");
}

// 📌 Şık oluşturma fonksiyonu (Doğru cevap mutlaka içinde olacak)
function generateOptions() {
    let options = new Set();
    options.add(selectedStock);

    while (options.size < 4) {
        const randomStock = STOCKS[Math.floor(Math.random() * STOCKS.length)];
        if (randomStock !== selectedStock) options.add(randomStock);
    }

    options = Array.from(options).sort(() => Math.random() - 0.5); // 📌 Şıkları karıştır

    const optionsContainer = document.getElementById("optionsContainer");
    const optionsButtons = document.getElementById("optionsButtons");
    optionsButtons.innerHTML = "";

    options.forEach(stock => {
        const btn = document.createElement("button");
        btn.textContent = stock;
        btn.className = "btn btn-outline-primary";
        btn.onclick = () => checkOptionGuess(stock);
        optionsButtons.appendChild(btn);
    });

    optionsContainer.classList.remove("d-none");
}

// 📌 Şık tahmini kontrol et (Doğruysa +2 puan, Yanlışsa -2 puan)
function checkOptionGuess(selected) {
    const message = document.getElementById("resultMessage");

    if (selected === selectedStock) {
        message.textContent = "✅ Doğru Tahmin! +2 Puan";
        message.style.color = "green";
        score += 2;
    } else {
        message.textContent = `❌ Yanlış! Doğru cevap: ${selectedStock} (-2 Puan)`;
        message.style.color = "red";
        score -= 2;
    }

    document.getElementById("score").textContent = score;
    document.getElementById("optionsContainer").classList.add("d-none");
    document.getElementById("retryButton").classList.remove("d-none");
}

// 📌 Manuel tahmini kontrol et (Doğruysa +3 puan, Yanlışsa -3 puan)
function checkGuess() {
    const guess = document.getElementById("guessInput").value.toUpperCase();
    const message = document.getElementById("resultMessage");

    if (guess === selectedStock) {
        message.textContent = "✅ Doğru Tahmin! +3 Puan";
        message.style.color = "green";
        score += 3;
    } else {
        message.textContent = `❌ Yanlış! Doğru cevap: ${selectedStock} (-3 Puan)`;
        message.style.color = "red";
        score -= 3;
    }

    document.getElementById("score").textContent = score;
    document.getElementById("retryButton").classList.remove("d-none");
}

// 📌 Oyunu sıfırla ve yeni soru sor
function resetGame() {
    generateStock();
}

// 📌 Grafiği oluştur
function drawChart(stockData) {
    const ctx = document.getElementById("stockChart").getContext("2d");

    if (window.stockChartInstance) {
        window.stockChartInstance.destroy();
    }

    const dataLimit = timeframe === "5Y" ? 1825 : timeframe === "3Y" ? 1095 :
                      timeframe === "1Y" ? 365 : timeframe === "3M" ? 90 : 30;
    
    let filteredData = stockData.slice(-dataLimit);

    const chartConfig = {
        type: "line",
        data: {
            labels: filteredData.map(d => formatDate(d.date)),
            datasets: [{
                label: "Hisse Fiyatı",
                data: filteredData.map(d => d.price),
                borderColor: "#000000", // Siyah çizgi
                borderWidth: 2,
                fill: false,
                tension: 0.2,
                pointRadius: 0,
            }],
        },
        options: {
            responsive: true,
            scales: {
                x: { grid: { display: false }, ticks: { autoSkip: true, maxTicksLimit: 10 } },
                y: { grid: { display: false } },
            },
            plugins: { legend: { display: false } },
        },
    };

    window.stockChartInstance = new Chart(ctx, chartConfig);
}

// 📌 Oyunu başlat
generateStock();






































