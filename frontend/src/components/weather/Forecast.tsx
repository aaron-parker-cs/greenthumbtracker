import { Spinner, Accordion } from "react-bootstrap";
import { api } from "../../redux/api";

const Forecast = () => {
  const {
    data: weatherData,
    isLoading: isWeatherLoading,
    error,
  } = api.useGetWeatherQuery();

  return (
    <div className="d-flex flex-column align-items-center">
      {isWeatherLoading ? (
        <Spinner animation="border" role="status" className="mb-4">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : error ? (
        <p className="fs-5 text-danger">
          Unable to load weather data. Do you have your location set?
        </p>
      ) : weatherData ? (
        <div className="w-100 mx-auto" style={{ maxWidth: "800px" }}>
          <h2 className="h4 fw-bold mb-4">5-Day Forecast</h2>
          <Accordion>
            {weatherData.list.map((day, index) => (
              <Accordion.Item eventKey={index.toString()} key={index}>
                <Accordion.Header>
                  {new Date(
                    (day.dt + weatherData.city.timezone) * 1000
                  ).toLocaleDateString(undefined, {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "America/Chicago",
                  })}{" "}
                  - {day.main.temp} °F - {day.weather[0].main}
                </Accordion.Header>
                <Accordion.Body>
                  <p className="mb-1">Temperature: {day.main.temp}°F</p>
                  <p className="mb-1">Feels Like: {day.main.feels_like}°F</p>
                  <p className="mb-1">
                    Min: {day.main.temp_min}°F, Max: {day.main.temp_max}°F
                  </p>
                  <p className="mb-1">
                    Weather: {day.weather[0].main} -{" "}
                    {day.weather[0].description}
                  </p>
                  <p className="mb-1">Humidity: {day.main.humidity}%</p>
                  <p className="mb-1">Wind Speed: {day.wind.speed} mph</p>
                  <p className="mb-1">Wind Direction: {day.wind.deg}°</p>
                  <p className="mb-1">Pressure: {day.main.pressure} hPa</p>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </div>
      ) : (
        <p className="fs-5">No weather data available.</p>
      )}
    </div>
  );
};

export default Forecast;
