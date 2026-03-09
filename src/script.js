document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const cryptoInfoElement = document.getElementById('crypto-info');
    const weatherInfoElement = document.getElementById('weather-info');
    const fetchButton = document.getElementById('fetch-button');
    const encryptButton = document.getElementById('encrypt-button');
    const decryptButton = document.getElementById('decrypt-button');
    const encryptedDataDiv = document.getElementById('encrypted-data');
    const encryptedTextElement = document.getElementById('encrypted-text');
    const decryptedDataDiv = document.getElementById('decrypted-data');
    const decryptedTable = document.getElementById('decrypted-table').getElementsByTagName('tbody')[0];
    const bitcoinPriceChartCanvas = document.getElementById('bitcoin-price-chart');
    const currentTemperatureElement = document.getElementById('current-temperature');

    // --- State ---
    let rawData = null;
    // WARNING: Not secure! In production, keys must be managed server-side.
    const encryptionKey = 'SecretKey123NotSecure';
    let bitcoinPriceChart = null;

    // --- Weather Code Descriptions ---
    const weatherCodeDescriptions = {
        0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
        45: "Fog", 48: "Icy fog", 51: "Light drizzle", 53: "Moderate drizzle",
        55: "Dense drizzle", 56: "Light freezing drizzle", 57: "Dense freezing drizzle",
        61: "Slight rain", 63: "Moderate rain", 65: "Heavy rain",
        66: "Light freezing rain", 67: "Heavy freezing rain", 71: "Slight snowfall",
        73: "Moderate snowfall", 75: "Heavy snowfall", 77: "Snow grains",
        80: "Slight rain showers", 81: "Moderate rain showers", 82: "Violent rain showers",
        85: "Slight snow showers", 86: "Heavy snow showers", 95: "Slight/moderate thunderstorm",
        96: "Thunderstorm with slight hail", 99: "Thunderstorm with heavy hail"
    };

    // --- Bitcoin Price History Chart ---
    async function fetchBitcoinPriceHistory() {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const fromTimestamp = Math.floor(sevenDaysAgo.getTime() / 1000);
        const toTimestamp = Math.floor(Date.now() / 1000);

        const historyUrl = `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range?vs_currency=try&from=${fromTimestamp}&to=${toTimestamp}`;

        try {
            const response = await fetch(historyUrl);
            const data = await response.json();
            if (data && data.prices) {
                const prices = data.prices.map(item => item[1]);
                const timestamps = data.prices.map(item => new Date(item[0]).toLocaleDateString());
                updateBitcoinPriceChart(timestamps, prices);
            } else {
                console.error('Could not retrieve Bitcoin price history.');
            }
        } catch (error) {
            console.error('Error fetching Bitcoin price history:', error);
        }
    }

    function updateBitcoinPriceChart(labels, data) {
        if (bitcoinPriceChart) {
            bitcoinPriceChart.destroy();
        }
        bitcoinPriceChart = new Chart(bitcoinPriceChartCanvas, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Bitcoin Price (TRY)',
                    data: data,
                    borderColor: '#f9a825',
                    borderWidth: 2,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: false }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) label += ': ';
                                if (context.parsed.y !== null) {
                                    label += context.parsed.y.toLocaleString('tr-TR', { maximumFractionDigits: 2 }) + ' TRY';
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }

    // --- Weather Data ---
    async function fetchWeatherData() {
        try {
            const response = await fetch(
                'https://api.open-meteo.com/v1/forecast?latitude=37.15&longitude=38.79' +
                '&current=temperature_2m,relative_humidity_2m,weather_code' +
                '&hourly=temperature_2m,relative_humidity_2m,weather_code' +
                '&daily=weather_code,temperature_2m_max,temperature_2m_min' +
                '&timezone=Europe%2FIstanbul&forecast_days=1'
            );
            const weatherData = await response.json();

            if (weatherData && weatherData.current) {
                rawData = rawData || {};
                rawData.weather = {
                    temperature: weatherData.current.temperature_2m,
                    humidity: weatherData.current.relative_humidity_2m,
                    weatherCode: weatherData.current.weather_code
                };

                const { temperature_2m: temperature, relative_humidity_2m: humidity, weather_code: weatherCode } = weatherData.current;
                const description = weatherCodeDescriptions[weatherCode] || 'Unknown';

                weatherInfoElement.textContent = `Weather: ${description}, Temp: ${temperature}°C, Humidity: ${humidity}%`;
                currentTemperatureElement.textContent = temperature;
            } else {
                weatherInfoElement.textContent = 'Could not retrieve weather data.';
                currentTemperatureElement.textContent = '-';
            }
        } catch (error) {
            console.error('Error fetching weather data:', error);
            weatherInfoElement.textContent = 'Could not retrieve weather data.';
            currentTemperatureElement.textContent = '-';
        }
    }

    // --- Initial Data Fetch ---
    async function fetchInitialData() {
        cryptoInfoElement.textContent = 'Loading...';
        weatherInfoElement.textContent = 'Loading...';
        rawData = {};

        await Promise.all([
            fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=try')
                .then(res => res.json())
                .then(data => {
                    if (data) {
                        rawData.crypto = data;
                        const btcPrice = data.bitcoin ? data.bitcoin.try : '-';
                        const ethPrice = data.ethereum ? data.ethereum.try : '-';
                        cryptoInfoElement.textContent =
                            `Bitcoin (TRY): ${btcPrice.toLocaleString('tr-TR', { maximumFractionDigits: 2 })}, ` +
                            `Ethereum (TRY): ${ethPrice.toLocaleString('tr-TR', { maximumFractionDigits: 2 })}`;
                    } else {
                        cryptoInfoElement.textContent = 'Could not retrieve crypto data.';
                    }
                })
                .catch(error => {
                    console.error('Error fetching crypto data:', error);
                    cryptoInfoElement.textContent = 'Could not retrieve crypto data.';
                }),
            fetchWeatherData()
        ]);

        await fetchBitcoinPriceHistory();
        console.log('Raw data before encryption:', rawData);
    }

    // --- Encrypt Button ---
    encryptButton.addEventListener('click', () => {
        if (rawData && (rawData.crypto || rawData.weather)) {
            const jsonData = JSON.stringify(rawData);
            const encrypted = CryptoJS.AES.encrypt(jsonData, encryptionKey).toString();
            encryptedTextElement.textContent = encrypted;
            encryptedDataDiv.style.display = 'block';
            decryptedDataDiv.style.display = 'none';
            decryptedTable.innerHTML = '';
        } else {
            alert('Please fetch data first before encrypting!');
        }
    });

    // --- Decrypt Button ---
    decryptButton.addEventListener('click', () => {
        const encryptedData = encryptedTextElement.textContent;
        if (!encryptedData) {
            alert('Please encrypt data first!');
            return;
        }

        try {
            const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, encryptionKey);

            if (decryptedBytes.sigBytes <= 0) {
                throw new Error('Decryption failed or returned empty data.');
            }

            const decryptedJson = decryptedBytes.toString(CryptoJS.enc.Utf8);
            if (!decryptedJson) {
                throw new Error('Decrypted data could not be converted to string.');
            }

            const decryptedData = JSON.parse(decryptedJson);
            console.log('Decrypted data (JSON):', JSON.stringify(decryptedData, null, 2));

            decryptedTable.innerHTML = '';
            decryptedDataDiv.style.display = 'block';
            encryptedDataDiv.style.display = 'none';

            // Crypto rows
            if (decryptedData.crypto) {
                const btcValue = decryptedData.crypto.bitcoin ? decryptedData.crypto.bitcoin.try : '-';
                const ethValue = decryptedData.crypto.ethereum ? decryptedData.crypto.ethereum.try : '-';

                [['Bitcoin (TRY)', btcValue], ['Ethereum (TRY)', ethValue]].forEach(([source, value]) => {
                    const row = decryptedTable.insertRow();
                    row.insertCell().textContent = source;
                    row.insertCell().textContent = value;
                });
            } else {
                const row = decryptedTable.insertRow();
                const cell = row.insertCell();
                cell.colSpan = 2;
                cell.textContent = 'No crypto data found in encrypted payload.';
            }

            // Weather rows
            if (decryptedData.weather) {
                const { temperature = '-', humidity = '-', weatherCode = '-' } = decryptedData.weather;
                const weatherDesc = weatherCodeDescriptions[weatherCode] || 'Unknown';

                [
                    ['Temperature (°C)', temperature],
                    ['Humidity (%)', humidity],
                    ['Weather Condition', weatherDesc]
                ].forEach(([source, value]) => {
                    const row = decryptedTable.insertRow();
                    row.insertCell().textContent = source;
                    row.insertCell().textContent = value;
                });
            } else {
                const row = decryptedTable.insertRow();
                const cell = row.insertCell();
                cell.colSpan = 2;
                cell.textContent = 'No weather data found in encrypted payload.';
            }

        } catch (error) {
            alert('An error occurred during decryption!');
            console.error('Decryption error:', error);
            decryptedTable.innerHTML = '';
            const row = decryptedTable.insertRow();
            const cell = row.insertCell();
            cell.colSpan = 2;
            cell.textContent = 'Could not decrypt or parse data. Check the console.';
        }
    });

    // --- Refresh Button ---
    fetchButton.addEventListener('click', fetchInitialData);

    // --- Auto-fetch on page load ---
    fetchInitialData();
});
