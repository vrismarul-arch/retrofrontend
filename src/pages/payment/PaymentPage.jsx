// src/components/pages/PaymentPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api";
import { message, Spin, Button, Card, Radio, Modal, Row, Col, Divider } from "antd";
import onlinePaymentIcon from "../payment/icon/bank.png";
import codPaymentIcon from "../payment/icon/afterpay.png";
import "./PaymentPage.css";

export default function PaymentPage() {
  const navigate = useNavigate();
  const [pendingBooking, setPendingBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [confirmPaymentVisible, setConfirmPaymentVisible] = useState(false); // ✅ payment confirm popup

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("pendingBooking"));
    if (!stored) {
      message.error("No booking data found");
      navigate("/checkout");
      return;
    }
    setPendingBooking(stored);
  }, [navigate]);

  const clearCartBackend = async () => {
    try {
      await api.delete("/api/cart", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
    } catch (err) {
      console.error("Failed to clear backend cart:", err);
    }
  };

  const handleOnlinePayment = async () => {
    if (!pendingBooking) return;
    setLoading(true);
    try {
      const { data } = await api.post("/api/payment/create-order", {
        ...pendingBooking,
        paymentMethod: "online",
      });

      const { orderId, amount, currency, bookingId } = data;

      const options = {
        key: "rzp_test_RByvKNCLagLArF",
        amount: amount.toString(),
        currency,
        name: "Salon Booking",
        description: "Service Booking Payment",
        order_id: orderId,
        handler: async (response) => {
          try {
            const verifyRes = await api.post("/api/payment/verify", {
              ...response,
              bookingId,
            });

            if (verifyRes.data.success) {
              message.success("Payment successful!");
              localStorage.setItem(
                "successBooking",
                JSON.stringify({ ...pendingBooking, paymentMethod: "online" })
              );
              localStorage.removeItem("cart");
              localStorage.removeItem("pendingBooking");
              await clearCartBackend();
              navigate("/success");
            } else {
              message.error("Payment verification failed!");
              navigate("/failure");
            }
          } catch (err) {
            console.error("Verify error:", err);
            message.error("Payment verification failed!");
            navigate("/failure");
          }
        },
        prefill: {
          name: pendingBooking.name,
          email: pendingBooking.email,
          contact: pendingBooking.phone,
        },
        theme: { color: "#3399cc" },
      };

      setLoading(false);
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Order creation error:", err);
      message.error("Failed to create payment order");
      setLoading(false);
      navigate("/checkout");
    }
  };

  const handleCOD = async () => {
    if (!pendingBooking) return;
    setLoading(true);
    try {
      await api.post(
        "/api/bookings",
        { ...pendingBooking, paymentMethod: "cod" },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      message.success("Booking placed with Cash on Delivery!");
      localStorage.setItem(
        "successBooking",
        JSON.stringify({ ...pendingBooking, paymentMethod: "cod" })
      );
      localStorage.removeItem("cart");
      localStorage.removeItem("pendingBooking");
      await clearCartBackend();
      navigate("/success");
    } catch (err) {
      console.error("COD booking error:", err);
      message.error("Failed to place COD booking");
      navigate("/failure");
    } finally {
      setLoading(false);
    }
  };

  const handleProceed = () => {
    // ✅ Open the payment confirmation modal
    setConfirmPaymentVisible(true);
  };

  const confirmPayment = () => {
    // ✅ Confirm popup: trigger the actual payment
    setConfirmPaymentVisible(false);
    if (paymentMethod === "online") handleOnlinePayment();
    else handleCOD();
  };

  const confirmCancel = async () => {
    try {
      setCancelLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      message.info("Booking cancelled, returning to cart.");
      localStorage.removeItem("pendingBooking");
      navigate("/cart");
    } catch (err) {
      console.error("Cancel error:", err);
      message.error("Failed to cancel booking");
    } finally {
      setCancelLoading(false);
      setShowCancelModal(false);
    }
  };

  if (!pendingBooking)
    return (
      <div className="payment-container">
        <Spin size="large" />
      </div>
    );

  return (
    <>
      <div className="payment-page-wrapper">
        <Row gutter={[24, 24]} justify="center">
          {/* LEFT SIDE — ORDER SUMMARY */}
          <Col xs={24} md={10} lg={8}>
            <Card className="payment-summary-card" bordered={false}>
              <h3 className="section-title">Order Summary</h3>
              <Divider />
              {pendingBooking.products?.map((item, idx) => (
                <div key={idx} className="summary-item">
                  <img
                    src={item.imageUrl || "/placeholder.png"}
                    alt={item.name}
                    className="summary-img"
                  />
                  <div className="summary-details">
                    <p className="summary-name">{item.name}</p>
                    <p className="summary-qty">
                      {item.quantity} × ₹{item.price}
                    </p>
                    <p className="summary-total">₹{item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
              <Divider />
              <p className="summary-grand-total">
                <strong>Total: ₹{pendingBooking.totalAmount}</strong>
              </p>
            </Card>
          </Col>

          {/* RIGHT SIDE — CUSTOMER & PAYMENT INFO */}
          <Col xs={24} md={14} lg={14}>
            <Card className="payment-info-card" bordered={false}>
              <h2 className="section-title">Your Details</h2>
              <Divider />
              <p><strong>Name:</strong> {pendingBooking.name}</p>
              <p><strong>Email:</strong> {pendingBooking.email}</p>
              <p><strong>Phone:</strong> {pendingBooking.phone}</p>
              <p><strong>Address:</strong> {pendingBooking.address}</p>

              <Divider />
              <h3 className="section-subtitle">Select Payment Method</h3>
              <Radio.Group
                onChange={(e) => setPaymentMethod(e.target.value)}
                value={paymentMethod}
                className="payment-radio-group"
              >
                {/* <Radio value="online">
                  <img src={onlinePaymentIcon} alt="Online" className="icon-img" />
                  Online Payment
                </Radio> */}
                <Radio value="cod">
                  <img src={codPaymentIcon} alt="COD" className="icon-img" />
                  Cash on Delivery
                </Radio>
              </Radio.Group>

              <div className="payment-actions">
                <Button onClick={() => setShowCancelModal(true)}>← Back to Cart</Button>
                <Button
                  type="primary"
                  loading={loading}
                  onClick={handleProceed} // ✅ trigger confirmation popup
                >
                  Proceed with{" "}
                  {paymentMethod === "online" ? "Online Payment" : "COD"}
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      {/* CANCEL BOOKING MODAL */}
      <Modal
        title="Cancel Booking?"
        open={showCancelModal}
        onCancel={() => setShowCancelModal(false)}
        footer={[
          <Button key="no" onClick={() => setShowCancelModal(false)}>No</Button>,
          <Button key="yes" danger loading={cancelLoading} onClick={confirmCancel}>
            Yes, Cancel
          </Button>,
        ]}
      >
        {cancelLoading ? (
          <Spin size="large" />
        ) : (
          <p>Are you sure you want to cancel this booking?</p>
        )}
      </Modal>

      {/* CONFIRM PAYMENT MODAL */}
      <Modal
        title="Confirm Payment?"
        open={confirmPaymentVisible}
        onOk={confirmPayment}
        onCancel={() => setConfirmPaymentVisible(false)}
        okText="Yes, Proceed"
        cancelText="Cancel"
        centered
      >
        <p>
          You are about to proceed with{" "}
          <strong>{paymentMethod === "online" ? "Online Payment" : "Cash on Delivery"}</strong>.
          Do you want to continue?
        </p>
      </Modal>
    </>
  );
}
