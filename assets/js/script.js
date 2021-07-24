/* Api call to weather for a search City */
var recentCitySearch = document.querySelector("#recent-search");
var todaysWeather = document.querySelector("#todays-weather");
var saveCity = [];
var apiKey = "a65c5c15039d05a0f7175619a4cb05e1";
var tempUnit = "imperial";

function searchCity() {
  /* Remove hide class show Recent Search div after search is clicked */
  recentCitySearch.classList.remove("hide");
  recentCitySearch.classList.add("show");
  todaysWeather.classList.remove("hide");
  todaysWeather.classList.add("show");  

  /* Get City and convert first letter to upper case */
  var getCity = document.querySelector("#city").value;
  const cityUpperCase = getCity;
  const city = cityUpperCase.charAt(0).toUpperCase() + cityUpperCase.slice(1);
  console.log("str2", city);

  /* Store in local Storage to retreive for recent history */
  localStorage.setItem("names", city);
  /* Show Recent search history */
  displayRecentSearch(city);
  /* Make API call to get the current and next 5-day forcast for the city entered by the user */
  weatherAPIRequest(city);
}

function weatherAPIRequest(cityName) {
  var weatherAPI = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=${tempUnit}`;
  console.log("api req" + weatherAPI);
  fetch(weatherAPI)
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
           
      /* fORMAT dATE */
      var currentDate = JSON.stringify(response.list[0].dt_txt);
      currentDate = currentDate.slice(1, -1);
      currentDate = currentDate.split(" ")[0];
    
      var displayCurrentWeather = document.createElement("h1");
      displayCurrentWeather.textContent = `${cityName} (${currentDate})`;

      todaysWeather.appendChild(displayCurrentWeather);
      /* Display weather conditions */
      var temperature = JSON.stringify(response.list[0].main.temp);
      var displayTemperature = document.createElement("p");
      displayTemperature.classList.add("weather-conditions");
      displayTemperature.textContent = `Temp: ${temperature}F`;
      
      var displayWind = document.createElement("p");
      displayWind.classList.add("weather-conditions");
      displayWind.textContent ="something";

      todaysWeather.appendChild(displayTemperature);
      todaysWeather.appendChild(displayTemperature);
    });
}

function displayRecentSearch() {
  var storedNames = localStorage.getItem("names");
  console.log("stored items " + storedNames);
  saveCity.push(storedNames);
  console.log(saveCity);
  var displayCity = document.createElement("button");
  displayCity.classList.add("city-name");
  for (index = 0; index < saveCity.length; index++) {
    displayCity.textContent = saveCity[index];
    recentCitySearch.appendChild(displayCity);
  }
}
var searchButton = document.querySelector("#search");
searchButton.addEventListener("click", searchCity);
