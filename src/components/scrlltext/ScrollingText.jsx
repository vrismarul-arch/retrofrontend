import React from "react";
import "./ScrollingText.css";

export default function ScrollingText() {
  const messages = [
    "Get in touch with Retrowoods",
    "Retrowoods - Your Furniture, Your Style",
    "Shop the best furniture at Retrowoods",
    "Fast & Reliable Service by Retrowoods",
    "Retrowoods - Quality Furniture for Every Home",
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
