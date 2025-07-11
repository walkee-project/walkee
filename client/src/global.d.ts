// global.d.ts (또는 kakao.d.ts)

export {};

declare global {
  interface Window {
    kakao: any;
  }

  namespace kakao {
    namespace maps {
      class LatLng {
        constructor(lat: number, lng: number);
        getLat(): number;
        getLng(): number;
      }

      class Map {
        constructor(container: HTMLElement, options: any);
        setCenter(latLng: LatLng): void;
      }

      class Marker {
        constructor(options: any);
        setPosition(latLng: LatLng): void;
        getPosition(): LatLng;
      }

      class Polyline {
        constructor(options: any);
        setMap(map: Map | null): void;
      }

      namespace services {
        class Geocoder {
          coord2RegionCode(
            x: number,
            y: number,
            callback: (result: RegionCode[], status: Status) => void
          ): void;
        }

        interface RegionCode {
          address_name: string;
          region_type: string;
          code: string;
          x: string;
          y: string;
        }

        type Status = "OK" | "ERROR" | "ZERO_RESULT";
      }

      namespace drawing {
        type OverlayType = "POLYLINE" | "MARKER";

        class DrawingManager {
          constructor(options: any);
          select(type: OverlayType): void;
        }
      }
    }
  }
}
