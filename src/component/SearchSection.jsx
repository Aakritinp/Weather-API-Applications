import PropTypes from "prop-types";
import "./WeatherCard.css";

const SearchSection = ({ city, setCity, fetchWeather, toggleUnit, unit }) => {
  return (
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
  );
};

SearchSection.propTypes = {
  city: PropTypes.string.isRequired,
  setCity: PropTypes.func.isRequired,
  fetchWeather: PropTypes.func.isRequired,
  toggleUnit: PropTypes.func.isRequired,
  unit: PropTypes.string.isRequired,
};

export default SearchSection;
