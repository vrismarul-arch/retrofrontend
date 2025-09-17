import React, { useEffect, useState } from "react";
import { Descriptions, Spin, Tag, Avatar, message, Row, Col, Typography, Select } from "antd";
import api from "../../../../api";

const { Text } = Typography;
const { Option } = Select;

const BookingDetails = ({ bookingId, onDeliveryChange }) => {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updatingDelivery, setUpdatingDelivery] = useState(false);

  const fetchBooking = async () => {
    if (!bookingId) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await api.get(`/api/admin/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooking(res.data.booking);
    } catch (err) {
      console.error(err);
      message.error("Failed to load booking details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBooking(); }, [bookingId]);

 const handleDeliveryUpdate = async (newStatus) => {
  if (!bookingId) return;
  setUpdatingDelivery(true);

  try {
    const token = localStorage.getItem("token");
    const res = await api.put(
      `/api/admin/bookings/${bookingId}`,
      { deliveryStatus: newStatus },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // ✅ Update local booking state with returned booking
    setBooking(res.data.booking);

    // Notify parent table if needed
    if (onDeliveryChange) {
      onDeliveryChange(bookingId, res.data.booking.deliveryStatus);
    }

    message.success("Delivery status updated");
  } catch (err) {
    console.error(err);
    message.error("Failed to update delivery status");
  } finally {
    setUpdatingDelivery(false);
  }
};

  if (loading) return <Spin tip="Loading..." style={{ display: "block", margin: "2rem auto" }} />;
  if (!booking) return <p>No booking details available</p>;

  const customer = booking.user || { name: booking.name, email: booking.email, phone: booking.phone };

  return (
    <Descriptions bordered column={1} labelStyle={{ fontWeight: "bold" }}>
      <Descriptions.Item label="Booking ID">{booking.bookingId || booking._id}</Descriptions.Item>
      <Descriptions.Item label="Customer">
        {customer.name} <br /> {customer.email || "-"} <br /> {customer.phone || "-"}
      </Descriptions.Item>
      <Descriptions.Item label="Address">{booking.address || "-"}</Descriptions.Item>
      <Descriptions.Item label="Products / Services">
        {booking.products?.length > 0 ? (
          <Row gutter={[8, 8]}>
            {booking.products.map((p) => {
              const product = p.productId || {};
              const img = product.image || product.images?.[0];
              return (
                <Col key={p._id} span={24}>
                  <Tag color="blue" style={{ display: "flex", alignItems: "center" }}>
                    {img && <Avatar src={img} size={24} shape="square" style={{ marginRight: 4 }} />}
                    {product.name || "Product"} × {p.quantity || 1} <Text type="secondary">(₹{product.price || 0})</Text>
                  </Tag>
                </Col>
              );
            })}
          </Row>
        ) : "-"}
      </Descriptions.Item>
      <Descriptions.Item label="Payment Method">{booking.paymentMethod || "-"}</Descriptions.Item>
      <Descriptions.Item label="Total Amount">₹{booking.totalAmount || 0}</Descriptions.Item>
      <Descriptions.Item label="Booking Status">
        <Tag color={booking.status === "confirmed" ? "green" : booking.status === "pending" ? "gold" : "red"}>
          {booking.status?.toUpperCase() || "N/A"}
        </Tag>
      </Descriptions.Item>
      <Descriptions.Item label="Delivery Status">
        <Row gutter={8} align="middle">
        
          <Col>
            <Tag color={booking.deliveryStatus === "delivered" ? "green" : booking.deliveryStatus === "shipping" ? "blue" : "gold"}>
              {booking.deliveryStatus?.toUpperCase() || "PENDING"}
            </Tag>
          </Col>
        </Row>
      </Descriptions.Item>
    </Descriptions>
  );
};

export default BookingDetails;
