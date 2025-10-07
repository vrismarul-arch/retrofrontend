import React, { useState } from 'react';
import './FAQAccordion.css'; // Import the new CSS file

// Array of FAQ data
const faqData = [
  {
    id: 1,
    question: "why can't I sign in?",
    answer: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quis, consectetur tempore fugit quaerat, reprehenderit voluptatem laborum dolor error architecto nulla nihil quam culpa exercitationem earum."
  },
  {
    id: 2,
    question: "how do I get a reference?",
    answer: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Perspiciatis nobis reprehenderit, pariatur incidunt, a vero quis eius corrupti, unde aliquid saepe! Eaque?"
  },
  {
    id: 3,
    question: "how do I apply?",
    answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor at alias dolorum, quaerat corporis exercitationem? Placeat sed quas iure assumenda!"
  },
  {
    id: 4,
    question: "what are entry requirements?",
    answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae ut nemo eum modi explicabo ea non, rerum beatae, perspiciatis necessitatibus quasi ratione similique. Quod architecto impedit odio inventore eum. Error, quidem necessitatibus mollitia rerum quis repellat aspernatur culpa magnam veniam!"
  },
];

const FAQAccordion = () => {
  // State to track which item is open. Using a single ID for accordion mode.
  // Set to null to start with all closed.
  const [openId, setOpenId] = useState(null);

  const toggleQuestion = (id) => {
    // If the clicked item is already open, close it (set to null).
    // Otherwise, open the clicked item (set to the new id).
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="faq">
      {/* Google Fonts and Font Awesome are usually linked in public/index.html or the main entry file,
          but I've kept the styles based on your request. */}
      {/* The links below are for demonstration; you typically don't put <link> tags in a React component's return */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
      <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500&display=swap" rel="stylesheet" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" integrity="sha512-Fo3rlrZj/k7ujTnHg4CGR2D7kSs0v4LLanw2qksYuRlEzO+tcaEPQogQ0KaoGN26/zrn20ImR1DfuLWnOo7aBA==" crossOrigin="anonymous" referrerPolicy="no-referrer" />

      <div className="headings">
        <h2 className="section-heading">frequently asked questions</h2>
        <p className="sub-heading">
          Here are some of our FAQs. If you have any other questions you’d like answered please feel free to email us.
        </p>
      </div>
      
      <div className="que-container">
        {faqData.map((item) => {
          const isOpen = item.id === openId;
          
          return (
            <div className="question" key={item.id}>
              <button
                // Use className based on state
                className={isOpen ? "show" : ""}
                onClick={() => toggleQuestion(item.id)}
              >
                <span>{item.question}</span>
                {/* Font Awesome icon */}
                <i className="fas fa-chevron-down"></i>
              </button>
              
              {/* The answer paragraph is conditionally rendered and styled */}
              <p style={{ height: isOpen ? 'auto' : 0, paddingBottom: isOpen ? '25px' : 0 }}>
                {item.answer}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FAQAccordion;