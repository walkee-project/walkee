import "./css/Navigation.css";
import { useNavigate, useLocation } from "react-router-dom";
import homeIcon from "../assets/homeIcon.png";
import communityIcon from "../assets/communityIcon.png";
import mapIcon from "../assets/mapIcon.png";
// import storeIcon from "../assets/storeIcon.png";
import mypageIcon from "../assets/mypageIcon.png";
import heart from "../assets/heart.png";

function Navigation({
  onResetKey,
}: {
  onResetKey: (sectionName: "community" | "store" | "mypage") => void;
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: "홈", icon: homeIcon, path: "/home" },
    {
      name: "커뮤니티",
      icon: communityIcon,
      path: "/community",
      sectionKey: "community",
    },
    { name: "맵", icon: mapIcon, path: "/map", center: true },
    // { name: "스토어", icon: storeIcon, path: "/store", sectionKey: "store" },
    {
      name: "찜한목록",
      icon: heart,
      path: "/courseList",
      sectionType: "wishlist",
      sectionKey: "courseList",
    },
    {
      name: "마이워키",
      icon: mypageIcon,
      path: "/mypage",
      sectionKey: "mypage",
    },
  ];

  const handleClick = (item: (typeof navItems)[0]) => {
    // resetKey 증가가 필요한 경우 실행
    if (item.sectionKey) {
      onResetKey(item.sectionKey as "community" | "store" | "mypage");
    }

    if (item.sectionKey === "courseList") {
      navigate(item.path, { state: { sectionType: item.sectionType } });
    } else {
      navigate(item.path);
    }
  };

  return (
    <nav className="bottom_nav">
      <div className="nav_list">
        {navItems.map((item) => (
          <div
            key={item.name}
            className={`nav_item ${item.center ? "center_item" : ""} ${
              location.pathname === item.path ? "active" : ""
            }`}
            onClick={() => handleClick(item)}
          >
            <img src={item.icon} className="icon" />
            {!item.center && <p className="label">{item.name}</p>}
          </div>
        ))}
      </div>
    </nav>
  );
}

export default Navigation;
