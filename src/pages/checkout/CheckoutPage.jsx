// src/components/pages/CheckoutPage.jsx
import { useEffect, useState } from "react";
import { Form, Input, Button, Card, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../../context/CartContext";
import api from "../../../api";
import "./CheckoutPage.css";

export default function CheckoutPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [products, setProducts] = useState([]);
  const { cart } = useCart();
  const navigate = useNavigate();

  // Fetch products from backend safely
  useEffect(() => {
    if (!cart || cart.length === 0) return;

    const ids = cart
      .filter((item) => item?.product?._id)
      .map((item) => item.product._id);
    if (ids.length === 0) return;

    setLoading(true);
    api
      .post("/api/products/byIds", { ids })
      .then((res) => setProducts(res.data || []))
      .catch(() => toast.error("Failed to fetch product details"))
      .finally(() => setLoading(false));
  }, [cart]);

  // Load profile if logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    api
      .get("/api/profile", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => form.setFieldsValue(res.data))
      .catch(() => toast("Could not fetch profile", { icon: "⚠️" }));
  }, [form]);

  // Get user location
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => toast("Could not fetch location", { icon: "⚠️" })
    );
  }, []);

  // Handle checkout submission
  const handleSubmit = (values) => {
    if (!location) return toast.error("Location not available");
    setLoading(true);

    const totalAmount = cart.reduce((sum, item) => {
      const prod = products.find((p) => p._id === item.product?._id);
      return sum + (prod?.price || item.product?.price || 0) * item.quantity;
    }, 0);

    const payload = {
      ...values,
      location,
      products: cart.map((item) => {
        const prod = products.find((p) => p._id === item.product?._id);
        return {
          productId: item.product?._id,
          name: prod?.name || item.product?.name || "Product",
          price: prod?.price || item.product?.price || 0,
          quantity: item.quantity,
          imageUrl:
            item.product?.image || prod?.imageUrl || "/placeholder.png",
        };
      }),
      totalAmount,
    };

    localStorage.setItem("pendingBooking", JSON.stringify(payload));
    toast.success("Booking details saved! Redirecting to payment…");

    setTimeout(() => {
      setLoading(false);
      navigate("/payment");
    }, 1000);
  };

  if (!cart || cart.length === 0)
    return (
      <div className="empty-cart">
        <p>
          Your cart is empty.{" "}
          <Button type="link" onClick={() => navigate("/category")}>
            Go Shopping
          </Button>
        </p>
      </div>
    );

  if (loading)
    return (
      <div className="loading-spinner">
        <Spin size="large" />
      </div>
    );

  return (
    <div className="checkout-wrapper">
      <Card className="checkout-card">
        <h2 className="checkout-title">Checkout</h2>
        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
          onFinishFailed={() =>
            toast.error("Please fill all required fields")
          }
        >
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input placeholder="Enter your name" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>
          <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
            <Input placeholder="Enter your phone number" />
          </Form.Item>
          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={2} placeholder="Enter your address" />
          </Form.Item>

          {location && (
            <p className="location-info">
              📍 {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
            </p>
          )}
        </Form>
      </Card>

      <Card className="order-summary">
        <h3>Order Summary</h3>
        {cart.map((item) => {
          const prod = products.find((p) => p._id === item.product?._id);
          const name = prod?.name || item.product?.name || "Product";
          const price = prod?.price || item.product?.price || 0;
          const imageSrc =
            item.product?.image || prod?.imageUrl || "/placeholder.png";

          return (
            <div key={item.product?._id || Math.random()} className="order-item">
              <img src={imageSrc} alt={name} />
              <div>
                <p className="item-name">{name}</p>
                <p className="item-price">
                  {item.quantity} × ₹{price} = ₹{item.quantity * price}
                </p>
              </div>
            </div>
          );
        })}
        <p className="total">
          Total: ₹
          {cart.reduce(
            (sum, i) =>
              sum +
              (products.find((p) => p._id === i.product?._id)?.price ||
                i.product?.price ||
                0) *
                i.quantity,
            0
          )}
        </p>
      </Card>

      <div className="sticky-footer">
        <Button
          type="primary"
          block
          shape="round"
          size="large"
          onClick={() => form.submit()}
        >
          Proceed to Payment
        </Button>
      </div>
    </div>
  );
}
