import axios from 'axios'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const BASE_URL = 'https://api.openweathermap.org/data/2.5'

const client = axios.create({ baseURL: BASE_URL })

function iconUrl(icon) {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`
}

function mapCurrentWeather(cityMeta, data) {
  return {
    id: cityMeta.id,
    name: cityMeta.name,
    temp: data.main.temp,
    feelsLike: data.main.feels_like,
    status: data.weather[0].description,
    conditionMain: data.weather[0].main,
    iconUrl: iconUrl(data.weather[0].icon),
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    description: data.weather[0].description,
  }
}

export async function fetchCurrentWeather(cityMeta) {
  const { data } = await client.get('/weather', {
    params: {
      lat: cityMeta.lat,
      lon: cityMeta.lon,
      appid: API_KEY,
      units: 'metric',
      lang: 'kr',
    },
  })
  return mapCurrentWeather(cityMeta, data)
}

export async function fetchCurrentWeatherList(citiesMeta) {
  return Promise.all(citiesMeta.map((cityMeta) => fetchCurrentWeather(cityMeta)))
}

function mapForecastEntry(entry) {
  return {
    dateTime: entry.dt_txt,
    temp: entry.main.temp,
    status: entry.weather[0].description,
    iconUrl: iconUrl(entry.weather[0].icon),
  }
}

export async function fetchForecast(cityMeta) {
  const { data } = await client.get('/forecast', {
    params: {
      lat: cityMeta.lat,
      lon: cityMeta.lon,
      appid: API_KEY,
      units: 'metric',
      lang: 'kr',
    },
  })
  return data.list.map(mapForecastEntry)
}
