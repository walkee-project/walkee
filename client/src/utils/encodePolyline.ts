export const encodePolyline = (
  coordinates: { lat: number; lng: number }[]
): string => {
  let lastLat = 0;
  let lastLng = 0;
  let result = "";

  for (const point of coordinates) {
    const lat = Math.round(point.lat * 1e5);
    const lng = Math.round(point.lng * 1e5);

    const deltaLat = lat - lastLat;
    const deltaLng = lng - lastLng;

    result += encodeSignedNumber(deltaLat);
    result += encodeSignedNumber(deltaLng);

    lastLat = lat;
    lastLng = lng;
  }

  return result;
};

function encodeSignedNumber(num: number): string {
  let sgnNum = num << 1;
  if (num < 0) {
    sgnNum = ~sgnNum;
  }
  return encodeNumber(sgnNum);
}

function encodeNumber(num: number): string {
  let encoded = "";
  while (num >= 0x20) {
    encoded += String.fromCharCode((0x20 | (num & 0x1f)) + 63);
    num >>= 5;
  }
  encoded += String.fromCharCode(num + 63);
  return encoded;
}
