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
    { name: "home", icon: homeIcon, path: "/home" },
    { name: "community", icon: communityIcon, path: "/community" },
    { name: "map", icon: mapIcon, path: "/map", center: true },
    { name: "store", icon: storeIcon, path: "/store" },
    { name: "mypage", icon: mypageIcon, path: "/mypage" },
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <div
          key={item.name}
          className={`nav-item ${item.center ? "center-item" : ""} ${
            location.pathname === item.path ? "active" : ""
          }`}
          onClick={() => navigate(item.path)}
        >
          <img src={item.icon} className="icon" />
          {!item.center && <p className="label">{item.name}</p>}
        </div>
      ))}
    </nav>
  );
}

export default Navigation;
