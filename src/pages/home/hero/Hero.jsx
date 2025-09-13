import React from "react";
import { Carousel } from "antd";
import "./Hero.css";
import facial from "./banner/banner.jpg";
import waxing from "./banner/waxing.jpg";
import Manicure from "./banner/Manicure.png";
import SareeDraping from "./banner/SareeDraping.png";
import { StarOutlined, TeamOutlined } from "@ant-design/icons";

const categories = [
  { name: "Salon for Women", icon: facial },
  { name: "Waxing Service", icon: waxing },
  { name: "Manicure", icon: Manicure },
  { name: "Saree Draping", icon: SareeDraping },
];

const Hero = () => {
  return (
    <section className="hero-container">
      <Carousel autoplay dots className="hero-carousel">
        {categories.map((cat, index) => (
          <div key={index} className="hero-slide">
            <img src={cat.icon} alt={cat.name} className="hero-image" />

            {/* Overlay content */}
            <div className="hero-overlay">
              

              <div className="hero-ratings">
                <div className="rating-item">
                  <StarOutlined className="rating-icon" />
                  <div className="rating-number">4.8</div>
                  <div className="rating-label">Service Rating*</div>
                </div>

                <div className="rating-item">
                  <TeamOutlined className="rating-icon" />
                  <div className="rating-number">12M+</div>
                  <div className="rating-label">Customers Globally*</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </section>
  );
};

export default Hero;
