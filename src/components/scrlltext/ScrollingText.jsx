import React from "react";
import "./ScrollingText.css";

export default function ScrollingText() {
  const messages = [
    "Get in touch with Retrowoods",
    "Retrowoods ",
    "Retrowoods ",
    "Retrowoods",
  ];

  return (
    <div className="scrolling-container">
      <div className="scrolling-marquee">
        <div className="scrolling-track">
          {messages.concat(messages).map((msg, index) => (
            <span key={index} className="scrolling-text">{msg}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
