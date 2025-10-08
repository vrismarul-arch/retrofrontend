// src/components/pages/SuccessPage.jsx

import { useEffect, useState } from "react";
import { Button, Card, Tag } from "antd"; // Import Tag for status badges
import { useNavigate } from "react-router-dom";
import { CheckCircleOutlined, ExclamationCircleOutlined, ClockCircleOutlined, LoadingOutlined } from '@ant-design/icons'; // Import Icons
import successIllustration from "../payment/icon/payment.gif"; 
import paymentdesktop from "../payment/icon/paymentdesktop.gif"; 
import "./SuccessPage.css";

// Helper function to render a status badge dynamically
const renderStatusTag = (status) => {
    switch (status?.toLowerCase()) {
        case 'confirmed':
        case 'paid':
        case 'processing':
            return <Tag icon={<CheckCircleOutlined />} color="success">{status}</Tag>;
        case 'pending':
            return <Tag icon={<ClockCircleOutlined />} color="processing">{status}</Tag>;
        case 'failed':
        case 'cancelled':
            return <Tag icon={<ExclamationCircleOutlined />} color="error">{status}</Tag>;
        default:
            return <Tag icon={<LoadingOutlined />} color="default">{status}</Tag>;
    }
};

export default function SuccessPage() {
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("successBooking"));
    if (stored) {
      setBooking(stored);
      localStorage.removeItem("successBooking");
    } else {
      // If no data, navigate home or to a history page
      navigate("/"); 
    }
  }, [navigate]);

  // Determine the friendly payment method name
  const paymentMethodName = booking?.paymentMethod === "cod" 
        ? "Cash on Delivery" 
        : booking?.paymentMethod === "razorpay" 
        ? "Online Payment (Razorpay)"
        : "N/A";

  // Determine the overall status for the main message
  const isSuccess = booking?.status === 'confirmed' || booking?.paymentMethod === 'cod';

  if (!booking) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="success-page-container">
      <Card className="success-card">
        <div className="success-content">
          {/* Left Section: Booking Details */}
          <div className="details">
            <h2 className="title">
                {isSuccess ? "Booking Confirmed! 🎉" : "Booking Status Update"}
            </h2>

            {/* Mobile Illustration */}
            <div className="mobile-illustration-wrapper">
                <img
                    src={successIllustration}
                    alt="Success"
                    className="mobile-illustration"
                />
            </div>

            <p className="subtitle">
              {isSuccess
                ? `Thank you for your order. Your booking via ${paymentMethodName} is confirmed and processing.`
                : `Your booking details have been saved, but the current payment status requires attention.`
              }
            </p>

            <div className="booking-details">
              <p><strong>Name:</strong> {booking.name}</p>
              <p><strong>Email:</strong> {booking.email}</p>
              <p><strong>Phone:</strong> {booking.phone}</p>

              {/* DYNAMIC STATUS DISPLAY */}
              <p>
                <strong>Payment Method:</strong> {paymentMethodName}
              </p>
              <p className="status-item">
                <strong>Payment Status:</strong> {renderStatusTag(booking.status)} 
              </p>
              <p className="status-item">
                <strong>Delivery Status:</strong> {renderStatusTag(booking.deliveryStatus)}
              </p>
              {/* END DYNAMIC STATUS DISPLAY */}
              
              <p><strong>Total Amount:</strong> ₹{booking.totalAmount}</p>
            </div>

            <div className="buttons">
              <Button type="primary" size="large" onClick={() => navigate("/")}>
                Back to Home
              </Button>
              <Button className="mt-2" onClick={() => navigate("/booking-history")}>
                View My Bookings
              </Button>
            </div>
          </div>

          {/* Right Section: Desktop Illustration */}
          <div className="desktop-illustration">
            <img src={paymentdesktop} alt="Success" />
          </div>
        </div>
      </Card>
    </div>
  );
}