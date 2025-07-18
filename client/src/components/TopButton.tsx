import React, { useEffect, useState } from "react";
import arrow_top from "../assets/arrow_top.png";
import "../components/css/TopButton.css";

const TopButton = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return show ? (
    <button className="top-button" onClick={scrollToTop}>
      <img src={arrow_top} alt="Scroll to top" />
    </button>
  ) : null;
};

export default TopButton;
