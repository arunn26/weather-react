import React, { useState } from "react";
import { fetchWeather } from "./api/fetchWeather";

const App = () => {
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [cityName, setCityName] = useState("");
  const [error, setError] = useState(null);
  const [cities, setCities] = useState([]);
  const [celsius, setCelsius] = useState(() => {
    const unitCelsius = localStorage.getItem("unitCelsius");
    if (unitCelsius) {
      return JSON.parse(unitCelsius);
    }
    return true;
  });

  const onSearch = (e) => {
    if (e.key === "Enter") {
      fetchData(cityName);
    }
  };

  const fetchData = async (city) => {
    setLoading(true);
    try {
      const data = await fetchWeather(city);
      setCities((prev) => {
        if (prev.includes(city)) return prev;
        return [...prev, city];
      });
      setWeatherData(data);
      setCityName("");
      setError(null);
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const selectCity = (city) => {
    fetchData(city);
  };

  const toggleUnit = () => {
    setCelsius((prev) => {
      localStorage.setItem("unitCelsius", JSON.stringify(!prev));
      return !prev;
    });
  };

  return (
    <div className="app-container">
      <div className="search-container">
        <input
          className="search-input"
          type="text"
          placeholder="Enter city name..."
          value={cityName}
          onChange={(e) => setCityName(e.target.value)}
          onKeyDown={onSearch}
        />
      </div>
      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading-message">Loading...</div>}
      {weatherData && (
        <div className="weather-container">
          <h2 className="weather-location">
            {weatherData.location.name}, {weatherData.location.region},{" "}
            {weatherData.location.country}
          </h2>
          <div className="weather-info">
            <p>
              Temperature: {celsius ? `${weatherData.current.temp_c} °C` : `${weatherData.current.temp_f} °F`}
            </p>
            <div className="unit-toggle" onClick={toggleUnit}>
              <span className={celsius ? "active" : ""}>Celsius</span> /
              <span className={!celsius ? "active" : ""}>Fahrenheit</span>
            </div>
            <p>Condition: {weatherData.current.condition.text}</p>
            <img
              className="weather-icon"
              src={weatherData.current.condition.icon}
              alt={weatherData.current.condition.text}
            />
            <p>Humidity: {weatherData.current.humidity} %</p>
            <p>Pressure: {weatherData.current.pressure_mb} mb</p>
            <p>Visibility: {weatherData.current.vis_km} km</p>
          </div>
        </div>
      )}
      {!!cities.length && (
        <div className="recent-cities">
          <h3>Recently Searched</h3>
          {cities.map((city) => (
            <div
              key={city}
              className="recent-city"
              onClick={() => selectCity(city)}
            >
              {city}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;