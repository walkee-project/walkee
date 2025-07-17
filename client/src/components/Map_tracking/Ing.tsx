import { useEffect, useRef, useState } from "react";
import "../css/Ing.css";
import MapComponent from "../map/MapComponent";
import MapTools from "../map/MapTools";
import Ing_finish from "./Ing_finish";

export default function Ing() {
  const [isPause, setIsPause] = useState(false);
  const [isFinish, setIsFinish] = useState(false);

  const [heading, setHeading] = useState(0);
  const markerRef = useRef<kakao.maps.Marker | null>(null);
  const [mapInstance, setMapInstance] = useState<kakao.maps.Map | null>(null);

  const handlePause = () => {
    setIsPause(!isPause);
  };

  const handleFinish = () => {
    setIsFinish(true);
  };

  // MapComponent에서 onMapReady 콜백으로 mapInstance를 세팅
  const handleMapReady = () => {
    if (window.kakaoMapInstance) {
      setMapInstance(window.kakaoMapInstance);
    }
  };

  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null) {
        setHeading(event.alpha);
      }
    };

    window.addEventListener("deviceorientation", handleOrientation, true);

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  return (
    <div className="ing_section">
      {isFinish ? (
        <Ing_finish />
      ) : (
        <>
          <div className="map_container">
            <MapComponent markerRef={markerRef} onMapReady={handleMapReady} />
            <MapTools
              heading={heading}
              markerRef={markerRef}
              mapInstance={mapInstance}
            />
          </div>

          {isPause && (
            <div className="pause_box">
              <div>쉬어가는 중</div>
            </div>
          )}

          <div className="state_wrapper">
            <div className="state_box">
              <div className="state_km">
                <span>2.35</span>
                <span className="unit"> km</span>
              </div>
              <div className="state_kmh">
                <span>3.2</span>
                <span className="unit"> km/h</span>
              </div>
              <div className="state_time">
                <span>32:35</span>
              </div>
            </div>
            <div className="ing_btns">
              <button className="btn_two btn ing_btn" onClick={handleFinish}>
                끝내기
              </button>
              <button className="btn_one btn ing_btn" onClick={handlePause}>
                {isPause ? "계속하기" : "쉬어가기"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
