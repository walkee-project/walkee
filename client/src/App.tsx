import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import First from "./components/First";
import Home from "./components/Home";
import Map from "./components/Map";
import Mypage from "./components/Mypage";
import Navigation from "./components/Navigation";

// ✅ Router 안에서 useLocation을 쓰는 내부 컴포넌트
function AppContent() {
  const location = useLocation();
  const hideNavRoutes = ["/"]; // 네비게이션 숨길 경로
  const isNavHidden = hideNavRoutes.includes(location.pathname);

  return (
    <>
      <Routes>
        <Route path="/" element={<First />} />
        <Route path="/home" element={<Home />} />
        <Route path="/map" element={<Map />} />
        <Route path="/mypage" element={<Mypage />} />
      </Routes>

      {!isNavHidden && <Navigation />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
