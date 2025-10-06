import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./TestimonialCarousel.css";

const cards = [
  {
    image: "https://images.unsplash.com/photo-1598300059231-0e06dcfa8d7f?auto=format&fit=crop&w=900&q=80",
    title: "Leather Recliner",
    text: "Beautiful leather recliner. Perfectly wide and easy to set up. Probably the best on the market!",
    name: "Arjun",
  },
  {
    image: "https://images.unsplash.com/photo-1588854337112-269f2a2fdd6c?auto=format&fit=crop&w=900&q=80",
    title: "Office Desk",
    text: "Purchased an office desk for my home setup. Great quality and smooth delivery experience!",
    name: "Rajkiran",
  },
  {
    image: "https://images.unsplash.com/photo-1616627892439-3db41d6c8c4e?auto=format&fit=crop&w=900&q=80",
    title: "Recliner Chair",
    text: "Very comfortable & spacious recliner! Worth the money. Delivery was fast and hassle-free.",
    name: "Madhusudan",
  },
  {
    image: "https://images.unsplash.com/photo-1616627893578-6c5eb5c6e6f8?auto=format&fit=crop&w=900&q=80",
    title: "Sofa Set",
    text: "We saw this in the showroom and knew it was perfect for our home. Soft and cozy finish!",
    name: "Vinay",
  },
  {
    image: "https://images.unsplash.com/photo-1616627893621-2fc8e8f7b1d0?auto=format&fit=crop&w=900&q=80",
    title: "Dining Table",
    text: "Elegant design and solid wood quality. Fits beautifully in our dining area.",
    name: "Ravi",
  },
];

const TestimonialCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(4);
  const timeoutRef = useRef(null);

  const total = cards.length;

  const updateCardsToShow = () => {
    const width = window.innerWidth;
    if (width < 640) setCardsToShow(1);
    else if (width < 1024) setCardsToShow(2);
    else setCardsToShow(4);
  };

  useEffect(() => {
    updateCardsToShow();
    window.addEventListener("resize", updateCardsToShow);
    return () => window.removeEventListener("resize", updateCardsToShow);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev + 1 >= total ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev - 1 < 0 ? total - 1 : prev - 1
    );
  };

  useEffect(() => {
    timeoutRef.current = setTimeout(nextSlide, 3000);
    return () => clearTimeout(timeoutRef.current);
  }, [currentIndex]);

  const slideWidth = 100 / cardsToShow;

  return (
    <section className="card-slider-section">
      <div className="card-slider-container">
        <div className="slider-header">
          <h2 className="slider-heading">What Our Customers Say</h2>
          <div className="slider-controls">
            <button className="arrow-btn left" onClick={prevSlide}>
              <ChevronLeft size={28} />
            </button>
            <button className="arrow-btn right" onClick={nextSlide}>
              <ChevronRight size={28} />
            </button>
          </div>
        </div>

        <div className="slider-track" style={{ transform: `translateX(-${currentIndex * slideWidth}%)` }}>
          {cards.map((card, index) => (
            <div key={index} className="slide-item" style={{ minWidth: `${slideWidth}%` }}>
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
        </div>
      </div>
    </section>
  );
};

export default TestimonialCarousel;
