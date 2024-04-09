document.addEventListener('DOMContentLoaded', function() {
    const cityButtons = document.querySelectorAll('.cities-list .city-button');
    const searchButton = document.querySelector('.search-button');
    const searchInput = document.querySelector('.search-input');
    const apiKey = '1320a882ac410975999ee75a91a95667';

    cityButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const cityName = this.textContent;
            fetchWeatherData(cityName, apiKey);
        });
    });

    searchButton.addEventListener('click', function() {
        const cityName = searchInput.value; // Get the city name from the input field
        fetchWeatherData(cityName, apiKey);
    });
});

function fetchWeatherData(cityName, apiKey) {
    const fivedaysAPIUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&appid=' + apiKey;
    const todayAPIUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=' + apiKey;

    Promise.all([
        fetch(fivedaysAPIUrl).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok for 5-day forecast');
            }
            return response.json();
        }),
        fetch(todayAPIUrl).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok for today\'s weather');
            }
            return response.json();
        })
    ])
    .then(([FiveDayData, todayData]) => {
        // Process and log the weather data as before
        processWeatherData(FiveDayData, todayData, cityName);
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}

function processWeatherData(FiveDayData, todayData, cityName) {
    const dailyForecasts = [];

    for (let i = 0; i < FiveDayData.list.length; i++) {
        const forecast = FiveDayData.list[i];
        const forecastTime = new Date(forecast.dt * 1000);
        
        if (forecastTime.getUTCHours() === 12) {
            dailyForecasts.push({
                humidity: forecast.main.humidity,
                speed: forecast.wind.speed,
                temp: forecast.main.temp,
                date: forecast.dt_txt,
                weather: forecast.weather[0].main
            });
        }
    }
    
    localStorage.setItem('forecastFiveDays', JSON.stringify(dailyForecasts));
    // Additional logging or UI updates to reflect the fetched weather data
    console.log(`The current temperature in ${cityName} is ${todayData.main.temp}°C`);
    console.log("humidity: " + todayData.main.humidity);
    console.log("Temp:  " + todayData.main.temp);
    console.log("Speed: " + todayData.wind.speed);
    console.log("weather: " + todayData.weather[0].main);
    // Continue logging other details...
}
