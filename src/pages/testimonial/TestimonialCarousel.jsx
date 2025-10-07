import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { motion } from "framer-motion";
import "./TestimonialCarousel.css";

import review1 from "./Padmaraj-Mahadevan.png";
import review2 from "./subashri-venkatesan.png";
import review3 from "./saraswathi-hema.png";
import review4 from "./Carolin-Sangeetha.png";
import review5 from "./bharathi.png";
import review6 from "./Santhosh.png";

const cards = [
  {
    image: review1,
    title: "Padmaraj Mahadevan",
    text: "Bought a bookshelf from Retrowood Adambakkam. Cheyizhan was helpful, and it was a good experience overall—nice pieces to choose from, delivered to our house on time. Found it to be good value for money.",
  },
  {
    image: review2,
    title: "Subashri Venkatesan",
    text: "We bought a two-seater wooden sofa in good condition at a reasonable price. Polishing was done quickly and delivery was on time. Very happy with the purchase!",
  },
  {
    image: review3,
    title: "Saraswathi Hema",
    text: "Worth buying! Extremely satisfied with the recent sofa purchase – great quality and price. Thanks to Retrowoods!",
  },
  {
    image: review4,
    title: "Carolin Sangeetha",
    text: "The quality of the furniture is top-notch. I'm extremely happy with my purchase and service!",
  },
  {
    image: review5,
    title: "Bharathi Bharathi",
    text: "Thank you for delivering that amazing sofa! Great quality and unbeatable price. Excellent service!",
  },
  {
    image: review6,
    title: "Santhosh Balaji",
    text: "Good and transparent service. Transport arranged within hours. Smooth and trustworthy experience overall!",
  },
];

export default function TestimonialCarousel() {
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
    const maxIndex = total - cardsToShow;
    setCurrentIndex((prev) => (prev + 1 > maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    const maxIndex = total - cardsToShow;
    setCurrentIndex((prev) => (prev - 1 < 0 ? maxIndex : prev - 1));
  };

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(nextSlide, 4000);
    return () => clearTimeout(timeoutRef.current);
  }, [currentIndex, cardsToShow]);

  const slideWidth = 100 / cardsToShow;
  const trackWidth = (total / cardsToShow) * 100;
  const translationValue = currentIndex * slideWidth;

  return (
    <section className="testimonial-section">
      <div className="testimonial-container">
        <div className="testimonial-header">
          <h2 className="testimonial-title">What Our Customers Say</h2>
          <div className="testimonial-controls">
            <button onClick={prevSlide} className="arrow-btn left" aria-label="Previous">
              <ChevronLeft size={24} />
            </button>
            <button onClick={nextSlide} className="arrow-btn right" aria-label="Next">
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        <motion.div
          className="testimonial-track"
          animate={{ x: `-${translationValue}%` }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          style={{ width: `${trackWidth}%` }}
        >
          {cards.map((card, index) => (
            <motion.div
              key={index}
              className="testimonial-item"
              style={{ minWidth: `${slideWidth}%` }}
              whileHover={{ scale: 1.04 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <div className="testimonial-card">
                <div className="testimonial-avatar">
                  <img src={card.image} alt={card.title} />
                </div>
                <div className="testimonial-content">
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                  <div className="testimonial-stars">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="#f5a623" stroke="#f5a623" />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
