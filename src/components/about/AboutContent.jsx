import React from "react";
import { Typography, Divider } from "antd";
import "./AboutContent.css";

const { Title, Paragraph } = Typography;

const AboutContent = () => {
  return (
    <div className="about-container">
      {/* Header Section */}
      <section className="about-header">
        <Title level={2}>Retrowoods – Comfort, Style, and Smart Furniture</Title>
        <Paragraph className="about-paragraph">
          At <strong>Retrowoods</strong>, we offer stylish, durable, and thoughtfully restored furniture for Indian homes.
          Every piece is selected to bring comfort, functionality, and personality to your space.
        </Paragraph>
      </section>

      <Divider className="about-divider" />

      {/* Furniture Section */}
      <section className="about-section">
        <Title level={3}>Smart Furniture Choices</Title>
        <Paragraph className="about-paragraph">
          From beds, wardrobes, sofas, and recliners to tables and storage units, our collection combines style and practicality for every room.
        </Paragraph>
      </section>

      <Divider className="about-divider" />

      {/* Store & Experience */}
      <section className="about-section">
        <Title level={3}>Visit Our Stores or Shop Online</Title>
        <Paragraph className="about-paragraph">
          Explore furniture in-store at <strong>Adambakkam, Chennai</strong> or shop online with secure payments, multiple options, and reliable delivery.
        </Paragraph>
        <Paragraph className="about-paragraph">
          Our customer care ensures smooth support from selection to doorstep delivery, making furnishing your home easy and enjoyable.
        </Paragraph>
      </section>

      <Divider className="about-divider" />

      {/* Why Retrowoods */}
      <section className="about-section">
        <Title level={3}>Why Choose Retrowoods</Title>
        <Paragraph className="about-paragraph">
          High-quality, restored furniture designed for Indian homes, backed by responsive support, reliable delivery, and affordable prices.
          Retrowoods is about style, durability, and sustainable living.
        </Paragraph>
      </section>
    </div>
  );
};

export default AboutContent;
