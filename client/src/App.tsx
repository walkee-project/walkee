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
import Store from "./components/Store";
import Mypage from "./components/mypage/Mypage";
import Navigation from "./components/Navigation";
import Community from "./components/community/Community";
import CourseList from "./components/CourseList";
import Community_write from "./components/community/Community_write";
import Community_detail from "./components/community/Community_detail";
import Community_Rules from "./components/community/Community_rules";
import useBackHandler from "./components/hooks/useBackHandle";
import ConfirmExitModal from "./components/ConfirmExitModal";
import Community_edit from "./components/community/Community_edit";

import { useState } from "react";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import {
  fetchUser,
  fetchUserSummaryThunk,
  fetchAllRouteThunk,
} from "./store/userSlice";

// ✅ Router 안에서 useLocation을 쓰는 내부 컴포넌트
function AppContent() {
  const location = useLocation();
  const hideNavRoutes = ["/", "/map/ing", "/courseList", "/community/write"]; // 네비게이션 숨길 경로
  const isDynamicDetail = matchPath("/community/:id", location.pathname);

  const isEdit = matchPath("/community/edit/:id", location.pathname);

  const isNavHidden =
    hideNavRoutes.includes(location.pathname) || !!isDynamicDetail || !!isEdit;

  const backHandler = useBackHandler();

  const { handleBack, showExitModal } = backHandler;

  useEffect(() => {
    // popstate 이벤트에 handleBack 연결
    const onPopState = () => {
      handleBack();

      // 뒤로가기를 막고 싶으면 아래 코드 사용
      window.history.pushState(null, "", window.location.pathname);
    };

    window.history.pushState(null, "", window.location.pathname);
    window.addEventListener("popstate", onPopState);

    return () => window.removeEventListener("popstate", onPopState);
  }, [handleBack, location.pathname]);

  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);

  // 1. user 정보 한 번만 불러오기
  useEffect(() => {
    dispatch(fetchUser());
    dispatch(fetchAllRouteThunk()); // 전체 경로 리스트도 한 번만 불러오기
  }, [dispatch]);

  // 2. user 정보가 있으면 summary 한 번만 불러오기
  useEffect(() => {
    if (user?.userIdx) {
      dispatch(fetchUserSummaryThunk(user.userIdx));
    }
  }, [user?.userIdx, dispatch]);

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
        <Route path="/home" element={<Home />} />
        <Route
          path="/community"
          element={<Community key={resetKey.community} />}
        />
        <Route path="/community/write" element={<Community_write />} />
        <Route
          path="/community/:id"
          element={<Community_detail key={resetKey.community} />}
        />
        <Route path="/community/edit/:id" element={<Community_edit />} />
        <Route path="/community/rules" element={<Community_Rules />} />

        <Route path="/map" element={<Map />} />
        <Route
          path="/map/ing"
          element={<Ing isMapModalOpen={backHandler.ismapModalOpen} />}
        />
        <Route path="/store" element={<Store />} />
        <Route path="/mypage" element={<Mypage key={resetKey.mypage} />} />
        <Route path="/courseList" element={<CourseList />} />
      </Routes>

      <ToastContainer position="bottom-center" autoClose={1000} />
      {!isNavHidden && <Navigation onResetKey={handleResetKey} />}
      {showExitModal && backHandler.exitFrom && (
        <ConfirmExitModal
          where={backHandler.exitFrom === "Map" ? "map" : "Community"}
          onCancel={backHandler.handleCancelModal}
          onConfirm={backHandler.handleConfirmModal}
        />
      )}
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
