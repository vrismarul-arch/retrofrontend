import React, { useEffect, useState } from "react";
import "./LoadingScreen.css";

export default function LoadingScreen({ loading }) {
  const [visible, setVisible] = useState(true);

  // Fade out when loading becomes false
  useEffect(() => {
    if (!loading) {
      const timeout = setTimeout(() => setVisible(false), 500); // fade-out duration
      return () => clearTimeout(timeout);
    }
  }, [loading]);

  if (!visible) return null;

  return (
    <div className={`loading-screen-advanced ${!loading ? "fade-out" : ""}`}>
      <div className="ripple-container">
        <div className="ripple"></div>
        <div className="ripple"></div>
      </div>
      <h1 className="loading-text">Retro Woods</h1>
    </div>
  );
}
