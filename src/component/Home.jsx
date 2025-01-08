import { useState, useEffect } from "react";
import axios from "axios";
import SearchSection from "./SearchSection";
import WeatherSection from "./WeatherSection";
import "./WeatherCard.css";

const Home = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [unit, setUnit] = useState("metric"); // 'metric' for Celsius, 'imperial' for Fahrenheit
  const [error, setError] = useState("");

  const apiKey = import.meta.env.VITE_APP_API_KEY;
  const weatherUrl = "https://api.openweathermap.org/data/2.5/weather";
  const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast";

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByCoords(latitude, longitude);
      },
      () => {
        fetchWeather("Manassas");
      }
    );
  }, []);

  const fetchWeather = async (location) => {
    try {
      const currentResponse = await axios.get(
        `${weatherUrl}?q=${location}&appid=${apiKey}&units=${unit}`
      );
      const forecastResponse = await axios.get(
        `${forecastUrl}?q=${location}&appid=${apiKey}&units=${unit}`
      );

      setWeatherData(currentResponse.data);
      setCity(currentResponse.data.name);

      const dailyForecast = forecastResponse.data.list.filter((item) =>
        item.dt_txt.includes("12:00:00")
      );
      setForecastData(dailyForecast);

      setError("");
    } catch {
      setWeatherData(null);
      setForecastData([]);
      setError("City not found. Please try again.");
    }
  };

  const fetchWeatherByCoords = async (lat, lon) => {
    try {
      const currentResponse = await axios.get(
        `${weatherUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`
      );
      const forecastResponse = await axios.get(
        `${forecastUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`
      );

      setWeatherData(currentResponse.data);
      const dailyForecast = forecastResponse.data.list.filter((item) =>
        item.dt_txt.includes("12:00:00")
      );
      setForecastData(dailyForecast);

      setError("");
    } catch {
      setWeatherData(null);
      setForecastData([]);
      setError("Failed to fetch weather for your location.");
    }
  };

  const toggleUnit = async () => {
    const newUnit = unit === "metric" ? "imperial" : "metric";
    setUnit(newUnit);
    if (city) {
      fetchWeather(city);
    }
  };

  return (
    <div className="home">
      <header>
        <h1>Weather Forecast</h1>
      </header>

      <SearchSection
        city={city}
        setCity={setCity}
        fetchWeather={fetchWeather}
        toggleUnit={toggleUnit}
        unit={unit}
      />

      {error && <p className="error-message">{error}</p>}

      {weatherData && (
        <WeatherSection
          weatherData={weatherData}
          forecastData={forecastData}
          unit={unit}
        />
      )}
    </div>
  );
};

export default Home;
