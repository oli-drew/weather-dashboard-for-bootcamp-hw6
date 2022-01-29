// Api key
const apiKey = "6218cd26c2983d4c1c16c93df2b17dc1";

// Get elements by ID
const searchInput = document.querySelector("#searchInput");
const searchList = document.querySelector("#searchList");
const cityName = document.querySelector("#cityName");
const weatherCards = document.querySelector("#weatherCards");

// Function to get search input
searchInput.addEventListener(
  "keydown",
  function (event) {
    if (event.code == "Enter") {
      const query = searchInput.value;
      // console.log(query);
      getCurrentWeather(query);
    }
  },
  true
);

// Add search to list
const appendSearch = (city) => {
  const li = document.createElement("li");
  li.classList.add("nav-item");
  li.innerHTML = `<a class="nav-link" href="#">
  <span class="material-icons align-middle">
    location_city
  </span>
  <span class="align-middle">${city}</span>
</a>`;
  searchList.appendChild(li);
};

// Add city name to dom
const showCityName = (city) => {
  cityName.textContent = city;
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
  // Do stuff here
  console.log(data);
  // Temp
  const temp = data.current.temp;
  currentTemp.textContent = `${temp} °C`;
  // Wind
  const wind = data.current.wind_speed;
  currentWind.textContent = `${wind} m/s`;
  // Humidity
  const humidity = data.current.humidity;
  currentHumidity.textContent = `${humidity} %`;
  // UVI
  const uvi = data.current.uvi;
  currentUVI.textContent = uvi;
  // Icon
  const icon = data.current.weather[0].icon;
  currentConditionIcon.src = getIcon(icon);
  // Daily cards
  const dailyWeather = data.daily;
  createWeatherCards(dailyWeather);
};

// Open weather icons
const getIcon = (weatherCondition) => {
  return `https://openweathermap.org/img/wn/${weatherCondition}@4x.png`;
};

// Render 5 Day weather
//

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
      console.log(`Error: ${response.statusText}`);
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
  console.log(`Name: ${cityName}`);
  // Lat Lon
  const latLonObj = { lat: data.coord.lat, lon: data.coord.lon };
  // Display city name
  showCityName(cityName);
  // Append city name to list
  appendSearch(cityName);
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
  console.log(dailyData);
  console.log(dailyData[0]);
  console.log(dailyData[0].wind_speed);
  //
  weatherCards.innerHTML = "";
  // Create 5 cards
  for (let i = 0; i < 5; i++) {
    const dayData = dailyData[i];
    const card = document.createElement("div");
    card.classList.add("card", "weather-card");
    card.innerHTML = `<img src="${getIcon(
      dayData.weather[0].icon
    )}" class="card-img-top" alt="Weather Condition Icon" />
    <div class="card-body">
      <h5 class="card-title">29/01/22</h5>
    </div>
    <ul class="list-group list-group-flush">
      <li class="list-group-item">Temp: ${dayData.temp.day}</li>
      <li class="list-group-item">Wind: ${dayData.wind_speed}</li>
      <li class="list-group-item">Humidity: ${dayData.humidity}</li>
    </ul>`;
    weatherCards.append(card);
  }
};
