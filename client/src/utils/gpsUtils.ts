// 거리 계산 (하버사인 공식)
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// 시간 포맷
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
}

// 마커 애니메이션
export function animateMarker(
  marker: kakao.maps.Marker,
  newLat: number,
  newLng: number,
  duration: number = 1000,
  markerAnimationRef?: { current: number | null },
  calculateDistanceFn: typeof calculateDistance = calculateDistance
): void {
  if (markerAnimationRef && markerAnimationRef.current) {
    cancelAnimationFrame(markerAnimationRef.current);
  }
  const startPosition = marker.getPosition();
  const startLat = startPosition.getLat();
  const startLng = startPosition.getLng();
  const distance = calculateDistanceFn(startLat, startLng, newLat, newLng);
  if (distance < 1) {
    marker.setPosition(new kakao.maps.LatLng(newLat, newLng));
    return;
  }
  const startTime = Date.now();
  const animate = () => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    let easeProgress = progress;
    if (progress < 0.5) {
      easeProgress = 4 * progress * progress * progress;
    } else {
      easeProgress = 1 - Math.pow(-2 * progress + 2, 3) / 2;
    }
    const currentLat = startLat + (newLat - startLat) * easeProgress;
    const currentLng = startLng + (newLng - startLng) * easeProgress;
    marker.setPosition(new kakao.maps.LatLng(currentLat, currentLng));
    if (progress < 1) {
      if (markerAnimationRef)
        markerAnimationRef.current = requestAnimationFrame(animate);
    } else {
      if (markerAnimationRef) markerAnimationRef.current = null;
    }
  };
  if (markerAnimationRef)
    markerAnimationRef.current = requestAnimationFrame(animate);
  else requestAnimationFrame(animate);
}

// 지도 중심 애니메이션
export function animateMapCenter(
  mapInstance: kakao.maps.Map,
  newLat: number,
  newLng: number,
  duration: number = 1000
): void {
  // @ts-expect-error kakao.maps.Map 타입 정의에 getCenter가 없지만 실제로는 존재함
  const startCenter = mapInstance.getCenter();
  const startLat = startCenter.getLat();
  const startLng = startCenter.getLng();
  const startTime = Date.now();
  const animate = () => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 2);
    const currentLat = startLat + (newLat - startLat) * easeProgress;
    const currentLng = startLng + (newLng - startLng) * easeProgress;
    mapInstance.setCenter(new kakao.maps.LatLng(currentLat, currentLng));
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };
  requestAnimationFrame(animate);
}
