import React from "react";
import { Typography, Divider, Collapse, Row, Col, Card } from "antd";
import { 
  ShopOutlined, 
  SafetyCertificateOutlined, 
  ThunderboltOutlined, 
  CustomerServiceOutlined 
} from "@ant-design/icons";
import "./AboutContent.css";

const { Title, Paragraph } = Typography;
const { Panel } = Collapse;

// ... (imports remain the same)

const AboutContent = () => {
  return (
    <div className="about-page-bg"> {/* Page background padding sethuruken */}
      <div className="main-card-wrapper"> {/* Ithu thaan unga puthiya container box */}
        
        {/* Hero Header Section */}
        <section className="about-header">
          <Title level={1} className="main-title">Retrowoods</Title>
          <Title level={3} className="sub-title">Comfort, Style, and Smart Furniture</Title>
          <Paragraph className="about-paragraph-hero">
            At <strong>Retrowoods</strong>, we offer stylish, durable, and thoughtfully restored furniture for Indian homes.
            Every piece is selected to bring comfort, functionality, and personality to your space.
          </Paragraph>
        </section>

        {/* Why Choose Us Section */}
        <section className="features-section">
          <Title level={3} className="features-title">Why Choose Retrowoods?</Title>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12} lg={6}>
              <Card hoverable className="feature-card">
                <SafetyCertificateOutlined className="feature-icon" />
                <h4>High Quality</h4>
                <p>Restored furniture designed for durability and sustainable living.</p>
              </Card>
            </Col>
            <Col xs={24} md={12} lg={6}>
              <Card hoverable className="feature-card">
                <ThunderboltOutlined className="feature-icon" />
                <h4>Smart Choices</h4>
                <p>Style meets practicality in every room, from beds to recliners.</p>
              </Card>
            </Col>
            <Col xs={24} md={12} lg={6}>
              <Card hoverable className="feature-card">
                <ShopOutlined className="feature-icon" />
                <h4>Visit or Online</h4>
                <p>Shop at Adambakkam, Chennai or from the comfort of your home.</p>
              </Card>
            </Col>
            <Col xs={24} md={12} lg={6}>
              <Card hoverable className="feature-card">
                <CustomerServiceOutlined className="feature-icon" />
                <h4>Reliable Support</h4>
                <p>Smooth support from selection to doorstep delivery.</p>
              </Card>
            </Col>
          </Row>
        </section>
      </div>
    </div>
  );
};

export default AboutContent;