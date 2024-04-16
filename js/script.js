
//when page loads, if data exist, it will get it from local storage
rendering()
// Function call to start the rendering process
function rendering(){

   //redering for current weather if data exist
   
  const weatherHeading = document.querySelector('.current-weather h2');
  
// Retrieve info from localStorage and parse it
var heading = JSON.parse(localStorage.getItem('CityName'));
console.log(heading.cityname);

// Set the content of weatherHeading with city name and date
weatherHeading.textContent = heading.cityname + " (" + heading.date + ") ";

// Get the image element by its ID
var imgElement = document.getElementById('topweatherimage');

// Retrieve the weather condition, assuming it's stored in `heading.images`
var weatherContent = heading.weather.toLowerCase(); // Convert to lowercase for case-insensitive comparison

// Compare the weather condition and set the image source accordingly
if (weatherContent === "clear") {
    imgElement.src = "./images/clear.png";
}else if (weatherContent === "clouds") {
    imgElement.src = "./images/clouds.png";
}else if (weatherContent === "fog") {
    imgElement.src = "./images/fog.png";
}else if (weatherContent === "mist") {
    imgElement.src = "./images/mist.png"; 
}else if (weatherContent === "rain") {
    imgElement.src = "./images/rain.png"; 
}else if (weatherContent === "thunder") {
    imgElement.src = "./images/thunder.png"; 
}else {
    // Set a default image for unmatched cases
    imgElement.src = "./images/default.png";
}

  

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
        console.log("local Temp:  " +  ForecastFiveDays.main.temp);
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
        
     
       var weatherImage = ForecastFiveDays.weather[0].main.trim().toLowerCase(); 
        var img = forecastDays[i].querySelector('img');
        
        if (weatherImage === "clear") {
            img.src = "./images/clear.png";
        } else if (weatherImage === "clouds") {
            img.src = "./images/clouds.png";
        } else if (weatherImage === "mist") {
            img.src = "./images/mist.png";
        } else if (weatherContent === "fog") {
            imgElement.src = "./images/fog.png";
        }else if (weatherImage === "rain") {
            img.src = "./images/rain.png";
        } else if (weatherImage === "thunder") {
            img.src = "./images/thunder.png";
        } else {
        //  "default" image for unmatched cases
            img.src = "./images/default.png"; //
        }

        
        //img.src = "../images/rain.png"
        // For each forecast day element, select the first four paragraph elements within it. 
        const dateParagraph = forecastDays[i].querySelectorAll('p')[0];
        const tempParagraph = forecastDays[i].querySelectorAll('p')[1];
        const windParagraph = forecastDays[i].querySelectorAll('p')[2];
        const humidityParagraph = forecastDays[i].querySelectorAll('p')[3];
        //update textcontents
        dateParagraph.textContent = formattedDate;
        tempParagraph.textContent = "Temp: " +   kelvinToFahrenheit(ForecastFiveDays.main.temp) + " °F";
        windParagraph.textContent = "Wind:  " + ForecastFiveDays.wind.speed + " MPH";
        humidityParagraph.textContent = "Humidity: " + ForecastFiveDays.main.humidity + " %";
    }




}

 // Attempts to retrieve the item 'ForecastFiveDays' from localStorage.
function ForecastFiveDaysDataLocalStorage() {
    var ForecastFiveDaysData = localStorage.getItem('ForecastFiveDays');
    if (ForecastFiveDaysData) {  
        ForecastFiveDaysData = JSON.parse(ForecastFiveDaysData);    
    } else {
        ForecastFiveDaysData = [];
    }
    return ForecastFiveDaysData;
  }




// Wait until the DOM is fully loaded before running the script
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
      // Constructs the URL for fetching the 5-day weather forecast using the city name and API key
    const fivedaysAPIUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&appid=' + apiKey;
     // Constructs the URL for fetching today's weather data using the city name and API key
    const todayAPIUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=' + apiKey;
    // Initiates fetching both the 5-day forecast and today's weather data concurrently
    // I used this becuase I used two API 
    Promise.all([
 
        //first fetch
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
        //second fetch
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
        // processWeatherData fucntion with FiveDayData, todayData, cityName passing
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
  // Define an object to hold today's weather data for a specified city  
    
    var todayData = {

     cityname: cityName,
     temp:  kelvinToFahrenheit(todayData.main.temp),
     wind:  todayData.wind.speed,
     humidity: todayData.main.humidity,
     weather: todayData.weather[0].main,
     date: formattedDate
    }
    
    
    
    
    //saving object to strings to local storage
    
    localStorage.setItem('CityName', JSON.stringify(todayData));
  // after saving to local storage redering from local storage

  rendering();
}
//kelvin to F
function kelvinToFahrenheit(kelvin) {
    const fahrenheit = (kelvin - 273.15) * 9/5 + 32;
    return parseFloat(fahrenheit.toFixed(2));
}
