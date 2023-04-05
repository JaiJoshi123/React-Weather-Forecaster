import axios from "axios";

import './App.css';
import { useState, useEffect, useRef } from 'react';

function App() {
  const [location, setLocation] = useState("Mumbai, India");
  const [currWeather, setCurrWeather] = useState();
  const [forecastWeather, setForecastWeather] = useState();
  const apikey = process.env.REACT_APP_API_KEY;
  const base_api = "http://api.weatherapi.com/v1";
  const current_weather_api = base_api + "/current.json";
  const forecast_weather_api = base_api + "/forecast.json";

  const inputRef = useRef();

  useEffect(() => {
    axios
      .get(forecast_weather_api, {
        params: {
          q: "Mumbai, India",
          key: apikey,
          days: 8,
        }
      })
      .then((resp) => {
        const weather_data = resp.data;
        const date = new Date(weather_data.location.localtime);
        const curr_weather = {
          "temp": weather_data.current.temp_c,
          "wind": weather_data.current.wind_kph,
          "pressure": weather_data.current.pressure_mb,
          "humidity": weather_data.current.humidity,
          "condition": {
            "text": weather_data.current.condition.text,
            "icon": "https:" + weather_data.current.condition.icon
          },
          "datetime": date.toLocaleString(),
        };
        console.log(curr_weather);
        setCurrWeather(prev => (curr_weather));

        var forecast_data = resp.data.forecast.forecastday;
        var forecast_weather = [];
        forecast_data.forEach((w, i) => {
          if (i > 0) {
            forecast_weather.push({
              "date": w.date,
              "temp": w.day.avgtemp_c,
              "condition": {
                "icon": "https:" + w.day.condition.icon,
                "text": w.day.condition.text
              }
            });
          }
        });
        console.log(forecast_weather);
        setForecastWeather(prev => forecast_weather);
      });
  }, []);

  const handleSearch = async () => {
    setLocation(prev => inputRef.current.value);
    const resp = await axios.get(forecast_weather_api, {
      params: {
        q: inputRef.current.value,
        key: apikey,
        days: 8,
      }
    })
    const weather_data = resp.data;
    const curr_weather = {
      "temp": weather_data.current.temp_c,
      "wind": weather_data.current.wind_kph,
      "pressure": weather_data.current.pressure_mb,
      "humidity": weather_data.current.humidity,
      "condition": {
        "text": weather_data.current.condition.text,
        "icon": "https:" + weather_data.current.condition.icon
      },
      "datetime": weather_data.location.localtime,
    };
    setCurrWeather(prev => (curr_weather));

    var forecast_data = resp.data.forecast.forecastday;
    var forecast_weather = [];
    forecast_data.forEach((w, i) => {
      if (i > 0) {
        forecast_weather.push({
          "date": w.date,
          "temp": w.day.avgtemp_c,
          "condition": {
            "icon": "https:" + w.day.condition.icon,
            "text": w.day.condition.text
          }
        });
      }
    });
    console.log(forecast_weather);
    setForecastWeather(prev => forecast_weather);
    inputRef.current.value = "";
  }

  return (
    <>
      {currWeather == null ?
        <></>
        :
        <div class="container mt-5">
          <div class="d-flex flex-column justify-content-center align-items-center">
            <div class="mb-3 d-flex flex-row">
              <input ref={inputRef} type="text" class="form-control" id="exampleFormControlInput1" placeholder="City,Country" />
              <button onClick={() => handleSearch()} class="btn btn-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-send" viewBox="0 0 16 16">
                  <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z" />
                </svg>
              </button>
            </div>
            <div class="weather__card">
              <div class="d-flex flex-row justify-content-center align-items-center">
                <div class="p-3">
                  <h2>{currWeather.temp}&deg;C</h2>
                </div>
                <div class="p-3">
                  <img src={currWeather.condition.icon} alt="weathericon" />
                </div>
                <div class="p-3">
                  <h5>{currWeather["datetime"]}</h5>
                  <h3>{location}</h3>
                  <span class="weather__description">{currWeather.condition.text}</span>
                </div>
              </div>
              <div class="weather__status d-flex flex-row justify-content-center align-items-center mt-3">
                <div class="p-4 d-flex justify-content-center align-items-center">
                  <img src="https://svgur.com/i/oHw.svg" alt="weathericon" />
                  <span>{currWeather.humidity}%</span>
                </div>
                <div class="p-4 d-flex justify-content-center align-items-center">
                  <img src="https://svgur.com/i/oH_.svg" alt="weathericon" />
                  <span>{currWeather.pressure} mB</span>
                </div>
                <div class="p-4 d-flex justify-content-center align-items-center">
                  <img src="https://svgur.com/i/oKS.svg" alt="weathericon" />
                  <span>{currWeather.wind} km/h</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      <div class="weather__forecast d-flex flex-row justify-content-center align-items-center mt-3">
        {forecastWeather == null ?
          <></>
          :
          forecastWeather.map((weather, i) => (
            <div class="p-4 d-flex flex-column justify-content-center align-items-center">
              <span>{weather.date}</span>
              <img src={weather.condition.icon} alt="weathericon" />
              <span>{weather.temp}&deg;C</span>
              <span class="badge bg-light">{weather.condition.text}</span>
            </div>
          ))}
      </div>
    </>
  );
}

export default App;
