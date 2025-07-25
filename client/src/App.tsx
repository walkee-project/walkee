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
import Community_edit from "./components/community/Community_edit";
import ConfirmExitModal from "./components/ConfirmExitModal";
import { DeleteAccountPage } from "./components/DeleteAccountPage";

import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useBackHandler from "./components/hooks/useBackHandle";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import {
  fetchUser,
  fetchUserSummaryThunk,
  fetchAllRouteThunk,
} from "./store/userSlice";
import { api } from "./utils/api";

function AppContent() {
  useEffect(() => {
    // URL에서 토큰 추출 및 저장
    api.initializeToken();
  }, []);
  useEffect(() => {
    // URL에서 토큰 추출
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get("accessToken");

    if (accessToken) {
      // localStorage에 저장
      localStorage.setItem("access_token", accessToken);

      // URL을 깔끔하게 정리
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);

      console.log("토큰 저장 완료:", accessToken);
    }
  }, []);

  const location = useLocation();

  // ✅ 뒤로가기 훅 (Router 안에서 호출해야 location 사용 가능)
  const backHandler = useBackHandler();
  const {
    handleBack,
    showExitModal,
    exitFrom,
    handleCancelModal,
    handleConfirmModal,
    ismapModalOpen,
  } = backHandler;

  // ✅ 네비게이션 숨김 조건
  const hideNavRoutes = ["/", "/map/ing", "/courseList", "/community/write"];
  const isDynamicDetail = matchPath("/community/:id", location.pathname);
  const isEdit = matchPath("/community/edit/:id", location.pathname);
  const isNavHidden =
    hideNavRoutes.includes(location.pathname) || !!isDynamicDetail || !!isEdit;

  // ✅ 뒤로가기 (popstate) 이벤트 연결
  useEffect(() => {
    const onPopState = () => {
      handleBack();
      window.history.pushState(null, "", window.location.pathname);
    };

    window.history.pushState(null, "", window.location.pathname);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [handleBack, location.pathname]);

  // ✅ user 및 전체 경로 초기 불러오기
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);

  useEffect(() => {
    if (location.pathname === "/") return;
    dispatch(fetchUser());
    dispatch(fetchAllRouteThunk());
  }, [dispatch, location.pathname]);

  useEffect(() => {
    if (user?.userIdx) {
      dispatch(fetchUserSummaryThunk(user.userIdx));
    }
  }, [user?.userIdx, dispatch]);

  // ✅ 커뮤니티/스토어/마이페이지 새로고침용 키 관리
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
        <Route path="/delete-account" element={<DeleteAccountPage />} />
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
          element={<Ing isMapModalOpen={ismapModalOpen} />}
        />
        <Route path="/store" element={<Store />} />
        <Route path="/mypage" element={<Mypage key={resetKey.mypage} />} />
        <Route path="/courseList" element={<CourseList />} />
      </Routes>

      <ToastContainer position="bottom-center" autoClose={1000} />
      {!isNavHidden && <Navigation onResetKey={handleResetKey} />}
      {showExitModal && exitFrom && (
        <ConfirmExitModal
          where={exitFrom === "Map" ? "map" : "community"}
          onCancel={handleCancelModal}
          onConfirm={handleConfirmModal}
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
