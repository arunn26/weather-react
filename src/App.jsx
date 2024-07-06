import React, { useState } from "react";
import { fetchWeather } from "./api/fetchWeather";
import "./index.css"

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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <input
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          placeholder="Enter city name..."
          value={cityName}
          onChange={(e) => setCityName(e.target.value)}
          onKeyDown={onSearch}
        />
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {loading && <div className="text-gray-600 mb-4">Loading...</div>}
      {weatherData && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-4">
          <h2 className="text-2xl font-bold mb-4">
            {weatherData.location.name}, {weatherData.location.region},{" "}
            {weatherData.location.country}
          </h2>
          <div className="space-y-2">
            <p className="text-lg">
              Temperature: {celsius ? `${weatherData.current.temp_c} °C` : `${weatherData.current.temp_f} °F`}
            </p>
            <div className="flex items-center space-x-2 cursor-pointer" onClick={toggleUnit}>
              <span className={`${celsius ? "font-bold" : ""}`}>Celsius</span> /
              <span className={`${!celsius ? "font-bold" : ""}`}>Fahrenheit</span>
            </div>
            <p>Condition: {weatherData.current.condition.text}</p>
            <img
              className="w-16 h-16"
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
        <div className="bg-gray-100 rounded-lg p-4">
          <h3 className="text-xl font-semibold mb-2">Recently Searched</h3>
          <div className="flex flex-wrap gap-2">
            {cities.map((city) => (
              <div
                key={city}
                className="bg-blue-500 text-white px-3 py-1 rounded-full cursor-pointer hover:bg-blue-600 transition-colors"
                onClick={() => selectCity(city)}
              >
                {city}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;