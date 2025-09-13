import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./AdsBanner.css";
import api from "../../../../api";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Lucide icons

// Custom Arrow Components
const PrevArrow = ({ className, style, onClick }) => (
  <button
    className={`custom-arrow prev ${className}`}
    style={{ ...style }}
    onClick={onClick}
  >
    <ChevronLeft size={28} />
  </button>
);

const NextArrow = ({ className, style, onClick }) => (
  <button
    className={`custom-arrow next ${className}`}
    style={{ ...style }}
    onClick={onClick}
  >
    <ChevronRight size={28} />
  </button>
);

export default function AdsBanner() {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const res = await api.get("/api/admin/banners");
      const now = new Date();
      const activeBanners = res.data.filter((b) => {
        if (!b.isActive) return false;
        if (b.schedule?.startDate && new Date(b.schedule.startDate) > now)
          return false;
        if (b.schedule?.endDate && new Date(b.schedule.endDate) < now)
          return false;
        return true;
      });
      setBanners(activeBanners);
    } catch (err) {
      console.error("Error fetching banners", err);
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 700,
    autoplay: true,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    appendDots: (dots) => (
      <ul
        style={{
          margin: 0,
          position: "absolute",
          bottom: "20px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          zIndex: 3,
        }}
      >
        {dots}
      </ul>
    ),
  };

  return (
    <div className="ads-banner-container">
      <Slider {...settings} className="ads-slick-slider">
        {banners.map((banner, i) => (
          <div key={i} className="ads-slide">
            <div
              className="ads-slide-bg"
              style={{
                backgroundImage: `url(${banner.imageUrl || "/placeholder.png"})`,
              }}
            >
              <div className="ads-overlay" />
              {/* <div className="ads-slide-content">
                {banner.subtitle && (
                  <p className="ads-subtitle">{banner.subtitle}</p>
                )}
                <h2 className="ads-title">{banner.title}</h2>
                {banner.btnText && (
                  <a href={banner.btnLink || "#"} className="ads-btn">
                    {banner.btnText}
                  </a>
                )}
              </div> */}
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
