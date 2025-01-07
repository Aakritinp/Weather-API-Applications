import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSun, FaCloudSun, FaWind, FaTint, FaSnowflake } from "react-icons/fa";
import "./WeatherCard.css";

const WeatherCard = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [unit, setUnit] = useState("metric"); // 'metric' for Celsius, 'imperial' for Fahrenheit
  const [error, setError] = useState("");

  const apiKey = "5e49276506266acd99f2b9f5ade51e76";
  const weatherUrl = "https://api.openweathermap.org/data/2.5/weather";
  const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast";

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByCoords(latitude, longitude);
      },
      () => {
        fetchWeather("Kathmandu"); // Default location
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
    } catch (err) {
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
    } catch (err) {
      setWeatherData(null);
      setForecastData([]);
      setError("Failed to fetch weather for your location.");
    }
  };

  const toggleUnit = async () => {
    const newUnit = unit === "metric" ? "imperial" : "metric";
    setUnit(newUnit);
    if (city) {
      fetchWeather(city); // Re-fetch weather for the searched location
    }
  };

  const convertUnixToTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="weather-app">
      <header>
        <h1>Weather Forecast</h1>
      </header>
      <div className="search-section">
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="search-bar"
        />
        <button onClick={() => fetchWeather(city)} className="search-button">
          Search
        </button>
        <div className="unit-toggle">
          <span>{unit === "metric" ? "°C" : "°F"}</span>
          <input type="checkbox" onChange={toggleUnit} />
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}

      {weatherData && (
        <div className="current-weather-section">
          <h2>Current Location</h2>
          <div className="current-weather">
            <h3>
              {weatherData.name}, {weatherData.sys.country}
            </h3>
            <h1>
              {weatherData.main.temp}°
              {/* Conditionally render snowflake icon only if the weather is snowy */}
              {weatherData.weather[0].description.includes("snow") && (
                <FaSnowflake style={{ color: "#ffb347" }} />
              )}
            </h1>
            <p>{weatherData.weather[0].description}</p>
            <div className="details">
              <div>
                <FaSun /> Sunrise: {convertUnixToTime(weatherData.sys.sunrise)}
              </div>
              <div>
                <FaSun /> Sunset: {convertUnixToTime(weatherData.sys.sunset)}
              </div>
              <div>
                <FaTint /> Humidity: {weatherData.main.humidity}%
              </div>
              <div>
                <FaWind /> Wind: {weatherData.wind.speed}{" "}
                {unit === "metric" ? "m/s" : "mph"}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="forecast-section">
        <h2>5-Day Forecast</h2>
        <div className="forecast-grid">
          {forecastData.map((day) => (
            <div className="forecast-card" key={day.dt}>
              <h3>{convertUnixToTime(day.dt)}</h3>
              <img
                src={`http://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                alt={day.weather[0].description}
              />
              <p>{day.main.temp}°</p>
              <p>{day.weather[0].description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
