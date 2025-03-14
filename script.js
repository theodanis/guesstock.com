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
    const endpoint = `https://guesstockcom.herokuapp.com/stock-data/${stockSymbol}`;
    const response = await fetch(endpoint);
    const data = await response.json();

    if (data.length > 0) {
        const stockData = data.map(entry => ({
            date: new Date(entry.date * 1000), // Unix timestamp'ini milisaniyeye çeviriyoruz
            price: entry.price,
        })).filter(entry => entry.price !== null); // Null değerleri filtrele

        return stockData;
    } else {
        console.error("Veri hatası:", data);
        return [];
    }
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

// 📌 Dropdown menüsüne göre hisse listesini değiştiren fonksiyon
function changeStockMarket() {
    selectedMarket = document.getElementById("stockSelect").value;  // Seçilen marketi al
    resetGame();
    generateStock();  // Hisseyi yeniden oluştur
}

// 📌 Hisseyi rastgele seçme fonksiyonu

// 📌 Hisse Seçimi - Random Hisse Seçme Fonksiyonu
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
// 📌 Şık oluşturma fonksiyonu
// 📌 Şık oluşturma fonksiyonu
// 📌 Kullanıcı seçiminden sonra, selectedCountry'yi güncelleme
function updateCountrySelection() {
    const countrySelect = document.getElementById("countrySelect");
    selectedCountry = countrySelect.value;  // TR veya US seçimi
    resetGame(); // Oyunu sıfırla ve yeni kategoriye göre şıkları oluştur
}

// 📌 Şık oluşturma fonksiyonu
function generateOptions() {
    let options = new Set();
    let stockList = selectedCountry === 'TR' ? STOCKS_TR : STOCKS_US;  // Seçilen ülkenin hisseleri

    options.add(selectedStock);  // Doğru hisseni şıklara ekle

    // Diğer 3 hisseyi random olarak seç
    while (options.size < 4) {
        const randomStock = stockList[Math.floor(Math.random() * stockList.length)];
        if (randomStock !== selectedStock) options.add(randomStock);  // Aynı hisseyi tekrar ekleme
    }

    options = Array.from(options); // Set'i array'e dönüştür
    options = options.sort(() => Math.random() - 0.5); // Şıkları karıştır

    // Şıkları HTML'e yerleştirme
    const optionsContainer = document.getElementById("optionsContainer");
    const optionsButtons = document.getElementById("optionsButtons");
    optionsButtons.innerHTML = ""; // Eski şıkları temizle

    options.forEach(stock => {
        const btn = document.createElement("button");
        btn.textContent = stock;
        btn.className = "btn btn-outline-primary";
        btn.onclick = () => checkOptionGuess(stock);  // Şık seçildiğinde kontrol et
        optionsButtons.appendChild(btn);
    });

    optionsContainer.classList.remove("d-none");  // Şıkları göster

    // Take Clues butonunu devre dışı bırakıyoruz
    document.querySelector(".btn-warning").disabled = true;
    document.getElementById("guessInput").disabled = true;  // Input'u da devre dışı bırak
}



// 📌 Şık tahmini kontrol et
function checkOptionGuess(selected) {
    if (gameEnded) return; // Eğer oyun bitti ise geri dön

    const message = document.getElementById("resultMessage");

    // Şık doğruysa
    if (selected === selectedStock) {
        message.textContent = "✅ Doğru Tahmin! +2 Puan";
        message.style.color = "green";
        score += 2;
    } else {
        // Şık yanlışsa
        message.textContent = `❌ Yanlış! Doğru cevap: ${selectedStock} (-2 Puan)`;
        message.style.color = "red";
        score -= 2;
    }

    // Puanı güncelle
    document.getElementById("score").textContent = score;

    // Şık seçildiğini işaretle
    optionsSelected = true;

    // "Tekrar Sor" butonunu görünür yap
    document.getElementById("retryButton").classList.remove("d-none");

    // Oyun bitmiş olarak işaretlensin
    gameEnded = true;

    // Butonları devre dışı bırak
    disableButtons();
}


// 📌 Manuel tahmini kontrol et
function checkGuess() {
    if (gameEnded || optionsSelected) return; // Eğer şık seçildiyse "Tahmin Et" butonu çalışmasın

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

// 📌 Oyun bitirme işlemi
function endGame() {
    // Butonları ve input'u gizle
    document.getElementById("guessInput").classList.add("d-none");
    document.querySelector(".button-container").classList.add("d-none");
    document.getElementById("optionsContainer").classList.add("d-none");
    
    // Tekrar Sor butonunu göster
    document.getElementById("retryButton").classList.remove("d-none");
    gameEnded = true;
}

function resetGame() {
    generateStock();  // Yeni hisse verisi oluştur
    document.getElementById("retryButton").classList.add("d-none");
    gameEnded = false;

    // Butonları ve input'u geri göster
    document.getElementById("guessInput").classList.remove("d-none");
    document.querySelector(".button-container").classList.remove("d-none");
    document.getElementById("resultMessage").textContent = "";
    document.getElementById("guessInput").value = "";
    optionsSelected = false; // Şık seçilmediğini sıfırla
    
    // Şıklar ve input'u tekrar aktif hale getir
    enableButtons();

    // Take Clues ve Write Guess butonlarını tekrar aktif yap
    document.querySelector(".btn-warning").disabled = false;  // Take Clues butonu
    document.querySelector(".btn-dark").disabled = false;  // Write Guess butonu

    // Şıklar container'ını gizle
    document.getElementById("optionsContainer").classList.add("d-none");
}



function disableButtons() {
    // Şık butonlarını devre dışı bırak
    document.getElementById("optionsButtons").querySelectorAll("button").forEach(button => {
        button.disabled = true;
    });

    // "Take Clues" ve "Write Guess" butonlarını devre dışı bırak
    document.querySelector(".btn-warning").disabled = true;
    document.querySelector(".btn-dark").disabled = true;
}




// 📌 Butonları aktif et
function enableButtons() {
    document.getElementById("optionsButtons").querySelectorAll("button").forEach(button => {
        button.disabled = false;
    });
    document.querySelector(".btn-warning").disabled = false;
    document.querySelector(".btn-dark").disabled = false;
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
            labels: filteredData.map(d => formatDate(d.date)), // Burada tarihleri formatlıyoruz
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
                x: { 
                    grid: { display: true }, 
                    ticks: { 
                        autoSkip: true, 
                        maxTicksLimit: 10, 
                        maxRotation: 0,    
                        minRotation: 0,
                    },
                },
                y: { grid: { display: false } },
            },
            plugins: { legend: { display: false } },
        },
    };

    window.stockChartInstance = new Chart(ctx, chartConfig);
}

// 📌 Oyunu başlat
generateStock();
