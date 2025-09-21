import React from "react";
import {
  InstagramOutlined,
  FacebookOutlined,
  TwitterOutlined,
  LinkedinOutlined,
  PinterestOutlined,
} from "@ant-design/icons";
import { Row, Col, Typography, Divider, Space, Button } from "antd";
import RetrowoodsLogo from "/retrologo.png"; // Replace with your logo path
import "./Footer.css";

const { Title, Text, Link, Paragraph } = Typography;

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <Row gutter={[32, 32]}>

          {/* Column 1: Logo & Links */}
          <Col xs={24} sm={12} md={6}>
            <img src={RetrowoodsLogo} alt="Retrowoods Logo" />
               <Space direction="vertical" size={8}>
              <Link href="#">Blogs</Link>
              <Link href="#">Terms Of Service</Link>
              <Link href="#">Privacy Policy</Link>
            </Space>
           
          </Col>

          {/* Column 2: Campaigns */}
         

          <Col xs={24} sm={12} md={6}>
            <Title level={4} className="footer-title">Policies</Title>
            <Space direction="vertical" size={8}>
              <Link href="#">FAQs</Link>
              <Link href="#">Shipping & Delivery</Link>
              <Link href="#">Payment, Returns & Refunds</Link>
              <Link href="#">Warranty</Link>
            </Space>

          </Col>
          {/* Column 3: Policies */}
          <Col xs={24} sm={12} md={6}>
              <Title level={4} className="footer-title">Help</Title>
            <Paragraph className="footer-help">Contact us at <Text strong className="text-white">+91 98435 52209</Text></Paragraph>
            <Paragraph className="footer-help">We are here to help you every day between 9:30 AM to 7:30 PM</Paragraph>
          </Col>

          {/* Column 4: Help */}
          <Col xs={24} sm={12} md={6} className="footer-help">
          
            <Paragraph className="footer-help"><Text strong>Registered Office</Text></Paragraph>
            <Paragraph className="footer-help">
              Retrowoods<br />
              2A, Plot no 15, Main Road, Next to Apollo Pharmacy, Ramapuram,<br />
              Telephone Colony, Ganesh Nagar, Adambakkam, Chennai, Tamil Nadu 600088
            </Paragraph>
          </Col>

        </Row>

        <Divider className="divider" />
      <div className="footer-bottom">
  <Text className="copyright">
    &copy; {new Date().getFullYear()} Retrowoods. All rights reserved.
  </Text>

  <Space size="middle" className="social-buttons">
    <Button shape="circle" icon={<InstagramOutlined />} aria-label="Instagram" />
    <Button shape="circle" icon={<FacebookOutlined />} aria-label="Facebook" />
   
  </Space>
</div>
      </div>
    </footer>
  );
};

export default Footer;
