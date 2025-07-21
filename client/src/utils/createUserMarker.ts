export function createUserMarker(
  map: kakao.maps.Map,
  position: kakao.maps.LatLng
): kakao.maps.Marker {
  const svgString =
    '<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<g opacity="0.2"><circle cx="20" cy="20" r="14" fill="#4285f4"/></g>' +
    '<circle cx="20" cy="20" r="8" fill="#4285f4" stroke="white" stroke-width="2"/>' +
    '<circle cx="20" cy="20" r="3" fill="white"/>' +
    "</svg>";

  const markerImage = new window.kakao.maps.MarkerImage(
    "data:image/svg+xml;base64," + btoa(svgString),
    new window.kakao.maps.Size(40, 40),
    { offset: new window.kakao.maps.Point(20, 20) }
  );

  const marker = new window.kakao.maps.Marker({
    position,
    image: markerImage,
  });

  marker.setMap(map);

  return marker;
}
