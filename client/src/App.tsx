import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import First from "./components/First";
import Home from "./components/Home";
import Map from "./components/map/Map";
import Ing from "./components/Map_tracking/Ing";
import Mypage from "./components/mypage/Mypage";
import Navigation from "./components/Navigation";
import Community from "./components/community/Community";
import { useState } from "react";
import { dummyData } from "./components/dummydate";

// ✅ Router 안에서 useLocation을 쓰는 내부 컴포넌트
function AppContent() {
  const location = useLocation();
  const hideNavRoutes = ["/", "/map/ing"]; // 네비게이션 숨길 경로
  const isNavHidden = hideNavRoutes.includes(location.pathname);

  const [routeId] = useState<number>(() => {
    const randomIndex = Math.floor(Math.random() * dummyData.length);
    return dummyData[randomIndex].id;
  });

  return (
    <>
      <Routes>
        <Route path="/" element={<First />} />
        <Route path="/home" element={<Home routeId={routeId} />} />
        <Route path="/community" element={<Community />} />
        <Route path="/map" element={<Map routeId={routeId} />} />
        <Route path="/map/ing" element={<Ing />} />
        <Route path="/mypage" element={<Mypage />} />
        <Route path="/like" element={<Mypage />} />
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
