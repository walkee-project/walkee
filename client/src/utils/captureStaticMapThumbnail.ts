import { getStaticMapImageUrl } from "./getStaticMapImageUrl";

export const captureStaticMapThumbnail = async (
  encodedPolyline: string
): Promise<string | null> => {
  const imageUrl = getStaticMapImageUrl(encodedPolyline);
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const formData = new FormData();
    formData.append("thumbnail", blob, "route-thumbnail.png");
    const uploadRes = await fetch(`${__API_URL__}/upload-thumbnail`, {
      method: "POST",
      body: formData,
    });
    if (!uploadRes.ok) throw new Error("썸네일 업로드 실패");
    const data = await uploadRes.json();
    return data.url;
  } catch (e) {
    console.error("Static Map 캡처/업로드 실패:", e);
    return null;
  }
};
