import { useWeather } from "../hooks/useWeather";
import mascot_long from "../../assets/mascot_long.png";

function WeatherComponent() {
  const {
    weather,
    loading: weatherLoading,
    error: weatherError,
  } = useWeather();

  return (
    <div className="weather_container">
      <div className="mascot_section">
        <img src={mascot_long} alt="마스코트" className="mascot_img" />
      </div>
      <div className="weather_section">
        {weatherLoading ? (
          <p>날씨 정보를 불러오는 중...</p>
        ) : weatherError ? (
          <p>{weatherError}</p>
        ) : weather ? (
          <>
            <div className="location_weather">
              <div className="weather_icon">
                <img src={weather.iconUrl} alt="날씨" />
              </div>
              <p>{weather.location}</p>
            </div>
            <p className="weather_detail">
              현재 온도 : {weather.temperature}도 | 강수량 :{" "}
              {weather.precipitation}mm
            </p>
            <p className="weather_comment">{weather.comment}</p>
          </>
        ) : (
          <p>날씨 정보를 불러오지 못했어요.</p>
        )}
      </div>
    </div>
  );
}

export default WeatherComponent;
