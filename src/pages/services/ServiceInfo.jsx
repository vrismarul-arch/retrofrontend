  import React from "react";
  import "./ServiceInfo.css";
  import { FaShippingFast, FaTools, FaShieldAlt, FaRedoAlt } from "react-icons/fa";

  export default function ServiceInfo() {
    const services = [
      {
        icon: <FaShippingFast size={36} color="#008b8b" />,
        title: "Free Shipping",
      },
      {
        icon: <FaTools size={36} color="#008b8b" />,
        title: "Installation",
      },
      {
        icon: <FaShieldAlt size={36} color="#008b8b" />,
        title: "Secure Payment",
      },
      {
        icon: <FaRedoAlt size={36} color="#008b8b" />,
        title: "5-day Replacement",
      },
    ];

    return (
      <div className="service-info-container">
        {services.map((s, i) => (
          <div className="service-info-card" key={i}>
            <div className="icon-box">{s.icon}</div>
            <h4>{s.title}</h4>
          </div>
        ))}
      </div>
    );
  }
