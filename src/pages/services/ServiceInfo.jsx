import React from "react";
import "./ServiceInfo.css";
import { FaShippingFast, FaTools, FaShieldAlt, FaRedoAlt } from "react-icons/fa";

export default function ServiceInfo() {
  const services = [
    { icon: <FaShippingFast />, title: "Free Shipping" },
    { icon: <FaTools />, title: "Installation" },
    { icon: <FaShieldAlt />, title: "Secure Payment" },
    { icon: <FaRedoAlt />, title: "5-day Replacement" },
  ];

  return (
    <section className="service-info-section">
      <div className="service-info-container">
        {services.map((s, i) => (
          <div className="service-info-card" key={i}>
            <div className="icon-box">{s.icon}</div>
            <h4>{s.title}</h4>
          </div>
        ))}
      </div>
    </section>
  );
}
