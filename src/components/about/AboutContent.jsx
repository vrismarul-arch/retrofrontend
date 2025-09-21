import React from "react";
import { Typography, Divider } from "antd";
import "./AboutContent.css";

const { Title, Paragraph } = Typography;

const AboutContent = () => {
  return (
    <div className="about-container">
      {/* Header Section */}
      <section className="about-header">
        <Title level={2}>Retrowoods – Make the Most of Every Indian Home</Title>
        <Paragraph className="about-paragraph">
          At <strong>Retrowoods</strong>, we believe every home deserves comfort, style, and a touch of history.
          From carefully curated used furniture that adds character to your space, to smart storage solutions that bring families closer,
          every piece is selected with love, practicality, and everyday Indian life in mind.
        </Paragraph>
      </section>

      <Divider className="about-divider" />

      {/* Furniture Section */}
      <section className="about-section">
        <Title level={3}>Retrowoods Furniture – Smart Choices for Every Home</Title>
        <Paragraph className="about-paragraph">
          A beautiful home begins with the right pieces. That is why <strong>Retrowoods furniture</strong> is chosen with both style and functionality in mind.
          Whether you are looking for a classic wooden bed, a vintage wardrobe, or a comfy second-hand sofa, each item is inspected and restored to ensure durability and comfort.
        </Paragraph>
        <Paragraph className="about-paragraph">
          Our collection also includes side tables, coffee tables, chairs, and storage units — all thoughtfully selected to complement your home décor.
          More than just furniture, these pieces are essential for creating a space that is welcoming, functional, and full of personality.
        </Paragraph>
      </section>

      <Divider className="about-divider" />

      {/* Sofas Section */}
      <section className="about-section">
        <Title level={3}>Retrowoods Sofas – Style Meets Comfort</Title>
        <Paragraph className="about-paragraph">
          The sofa is the centerpiece of your living space. At <strong>Retrowoods</strong>, our sofas combine style, comfort, and reliability.
          From cozy 3-seater sofas ideal for smaller living rooms, to L-shaped sofas perfect for larger spaces, each item is carefully restored and upholstered to give you long-lasting comfort.
        </Paragraph>
        <Paragraph className="about-paragraph">
          Short on space? Explore our sofa cum bed options for flexible living solutions. For those who enjoy relaxation time, our recliners bring plush comfort and effortless movement.
        </Paragraph>
      </section>

      <Divider className="about-divider" />

      {/* Rooms Section */}
      <section className="about-section">
        <Title level={3}>Furniture for Every Room</Title>
        <Paragraph className="about-paragraph">
          Every room in your home has a purpose, and Retrowoods furniture is built to support them all.
          Looking for a dedicated workspace? Our study tables provide compact and practical solutions.
          Need smarter storage? Explore our range of restored wardrobes and cabinets that offer space-efficient organization with a touch of vintage charm.
        </Paragraph>
        <Paragraph className="about-paragraph">
          Pair our coffee tables with TV units to create balance in your living area, or add a wooden bed frame to complete your bedroom.
          Each piece is carefully chosen for durability, style, and everyday use, making it perfect for Indian homes.
        </Paragraph>
      </section>

      <Divider className="about-divider" />

      {/* Visit Store Section */}
      <section className="about-section">
        <Title level={3}>Visit a Retrowoods Store Near You</Title>
        <Paragraph className="about-paragraph">
          It feels different when you walk into a <strong>Retrowoods store</strong>. You can see, touch, and test each piece of furniture, from sofas to wardrobes, and discover what truly fits your home and lifestyle.
        </Paragraph>
        <Paragraph className="about-paragraph">
          Our store is conveniently located at <strong>Plot #15, Telephone Colony Main Road, Adambakkam, Chennai — just 100 meters from Adambakkam Bus Depot</strong>.
          Whether you’re looking for a specific item or exploring complete room setups, our store brings your vision to life.
        </Paragraph>
      </section>

      <Divider className="about-divider" />

      {/* Secure Payments Section */}
      <section className="about-section">
        <Title level={3}>Secure Payments – Shop with Confidence</Title>
        <Paragraph className="about-paragraph">
          At <strong>Retrowoods</strong>, your safety is our priority. All online transactions are protected with the latest encryption technology,
          ensuring that your payment details remain confidential and secure.
        </Paragraph>
        <Paragraph className="about-paragraph">
          We accept multiple payment options including UPI, credit/debit cards, and net banking, making it convenient and safe to shop for your favorite furniture from the comfort of your home.
        </Paragraph>
      </section>

      <Divider className="about-divider" />

      {/* Experience Section */}
      <section className="about-section">
        <Title level={3}>Retrowoods Experience – From Cart to Comfort</Title>
        <Paragraph className="about-paragraph">
          From browsing our online store to delivery at your doorstep, <strong>Retrowoods</strong> ensures a smooth and reliable experience.
          Our customer care team is ready to assist with selecting the right furniture, checking availability, or tracking your order.
        </Paragraph>
        <Paragraph className="about-paragraph">
          Expect careful handling, timely delivery, and clear communication. Comfort begins with the way we serve you, long before you sit or rest on your furniture.
        </Paragraph>
      </section>

      <Divider className="about-divider" />

      {/* Why Retrowoods Section */}
      <section className="about-section">
        <Title level={3}>Why Retrowoods is the Choice for Smart, Sustainable Homes</Title>
        <Paragraph className="about-paragraph">
          Retrowoods stands out for offering high-quality, restored furniture that fits Indian homes and lifestyles. Each piece is selected, inspected, and improved to meet real-life needs.
        </Paragraph>
        <Paragraph className="about-paragraph">
          With responsive customer support, reliable delivery, and affordable prices, we make furnishing your home easy, sustainable, and stylish.
          Retrowoods is not just about furniture that looks good — it’s about pieces that work, last, and bring warmth and charm to your home every day.
        </Paragraph>
      </section>
    </div>
  );
};

export default AboutContent;
