var recentCitySearch = document.querySelector("#recent-search");
var todaysWeather = document.querySelector("#todays-weather");
var show5DayHeader = document.querySelector("#show-five-day-header");
var weatherForecast = document.querySelector("#weather-forecast");
var getCity = document.querySelector("#city");

var displayCityDateInfo = document.getElementById("selected-city");
var temperature = document.getElementById("temperature");
var wind = document.getElementById("wind");
var humidity = document.getElementById("humidity");
var uvIndex = document.getElementById("UV-index");
var horizontalRule = document.getElementById("horizontal-rule");

var saveCity = [];
var apiKey = "a65c5c15039d05a0f7175619a4cb05e1";
var tempUnit = "imperial";
var cityId;
var recentHistorySearch;
var excludeParam = "current";

/* function for On click event on Search Button OR Input ENTER key */
function searchCity() {
  /* Remove hide class show Recent Search div after search is clicked */
  recentCitySearch.classList.remove("hide");
  recentCitySearch.classList.add("show");
  horizontalRule.classList.remove("hide");
  horizontalRule.classList.add("show");

  /* Get City and capitalize first letter of each word .value;*/
  var city = capitalizeFirstLetter(getCity.value);

  /* Store in local Storage to retreive for recent history */
  store(city);
  
  /* Show Recent search history */
  displayRecentSearch(city);

  /* Make API call to get the current day's weather */
  weatherAPIRequest(city);
}

function weatherAPIRequest(cityName) {
  /* Remove hide class show Recent Search div after search is clicked */
  todaysWeather.classList.remove("hide");
  todaysWeather.classList.add("show");
  show5DayHeader.classList.remove("hide");
  show5DayHeader.classList.add("show");

  /* call Weather API */
  var weatherAPI = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=${tempUnit}`;
  console.log("Weather api req" + weatherAPI);
  fetch(weatherAPI)
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      /* Get Formatted Date */
      var currentDate = JSON.stringify(response.list[0].dt_txt);
      currentDate = formattedDate(currentDate);
      /* Weather icon*/
      var weatherIcon = JSON.stringify(response.list[0].weather[0].icon);
      weatherIcon = weatherIcon.slice(1, -1);
      weatherIcon = weatherIcon.split(" ")[0];

      /* create Image element for displaying icon */
      var displayWeatherIcon = document.createElement("img");
      var imgSource = `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`;
      console.log("imgSource", imgSource);
      displayWeatherIcon.setAttribute("src", `${imgSource}`);

      displayCityDateInfo.textContent = `${cityName} (${currentDate})`;
      displayCityDateInfo.appendChild(displayWeatherIcon);
      todaysWeather.appendChild(displayCityDateInfo);

      /* Display weather conditions */
      var responseTemperature = JSON.stringify(response.list[0].main.temp);
      temperature.textContent = `Temp: ${responseTemperature}F`;

      var responseWind = JSON.stringify(response.list[0].wind.speed);
      wind.textContent = `Wind: ${responseWind} MPH`;

      var responseHumidity = JSON.stringify(response.list[0].main.humidity);
      humidity.textContent = `Humidity: ${responseHumidity} %`;

      /* Get UV Index */
      var lat = response.city.coord.lat;
      var lon = response.city.coord.lon;
      cityId = response.city.id;
  
      /* call UV Query API to get UV-Index */
      var UVQueryURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`;

      fetch(UVQueryURL)
        .then(function (response) {
          return response.json();
        })
        .then(function (response) {

          var responseUVIndex = document.createElement("span");
          if (response.current.uvi < 4) {
            responseUVIndex.setAttribute("class", "badge badge-success");
          } else if (response.current.uvi < 8) {
            responseUVIndex.setAttribute("class", "badge badge-warning");
          } else {
            responseUVIndex.setAttribute("class", "badge badge-danger");
          }
          responseUVIndex.innerHTML = response.current.uvi;
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
      var fiveDayList = response.list;
      console.log("fiveDayList", fiveDayList);

      /* For each date, there are 8 objects for 5 days, iterate over the list of 40 items */
      for (index = 0; index < 5; index++) {
        /* get Div tag by id and clear content before appending*/
        var dailyforecast = document.querySelector(
          `#displayDay${index + 1}Weather`
        );
        /* Clear existing content before appending */
        dailyforecast.innerHTML = " ";

        /* calculate index to retreive 4th occurence object to display NOON values */
        calculatedIndex = index * 8 + 4;

        if (calculatedIndex < fiveDayList.length) {
          var forecastDate = document.createElement("p");
          var forecastTemp = document.createElement("p");
          var forecastWind = document.createElement("p");
          var forecastHumidity = document.createElement("p");

          var displayIcon = fiveDayList[calculatedIndex].weather[0].icon;

          /* Create Image element to display icon */
          var forecastWeatherIcon = document.createElement("img");
          var imageSource = `https://openweathermap.org/img/wn/${displayIcon}@2x.png`;
          forecastWeatherIcon.setAttribute("src", `${imageSource}`);

          /* Get Weather conditions - Date, Temp, Wind and Humidity values */
          var getEachDayDate = fiveDayList[calculatedIndex].dt_txt;
          getEachDayDate = formattedDate(getEachDayDate);

          var eachDayTemp = fiveDayList[calculatedIndex].main.temp;
          var eachDayWind = fiveDayList[calculatedIndex].wind.speed;
          var eachDayHumidity = fiveDayList[calculatedIndex].main.humidity;

          weatherForecast.classList.remove("hide");
          weatherForecast.classList.add("show-forecast");
          weatherForecast.classList.add("weather-forecast");

          forecastDate.classList.add("each-day-date");
          forecastDate.innerHTML = `${getEachDayDate}`;
          forecastTemp.innerHTML = `Temp : ${eachDayTemp} F`;
          forecastWind.innerHTML = `Wind : ${eachDayWind} MPH`;
          forecastHumidity.innerHTML = `Humidity : ${eachDayHumidity} %`;
        }
        dailyforecast.append(forecastDate);
        forecastDate.appendChild(forecastWeatherIcon);
        dailyforecast.appendChild(forecastTemp);
        dailyforecast.appendChild(forecastWind);
        dailyforecast.appendChild(forecastHumidity);
      }
    });
}

/* Function to display Recent Search History */
function displayRecentSearch() {
  /* Retreive most recently searched city from local storage and save it in a array */
  var storedNames = localStorage.getItem("names");
  saveCity.push(storedNames);

  /* Create button dynamically for displaying recently searched cities list */
  var displayCity = document.createElement("button");
  displayCity.classList.add("city-name");
 
  for (index = 0; index < saveCity.length; index++) {
    displayCity.textContent = localStorage.getItem("item");
    displayCity.textContent = displayCity.textContent.slice(1, -1);
    displayCity.textContent = displayCity.textContent.split(" ")[0];
    recentCitySearch.appendChild(displayCity);
  }
  /* If the button in recent search is clicked, today's weather and 5 day forecast will be displayed for that particular city */
  displayCity.addEventListener("click", function () {
    recentHistorySearch = displayCity.textContent;
    weatherAPIRequest(recentHistorySearch);
  });
}

/* Function for Capitalizing first letter of each word in the City entered by the user */
function capitalizeFirstLetter(cName) {
  cName = cName.split(" ");
  for (var i = 0; i < cName.length; i++) {
    cName[i] = cName[i].charAt(0).toUpperCase() + cName[i].slice(1);
  }
  cName = cName.join(" ");
  return cName;
}

/* function for local Storage */

function store(item) {
  saveCity.push(item);
  localStorage.setItem("item", JSON.stringify(item));
}

/* Format Date to mm/dd/yyyy format */
function formattedDate(formatDate) {
  var day;
  var month;
  var year;
  formatDate = formatDate.slice(1, -1);
  formatDate = formatDate.split(" ")[0];
  formatDate = formatDate.split("-");
  year = formatDate[0];
  month = formatDate[1];
  day = formatDate[2];
  if (year.length < 4) {
    year = "2" + year;
  }
  var myDate = month + "/" + day + "/" + year;
  return myDate;
}

/* Search Button Event Listener */
var searchButton = document.getElementById("search-btn");
searchButton.addEventListener("click", searchCity);

/* Capture key board event for ENTER and call Search City function */
document.getElementById("city").onkeypress = function (e) {
  if (!e) e = window.event;
  if (e.key === "Enter") {
    searchCity();
    return false;
  }
};
