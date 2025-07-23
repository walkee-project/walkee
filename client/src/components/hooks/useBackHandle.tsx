import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";

function useBackHandler() {
  const location = useLocation();
  const navigate = useNavigate();

  const [showExitModal, setShowExitModal] = useState(false);
  const [exitFrom, setExitFrom] = useState<"Community" | "Map" | null>(null);
  const [backKeyPressedTime, setBackKeyPressedTime] = useState(0);
  const [ismapModalOpen, setIsMapModalOpen] = useState(false);

  const handleBack = useCallback(() => {
    if (location.pathname === "/map/ing") {
      setExitFrom("Map");
      setShowExitModal(true);
      setIsMapModalOpen(true);
    } else if (
      location.pathname === "/community/write" ||
      location.pathname === "/community/edit"
    ) {
      setExitFrom("Community");
      setShowExitModal(true);
    } else if (location.pathname !== "/home" && location.pathname !== "/") {
      navigate("/home");
    } else {
      const now = Date.now();
      if (now - backKeyPressedTime < 1000) {
        window.ReactNativeWebView?.postMessage("EXIT_APP");
      } else {
        setBackKeyPressedTime(now);
        toast("뒤로 가기 버튼을 한 번 더 누르시면 종료됩니다.");
      }
    }
  }, [location.pathname, navigate, backKeyPressedTime]);

  useEffect(() => {
    const onAndroidBack = () => {
      handleBack();
    };

    window.addEventListener("ANDROID_BACK", onAndroidBack);

    return () => {
      window.removeEventListener("ANDROID_BACK", onAndroidBack);
    };
  }, [handleBack]);

  const handleConfirmModal = () => {
    setShowExitModal(false);
    setExitFrom(null);
    setIsMapModalOpen(false);
    navigate("/home");
  };

  const handleCancelModal = () => {
    setShowExitModal(false);
    setExitFrom(null);
    setIsMapModalOpen(false);
  };

  return {
    handleBack,
    showExitModal,
    exitFrom,
    ismapModalOpen,
    handleConfirmModal,
    handleCancelModal,
  };
}

export default useBackHandler;
