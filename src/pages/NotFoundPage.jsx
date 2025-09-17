import React, { useEffect } from "react";
import { Button, Typography } from "antd";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

export default function NotFoundPage() {
  const navigate = useNavigate();

  // Determine redirect path
  const handleRedirect = () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role"); // assuming you save role in localStorage
    if (token && role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        textAlign: "center",
      }}
    >
      <div
        style={{
          maxWidth: 400,
          padding: 30,
          borderRadius: 12,
        }}
      >
        <img
          src="/notfound.svg"
          alt="404 Not Found"
          style={{ width: "100%", marginBottom: 24 }}
        />

        <Title level={3} style={{ marginBottom: 16 }}>
          Page Not Found
        </Title>
        <Text type="secondary" style={{ marginBottom: 24 }}>
          Sorry, the page you are looking for does not exist.
        </Text>

        <Button
          type="primary"
          size="large"
          onClick={handleRedirect}
          style={{ width: "100%" }}
        >
          Go to Home
        </Button>
      </div>
    </div>
  );
}
