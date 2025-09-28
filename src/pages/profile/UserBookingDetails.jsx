// src/pages/profile/UserBookingDetails.jsx
import React, { useEffect, useState } from "react";
import {
  Card,
  Tag,
  Spin,
  message,
  Button,
  Divider,
  Typography,
  Avatar,
  Steps,
  Row,
  Col,
  Space,
  Modal,
  Input,
} from "antd";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeftOutlined,
  FilePdfOutlined,
  StopOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import api from "../../../api";
import "./UserBookingDetails.css";

const { Title, Text } = Typography;
const { Step } = Steps;

const cancelOptions = [
  "Change of plans",
  "Ordered by mistake",
  "Found a better price",
  "Delayed delivery",
  "Product not needed",
  "Other",
];

export default function UserBookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  const [cancelModal, setCancelModal] = useState(false);
  const [cancelSuccessModal, setCancelSuccessModal] = useState(false);
  const [selectedReasons, setSelectedReasons] = useState([]);
  const [customReason, setCustomReason] = useState("");
  const [loadingCancel, setLoadingCancel] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const res = await api.get("/api/bookings/my", { headers });
        const single = res.data.find((b) => b._id === id);

        if (!single) {
          message.error("Booking not found");
          setBooking(null);
          return;
        }
        setBooking(single);
      } catch (err) {
        console.error(err);
        message.error("Failed to fetch booking");
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  if (loading) {
    return <Spin size="large" style={{ display: "block", margin: "2rem auto" }} />;
  }

  if (!booking) return <p>Booking not found</p>;

  const statusSteps = ["pending", "confirmed", "in-progress", "completed"];
  let stepKey = "pending";
  if (booking.status === "confirmed") stepKey = "confirmed";
  else if (booking.deliveryStatus === "out-for-delivery" || booking.status === "picked")
    stepKey = "in-progress";
  else if (booking.status === "completed" || booking.deliveryStatus === "delivered")
    stepKey = "completed";

  const currentStep = statusSteps.indexOf(stepKey);

  // ==========================
  // Cancel Booking
  // ==========================
  const handleCancelBooking = async () => {
    if (selectedReasons.length === 0) {
      message.warning("Please select at least one reason");
      return;
    }

    let reasonText = selectedReasons.join(", ");
    if (selectedReasons.includes("Other")) {
      if (!customReason.trim()) {
        message.warning("Please enter a custom reason");
        return;
      }
      reasonText = reasonText.replace("Other", customReason.trim());
    }

    try {
      setLoadingCancel(true);
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      await api.put(`/api/bookings/${booking._id}/cancel`, { reason: reasonText }, { headers });

      setCancelModal(false);
      setCancelSuccessModal(true);
      setBooking({
        ...booking,
        status: "cancelled",
        deliveryStatus: "cancelled",
        cancelReason: reasonText,
      });
      setSelectedReasons([]);
      setCustomReason("");
    } catch (err) {
      console.error(err);
      message.error(err.response?.data?.error || "Failed to cancel booking");
    } finally {
      setLoadingCancel(false);
    }
  };

  return (
    <div className="booking-details-wrapper">
      {/* Back Button */}
      <Button
        type="link"
        icon={<ArrowLeftOutlined />}
        className="back-btn"
        onClick={() => navigate(-1)}
      >
        Back to My Bookings
      </Button>

      {/* Hero Section */}
      <Card className="hero-card" bordered>
        <Row justify="space-between" align="middle">
          <Col>
            <Space direction="vertical" size={0}>
              <Title level={4}>Booking #{booking.bookingId || booking._id}</Title>
              <Tag
                className="status-tag"
                color={
                  booking.status === "completed" || booking.deliveryStatus === "delivered"
                    ? "green"
                    : booking.status === "cancelled"
                    ? "red"
                    : booking.status === "confirmed"
                    ? "blue"
                    : "gold"
                }
              >
                {(booking.deliveryStatus || booking.status || "pending").toUpperCase()}
              </Tag>
              {booking.status === "cancelled" && booking.cancelReason && (
                <Text type="secondary">Reason: {booking.cancelReason}</Text>
              )}
            </Space>
          </Col>
          <Col>
            <Space direction="vertical" align="end" size={2}>
              <Text className="total-price">₹{booking.totalAmount}</Text>
              <Text type="secondary">{booking.paymentMethod || "—"}</Text>
              <Space>
                <Button type="default" icon={<FilePdfOutlined />}>
                  Invoice
                </Button>
                {booking.status !== "cancelled" && booking.status !== "completed" && (
                  <Button danger icon={<StopOutlined />} onClick={() => setCancelModal(true)}>
                    Cancel
                  </Button>
                )}
              </Space>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Cancel Modal */}
      <Modal
        title="Cancel Booking"
        open={cancelModal}
        onCancel={() => setCancelModal(false)}
        footer={null}
        centered
        bodyStyle={{ padding: 24 }}
      >
        <Text>Please select reason(s) for cancellation:</Text>
        <div className="cancel-options-wrapper" style={{ marginTop: 16 }}>
          {cancelOptions.map((reason) => (
            <Button
              key={reason}
              type={selectedReasons.includes(reason) ? "primary" : "default"}
              onClick={() => {
                if (selectedReasons.includes(reason)) {
                  setSelectedReasons(selectedReasons.filter((r) => r !== reason));
                } else {
                  setSelectedReasons([...selectedReasons, reason]);
                }
              }}
              style={{
                margin: 4,
                minWidth: 140,
                textAlign: "center",
                display: "inline-block",
              }}
            >
              {reason}
            </Button>
          ))}
        </div>

        {selectedReasons.includes("Other") && (
          <Input.TextArea
            rows={3}
            placeholder="Enter your custom reason..."
            value={customReason}
            onChange={(e) => setCustomReason(e.target.value)}
            style={{ marginTop: 16 }}
          />
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: 24,
            gap: 8,
          }}
        >
          <Button onClick={() => setCancelModal(false)}>Close</Button>
          <Button
            type="primary"
            danger
            loading={loadingCancel}
            onClick={handleCancelBooking}
          >
            Submit Cancellation
          </Button>
        </div>
      </Modal>

      {/* Success Modal */}
      <Modal
        title="Cancellation Successful"
        open={cancelSuccessModal}
        onOk={() => setCancelSuccessModal(false)}
        cancelButtonProps={{ style: { display: "none" } }}
        centered
        bodyStyle={{ textAlign: "center", padding: 32 }}
      >
        <StopOutlined style={{ fontSize: 48, color: "#f5222d", marginBottom: 16 }} />
        <Title level={4}>Your booking has been cancelled</Title>
        <Text>Your cancellation has been received successfully.</Text>
        <br />
        <Text>Our team will contact you soon.</Text>
        <br />
        <Text>Your payment will be refunded within 7 days.</Text>
        <div style={{ marginTop: 24 }}>
          <Button type="primary" onClick={() => setCancelSuccessModal(false)}>
            OK
          </Button>
        </div>
      </Modal>

      {/* Order Progress */}
      <Card className="progress-card" bordered>
        <Steps size="small" current={currentStep >= 0 ? currentStep : 0} responsive>
          <Step title="Pending" />
          <Step title="Confirmed" />
          <Step title="In Progress" />
          <Step title="Completed" />
        </Steps>
      </Card>

      {/* Main Content */}
      <Row gutter={[16, 16]} className="content-row">
        {/* Products */}
        <Col xs={24} lg={16}>
          <Card className="section-card" bordered>
            <Divider orientation="left">Products</Divider>
            <div className="services-list">
              {booking.products?.length > 0 ? (
                booking.products.map((p) => {
                  const product = p.productId || {};
                  const img = product.image || product.images?.[0] || "";
                  const name = product.name || "Product";
                  const price = product.price || 0;
                  const qty = p.quantity || 1;

                  return (
                    <Card key={p._id} className="service-card" size="small" bordered>
                      <Row gutter={12} align="middle">
                        <Col>
                          <Avatar
                            shape="square"
                            size={80}
                            src={img}
                            icon={!img && <ShoppingOutlined />}
                          />
                        </Col>
                        <Col flex="auto">
                          <Space direction="vertical" size={0}>
                            <Text strong>{name}</Text>
                            <Tag color="blue">Product</Tag>
                            <Text type="secondary">Qty: {qty}</Text>
                            <Text>₹{price}</Text>
                          </Space>
                        </Col>
                      </Row>
                    </Card>
                  );
                })
              ) : (
                <Text type="secondary">No products found</Text>
              )}
            </div>
          </Card>
        </Col>

        {/* Customer Info & Partner */}
        <Col xs={24} lg={8}>
          <Card className="section-card" bordered>
            <Divider orientation="left">Customer Info</Divider>
            <Space direction="vertical" size={4}>
              <Text strong>{booking.user?.name || booking.name}</Text>
              <Text>{booking.user?.email || booking.email}</Text>
              <Text>{booking.user?.phone || booking.phone}</Text>
              <Text>{booking.address || "-"}</Text>
            </Space>
          </Card>

          {booking.assignedTo && (
            <Card className="section-card" bordered>
              <Divider orientation="left">Assigned Partner</Divider>
              <Space direction="vertical" size={4}>
                <Text strong>{booking.assignedTo.name}</Text>
                <Text>{booking.assignedTo.email}</Text>
                <Text>{booking.assignedTo.phone}</Text>
              </Space>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
}
