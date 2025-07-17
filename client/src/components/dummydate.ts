import type { RouteItem } from "./types/mypage_type";
import ex2 from "../assets/homeMap_ex2.png";
import ex3 from "../assets/homeMap_ex3.png";
import ex4 from "../assets/map_ex4.png";

export const dummyData: RouteItem[] = [
  {
    routeIdx: 1,
    routeCreatedAt: "2025.07.08",
    routeTitle: "남매지 러닝",
    routeTotalTime: 120, // 2분
    routeTotalKm: 2.58,
    routeThumbnail: ex4,
    userIdx: 1,
    isLiked: true,
  },
  {
    routeIdx: 2,
    routeCreatedAt: "2025.07.08",
    routeTitle: "붕어빵런",
    routeTotalTime: 1954, // 32분 34초
    routeTotalKm: 2.58,
    routeThumbnail: ex2,
    userIdx: 2,
    isLiked: false,
  },
  {
    routeIdx: 3,
    routeCreatedAt: "2025.07.05",
    routeTitle: "한강 야경런",
    routeTotalTime: 1812, // 30분 12초
    routeTotalKm: 3.12,
    routeThumbnail: ex3,
    userIdx: 3,
    isLiked: false,
  },
];
