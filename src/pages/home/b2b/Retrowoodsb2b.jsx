import React, { useState } from "react";
import { Row, Col, Typography, Button, Card, Modal } from "antd";
import b2b from "./b2b.svg"; 
import "./Retrowoodsb2b.css";
import VendorProduct from "../../vendor/VendorProduct"; // adjust path as per your folder

const { Title, Text } = Typography;

const Retrowoodsb2b = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="b2b-wrapper">
      <Card className="b2b-card">
        <Row gutter={[32, 32]} align="middle" justify="center">
          {/* Left Section */}
          <Col xs={24} md={12} className="b2b-left">
            <Text className="b2b-subtitle">
              Vendors . Enterprises . Shops . Individuals
            </Text>
            <Title level={2} className="b2b-title">
              Partner With Us
            </Title>
            <Text className="b2b-description">
              Sell your second-hand products directly on our platform.  
              Get bulk deals, better visibility, and collaborative growth.
            </Text>
            <Button
              type="primary"
              size="large"
              className="b2b-button"
              onClick={() => setOpen(true)}
            >
              List Your Product
            </Button>
          </Col>

          {/* Right Section (Image) */}
          <Col xs={24} md={12} className="b2b-image-col">
            <img src={b2b} alt="Vendor Collaboration" className="b2b-image" />
          </Col>
        </Row>
      </Card>

      {/* Modal with VendorProduct Form */}
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={550}   // 👈 keeps modal width nice and compact
        destroyOnClose
      >
        <VendorProduct />
      </Modal>
    </div>
  );
};

export default Retrowoodsb2b;
