const weatherForm = document.getElementById('weather-form');
const cityInput = document.getElementById('city-input');
const errorMessage = document.getElementById('error-message');
const weatherData = document.getElementById('weather-data');
const cityName = document.getElementById('city-name');
const temperature = document.getElementById('temperature');
const weatherDescription = document.getElementById('weather-description');
const weatherIcon = document.getElementById('weather-icon');
const historyList = document.getElementById('history-list');
const clearHistoryButton = document.getElementById('clear-history');

let searchHistory = [];

weatherForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const city = cityInput.value;
    fetchWeather(city);
});

clearHistoryButton.addEventListener('click', function() {
    searchHistory = [];
    historyList.innerHTML = '';
});

function fetchWeather(city) {
    const apiKey = '8b9290da0228ad4e99bc79358e2c70b8'; 
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('City not found.');
                } else if (response.status === 401) {
                    throw new Error('Invalid API key.');
                } else {
                    throw new Error(`Error: ${response.status} ${response.statusText}`);
                }
            }
            return response.json();
        })
        .then(data => {
            errorMessage.classList.add('hidden');
            weatherData.classList.remove('hidden');
            cityName.textContent = data.name;
            temperature.textContent = `Temperature: ${data.main.temp}°C`;
            weatherDescription.textContent = data.weather[0].description;
            weatherIcon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

            addToHistory(city);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            weatherData.classList.add('hidden');
            errorMessage.classList.remove('hidden');
            errorMessage.textContent = error.message;
        });
}

function addToHistory(city) {
    if (!searchHistory.includes(city)) {
        searchHistory.push(city);
        const listItem = document.createElement('li');
        listItem.innerHTML = `<span class="history-item">${city}</span><button class="remove-item">X</button>`;
        listItem.querySelector('.history-item').addEventListener('click', () => fetchWeather(city));
        listItem.querySelector('.remove-item').addEventListener('click', (event) => {
            event.stopPropagation();
            removeFromHistory(city);
        });
        historyList.appendChild(listItem);
    }
}

function removeFromHistory(city) {
    searchHistory = searchHistory.filter(item => item !== city);
    updateHistoryList();
}

function updateHistoryList() {
    historyList.innerHTML = '';
    searchHistory.forEach(city => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<span class="history-item">${city}</span><button class="remove-item">X</button>`;
        listItem.querySelector('.history-item').addEventListener('click', () => fetchWeather(city));
        listItem.querySelector('.remove-item').addEventListener('click', (event) => {
            event.stopPropagation();
            removeFromHistory(city);
        });
        historyList.appendChild(listItem);
    });
}

