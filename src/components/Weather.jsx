import React, { useEffect, useState } from 'react';
import './Weather.css';
import search_icon from '../assets/search.png';
import clear_icon from '../assets/clear.png';
import cloud_icon from '../assets/cloud.png';
import drizzle_icon from '../assets/drizzle.png';
import humidity_icon from '../assets/humidity.png';
import rain_icon from '../assets/rain.png';
import snow_icon from '../assets/snow.png';
import wind_icon from '../assets/wind.png';

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [inputCity, setInputCity] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const [theme, setTheme] = useState('light');

  const allIcons = {
    "01d": clear_icon,
    "01n": clear_icon,
    "02d": cloud_icon,
    "02n": cloud_icon,
    "03d": cloud_icon,
    "03n": cloud_icon,
    "04d": drizzle_icon,
    "04n": drizzle_icon,
    "09d": rain_icon,
    "09n": rain_icon,
    "10d": rain_icon,
    "10n": rain_icon,
    "13d": snow_icon,
    "13n": snow_icon,
  };

  const apikey = '66b7902e11d64d2efb2383b4a7def9b4';

  const search = async (city) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apikey}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.cod !== 200) {
        alert('City not found');
        return;
      }

      const icon = allIcons[data.weather[0].icon] || clear_icon;
      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        icon: icon,
      });

      setRecentSearches((prev) => {
        const updated = [data.name, ...prev.filter((c) => c !== data.name)];
        return updated.slice(0, 5);
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    search("Delhi");
  }, []);

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <div className={`weather ${theme}-theme`}>
      <div className="top-bar">
        <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search"
          value={inputCity}
          onChange={(e) => setInputCity(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && search(inputCity)}
        />
        <img src={search_icon} alt="Search" onClick={() => search(inputCity)} />
      </div>

      {weatherData && (
        <>
          <img src={weatherData.icon} alt="Weather Icon" className="weather-icon" />
          <p className="temperature">{weatherData.temperature}°C</p>
          <p className="location">{weatherData.location}</p>
          <div className="weather-data">
            <div className="col">
              <img src={humidity_icon} alt="Humidity" />
              <div>
                <p>{weatherData.humidity}%</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className="col">
              <img src={wind_icon} alt="Wind Speed" />
              <div>
                <p>{weatherData.windSpeed} km/h</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
        </>
      )}

      {recentSearches.length > 0 && (
        <div className="history">
          <h4>Recent Searches:</h4>
          <ul>
            {recentSearches.map((city, index) => (
              <li key={index} onClick={() => search(city)}>{city}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Weather;
