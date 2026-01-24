import React from "react";
import {
  InstagramOutlined,
  FacebookOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { Row, Col, Typography, Divider, Space } from "antd";
import RetrowoodsLogo from "/retrologo.png"; 
import "./Footer.css";

const { Title, Text, Link, Paragraph } = Typography;

const Footer = () => {
  return (
    <footer className="footer-modern">
      <div className="footer-container">
        <Row gutter={[48, 32]}>
          {/* Brand Identity */}
          <Col xs={24} lg={7}>
            <img src={RetrowoodsLogo} alt="Retrowoods Logo" className="footer-logo" />
            <Paragraph className="footer-tagline">
              Crafting comfort and restoring timeless beauty for your Indian home. Your journey to smart furnishing starts here.
            </Paragraph>
            <Space size="large" className="social-icons-row">
              <Link href="#" className="social-link"><InstagramOutlined /></Link>
              <Link href="#" className="social-link"><FacebookOutlined /></Link>
              {/* MailOutlined Removed here */}
            </Space>
          </Col>

          {/* Quick Links */}
          <Col xs={12} sm={6} lg={4}>
            <Title level={5} className="footer-title">Explore</Title>
            <Space direction="vertical" size={12} className="footer-links">
              <Link href="#">Blogs</Link>
              <Link href="#">About Us</Link>
              <Link href="#">Our Stores</Link>
              <Link href="#">Terms of Service</Link>
            </Space>
          </Col>

          {/* Policies */}
          <Col xs={12} sm={6} lg={5}>
            <Title level={5} className="footer-title">Policies</Title>
            <Space direction="vertical" size={12} className="footer-links">
              <Link href="#">FAQs</Link>
              <Link href="#">Shipping Policy</Link>
              <Link href="#">Returns & Refunds</Link>
              <Link href="#">Warranty Info</Link>
            </Space>
          </Col>

          {/* Contact Info */}
          <Col xs={24} sm={12} lg={8}>
            <Title level={5} className="footer-title">Reach Us</Title>
            <div className="contact-item">
              {/* Phone icon rotated 90 degrees */}
              <PhoneOutlined rotate={90} /> 
              <div className="contact-text">
                <Text className="label">Customer Care</Text>
                <Text className="value">+91 98435 52209</Text>
              </div>
            </div>
            <div className="contact-item">
              <EnvironmentOutlined />
              <div className="contact-text">
                <Text className="label">Registered Office</Text>
                <Text className="value">
                  2A, Plot no 15, Adambakkam, Chennai - 600088
                </Text>
              </div>
            </div>
          </Col>
        </Row>

        <Divider className="footer-divider-modern" />

        <div className="footer-bottom-bar">
          <Text className="copyright-text">
            © {new Date().getFullYear()} Retrowoods. All rights reserved. Built for Comfort.
          </Text>
          <div className="footer-legal">
            <Link href="#">Privacy Policy</Link>
            <Link href="#">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;