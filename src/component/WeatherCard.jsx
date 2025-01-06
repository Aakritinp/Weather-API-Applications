import { useState } from "react";
import axios from "axios";

const WeatherCard = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState("");

  const apiKey = "5e49276506266acd99f2b9f5ade51e76";
  const baseUrl = "https://api.openweathermap.org/data/2.5/weather";

  // Function to fetch weather data
  const getWeather = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}?q=${city}&appid=${apiKey}&units=metric`
      );
      setWeatherData(response.data);
      setError("");
    } catch {
      setWeatherData(null);
      setError(
        "Failed to fetch weather data. Please check the city name or try again later."
      );
    }
  };

  return (
    <div className="weather-card">
      <h2>Weather App</h2>
      <input
        type="text"
        placeholder="Enter city"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={getWeather}>Get Weather</button>

      {error && <p className="error">{error}</p>}

      {weatherData && (
        <div className="weather-info">
          <h3>
            {weatherData.name}, {weatherData.sys.country}
          </h3>
          <p>Temperature: {weatherData.main.temp}°C</p>
          <p>Weather: {weatherData.weather[0].description}</p>
          <p>Humidity: {weatherData.main.humidity}%</p>
        </div>
      )}
    </div>
  );
};

export default WeatherCard;
