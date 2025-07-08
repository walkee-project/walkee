// src/hooks/useWeather.ts
import { useEffect, useState } from "react";

interface WeatherInfo {
  location: string;
  temperature: number;
  precipitation: number;
  comment: string;
  iconUrl: string;
}

export function useWeather() {
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const API_KEY = "8bae7c1d7875e2c7ecf2c801c7799338";
  useEffect(() => {
    const fetchWeather = async (lat: number, lon: number) => {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=kr`
        );
        if (!res.ok) throw new Error("날씨 정보를 불러오지 못했습니다.");
        const data = await res.json();

        const temperature = Math.round(data.main.temp);
        const precipitation = Math.round(
          data.rain?.["1h"] ?? data.rain?.["3h"] ?? 0
        );
        const comment =
          temperature > 30 && precipitation < 1
            ? "오늘은 달리기 좋은 날씨예요!"
            : precipitation > 5
            ? "비가 많이 와요. 외출을 조심하세요."
            : "산책하기 괜찮은 날씨예요!";
        const iconCode = data.weather?.[0]?.icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        setWeather({
          location: data.name,
          temperature,
          precipitation,
          comment,
          iconUrl,
        });
      } catch (err) {
        console.error(err);
        setError("날씨 정보 로딩 실패");
      } finally {
        setLoading(false);
      }
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        fetchWeather(latitude, longitude);
      },
      (err) => {
        console.error("위치 정보 오류:", err);
        setError("위치 정보를 불러오지 못했습니다.");
        setLoading(false);
      }
    );
  }, []);

  return { weather, loading, error };
}
