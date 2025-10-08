import { useState, useEffect } from "react";
import { Button, Popconfirm, Row, Col, Card, Divider } from "antd";
import { DeleteOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import LoadingScreen from "../../components/loading/LoadingScreen";
import "./CartPage.css";
import cartimg from '../../assets/retrowoods.png';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const delivery = cart.length > 0 ? 5 : 0;
  const total = subtotal ;

  if (loading) return <LoadingScreen message="Processing cart…" />;

  return (
    <div className="cart-page-wrapper">
      <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate("/")}>
        Continue Shopping
      </Button>

      <h2 className="cart-title">🛒 Shopping Cart</h2>

      {cart.length === 0 ? (
        <p className="empty-cart">Your cart is empty</p>
      ) : (
        <>
          <Button
            type="primary"
            danger
            className="clear-cart-btn"
            onClick={async () => {
              setLoading(true);
              await clearCart();
              setLoading(false);
            }}
          >
            Clear Cart
          </Button>

          <Row gutter={[24, 24]}>
            {/* LEFT SIDE — PRODUCT LIST */}
            <Col xs={24} md={16}>
              <Card className="cart-card">
                {cart.map((item) => (
                  <div key={item.product._id} className="cart-item">
                    <img
                      src={item.product.image || "/placeholder.png"}
                      alt={item.product.name}
                      className="cart-item-img"
                    />
                    <div className="cart-item-details">
                      <h3>{item.product.name}</h3>
                      <p>Price: ₹{item.product.price}</p>
                      <p>Total: ₹{item.product.price * item.quantity}</p>
                      <div className="qty-box">
                        <Button
                          onClick={async () => {
                            if (item.quantity <= 1) return;
                            setLoading(true);
                            await updateQuantity(item.product._id, item.quantity - 1);
                            setLoading(false);
                          }}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </Button>
                        <span>{item.quantity}</span>
                        <Button
                          onClick={async () => {
                            setLoading(true);
                            await updateQuantity(item.product._id, item.quantity + 1);
                            setLoading(false);
                          }}
                        >
                          +
                        </Button>
                      </div>
                      <Popconfirm
                        title="Remove this item?"
                        onConfirm={async () => {
                          setLoading(true);
                          await removeFromCart(item.product._id);
                          setLoading(false);
                        }}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button type="text" danger icon={<DeleteOutlined />}>
                          Remove
                        </Button>
                      </Popconfirm>
                    </div>
                  </div>
                ))}
              </Card>

              <Card className="cart-image-card">
                <img src={cartimg} alt="Need Help?" className="cart-image" />
              </Card>
            </Col>

            {/* RIGHT SIDE — SUMMARY */}
            <Col xs={24} md={8}>
              <Card className="cart-summary-card">
                <h3>Order Summary</h3>
                <Divider />
                <div className="summary-row">
                  <span>Sub Total</span>
                  <span>₹{subtotal}</span>
                </div>
                {/* <div className="summary-row">
                  <span>Delivery Fee</span>
                  <span>₹{delivery}</span>
                </div> */}
                <div className="summary-row total">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
                <Button
                  type="primary"
                  block
                  className="checkout-btn"
                  onClick={() => navigate("/checkout")}
                >
                  Proceed to Checkout
                </Button>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
}
