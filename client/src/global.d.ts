// global.d.ts (또는 kakao.d.ts)

export {};

declare global {
  interface Window {
    kakao: typeof kakao;
  }

  namespace kakao {
    namespace maps {
      class LatLng {
        constructor(lat: number, lng: number);
        getLat(): number;
        getLng(): number;
      }

      interface MapOptions {
        center: LatLng;
        level?: number;
        draggable?: boolean;
        scrollwheel?: boolean;
        disableDoubleClick?: boolean;
        disableDoubleClickZoom?: boolean;
        tileAnimation?: boolean;
        projectionId?: number;
      }

      class Map {
        constructor(container: HTMLElement, options: MapOptions);
        setCenter(latLng: LatLng): void;
        getCenter(): LatLng;
        getLevel(): number;
      }

      interface MarkerOptions {
        map?: Map;
        position: LatLng;
        image?: MarkerImage;
        title?: string;
        clickable?: boolean;
        draggable?: boolean;
        zIndex?: number;
      }

      class Marker {
        constructor(options: MarkerOptions);
        setPosition(latLng: LatLng): void;
        getPosition(): LatLng;
        getMap(): Map | null;
        setMap(map: Map | null): void;
      }

      interface MarkerImage {
        size: Size;
        options?: MarkerImageOptions;
      }

      class Size {
        constructor(width: number, height: number);
        getWidth(): number;
        getHeight(): number;
      }

      interface MarkerImageOptions {
        offset?: Point;
        spriteOrigin?: Point;
        spriteSize?: Size;
        alt?: string;
        shape?: string;
      }

      class Point {
        constructor(x: number, y: number);
        getX(): number;
        getY(): number;
      }

      interface PolylineOptions {
        map?: Map;
        path: LatLng[];
        strokeWeight?: number;
        strokeColor?: string;
        strokeOpacity?: number;
        strokeStyle?:
          | "solid"
          | "shortdash"
          | "shortdot"
          | "longdash"
          | "dashdot"
          | "longdashdot";
      }

      class Polyline {
        constructor(options: PolylineOptions);
        setMap(map: Map | null): void;
        setPath(path: LatLng[]): void;
        getPath(): LatLng[];
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

        interface DrawingManagerOptions {
          map: Map;
          drawingMode?: OverlayType[];
          guideTooltip?: ["draw", "drag", "edit"];
          markerOptions?: MarkerOptions;
          polylineOptions?: PolylineOptions;
        }

        class DrawingManager {
          constructor(options: DrawingManagerOptions);
          select(type: OverlayType): void;
        }
      }
    }
  }
}
