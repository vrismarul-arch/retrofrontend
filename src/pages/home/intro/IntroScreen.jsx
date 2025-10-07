import React, { useState } from "react";
import { Button, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import VendorProduct from "../../vendor/VendorProduct";
import "./IntroScreen.css";
import intro from "./retro.png";

const IntroScreen = () => {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);

  // ✅ Get current year dynamically
  const currentYear = new Date().getFullYear();

  const goToHome = () => navigate("/home");
  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  const handleSubmitSuccess = () => {
    closeModal();
    navigate("/home");
  };

  return (
    <div className="intro-container">
      {/* Left side - Text + Buttons */}
      <div className="intro-left">
        <div className="intro-buttons">
          <Button type="primary" size="large" onClick={goToHome}>
            Buy Products
          </Button>
          <Button size="large" onClick={openModal}>
            Sell Products
          </Button>
        </div>
      </div>

      {/* Center Image */}
      <div className="intro-center">
        <img src={intro} alt="Intro" className="intro-image" />
      </div>

      {/* Vendor Product Modal */}
      <Modal
        title="Sell Your Product"
        open={isModalVisible}
        onCancel={closeModal}
        footer={null}
        width={700}
      >
        <VendorProduct onSuccess={handleSubmitSuccess} />
      </Modal>

      {/* ✅ Footer Section */}
      <footer className="intro-footer">
        © {currentYear} Retro Woods.
      </footer>
    </div>
  );
};

export default IntroScreen;
