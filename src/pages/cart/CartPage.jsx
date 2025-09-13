// src/pages/cart/CartPage.jsx
import { useState, useEffect } from "react";
import { Table, Button, Popconfirm } from "antd";
import { DeleteOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import "./CartPage.css";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const delivery = cart.length > 0 ? 5 : 0;
  const total = subtotal + delivery;

  const columns = [
    {
      title: "Product",
      render: (_, item) => (
        <div className="cart-product">
          <img src={item.product.image || "/placeholder.png"} alt={item.product.name} />
          <div className="cart-product-info">
            <h3>{item.product.name}</h3>
            <p className="price">₹{item.product.price}</p>
            <Popconfirm
              title="Remove this item?"
              onConfirm={() => removeFromCart(item.product._id)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="text" danger icon={<DeleteOutlined />}>
                Remove
              </Button>
            </Popconfirm>
          </div>
        </div>
      ),
    },
    {
      title: "Quantity",
      render: (_, item) => (
        <div className="qty-box">
          <Button
            onClick={() => item.quantity > 1 && updateQuantity(item.product._id, item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            -
          </Button>
          <span>{item.quantity}</span>
          <Button onClick={() => updateQuantity(item.product._id, item.quantity + 1)}>+</Button>
        </div>
      ),
    },
    { title: "Price", render: (_, item) => `₹${item.product.price}` },
    { title: "Total", render: (_, item) => `₹${item.product.price * item.quantity}` },
  ];

  return (
    <div className="cart-container">
      <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate("/")}>
        Continue Shopping
      </Button>

      <h2 className="cart-title">🛒 Shopping Cart</h2>

      {cart.length === 0 ? (
        <p className="empty-cart">Your cart is empty</p>
      ) : (
        <>
          <Button type="primary" danger className="clear-cart-btn" onClick={clearCart}>
            Clear Cart
          </Button>

          {isMobile ? (
            <div className="cart-cards">
              {cart.map((item) => (
                <div key={item.product._id} className="cart-card">
                  <img src={item.product.image || "/placeholder.png"} alt={item.product.name} />
                  <div className="cart-card-info">
                    <h3>{item.product.name}</h3>
                    <p>Price: ₹{item.product.price}</p>
                    <p>Total: ₹{item.product.price * item.quantity}</p>
                    <div className="qty-box">
                      <Button
                        onClick={() =>
                          item.quantity > 1 && updateQuantity(item.product._id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                      >
                        -
                      </Button>
                      <span>{item.quantity}</span>
                      <Button onClick={() => updateQuantity(item.product._id, item.quantity + 1)}>
                        +
                      </Button>
                    </div>
                    <Popconfirm
                      title="Remove this item?"
                      onConfirm={() => removeFromCart(item.product._id)}
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
            </div>
          ) : (
            <Table dataSource={cart} columns={columns} rowKey={(item) => item.product._id} pagination={false} />
          )}

          <div className="cart-summary">
            <div className="summary-row"><span>Sub Total</span><span>₹{subtotal}</span></div>
            <div className="summary-row"><span>Delivery Fee</span><span>₹{delivery}</span></div>
            <div className="summary-row total"><span>Total</span><span>₹{total}</span></div>
            <Button type="primary" className="checkout-btn" onClick={() => navigate("/checkout")}>
              Checkout
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
