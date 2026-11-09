# 📊 Crypto & Weather Live Dashboard

![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-4.x-FF6384?logo=chartdotjs&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)

A real-time financial and meteorological web dashboard built with **Vanilla JavaScript (ES6+)**, **Chart.js**, and **CryptoJS**. It fetches live cryptocurrency market data and local weather metrics via public REST APIs and demonstrates client-side **AES-256 symmetric payload encryption**.

---

## ✨ Key Features

- **📈 Live Cryptocurrency Ticker:** Fetches real-time **Bitcoin (BTC)** and **Ethereum (ETH)** market prices in TRY via the CoinGecko REST API.
- **📉 7-Day Interactive Price Chart:** Renders historical Bitcoin price trends using **Chart.js** with responsive canvas scaling.
- **🌤️ Real-Time Weather Telemetry:** Displays live temperature, humidity, wind speed, and atmospheric conditions via the Open-Meteo API.
- **🔐 Client-Side AES Encryption Demo:** Encrypts and decrypts live JSON telemetry payloads in-browser using **CryptoJS AES**.

---

## 🗂️ Project Structure

```text
Crypto-Weather-Dashboard/
├── src/
│   ├── script.js            # API clients, Chart.js rendering & AES logic
│   └── style.css            # Responsive dashboard layout & cards
├── index.html               # Main application entry point
├── LICENSE                  # MIT License
└── README.md                # Project documentation
```

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/Firatdondar/Crypto-Weather-Dashboard.git
cd Crypto-Weather-Dashboard
```

### 2. Launch in Browser
Open `index.html` directly in any modern browser, or serve locally:
```bash
python -m http.server 8080
```
Then visit `http://localhost:8080`.

---

## 🔌 External APIs

| Provider | Endpoint Purpose | Authentication |
| :--- | :--- | :--- |
| [CoinGecko API](https://www.coingecko.com/en/api) | Live BTC/ETH prices & 7-day historical market chart | Free / No API Key |
| [Open-Meteo API](https://open-meteo.com/) | Real-time weather forecast & telemetry | Free / No API Key |

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.
