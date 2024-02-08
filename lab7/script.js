var debounceTimer;
var savedCities = JSON.parse(localStorage.getItem('savedCities')) ?? [];
var weatherData = [];

document.addEventListener('DOMContentLoaded', async () => {
  await updateWeatherData();
  const refreshInterval = setInterval(async () => {
    await updateWeatherData();
  }, 300000);
  clearInterval(refreshInterval);
});

document.getElementById('cityInput').addEventListener('input', async function () {
  let inputCity = this.value;

  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(async function () {
    await fetch(
      `http://geodb-free-service.wirefreethought.com/v1/geo/cities?namePrefix=${inputCity}&types=CITY&sort=name`,
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    )
      .then(async response => await response.json())
      .then(result => {
        let cityDropdown = document.getElementById('cityList');
        cityDropdown.innerHTML = '';

        let polishCity = result.data.find(city => city.country === 'Poland')?.city;
        if (polishCity) {
          cityDropdown.appendChild(new Option(polishCity));
        } else {
          result.data.forEach(city => {
            cityDropdown.appendChild(new Option(city.city));
          });
        }
      });
  }, 800);
});

document.getElementById('deleteWeatherBtn').addEventListener('click', async () => {
  let selectedCity = document.getElementById('cityList').value;
  savedCities = savedCities.filter(city => city !== selectedCity);
  localStorage.setItem('savedCities', JSON.stringify(savedCities));
  await updateWeatherData();
});

document.getElementById('getWeatherBtn').addEventListener('click', async () => {
  let selectedCity = document.getElementById('cityList').value;
  if (!savedCities.includes(selectedCity) && selectedCity && selectedCity !== 'undefined') {
    savedCities.push(selectedCity);
    localStorage.setItem('savedCities', JSON.stringify(savedCities));
    await updateWeatherData();
  }
});

async function updateWeatherData() {
  weatherData = [];
  var weatherFetchTasks = new Promise(resolve => {
    savedCities.forEach(async city => {
      await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=33a861c82d591ab52c21fb63bd0a30f7`)
        .then(async response => await response.json())
        .then(weatherInfo => {
          let forecastHours = weatherInfo.list.map(item => item.dt_txt);
          let forecastTemperatures = weatherInfo.list.map(item => convertKelvinToCelsius(item.main.temp));

          weatherData.push({
            iconUrl: `http://openweathermap.org/img/wn/${weatherInfo.list[0].weather[0].icon}@2x.png`,
            weatherCondition: weatherInfo.list[0].weather[0].main,
            temperatures: forecastTemperatures,
            forecastHours: forecastHours,
            cityName: city,
            color: generateRandomRgba(),
          });

          if (weatherData.length === savedCities.length) {
            resolve();
          }
        });
    });
  });

  weatherFetchTasks.then(() => {
    weatherData.sort((a, b) => a.cityName.localeCompare(b.cityName));
    renderChart();
    displayWeatherStats();
  });
}

function renderChart() {
  let chartData = weatherData.map(cityWeather => ({
    label: cityWeather.cityName,
    data: cityWeather.temperatures,
    backgroundColor: cityWeather.color,
    borderColor: cityWeather.color,
    borderWidth: 1,
  }));

  let chartContext = document.getElementById('weatherChart').getContext('2d');
  new Chart(chartContext, {
    type: 'line',
    data: {
      labels: weatherData[0]?.forecastHours,
      datasets: chartData,
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

function displayWeatherStats() {
  let weatherBlocks = weatherData.map(
    cityWeather => `
    <div style="margin: 50px">
      <img class="weatherIcon" src="${cityWeather.iconUrl}" height="128" width="128">
      <p class="weatherDetails">${cityWeather.cityName}: ${cityWeather.weatherCondition} ${cityWeather.temperatures[0]}°C</p>
    </div>
  `
  );

  document.getElementById('data').innerHTML = weatherBlocks.join('');
}

function generateRandomRgba() {
  let round = Math.round,
    random = Math.random,
    max = 255;
  return `rgba(${round(random() * max)}, ${round(random() * max)}, ${round(random() * max)}, 0.25)`;
}

function convertKelvinToCelsius(kelvin) {
  return Math.round(kelvin - 273.15);
}
