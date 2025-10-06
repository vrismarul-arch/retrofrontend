import React, { useRef } from "react";
import Slider from "react-slick";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./TestimonialCarousel.css";

const cards = [
  {
    image: "https://images.unsplash.com/photo-1616627986345-6a9b5f79b0f8?auto=format&fit=crop&w=900&q=80",
    title: "Leather Recliner",
    text: "Beautiful leather recliner. Perfectly wide and easy to set up. Probably the best on the market!",
    name: "Arjun",
  },
  {
    image: "https://images.unsplash.com/photo-1616627892462-8c6bcd8b3d0c?auto=format&fit=crop&w=900&q=80",
    title: "Office Desk",
    text: "Purchased an office desk for my home setup. Great quality and smooth delivery experience!",
    name: "Rajkiran",
  },
  {
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
    title: "Recliner Chair",
    text: "Very comfortable & spacious recliner! Worth the money. Delivery was fast and hassle-free.",
    name: "Madhusudan",
  },
  {
    image: "https://images.unsplash.com/photo-1616627563046-3fdf168ab8b1?auto=format&fit=crop&w=900&q=80",
    title: "Sofa Set",
    text: "We saw this in the showroom and knew it was perfect for our home. Soft and cozy finish!",
    name: "Vinay",
  },
  {
    image: "https://images.unsplash.com/photo-1616627893561-b0cb8b6e3cb8?auto=format&fit=crop&w=900&q=80",
    title: "Dining Table",
    text: "Elegant design and solid wood quality. Fits beautifully in our dining area.",
    name: "Ravi",
  },
];

const TestimonialCarousel = () => {
  const sliderRef = useRef(null);

  const settings = {
    dots: false,
    infinite: true,
    speed: 700,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    pauseOnHover: true,
    arrows: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section className="card-slider-section">
      <div className="card-slider-container">
        <div className="slider-header">
          <h2 className="slider-heading">What Our Customers Say</h2>
          <div className="slider-controls">
            <button
              className="arrow-btn left"
              onClick={() => sliderRef.current.slickPrev()}
            >
              <ChevronLeft size={28} />
            </button>
            <button
              className="arrow-btn right"
              onClick={() => sliderRef.current.slickNext()}
            >
              <ChevronRight size={28} />
            </button>
          </div>
        </div>

        <Slider ref={sliderRef} {...settings}>
          {cards.map((card, index) => (
            <div className="slide-item" key={index}>
              <div className="card">
                <div className="card-img">
                  <img src={card.image} alt={card.title} />
                </div>
                <div className="card-body">
                  <h3 className="card-title">{card.title}</h3>
                  <p className="card-text">{card.text}</p>
                  <div className="card-footer">
                    <div className="stars">⭐⭐⭐⭐⭐</div>
                    <p className="card-name">{card.name}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default TestimonialCarousel;
