rendering()

function rendering(){

   //redering for current weather if data exist
   
  const weatherHeading = document.querySelector('.current-weather h2');
  
  var heading =  JSON.parse(localStorage.getItem('CityName'));
  console.log(heading.cityname)
  
   weatherHeading.textContent = heading.cityname + " (" + heading.date + ") ";


   
  
  //var currentWeather = localstorage.getitem('TodayWeather');
  //onsole.log(currentWeather)
  

   const weatherDetails = document.querySelectorAll('.current-weather p');
   weatherDetails[0].textContent = 'Temp:' + heading.temp + " °F'";  // Update temperatur
   weatherDetails[1].textContent = 'Wind: ' + heading.wind + ' MPH'; // Update wind speed
   weatherDetails[2].textContent = 'Humidity: ' + heading.humidity +  ' %'; // U


    //redering for 5 days from localstorage
    const forecastDays = document.querySelectorAll('.forecast-day');
    var ForecastFiveDaysData = ForecastFiveDaysDataLocalStorage()
    for (var i = 0; i < ForecastFiveDaysData.length; i += 1) {
   
        var ForecastFiveDays = ForecastFiveDaysData[i];
         
        console.log("local date: " + ForecastFiveDays.dt_txt);
        console.log("local humidity: " + ForecastFiveDays.main.humidity);
        console.log("local speed: " + ForecastFiveDays.wind.speed);
        console.log("local Temp:  " + ForecastFiveDays.main.temp);
        console.log("local weather: " + ForecastFiveDays.weather[0].main);


        const inputDateString = ForecastFiveDays.dt_txt;

        // Creating a new Date object with the input date string
        const date = new Date(inputDateString);
        
        // Extracting the year, month, and day
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // getMonth() returns 0-11, so add 1 to get 1-12
        const day = date.getDate();
        
        // Formatting the date as "M/D/YYYY"
        const formattedDate = `${month}/${day}/${year}`;
        
       // console.log(formattedDate)

    
        const dateParagraph = forecastDays[i].querySelectorAll('p')[0];
        const tempParagraph = forecastDays[i].querySelectorAll('p')[2];
        const windParagraph = forecastDays[i].querySelectorAll('p')[3];
        const humidityParagraph = forecastDays[i].querySelectorAll('p')[4];
    
        dateParagraph.textContent = formattedDate;
        tempParagraph.textContent = "Temp: " +  ForecastFiveDays.main.temp + " °F";
        windParagraph.textContent = "Wind:  " + ForecastFiveDays.wind.speed + " MPH";
        humidityParagraph.textContent = "Humidity: " + ForecastFiveDays.main.humidity + " %";
    }




}

function ForecastFiveDaysDataLocalStorage() {
    var ForecastFiveDaysData = localStorage.getItem('ForecastFiveDays');
    if (ForecastFiveDaysData) {  
        ForecastFiveDaysData = JSON.parse(ForecastFiveDaysData);    
    } else {
        ForecastFiveDaysData = [];
    }
    return ForecastFiveDaysData;
  }





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
            var searchInput = document.querySelector('.search-input');
           
            if (response.status === 404) {

                //if city not found, puth  'invalid city name' to .serch-input element
                searchInput.value = "Invalid City Name";

                throw new Error('City not found for 5-day forecast');
            } else if (!response.ok) {
                throw new Error('Network response was not ok for 5-day forecast');
            }
            //if city found text value to be ""
            searchInput.value = "";
             
            return response.json();
        }),
        fetch(todayAPIUrl).then(response => {

            if (response.status === 404) {
                
                throw new Error('City not found for today forecast');
            } else if (!response.ok) {
                throw new Error('Network response was not ok for 5-day forecast');
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
            dailyForecasts.push(forecast);

            console.log("humidity: " + forecast.main.humidity);
            console.log("speed: " + forecast.wind.speed);
            console.log("Temp:  " + forecast.main.temp);
            console.log("date: " + forecast.dt_txt);
            console.log("weather: " + forecast.weather[0].main);
        }
    }
    
    localStorage.setItem('ForecastFiveDays', JSON.stringify(dailyForecasts));
    // Additional logging or UI updates to reflect the fetched weather data
    console.log(`The current temperature in ${cityName} is ${todayData.main.temp}°C`);
    console.log("humidity: " + todayData.main.humidity);
    console.log("Temp:  " + todayData.main.temp);
    console.log("Speed: " + todayData.wind.speed);
    console.log("weather: " + todayData.weather[0].main);

    localStorage.setItem('TodayWeather', JSON.stringify(todayData));



    const today = new Date();

// Extract the month, day, and year from the Date object

const month = today.getMonth() + 1;
const day = today.getDate();
const year = today.getFullYear();

// Format the date as "M/D/YYYY"
const formattedDate = `${month}/${day}/${year}`;
    
    
    var todayData = {

     cityname: cityName,
     temp:  todayData.main.temp,
     wind:  todayData.wind.speed,
     humidity: todayData.main.humidity,
     date: formattedDate
    }
    
    
    
    
    
    
    localStorage.setItem('CityName', JSON.stringify(todayData));

  rendering();
}
