import { useEffect, useState } from "react";
import {
  List,
  Avatar,
  Button,
  message,
  Spin,
  Modal,
  Card,
  Tag,
  Typography,
  Empty,
} from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import api from "../../../api";
import "./BookingHistoryPage.css";

const { Title, Text } = Typography;

export default function BookingHistoryPage() {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        const bookingRes = await api.get("/api/bookings/my", { headers });
        setBookings(Array.isArray(bookingRes.data) ? bookingRes.data : []);
      } catch {
        message.error("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleDeleteBooking = (bookingId) => {
    Modal.confirm({
      title: "Delete this booking?",
      content: "This action cannot be undone.",
      okText: "Yes, delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          const token = localStorage.getItem("token");
          const headers = { Authorization: `Bearer ${token}` };
          await api.delete(`/api/bookings/${bookingId}`, { headers });

          const updated = await api.get("/api/bookings/my", { headers });
          setBookings(Array.isArray(updated.data) ? updated.data : []);
          message.success("Booking deleted");
        } catch {
          message.error("Failed to delete booking");
        }
      },
    });
  };

  if (loading) {
    return (
      <div className="flex-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!bookings.length) {
    return <Empty description="No bookings yet" />;
  }

  return (
    <div className="booking-history-wrapper">
      <Title level={3} className="booking-title">
        My Orders
      </Title>

      <List
        itemLayout="vertical"
        dataSource={bookings}
        rowKey={(it) => it._id}
        renderItem={(item) => {
          const dateStr = item.selectedDate
            ? new Date(item.selectedDate).toLocaleDateString()
            : "-";
          const timeStr = item.selectedTime
            ? new Date(item.selectedTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })
            : "-";

          const firstProduct = item?.products?.[0] || {};
          const firstProductName =
            firstProduct?.productId?.name || firstProduct?.name || "Product";

          const firstProductImage =
            firstProduct?.productId?.image ||
            firstProduct?.productId?.images?.[0] ||
            firstProduct?.imageUrl;

          // ✅ Delivery status highlight
          const isDelivered = item.deliveryStatus === "delivered";
          const isOutForDelivery = item.deliveryStatus === "out-for-delivery";

          return (
            <Card
              className={`order-card ${
                isDelivered
                  ? "delivered-card"
                  : isOutForDelivery
                  ? "out-for-delivery-card"
                  : ""
              }`}
              variant="default"
            >
              <div className="order-item">
                {/* Left side - Image */}
                <div className="order-image">
                  <Avatar shape="square" size={80} src={firstProductImage} />
                </div>

                {/* Right side - Details */}
                <div className="order-details">
                  <div className="order-header">
                    <Text strong className="service-name">
                      {firstProductName}
                    </Text>
                    <Tag
                      className="status-tag"
                      color={
                        isDelivered
                          ? "green"
                          : isOutForDelivery
                          ? "gold"
                          : item.status === "cancelled"
                          ? "red"
                          : "blue"
                      }
                    >
                      {isDelivered
                        ? "DELIVERED"
                        : isOutForDelivery
                        ? "OUT FOR DELIVERY"
                        : item.status || "PENDING"}
                    </Tag>
                  </div>

                  <Text type="secondary" className="booking-id">
                    Order ID: {item.bookingId || item._id}
                  </Text>

                  <div className="order-info">
                    <Text>
                      <ShoppingCartOutlined />{" "}
                      <b className="price">₹{item.totalAmount}</b>
                    </Text>
                   
                  </div>

                  <div className="order-actions">
                    <Button
                      type="link"
                      onClick={() => navigate(`/profile/bookings/${item._id}`)}
                    >
                      View Details
                    </Button>
                    {!isDelivered && (
                      <Button
                        type="link"
                        danger
                        onClick={() => handleDeleteBooking(item._id)}
                      >
                        Cancel Order
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        }}
      />
    </div>
  );
}
