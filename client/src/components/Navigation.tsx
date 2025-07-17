import "./css/Navigation.css";
import { useNavigate, useLocation } from "react-router-dom";
import homeIcon from "../assets/homeIcon.png";
import communityIcon from "../assets/communityIcon.png";
import mapIcon from "../assets/mapIcon.png";
import storeIcon from "../assets/storeIcon.png";
import mypageIcon from "../assets/mypageIcon.png";

function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: "홈", icon: homeIcon, path: "/home" },
    { name: "커뮤니티", icon: communityIcon, path: "/community" },
    { name: "맵", icon: mapIcon, path: "/map", center: true },
    { name: "스토어", icon: storeIcon, path: "/store" },
    { name: "마이워키", icon: mypageIcon, path: "/mypage" },
  ];

  return (
    <nav className="bottom_nav">
      <div className="nav_list">
        {navItems.map((item) => (
          <div
            key={item.name}
            className={`nav_item ${item.center ? "center_item" : ""} ${
              location.pathname === item.path ? "active" : ""
            }`}
            onClick={() => navigate(item.path)}
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
