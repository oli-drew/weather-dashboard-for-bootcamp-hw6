// Api key
const apiKey = "6218cd26c2983d4c1c16c93df2b17dc1";

// Get elements by ID
const searchInput = document.querySelector("#searchInput");
const searchBtn = document.querySelector("#searchBtn");
const searchList = document.querySelector("#searchList");
const cityName = document.querySelector("#cityName");
const weatherCards = document.querySelector("#weatherCards");
const currentWeatherCard = document.querySelector("#currentWeatherCard");

// Function to get search input on enter
searchInput.addEventListener(
  "keydown",
  function (event) {
    if (event.code == "Enter") {
      const query = searchInput.value;
      getCurrentWeather(query);
    }
  },
  true
);

// Search on button press
searchBtn.addEventListener("click", function () {
  const query = searchInput.value;
  getCurrentWeather(query);
});

// Add search to list
const appendSearch = (search) => {
  const li = document.createElement("li");
  li.classList.add("nav-item", "pointer");
  li.innerHTML = `<a class="nav-link">
  <span class="material-icons align-middle">
    location_city
  </span>
  <span class="align-middle">${search}</span>
</a>`;
  li.setAttribute("data-search", search);
  li.addEventListener("click", searchLocationClicked);
  searchList.appendChild(li);
};

// Function to search to city when clicked
const searchLocationClicked = (event) => {
  const search = event.currentTarget.getAttribute("data-search");
  getCurrentWeather(search);
};

// Add city name to dom
const showCityName = (city) => {
  cityName.innerHTML = `<div
  class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
  <h1 class="h2">${city}</h1>
</div>`;
};

// Get the One Weather data
const getOneWeather = async (lat, lon) => {
  // Things to exclude
  const exclude = "minutely,hourly,alerts";
  const oneWeather = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=${exclude}&appid=${apiKey}&units=metric`;
  try {
    const response = await fetch(oneWeather);
    if (response.ok) {
      // Return the response
      const data = await response.json();
      return renderOneWeather(data);
    } else {
      console.log(`Error: ${response.statusText}`);
    }
  } catch (error) {
    console.log(`Unable to connect to OneWeather`);
  }
};

// IDs of current weather
const currentConditionIcon = document.querySelector("#currentConditionIcon");
const currentTemp = document.querySelector("#currentTemp");
const currentWind = document.querySelector("#currentWind");
const currentHumidity = document.querySelector("#currentHumidity");
const currentUVI = document.querySelector("#currentUVI");

// Render one call output
const renderOneWeather = (data) => {
  // Temp
  const temp = data.current.temp;
  currentTemp.textContent = `Temperature: ${temp} °C`;
  // Wind
  const wind = data.current.wind_speed;
  currentWind.textContent = `Wind speed: ${wind} m/s`;
  // Humidity
  const humidity = data.current.humidity;
  currentHumidity.textContent = `Humidity: ${humidity} %`;
  // UVI
  const uvi = data.current.uvi;
  currentUVI.innerHTML = `UV Index: <span class="badge ${UVIColours(
    uvi
  )}">${uvi}</span>`;
  // Icon
  const icon = data.current.weather[0].icon;
  currentConditionIcon.innerHTML = `<img
  src="${getIcon(icon)}"
  class="d-block mx-lg-auto img-fluid m-auto"
  alt="Weather Condition Icon"
  width="200px"
  height="200px"
  loading="lazy"
/>`;
  // Show current weather
  currentWeatherCard.classList.remove("d-none");
  // Daily cards
  const dailyWeather = data.daily;
  createWeatherCards(dailyWeather);
};

// UVI Colours
const UVIColours = (uvi) => {
  if (uvi < 2) {
    return "bg-success";
  } else if (uvi >= 2 && uvi < 5) {
    return "bg-warning";
  } else {
    return "bg-danger";
  }
};

// Open weather icons
const getIcon = (weatherCondition) => {
  return `https://openweathermap.org/img/wn/${weatherCondition}@4x.png`;
};

// Get the current Weather data
const getCurrentWeather = async (queryCity) => {
  // Current Weather API URL
  const currentWeather = `https://api.openweathermap.org/data/2.5/weather?q=${queryCity}&appid=${apiKey}`;
  // const currentWeather = `https://api.openweathermap.org/geo/1.0/direct?q=${queryCity},,GB&limit=1&&appid=${apiKey}`;
  try {
    const response = await fetch(currentWeather);
    if (response.ok) {
      // Return the response
      const data = await response.json();
      return processCurrentWeather(data);
    } else {
      // Open error modal
      showErrorModal(queryCity);
    }
  } catch (error) {
    console.log(`Unable to connect to CurrentWeather`);
  }
};

// Process Current Weather output
const processCurrentWeather = (data) => {
  // City Name
  const cityName = data.name;
  // Lat Lon
  const latLonObj = { lat: data.coord.lat, lon: data.coord.lon };
  // Date
  const dateString = moment.unix(data.dt).format("dddd, MMMM Do YYYY");
  const nameAndDate = `${cityName} - ${dateString}`;
  // Display city name and date
  showCityName(nameAndDate);
  // Append city name to list
  addSearchQuery(cityName);
  // Display the search
  displaySearches();
  // One Weather API call
  getOneWeather(latLonObj["lat"], latLonObj["lon"]);
};

// Launch modal when search city not found
const showErrorModal = (query) => {
  const errorModal = new bootstrap.Modal(document.querySelector("#errorModal"));
  const searchCity = document.querySelector("#searchCity");
  searchCity.textContent = query;
  errorModal.show();
};

// Dynamically create daily cards
const createWeatherCards = (dailyData) => {
  // Clear weather cards
  weatherCards.innerHTML = "";
  // Create 5 cards
  for (let i = 0; i < 5; i++) {
    const dayData = dailyData[i + 1];
    const dateString = moment.unix(dayData.dt).format("DD/MM/YY");
    const card = document.createElement("div");
    card.classList.add("card", "weather-card");
    card.innerHTML = `<img src="${getIcon(
      dayData.weather[0].icon
    )}" <img class="card-img-top daily-card-icon" alt="Weather Condition Icon"/>
    <ul class="list-group list-group-flush">
      <li class="list-group-item">Temp: ${dayData.temp.day} °C</li>
      <li class="list-group-item">Wind: ${dayData.wind_speed} m/s</li>
      <li class="list-group-item">Humidity: ${dayData.humidity} %</li>
    </ul>
    <div class="card-footer text-muted">
    ${dateString}
  </div>`;
    weatherCards.append(card);
  }
};

// Local Storage
// Function to get previous search query
const getSearchQuery = () => {
  const searches = localStorage.getItem("searches");
  // If not null
  if (searches) {
    // Return the searches as an object
    return JSON.parse(searches);
  } else {
    // Return empty array
    return [];
  }
};

// Function to add search query to local storage
const addSearchQuery = (query) => {
  if (query) {
    // Get the previous searches
    const prevQuery = getSearchQuery();
    // Add new search query
    prevQuery.push(query);
    // Remove duplicates
    uniqSearches = [...new Set(prevQuery)];
    // Add the searches to local storage
    localStorage.setItem("searches", JSON.stringify(uniqSearches));
  }
};

// Function to display previous searches
const displaySearches = () => {
  // Array of searches
  const searchesArr = getSearchQuery();
  // If array is not empty
  if (searchesArr.length > 0) {
    // Clear innerHTML
    searchList.innerHTML = "";
    // Loop over the array an display the searches
    searchesArr.forEach((search) => {
      appendSearch(search);
    });
  }
};

// On page load show the searches
window.onload = function () {
  displaySearches();
  getCurrentWeather("Birmingham,GB");
};
