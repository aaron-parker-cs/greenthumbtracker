import { userRepository } from "../db/repositories/user.repository";
import { WeatherData } from "./WeatherData";

const openWeatherApiKey = process.env.OPEN_WEATHER_API_KEY;
const openWeatherApiUrl = process.env.OPEN_WEATHER_API_URL;

export async function setUserLocation(
  inputValue: string,
  userId: number
): Promise<void> {
  const geocodeUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
    `${inputValue},US`
  )}&limit=1&appid=${openWeatherApiKey}`;
  const response = await fetch(geocodeUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch geocode data");
  }

  const data = await response.json();

  if (data.length === 0) {
    throw new Error("No geocode data found");
  }

  const { lat, lon } = data[0];
  userRepository.updateUserLocation(userId, inputValue, lat, lon);
}

export async function getWeatherData(
  latitude: number,
  longitude: number
): Promise<WeatherData> {
  const weatherUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=imperial&appid=${openWeatherApiKey}`;
  const response = await fetch(weatherUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch weather data");
  }

  // Get the raw data in OpenWeather's shape
  const rawData = await response.json();

  const transformedData: WeatherData = {
    cod: rawData.cod,
    message: rawData.message,
    cnt: rawData.cnt,
    list: rawData.list.map((item: any) => ({
      dt: item.dt,
      main: {
        temp: item.main.temp,
        feels_like: item.main.feels_like,
        temp_min: item.main.temp_min,
        temp_max: item.main.temp_max,
        pressure: item.main.pressure,
        sea_level: item.main.sea_level,
        grnd_level: item.main.grnd_level,
        humidity: item.main.humidity,
        temp_kf: item.main.temp_kf,
      },
      weather: item.weather.map((weatherItem: any) => ({
        id: weatherItem.id,
        main: weatherItem.main,
        description: weatherItem.description,
        icon: weatherItem.icon,
      })),
      clouds: {
        all: item.clouds.all,
      },
      wind: {
        speed: item.wind.speed,
        deg: item.wind.deg,
        gust: item.wind.gust,
      },
      visibility: item.visibility,
      pop: item.pop,
      rain: item.rain ? { "3h": item.rain["3h"] } : undefined,
      sys: {
        pod: item.sys.pod,
      },
      dt_txt: item.dt_txt,
    })),
    city: {
      id: rawData.city.id,
      name: rawData.city.name,
      coord: {
        lat: rawData.city.coord.lat,
        lon: rawData.city.coord.lon,
      },
      country: rawData.city.country,
      population: rawData.city.population,
      timezone: rawData.city.timezone,
      sunrise: rawData.city.sunrise,
      sunset: rawData.city.sunset,
    },
  };

  return transformedData;
}
