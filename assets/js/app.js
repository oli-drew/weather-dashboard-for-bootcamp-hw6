// Api key
const apiKey = "6218cd26c2983d4c1c16c93df2b17dc1";
// One Call API URL
// const oneWeather = `https://api.openweathermap.org/data/2.5/onecall?lat=${latLon[0]}&lon=${latLon[1]}&exclude=${exclude}&appid=${apiKey}&units=metric`;

// Get elements by ID
const searchInput = document.querySelector("#searchInput");
const searchList = document.querySelector("#searchList");
const cityName = document.querySelector("#cityName");

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
  const exclude = "minutely,hourly,daily,alerts";
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

// Render one call output
const renderOneWeather = (data) => {
  // Do stuff here
  console.log(data);
};

// Get the current Weather data
const getCurrentWeather = async (queryCity) => {
  // Current Weather API URL
  const currentWeather = `https://api.openweathermap.org/data/2.5/weather?q=${queryCity}&appid=${apiKey}`;
  try {
    const response = await fetch(currentWeather);
    if (response.ok) {
      // Return the response
      const data = await response.json();
      return processCurrentWeather(data);
    } else {
      console.log(`Error: ${response.statusText}`);
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
