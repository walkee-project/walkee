import type { RouteItem } from "./types/mypage_type";
import ex2 from "../assets/homeMap_ex2.png";
import ex3 from "../assets/homeMap_ex3.png";
import ex4 from "../assets/map_ex4.png";

export const dummyData: RouteItem[] = [
  {
    id: "1",
    date: "2025.07.08",
    title: "남매지 러닝",
    time: "32:34",
    distance: "2.58",
    speed: "4.69",
    image: ex4,
    who: "라쓰비",
    isLiked: false,
  },
  {
    id: "2",
    date: "2025.07.08",
    title: "붕어빵런",
    time: "32:34",
    distance: "2.58",
    speed: "4.69",
    image: ex2,
    who: "라쓰비",
    isLiked: false,
  },
  {
    id: "3",
    date: "2025.07.05",
    title: "한강 야경런",
    time: "30:12",
    distance: "3.12",
    speed: "5.1",
    image: ex3,
    who: "라쓰비",
    isLiked: false,
  },
];
