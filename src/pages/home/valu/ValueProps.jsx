import React from "react";
import "./ValueProps.css";

import user from "./people.png";
import customer from "./customer.png";
import payment from "./payment.png";
import furniture from "./furniture.png";

export default function ValueProps() {
  const valuePropositions = [
    { id: 1, icon: user, text: "5k Customers" },
    { id: 2, icon: customer, text: "24/7 Support" },
    { id: 3, icon: payment, text: "100% Secure Payment" },
    { id: 4, icon: furniture, text: "Quality Furniture" },
  ];

  return (
    <div className="value-props-container">
      <div className="value-props-list">
        {valuePropositions.map((item) => (
          <div key={item.id} className="value-props-item">
            <div className="icon-wrapper">
              <img src={item.icon} alt={item.text} className="icon-img" />
            </div>
            <p className="item-text">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
