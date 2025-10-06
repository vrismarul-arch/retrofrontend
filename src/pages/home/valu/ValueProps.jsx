import React from "react";
import "./ValueProps.css";
import {
  UsergroupAddOutlined,
  GlobalOutlined,
  DollarOutlined,
  LockOutlined,
  TagOutlined,
} from "@ant-design/icons";

export default function ValueProps() {
  const valuePropositions = [
    {
      id: 1,
      icon: UsergroupAddOutlined,
      text: "Trusted by Thousands",
    },
    {
      id: 2,
      icon: GlobalOutlined,
      text: "Global Services",
    },
    {
      id: 3,
      icon: DollarOutlined,
      text: "Affordable Second-Hand Deals",
    },
    {
      id: 4,
      icon: LockOutlined,
      text: "100% Secure Payment",
    }
  ];

  return (
    <div className="value-props-container">
      <div className="value-props-list">
        {valuePropositions.map((item) => (
          <div key={item.id} className="value-props-item">
            <div className="icon-wrapper">
              <item.icon className="ant-icon" />
            </div>
            <p className="item-text">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
