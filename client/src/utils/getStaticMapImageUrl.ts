export const getStaticMapImageUrl = (encodedPolyline: string) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY; // .env에 저장
  const size = "600x400"; // 썸네일 크기
  const path = `color:0xff0000ff|weight:4|enc:${encodedPolyline}`;
  return `https://maps.googleapis.com/maps/api/staticmap?size=${size}&path=${path}&key=${apiKey}`;
};
