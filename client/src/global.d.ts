// global.d.ts (또는 kakao.d.ts)

export {};

declare global {
  interface Window {
    kakao: any;
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
    AndroidBridge?: {
      logTest: (msg: string) => void;
      postMessage: (message: string) => void;
    };
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
        setBounds(bounds: LatLngBounds): void;
      }

      class Marker {
        constructor(options: any);
        setPosition(latLng: LatLng): void;
        getPosition(): LatLng;
        getMap(): Map | null;
        setMap(map: Map | null): void;
      }

      class LatLngBounds {
        constructor();
        extend(latlng: LatLng): void;
      }

      class Polyline {
        constructor(options: any);
        setMap(map: Map | null): void;
        setPath(path: LatLng[]): void;
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
