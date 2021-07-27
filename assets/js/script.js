/* Api call to weather for a search City */
var recentCitySearch = document.querySelector("#recent-search");
var todaysWeather = document.querySelector("#todays-weather");
var show5DayHeader = document.querySelector("#show-five-day-header");
var weatherForecast = document.querySelector("#weather-forecast");

var saveCity = [];
var apiKey = "a65c5c15039d05a0f7175619a4cb05e1";
var tempUnit = "imperial";
var cityId;
var recentHistorySearch;

var displayCityDateInfo = document.getElementById("selected-city");
var temperature = document.getElementById("temperature");
var wind = document.getElementById("wind");
var humidity = document.getElementById("humidity");
var uvIndex = document.getElementById("UV-index");

function searchCity() {
  /* Remove hide class show Recent Search div after search is clicked */
  recentCitySearch.classList.remove("hide");
  recentCitySearch.classList.add("show");
  todaysWeather.classList.remove("hide");
  todaysWeather.classList.add("show");
  show5DayHeader.classList.remove("hide");
  show5DayHeader.classList.add("show");

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

      /* Weather icon*/
      var weatherIcon = JSON.stringify(response.list[0].weather[0].icon);

      // displayCityDateInfo.textContent =
      //   `${cityName} (${currentDate}) ${weatherIcon}` + "@2x.png";
      displayCityDateInfo.textContent = `${cityName} (${currentDate})`;
      todaysWeather.appendChild(displayCityDateInfo);

      /* Display weather conditions */
      var responseTemperature = JSON.stringify(response.list[0].main.temp);
      temperature.textContent = `Temp: ${responseTemperature}F`;

      var responseWind = JSON.stringify(response.list[0].wind.speed);
      wind.textContent = `Wind: ${responseWind} MPH`;

      var responseHumidity = JSON.stringify(response.list[0].main.humidity);
      humidity.textContent = `Humidity: ${responseHumidity} %`;

      // Get UV Index
      var lat = response.city.coord.lat;
      var lon = response.city.coord.lon;
      cityId = response.city.id;

      var UVQueryURL = `https://api.openweathermap.org/data/2.5/uvi/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&cnt=1`;

      fetch(UVQueryURL)
        .then(function (response) {
          return response.json();
        })
        .then(function (response) {
          console.log("resp ", response[0].value);
          var responseUVIndex = document.createElement("span");
          if (response[0].value < 4) {
            responseUVIndex.setAttribute("class", "badge badge-success");
          } else if (response[0].value < 8) {
            responseUVIndex.setAttribute("class", "badge badge-warning");
          } else {
            responseUVIndex.setAttribute("class", "badge badge-danger");
          }
          responseUVIndex.innerHTML = response[0].value;
          uvIndex.textContent = `UV-Index: `;
          uvIndex.appendChild(responseUVIndex);
        });

      todaysWeather.appendChild(temperature);
      todaysWeather.appendChild(wind);
      todaysWeather.appendChild(humidity);
      todaysWeather.appendChild(uvIndex);
      fiveDayWeatherforecast(cityId);
    });
}

function fiveDayWeatherforecast(cityID) {
  var forecastweatherAPI = `https://api.openweathermap.org/data/2.5/forecast?id=${cityID}&appid=${apiKey}&units=imperial`;
  console.log("forecast Url", forecastweatherAPI);
  fetch(forecastweatherAPI)
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      console.log("resp ", response);
      var fiveDayList = response.list;
      console.log("fiveDayList", fiveDayList);

      /* For each date, there are 8 objects, iterate over the list of 40 items */
      for (index = 0; index < 5; index++) {
        /* get Div tag by id and clear content before appending*/
        var dailyforecast = document.querySelector(
          `#displayDay${index + 1}Weather`
        );
        dailyforecast.innerHTML = " ";

        // calculate index to retreive 4th occurence object to display 3.00pm values
        calculatedIndex = index * 8 + 4;
        if (calculatedIndex < fiveDayList.length) {
          var forecastDate = document.createElement("p");
          var forecastTemp = document.createElement("p");
          var forecastWind = document.createElement("p");
          var forecastHumidity = document.createElement("p");

          var getEachDayDate = fiveDayList[calculatedIndex].dt_txt;
          getEachDayDate = getEachDayDate.slice(1, -1);
          getEachDayDate = getEachDayDate.split(" ")[0];

          var eachDayTemp = fiveDayList[calculatedIndex].main.temp;
          console.log("eachDayTemp ", eachDayTemp);
          var eachDayWind = fiveDayList[calculatedIndex].wind.speed;
          console.log("eachDayWind ", eachDayWind);
          var eachDayHumidity = fiveDayList[calculatedIndex].main.humidity;
          console.log("eachDayHumidity ", eachDayHumidity);

          weatherForecast.classList.remove("hide");
          weatherForecast.classList.add("show-forecast");
          weatherForecast.classList.add("weather-forecast");

          forecastDate.classList.add("each-day-date");
          forecastDate.innerHTML = `(${getEachDayDate})`;

          forecastTemp.innerHTML = `Temp : ${eachDayTemp} F`;
          console.log(" forecastTemp text content ", forecastTemp.innerHTML);

          forecastWind.innerHTML = `Wind : ${eachDayWind} MPH`;

          forecastHumidity.innerHTML = `Humidity : ${eachDayHumidity} %`;
        }

        dailyforecast.append(forecastDate.innerHTML);
        dailyforecast.appendChild(forecastTemp);
        dailyforecast.appendChild(forecastWind);
        dailyforecast.appendChild(forecastHumidity);
      }
    });
}

function displayRecentSearch() {
  var storedNames = localStorage.getItem("names");
  saveCity.push(storedNames);
  var displayCity = document.createElement("button");
  displayCity.classList.add("city-name");
 
  for (index = 0; index < saveCity.length; index++) {
    displayCity.textContent = saveCity[index];
    recentCitySearch.appendChild(displayCity);
  }
  /* If the button in recent search is clicked, today's weather and 5 day forecast will be displayed for that particular city */
  displayCity.addEventListener("click", function () {
    recentHistorySearch = displayCity.textContent;
    weatherAPIRequest(recentHistorySearch);
  });
}

var searchButton = document.querySelector("#search");
searchButton.addEventListener("click", searchCity);
