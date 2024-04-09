

  document.querySelector('.city-button').addEventListener('click', function() {

    console.log("cliked")
    const cityName = this.textContent; // Use the button's text as the city name
    console.log(cityName)
    const apiKey = '1320a882ac410975999ee75a91a95667';
    console.log(apiKey)
   //const apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;

    const apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&appid=' + apiKey;



 console.log(apiUrl)






 fetch(apiUrl)
 .then(response => {
     if (!response.ok) {
         throw new Error('Network response was not ok');
     }
     return response.json();
 })
 .then(data => {
     // Initialize an empty array to hold forecasts around noon
     const dailyForecasts = [];
     
     // Loop through all forecasts
     for (let i = 0; i < data.list.length; i++) {
         const forecast = data.list[i];
         const forecastTime = new Date(forecast.dt * 1000); // Convert Unix time to JS Date object
         
         // Check if the forecast is for 12:00 UTC
         if (forecastTime.getUTCHours() === 12) {
             dailyForecasts.push(forecast); // Add this forecast to our array
         }
     }

     console.log(dailyForecasts); // Log the filtered forecasts
 })
 .catch(error => {
     console.error('There was a problem with your fetch operation:', error);
 });














});
