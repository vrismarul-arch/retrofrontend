import React, { useState } from "react";
import { Button, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import VendorProduct from "../../vendor/VendorProduct"; // import your form
import "./IntroScreen.css";
import intro from "./retro.gif";

const IntroScreen = () => {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const goToHome = () => navigate("/home");

  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  const handleSubmitSuccess = () => {
    closeModal();     // close the modal
    navigate("/home"); // redirect to home
  };

  return (
    <div className="intro-container">
      {/* Left side - Text + Buttons */}
      <div className="intro-left">
        <h1 className="intro-title">Welcome to Retro Woods</h1>
        <p className="intro-subtitle">
          Discover your perfect stay with comfort and style.
        </p>
        <div className="intro-buttons">
          <Button type="primary" size="large" onClick={goToHome}>
            Buy Products
          </Button>
          <Button size="large" onClick={openModal}>
            Sell Products
          </Button>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="intro-right">
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
    </div>
  );
};

export default IntroScreen;
