import React, { useState, useEffect } from "react";
import axios from "axios";
import "./WeatherCard.css";

const WeatherCard = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [unit, setUnit] = useState("metric"); // 'metric' for Celsius, 'imperial' for Fahrenheit
  const [error, setError] = useState("");
  const [backgroundClass, setBackgroundClass] = useState("");

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

      updateBackgroundClass(currentResponse.data.weather[0].main);

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

      updateBackgroundClass(currentResponse.data.weather[0].main);

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

  const updateBackgroundClass = (weatherCondition) => {
    const condition = weatherCondition.toLowerCase();
    if (condition.includes("clear")) {
      setBackgroundClass("clear-sky");
    } else if (condition.includes("cloud")) {
      setBackgroundClass("cloudy");
    } else if (condition.includes("rain")) {
      setBackgroundClass("rainy");
    } else if (condition.includes("snow")) {
      setBackgroundClass("snowy");
    } else if (condition.includes("thunderstorm")) {
      setBackgroundClass("stormy");
    } else {
      setBackgroundClass("default-bg");
    }
  };

  const getDayName = (dt_txt) => {
    const date = new Date(dt_txt);
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  return (
    <div className={`weather-app ${backgroundClass}`}>
      <header>
        <h1>Weather App</h1>
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
          <h2>Current Weather</h2>
          <div className="current-weather">
            <h3>
              {weatherData.name}, {weatherData.sys.country}
            </h3>
            <h1>{weatherData.main.temp}°</h1>
            <p>{weatherData.weather[0].description}</p>
            <div className="details">
              <p>Feels like: {weatherData.main.feels_like}°</p>
              <p>Humidity: {weatherData.main.humidity}%</p>
              <p>
                Wind: {weatherData.wind.speed}{" "}
                {unit === "metric" ? "m/s" : "mph"}
              </p>
            </div>
          </div>
        </div>
      )}

      {forecastData.length > 0 && (
        <div className="forecast-section">
          <h2>Extended Forecast</h2>
          <div className="forecast-grid">
            {forecastData.map((day, index) => (
              <div className="forecast-card" key={index}>
                <h3>{getDayName(day.dt_txt)}</h3>
                <img
                  src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                  alt={day.weather[0].description}
                />
                <p>
                  {day.main.temp_min.toFixed(1)}° /{" "}
                  {day.main.temp_max.toFixed(1)}°
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherCard;
