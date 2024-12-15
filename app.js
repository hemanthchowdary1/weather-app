const apiKey = '562c3652289c791610601647100a208c';
let currentUnit = 'metric'; // Default unit is Celsius

let recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];

// Display recent searches on page load
function displaySearchHistory() {
    const historyContainer = document.getElementById('searchHistory');
    historyContainer.innerHTML = recentSearches
        .map(city => `<button onclick="fetchWeather('${city}')">${city}</button>`)
        .join('');
}

// Save city to localStorage for recent search history
function saveSearch(city) {
    if (!recentSearches.includes(city)) {
        recentSearches.unshift(city); // Add to the beginning of the array
        if (recentSearches.length > 5) recentSearches.pop(); // Keep only the last 5
        localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    }
}

// Fetch weather data from the API
async function fetchWeather(city) {
    try {
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${currentUnit}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.cod !== 200) {
            document.getElementById('weatherInfo').innerHTML = `<p>${data.message}</p>`;
            return;
        }

        displayWeather(data);
        saveSearch(city);
        displaySearchHistory();
    } catch (error) {
        console.error('Error fetching weather:', error);
        document.getElementById('weatherInfo').innerHTML = '<p>Something went wrong! Please try again later.</p>';
    }
}

// Display weather data on the page
function displayWeather(data) {
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    document.getElementById('weatherInfo').innerHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <p>Temperature: ${data.main.temp}°</p>
        <img src="${iconUrl}" alt="${data.weather[0].description}">
        <p>${data.weather[0].description}</p>
    `;
}

// Toggle between Celsius and Fahrenheit
function toggleTemperatureUnit() {
    currentUnit = currentUnit === 'metric' ? 'imperial' : 'metric';
    const city = document.getElementById('cityInput').value;
    if (city) fetchWeather(city);
}

// Add event listeners
document.getElementById('getWeatherBtn').addEventListener('click', () => {
    const city = document.getElementById('cityInput').value;
    if (city) fetchWeather(city);
});

document.getElementById('toggleTemp').addEventListener('click', toggleTemperatureUnit);

// Display recent search history when the page loads
displaySearchHistory();
