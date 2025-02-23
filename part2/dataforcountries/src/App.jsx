import { useState, useEffect } from "react";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [query, setQuery] = useState("");
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  // 第一次 useEffect：获取国家列表
  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all")
      .then(response => response.json())
      .then(data => setCountries(data))
      .catch(error => console.error("Error fetching countries:", error));
  }, []);

  // 第二次 useEffect：根据 query 过滤国家
  useEffect(() => {
    if (query) {
      const filtered = countries.filter(country =>
        country.name.common.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCountries(filtered);
      setSelectedCountry(null);
    } else {
      setFilteredCountries([]);
      setSelectedCountry(null);
    }
  }, [query, countries]);

  return (
    <div>
      <label>find countries </label>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <CountryList countries={filteredCountries} onSelect={setSelectedCountry} />
      {selectedCountry && <CountryDetail country={selectedCountry} />}
    </div>
  );
};

const CountryList = ({ countries, onSelect }) => {
  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>;
  }

  if (countries.length > 1) {
    return (
      <ul>
        {countries.map((country) => (
          <li key={country.cca3}>
            {country.name.common}{" "}
            <button onClick={() => onSelect(country)}>Show</button>
          </li>
        ))}
      </ul>
    );
  }

  if (countries.length === 1) {
    return <CountryDetail country={countries[0]} />;
  }

  return null;
};

// 详细信息展示组件
const CountryDetail = ({ country }) => {
  // 从环境变量中获取 API Key
  const api_key = import.meta.env.VITE_API_KEY;

  const [weather, setWeather] = useState(null);

  // 当组件加载或国家首都变化时，获取天气信息
  useEffect(() => {
    // 如果没有首都信息，就不请求天气数据
    if (!country.capital || country.capital.length === 0) {
      return;
    }
    const capitalName = country.capital[0];
    
    // 这里单位 units=metric，返回摄氏度
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${capitalName}&appid=${api_key}&units=metric`;

    fetch(url)
      .then(response => response.json())
      .then(data => setWeather(data))
      .catch(error => console.error("Error fetching weather data:", error));
  }, [country.capital, api_key]);

  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>Capital: {country.capital ? country.capital[0] : "N/A"}</p>
      <p>Area: {country.area}</p>
      <h3>Languages:</h3>
      <ul>
        {country.languages &&
          Object.values(country.languages).map((lang) => (
            <li key={lang}>{lang}</li>
          ))}
      </ul>
      <img
        src={country.flags.svg}
        alt={`Flag of ${country.name.common}`}
        width="150"
      />

      {/* 如果成功获取到天气数据，则展示 */}
      {weather && weather.main && (
        <div>
          <h3>Weather in {country.capital[0]}</h3>
          <p>Temperature {weather.main.temp} Celsius</p>
          {weather.weather && weather.weather.length > 0 && (
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt="Weather icon"
            />
          )}
          <p>Wind {weather.wind.speed} m/s</p>
        </div>
      )}
    </div>
  );
};

export default App;
