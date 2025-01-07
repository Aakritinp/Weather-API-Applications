import { FaSun, FaTint, FaWind, FaSnowflake } from "react-icons/fa";
import PropTypes from "prop-types";
import "./WeatherCard.css";

const WeatherSection = ({ weatherData, forecastData, unit }) => {
  const convertUnixToTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getDayName = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  return (
    <div className="weather-section">
      <div className="current-weather-section">
        <h2>Current Location</h2>
        <div className="current-weather">
          <h3>
            {weatherData.name}, {weatherData.sys.country}
          </h3>
          <h1>
            {weatherData.main.temp}°
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

      <div className="forecast-section">
        <h2>5-Day Forecast</h2>
        <div className="forecast-grid">
          {forecastData.map((day) => (
            <div className="forecast-card" key={day.dt}>
              <h3>{getDayName(day.dt)}</h3>
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
WeatherSection.propTypes = {
  weatherData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    sys: PropTypes.shape({
      country: PropTypes.string.isRequired,
      sunrise: PropTypes.number.isRequired,
      sunset: PropTypes.number.isRequired,
    }).isRequired,
    main: PropTypes.shape({
      temp: PropTypes.number.isRequired,
      humidity: PropTypes.number.isRequired,
    }).isRequired,
    weather: PropTypes.arrayOf(
      PropTypes.shape({
        description: PropTypes.string.isRequired,
        icon: PropTypes.string.isRequired,
      })
    ).isRequired,
    wind: PropTypes.shape({
      speed: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
  forecastData: PropTypes.arrayOf(
    PropTypes.shape({
      dt: PropTypes.number.isRequired,
      main: PropTypes.shape({
        temp: PropTypes.number.isRequired,
      }).isRequired,
      weather: PropTypes.arrayOf(
        PropTypes.shape({
          description: PropTypes.string.isRequired,
          icon: PropTypes.string.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
  unit: PropTypes.string.isRequired,
};

export default WeatherSection;
