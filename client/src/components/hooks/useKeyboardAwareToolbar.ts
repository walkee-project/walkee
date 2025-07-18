import { useEffect } from "react";

const useKeyboardAwareToolbar = () => {
  useEffect(() => {
    const footer = document.querySelector(".write-footer") as HTMLElement;
    if (!footer || !window.visualViewport) return;

    const handleResize = () => {
      const viewport = window.visualViewport!;
      const bottomSpace =
        window.innerHeight - viewport.height - viewport.offsetTop;

      if (bottomSpace > 100) {
        // 키보드가 올라온 경우
        footer.style.transform = `translateY(-${bottomSpace}px)`;
      } else {
        // 키보드가 닫힌 경우
        footer.style.transform = "translateY(0)";
      }
    };

    window.visualViewport.addEventListener("resize", handleResize);
    window.visualViewport.addEventListener("scroll", handleResize);

    return () => {
      window.visualViewport?.removeEventListener("resize", handleResize);
      window.visualViewport?.removeEventListener("scroll", handleResize);
    };
  }, []);
};

export default useKeyboardAwareToolbar;
