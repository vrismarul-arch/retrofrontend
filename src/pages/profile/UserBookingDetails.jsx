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
  Popconfirm,
} from "antd";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeftOutlined,
  FilePdfOutlined,
  StopOutlined,
  UserOutlined,
} from "@ant-design/icons";
import api from "../../../api";
import "./UserBookingDetails.css";

const { Title, Text } = Typography;

export default function UserBookingDetails() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch booking details
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
        message.error("Failed to fetch booking details");
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

  // Normalize status
  const normalizeStatus = (status, delivery) => {
    const s = (status || "").toLowerCase();
    const d = (delivery || "").toLowerCase();

    if (s === "cancelled") return "cancelled";
    if (s === "completed" || d === "delivered" || s === "delociis" || d === "delociis")
      return "completed";
    if (s === "picked" || s === "in-progress" || d === "out-for-delivery")
      return "in-progress";
    if (s === "confirmed") return "confirmed";
    return "pending";
  };

  const statusSteps = ["pending", "confirmed", "in-progress", "completed"];
  const stepKey = normalizeStatus(booking.status, booking.deliveryStatus);
  const currentStep = statusSteps.indexOf(stepKey);

  // Download invoice
  const handleDownloadInvoice = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get(`/api/bookings/${id}/invoice`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      message.success("Invoice downloaded successfully!");
    } catch (err) {
      console.error(err);
      message.error("Failed to download invoice");
    }
  };

  // Cancel booking
  const handleCancelBooking = async () => {
    try {
      const token = localStorage.getItem("token");
      await api.put(
        `/api/bookings/${id}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success("Booking cancelled successfully");
      navigate("/profile/bookings");
    } catch (err) {
      console.error(err);
      message.error("Failed to cancel booking");
    }
  };

  // Map status to color for Tag
  const getStatusColor = () => {
    if (stepKey === "completed") return "green";
    if (stepKey === "cancelled") return "red";
    if (stepKey === "confirmed") return "blue";
    if (stepKey === "in-progress") return "gold";
    return "default";
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

      {/* Header */}
      <Card className="hero-card">
        <div className="hero-header">
          <div className="hero-left">
            <Title level={4}>Booking #{booking.bookingId || booking._id}</Title>
            <Tag className="status-tag" color={getStatusColor()}>
              {(booking.deliveryStatus || booking.status || "pending").toUpperCase()}
            </Tag>
          </div>
          <div className="hero-right">
            <Text className="total-price">₹{booking.totalAmount}</Text>
            <Text type="secondary">{booking.paymentMethod || "—"}</Text>
            <div className="hero-actions">
              <Button icon={<FilePdfOutlined />} onClick={handleDownloadInvoice}>
                Download Invoice
              </Button>
              <Popconfirm
                title="Cancel this booking?"
                onConfirm={handleCancelBooking}
                okText="Yes"
                cancelText="No"
              >
                <Button danger icon={<StopOutlined />}>
                  Cancel Booking
                </Button>
              </Popconfirm>
            </div>
          </div>
        </div>
      </Card>

      {/* Order Progress */}
      <Card className="progress-card">
        {stepKey === "cancelled" ? (
          <div style={{ textAlign: "center", padding: "8px 0" }}>
            <Tag color="red" style={{ fontSize: "14px", padding: "6px 12px" }}>
              ❌ Booking Cancelled
            </Tag>
          </div>
        ) : (
          <Steps
            size="small"
            current={currentStep >= 0 ? currentStep : 0}
            responsive
            items={[
              {
                title: "Pending",
                status: currentStep > 0 ? "finish" : currentStep === 0 ? "process" : "wait",
              },
              {
                title: "Confirmed",
                status: currentStep > 1 ? "finish" : currentStep === 1 ? "process" : "wait",
              },
              {
                title: "In Progress",
                status: currentStep > 2 ? "finish" : currentStep === 2 ? "process" : "wait",
              },
              {
                title: "Completed",
                status: currentStep === 3 ? "finish" : "wait",
              },
            ]}
          />
        )}
      </Card>

      {/* Main Content */}
      <Row gutter={[16, 16]} className="content-row">
        {/* Products */}
        <Col xs={24} md={16}>
          <Card className="section-card">
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
                    <Card key={p._id} className="service-card" variant="outlined">
                      <Avatar
                        shape="square"
                        size={80}
                        src={img}
                        icon={!img && <UserOutlined />}
                      />
                      <div className="service-info">
                        <Text strong>{name}</Text>
                        <Tag color="blue">Product</Tag>
                        <Text type="secondary">Qty: {qty}</Text>
                        <Text>₹{price}</Text>
                      </div>
                    </Card>
                  );
                })
              ) : (
                <Text type="secondary">No products found</Text>
              )}
            </div>
          </Card>
        </Col>

        {/* Customer Info & Assigned Partner */}
        <Col xs={24} md={8}>
          <Card className="section-card">
            <Divider orientation="left">Customer Info</Divider>
            <Text strong>{booking.user?.name || booking.name}</Text>
            <br />
            <Text>{booking.user?.email || booking.email}</Text>
            <br />
            <Text>{booking.user?.phone || booking.phone}</Text>
            <br />
            <Text>{booking.address || "-"}</Text>
          </Card>

          {booking.assignedTo && (
            <Card className="section-card">
              <Divider orientation="left">Assigned Partner</Divider>
              <Text strong>{booking.assignedTo.name}</Text>
              <br />
              <Text>{booking.assignedTo.email}</Text>
              <br />
              <Text>{booking.assignedTo.phone}</Text>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
}
