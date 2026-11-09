# 📊 Crypto & Weather Dashboard

A real-time data dashboard built with vanilla JavaScript that fetches live cryptocurrency prices and weather data, then demonstrates AES symmetric encryption/decryption using CryptoJS.

---

## ✨ Features

- 📈 **Live Crypto Prices** — Bitcoin & Ethereum prices in TRY via CoinGecko API
- 🌤️ **Live Weather** — Current temperature, humidity, and conditions for Şanlıurfa via Open-Meteo
- 📉 **Bitcoin Chart** — 7-day price history rendered with Chart.js
- 🔐 **AES Encryption** — Encrypt and decrypt fetched data in-browser using CryptoJS

---

## 🗂️ Project Structure

```
crypto-weather-dashboard/
├── index.html          # Main HTML entry point
├── src/
│   ├── script.js       # All JavaScript logic
│   └── style.css       # All styles
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Option 1 — Open directly in browser

Just open `index.html` in any modern browser. No build step or server required.

### Option 2 — Use VS Code Live Server (recommended)

1. Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension in VS Code
2. Right-click `index.html` → **Open with Live Server**
3. The dashboard opens at `http://127.0.0.1:5500`

---

## 🔌 APIs Used

| API | Purpose | Docs |
|-----|---------|------|
| [CoinGecko](https://www.coingecko.com/en/api) | Crypto prices & history | Free, no key required |
| [Open-Meteo](https://open-meteo.com/) | Weather data | Free, no key required |

---

## 📦 Dependencies (via CDN)

| Library | Version | Purpose |
|---------|---------|---------|
| [Chart.js](https://www.chartjs.org/) | latest | Price history chart |
| [CryptoJS](https://cryptojs.gitbook.io/docs/) | 4.1.1 | AES encryption |
| [Font Awesome](https://fontawesome.com/) | 6.0.0-beta3 | Icons |
| [Google Fonts](https://fonts.google.com/) | — | Montserrat & Open Sans |

---

## ⚠️ Security Notice

> The encryption key in `script.js` is **hardcoded for demonstration purposes only**.  
> In a production application, **never expose secret keys on the client side**.  
> Keys should be managed server-side or via environment variables.

---

## 📄 License

MIT License — feel free to use, modify, and distribute.
