import { useEffect, useState } from "react";
import { waitForKakaoSdk } from "./useKakaoSdk";

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

  const API_KEY = import.meta.env.VITE_APP_WEATHER_API_KEY;

  // 기본 위치 (서울)
  const DEFAULT_LAT = 37.5665;
  const DEFAULT_LON = 126.978;

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

        // 카카오 좌표 -> 한글 주소
        const kakao = await waitForKakaoSdk();
        const geocoder = new kakao.maps.services.Geocoder();

        geocoder.coord2RegionCode(
          lon,
          lat,
          (
            result: kakao.maps.services.RegionCode[],
            status: kakao.maps.services.Status
          ) => {
            if (status === kakao.maps.services.Status.OK && result.length > 0) {
              const regionName = result[0].address_name;

              setWeather({
                location: regionName,
                temperature,
                precipitation,
                comment,
                iconUrl,
              });
            } else {
              setError("주소 정보를 불러올 수 없습니다.");
            }
            setLoading(false);
          }
        );
      } catch (err) {
        console.error(err);
        setError("날씨 정보 로딩 실패");
        setLoading(false);
      }
    };

    // 위치 정보 지원 여부 확인
    if (!navigator.geolocation) {
      console.log(
        "위치 정보를 지원하지 않습니다. 기본 위치(서울)를 사용합니다."
      );
      fetchWeather(DEFAULT_LAT, DEFAULT_LON);
      return;
    }

    // 위치 정보 옵션 설정
    const options = {
      enableHighAccuracy: true, // 정확도 우선
      timeout: 10000, // 10초 타임아웃
      maximumAge: 60000, // 1분간 캐시된 위치 정보 사용
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        fetchWeather(latitude, longitude);
      },
      (err) => {
        console.error("위치 정보 오류:", err);

        // HTTPS 환경에서 위치 정보 접근이 차단된 경우 기본 위치 사용
        if (err.code === 1 && window.location.protocol === "https:") {
          console.log(
            "HTTPS 환경에서 위치 정보 접근이 차단되었습니다. 기본 위치(서울)를 사용합니다."
          );
          fetchWeather(DEFAULT_LAT, DEFAULT_LON);
          return;
        }

        // 구체적인 오류 메시지 제공
        let errorMessage = "위치 정보를 불러오지 못했습니다.";

        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage =
              "위치 정보 접근이 거부되었습니다. 브라우저 설정에서 위치 정보를 허용해주세요.";
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = "위치 정보를 사용할 수 없습니다.";
            break;
          case err.TIMEOUT:
            errorMessage = "위치 정보 요청이 시간 초과되었습니다.";
            break;
          default:
            errorMessage = "알 수 없는 오류가 발생했습니다.";
        }

        setError(errorMessage);
        setLoading(false);
      },
      options
    );
  }, []);

  return { weather, loading, error };
}
