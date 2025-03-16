let selectedCountry = "US"; 
let selectedStock = "";
let timeframe = "5Y";
let score = 0;
let optionsSelected = false;  // Şık seçildi mi kontrol etmek için
let gameEnded = false; // Oyun bitti mi kontrol etmek için

// 📌 Zaman formatını asdsyarlama fonksiyonu
function formatDate(timestamp) {
    const date = new Date(timestamp * 1000); // Unix timestamp'ı milisaniyeye çevir
    if (isNaN(date)) {
        console.error("Geçersiz tarih verisi:", timestamp);
        return '';  // Geçersiz tarih durumunda boş string döndür
    }

    let options;
    if (timeframe === "1M" || timeframe === "3M") {
        options = { month: 'short', day: 'numeric' }; // 1 ay & 3 ay → Gün ve Ay
    } else {
        options = { month: 'short', year: '2-digit' }; // 1 yıl ve üstü → Ay ve Yıl
    }

    return new Intl.DateTimeFormat('en-US', options).format(date);
}

// 📌 Hisse fiyatlarını Yahoo Finance API ile çekmek için bir fonksiyon
async function fetchStockData(stockSymbol) {
    const currentDate = Math.floor(Date.now() / 1000); // Şu anki zaman, Unix timestamp olarak
    let dummyData = [];
    let step = 1; // Varsayılan olarak her gün veri ekle

    if (timeframe === "3M") step = 3; // 3 günde bir
    if (timeframe === "1Y") step = 14; // 14 günde bir
    if (timeframe === "3Y") step = 30; // 30 günde bir
    if (timeframe === "5Y") step = 60; // 60 günde bir

    const totalDays = {
        "1M": 30,
        "3M": 90,
        "1Y": 365,
        "3Y": 1095,
        "5Y": 1825
    }[timeframe];

    for (let i = 0; i < totalDays; i += step) {
        dummyData.push({
            date: currentDate - (i * 86400),
            price: Math.random() * 1000, // Rastgele fiyat
        });
    }

    return dummyData.reverse().map(entry => ({
        date: new Date(entry.date * 1000),
        price: entry.price
    }));
}

// 📌 Zaman dilimini değiştir
function setTimeframe(tf) {
    timeframe = tf;
    generateStock();
}

// 📌 Hisse seç ve grafik oluştur
const STOCKS_US = [
    "AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "NVDA", "META", "NFLX", "BABA", "IBM",
    "NFLX", "GOOGL", "AMZN", "TSLA", "MSFT", "AAPL", "NVDA", "BABA", "AMD", "INTC",
    "FB", "NVDA", "AMD", "PYPL", "V", "MA", "CSCO", "BIDU", "SNAP", "UBER", "TWTR",
    "INTC", "ADBE", "SBUX", "BA", "GE", "DIS", "MSFT", "AAPL", "GOOG", "FB", "NVDA",
    "GS", "BRK.B", "WMT", "PG", "UNH", "BABA", "JNJ", "JPM", "AMZN"
];

const STOCKS_TR = [
    "ASELS.IS", "THYAO.IS", "GARAN.IS", "KRDMD.IS", "BIST.IS", "TUPRS.IS", "AKBNK.IS", "YKBNK.IS", "EREGL.IS", "VESTL.IS",
    "BIMAS.IS", "FROTO.IS", "KCHOL.IS", "PETKM.IS", "ISCTR.IS", "ARCLK.IS", "ODAS.IS", "SASA.IS", "TAVHL.IS", "KAPLM.IS",
    "GUBRF.IS", "KIMSE.IS", "ULKER.IS", "SAHOL.IS", "SISE.IS", "KORDS.IS", "HEKTS.IS", "EGEEN.IS", "MGROS.IS", "TTRAK.IS",
    "KARSN.IS", "ISGYO.IS", "CIMSA.IS", "ENKAI.IS", "ISGYO.IS", "KLCM.IS", "BRSAN.IS", "FENER.IS", "YAZIC.IS", "VAKBN.IS",
    "SARKY.IS", "OTKAR.IS", "TATGD.IS", "EGEPO.IS", "KRNMA.IS", "MAVI.IS", "SELEC.IS", "KOZAL.IS", "ALCAR.IS", "ADEL.IS",
    "PETKM.IS", "TUPRS.IS", "ZOREN.IS", "VERUS.IS", "BIMAS.IS"
];

let selectedMarket = "US"; // Default olarak US seçili

function changeStockMarket() {
    selectedMarket = document.getElementById("countrySelect").value;
    resetGame();
    generateStock();
}

// 📌 Hisseyi rastgele seçme fonksiyonu
async function generateStock() {
    let stockList = selectedCountry === 'TR' ? STOCKS_TR : STOCKS_US;  // TR veya US hissesi
    selectedStock = stockList[Math.floor(Math.random() * stockList.length)];  // Rastgele hisse seç
    const stockData = await fetchStockData(selectedStock);  // Hisse verisini çek

    if (stockData.length > 0) {
        drawChart(stockData);  // Grafiği çiz
    } else {
        alert("Hisse verileri alınamadı!");
    }

    // Başlangıç temizlik işlemleri
    document.getElementById("resultMessage").textContent = "";
    document.getElementById("guessInput").value = "";
    document.getElementById("retryButton").classList.add("d-none");
    document.getElementById("optionsContainer").classList.add("d-none");
    enableButtons();  // Şıklar aktifken, tahmin butonlarını da aktif yap
}


// 📌 Şık oluşturma fonksiyonu
function generateOptions() {
    let options = new Set();
    let stockList = selectedCountry === 'TR' ? STOCKS_TR : STOCKS_US;

    options.add(selectedStock);

    while (options.size < 4) {
        const randomStock = stockList[Math.floor(Math.random() * stockList.length)];
        if (randomStock !== selectedStock) options.add(randomStock);
    }

    options = Array.from(options);
    options = options.sort(() => Math.random() - 0.5);

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

    document.querySelector(".btn-warning").disabled = true;
    document.querySelector(".btn-dark").disabled = true;
    document.getElementById("guessInput").disabled = true;
}

function checkOptionGuess(selected) {
    if (gameEnded) return;

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
    optionsSelected = true;

    document.getElementById("retryButton").classList.remove("d-none");
    gameEnded = true;
    disableButtons();
}

function checkGuess() {
    if (gameEnded || optionsSelected) return;

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
    endGame();
}

function endGame() {
    document.getElementById("guessInput").classList.add("d-none");
    document.querySelector(".button-container").classList.add("d-none");
    document.getElementById("optionsContainer").classList.add("d-none");

    document.getElementById("retryButton").classList.remove("d-none");
    gameEnded = true;
}

function resetGame() {
    generateStock();
    document.getElementById("retryButton").classList.add("d-none");
    gameEnded = false;

    document.getElementById("guessInput").classList.remove("d-none");
    document.querySelector(".button-container").classList.remove("d-none");
    document.getElementById("resultMessage").textContent = "";
    document.getElementById("guessInput").value = "";
    optionsSelected = false;

    enableButtons();

    document.querySelector(".btn-warning").disabled = false;
    document.querySelector(".btn-dark").disabled = false;

    document.getElementById("optionsContainer").classList.add("d-none");
}

function disableButtons() {
    document.getElementById("optionsButtons").querySelectorAll("button").forEach(button => {
        button.disabled = true;
    });

    document.querySelector(".btn-warning").disabled = true;
    document.querySelector(".btn-dark").disabled = true;
}

function enableButtons() {
    document.getElementById("optionsButtons").querySelectorAll("button").forEach(button => {
        button.disabled = false;
    });
    document.querySelector(".btn-warning").disabled = false;
    document.querySelector(".btn-dark").disabled = false;
}

function drawChart(stockData) {
    const ctx = document.getElementById("stockChart").getContext("2d");

    if (window.stockChartInstance) {
        window.stockChartInstance.destroy();
    }

    const dataLimit = timeframe === "5Y" ? 1825 : timeframe === "3Y" ? 1095 :
                      timeframe === "1Y" ? 365 : timeframe === "3M" ? 90 : 30;

    const limitedData = stockData.slice(0, dataLimit);

    window.stockChartInstance = new Chart(ctx, {
        type: "line",
        data: {
            labels: limitedData.map(entry => formatDate(entry.date.getTime() / 1000)),
            datasets: [{
                label: "",
                data: limitedData.map(entry => entry.price),
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 2,
                fill: false,
            }]
        }
    });
}

// Sayfa yüklemede ilk hisseyi oluştur
generateStock();
