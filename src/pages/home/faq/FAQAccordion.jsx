import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react'; // Icons sethuruken
import './FAQAccordion.css';

const faqData = [
  { id: 1, question: "Why can't I sign in?", answer: "Check your email and password. If you forgot your password, use the 'Forgot Password' link to reset it via your registered email." },
  { id: 2, question: "How do I get a reference?", answer: "Once your order is completed, you can find the order reference number in your account dashboard under 'My Orders'." },
  { id: 3, question: "How do I apply?", answer: "Browse our categories, add items to your cart, and proceed to checkout. Fill in your delivery details and complete the payment." },
  { id: 4, question: "What are entry requirements?", answer: "For wholesale accounts, we require a valid GST number and shop registration details. Personal accounts only need a phone number." },
];

const FAQAccordion = () => {
  const [openId, setOpenId] = useState(null);

  const toggleQuestion = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="faq-section">
      <div className="faq-headings">
        <div className="faq-badge"><HelpCircle size={16} /> FAQ Support</div>
        <h2 className="faq-title">Frequently Asked Questions</h2>
        <div className="faq-title-underline"></div>
        <p className="faq-subtitle">Everything you need to know about our service.</p>
      </div>
      
      <div className="faq-container">
        {faqData.map((item) => {
          const isOpen = item.id === openId;
          
          return (
            <div className={`faq-item ${isOpen ? 'active' : ''}`} key={item.id}>
              <button
                className="faq-question-btn"
                onClick={() => toggleQuestion(item.id)}
                aria-expanded={isOpen}
              >
                <span className="q-text">{item.question}</span>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className={`faq-icon ${isOpen ? 'icon-active' : ''}`} />
                </motion.div>
              </button>
              
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="faq-answer-wrapper"
                  >
                    <div className="faq-answer-content">
                      <p>{item.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FAQAccordion;