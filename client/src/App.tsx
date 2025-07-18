import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  matchPath,
} from "react-router-dom";
import First from "./components/First";
import Home from "./components/Home";
import Map from "./components/map/Map";
import Ing from "./components/Map_tracking/Ing";
import Mypage from "./components/mypage/Mypage";
import Navigation from "./components/Navigation";
import Community from "./components/community/Community";
import CourseList from "./components/courseList";
import Community_write from "./components/community/Community_write";
import Community_detail from "./components/community/Community_detail";

import { useState } from "react";
import { dummyData } from "./components/dummydate";

// ✅ Router 안에서 useLocation을 쓰는 내부 컴포넌트
function AppContent() {
  const location = useLocation();
  const hideNavRoutes = ["/", "/map/ing", "/courseList", "/community/write"]; // 네비게이션 숨길 경로
  const isDynamicDetail = matchPath("/community/:id", location.pathname);
  const isNavHidden =
    hideNavRoutes.includes(location.pathname) || !!isDynamicDetail;

  const [routeId] = useState<number>(() => {
    const randomIndex = Math.floor(Math.random() * dummyData.length);
    return dummyData[randomIndex].routeIdx;
  });

  const [resetKey, setResetKey] = useState({
    community: 0,
    store: 0,
    mypage: 0,
  });

  const handleResetKey = (sectionName: "community" | "store" | "mypage") => {
    setResetKey((prev) => ({
      ...prev,
      [sectionName]: prev[sectionName] + 1,
    }));
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<First />} />
        <Route path="/home" element={<Home routeId={routeId} />} />
        <Route
          path="/community"
          element={<Community key={resetKey.community} />}
        />
        <Route path="/community/write" element={<Community_write />} />
        <Route
          path="/community/:id"
          element={<Community_detail key={resetKey.community} />}
        />
        <Route path="/map" element={<Map routeId={routeId} />} />
        <Route path="/map/ing" element={<Ing />} />
        <Route path="/mypage" element={<Mypage key={resetKey.mypage} />} />
        <Route path="/courseList" element={<CourseList />} />
      </Routes>

      {!isNavHidden && <Navigation onResetKey={handleResetKey} />}
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
