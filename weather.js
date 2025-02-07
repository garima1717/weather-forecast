const apiKey = 'd7bd1388d494f21889dca7d4ef66d2ef'; // Replace with your OpenWeatherMap API key
let currentUnit = 'metric'; // Default unit is Celsius

// Fetch weather data
async function getWeather() {
    const city = document.getElementById('city').value || 'Chandigarh'; // Default to Chandigarh if no city is entered
    const errorDiv = document.getElementById('error');
    const forecastDiv = document.getElementById('forecast');

    try {
        // OpenWeatherMap API URLs
        const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${currentUnit}`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${currentUnit}`;

        // Fetch current weather
        const currentWeatherResponse = await fetch(currentWeatherUrl);
        const currentWeatherData = await currentWeatherResponse.json();

        // Handle invalid city names
        if (currentWeatherData.cod !== 200) {
            throw new Error(currentWeatherData.message || 'Error fetching current weather');
        }

        displayCurrentWeather(currentWeatherData);

        // Fetch hourly forecast
        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();
        displayHourlyForecastGraph(forecastData.list);
        displayDailyForecast(forecastData.list);

        errorDiv.style.display = 'none'; // Clear any previous errors
    } catch (error) {
        errorDiv.style.display = 'block';
        errorDiv.textContent = `Error: ${error.message}`;
    }
}

// Display current weather
function displayCurrentWeather(data) {
    const location = document.getElementById('location');
    const temperature = document.getElementById('temperature');
    const feelsLike = document.getElementById('feels-like');
    const humidity = document.getElementById('humidity');

    const tempUnit = currentUnit === 'metric' ? '°C' : '°F';

    location.innerText = `${data.name}, ${data.sys.country}`;
    temperature.innerText = `🟠 ${data.main.temp}${tempUnit}`;
    feelsLike.innerText = `Feels Like: ${data.main.feels_like}${tempUnit}`;
    humidity.innerText = `Humidity: ${data.main.humidity}%`;
}

// Display hourly forecast graph for the next 8 hours
function displayHourlyForecastGraph(hourlyData) {
    const next8Hours = hourlyData.slice(0, 8);

    const labels = next8Hours.map((item) => {
        const date = new Date(item.dt * 1000);
        return `${date.getHours()}:00`;
    });
    const temperatures = next8Hours.map((item) => item.main.temp);

    const ctx = document.getElementById('hourly-forecast-graph').getContext('2d');

    // Destroy any existing chart
    if (window.hourlyChart) {
        window.hourlyChart.destroy();
    }

    window.hourlyChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: `Hourly Temperature (${currentUnit === 'metric' ? '°C' : '°F'})`,
                    data: temperatures,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,
                },
            },
            scales: {
                x: {
                    ticks: {
                        font: { size: 10 },
                    },
                },
                y: {
                    ticks: {
                        font: { size: 10 },
                    },
                },
            },
        },
    });
}

// Display daily forecast for the next 7 days
function displayDailyForecast(hourlyData) {
    const forecastDiv = document.getElementById('forecast');
    forecastDiv.innerHTML = '';

    const dailyForecasts = hourlyData.filter((item, index) => index % 8 === 0).slice(0, 7);

    dailyForecasts.forEach((day) => {
        const date = new Date(day.dt * 1000);
        const card = document.createElement('div');
        card.className = 'forecast-card';
        card.innerHTML = `
            <div class="date">${date.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
            })}</div>
            <img class="weather-icon" src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="${day.weather[0].description}">
            <div class="temp">${Math.round(day.main.temp)}°${currentUnit === 'metric' ? 'C' : 'F'}</div>
            <div class="description">${day.weather[0].description}</div>

        `;
        forecastDiv.appendChild(card);
    });
}

// Toggle between Celsius and Fahrenheit
function toggleUnit() {
    currentUnit = currentUnit === 'metric' ? 'imperial' : 'metric';
    const unitLabel = document.getElementById('unit-label');
    unitLabel.textContent = currentUnit === 'metric' ? 'Switch to Fahrenheit (°F)' : 'Switch to Celsius (°C)';

    getWeather(); // Refresh weather data with the new unit
}

// Fetch weather on page load
document.addEventListener('DOMContentLoaded', () => {
    getWeather();

    // Allow Enter key to trigger the search
    document.getElementById('city').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            getWeather();
        }
    });
});
