// Api key
const apiKey = "6218cd26c2983d4c1c16c93df2b17dc1";

// Things to exclude
const exclude = "minutely,hourly,daily,alerts";

// Lat Lon
const latLon = [33.44, -94.04];

// One Call API URL
const oneWeather = `https://api.openweathermap.org/data/2.5/onecall?lat=${latLon[0]}&lon=${latLon[1]}&exclude=${exclude}&appid=${apiKey}&units=metric`;

// City
const searchCity = "Birmingham";

// Current Weather API URL
const currentWeather = `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=${apiKey}`;

// Get the One Weather data
const getOneWeather = async () => {
  try {
    const response = await fetch(oneWeather);
    if (response.ok) {
      // Return the response
      return await response.json();
    } else {
      console.log(`Error: ${response.statusText}`);
    }
  } catch (error) {
    console.log(`Unable to connect to OneWeather`);
  }
};

// Get the One Weather data
const getCurrentWeather = async () => {
  try {
    const response = await fetch(currentWeather);
    if (response.ok) {
      // Return the response
      const data = await response.json();
      const latLon = [data.coord.lat, data.coord.lon];
      console.log(latLon);
      return latLon;
    } else {
      console.log(`Error: ${response.statusText}`);
    }
  } catch (error) {
    console.log(`Unable to connect to OneWeather`);
  }
};

// Render one call output
const renderWeather = (data) => {
  // Do stuff here
  console.log(data);
};

// Render lat lon output
const renderLatLon = (data) => {
  // Do stuff here
  console.log(data);
};

//   Render lat lon
renderLatLon(getCurrentWeather());

// Render weather
// renderWeather(getOneWeather());
