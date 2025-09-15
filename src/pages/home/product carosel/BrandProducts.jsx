import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Skeleton, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";  // ✅ Import Plus icon
import toast from "react-hot-toast";
import api from "../../../../api";
import { useCart } from "../../../context/CartContext";
import "./BrandProducts.css";

export default function BestSellers() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { cart, addToCart, removeFromCart } = useCart();
  const isLoggedIn = !!localStorage.getItem("token");

  const roundPrice = (p) => Number(Number(p).toFixed(2));

  useEffect(() => {
    const fetchBestSellers = async () => {
      setLoading(true);
      try {
        const prodRes = await api.get(`/api/admin/products`);
        setProducts(prodRes.data);
      } catch (err) {
        console.error("❌ Best sellers fetch error:", err);
        toast.error("Failed to load best sellers");
      } finally {
        setLoading(false);
      }
    };
    fetchBestSellers();
  }, []);

  const handleAddToCartClick = async (product) => {
    if (!isLoggedIn) {
      toast("Please login first", { icon: "🔑" });
      navigate("/login");
      return;
    }
    try {
      await addToCart(product._id, 1, product);
      toast.success(`${product.name} added to cart`);
    } catch (err) {
      console.error("❌ Add to cart failed:", err);
      toast.error("Could not add to cart");
    }
  };

  const handleRemoveFromCartClick = async (productId) => {
    try {
      await removeFromCart(productId);
      toast.success("Removed from cart");
    } catch (err) {
      console.error("❌ Remove from cart failed:", err);
      toast.error("Could not remove from cart");
    }
  };

  const isInCart = (productId) =>
    cart.some((item) => item.product._id === productId);

  return (
    <div className="best-sellers-section">
      <div className="best-sellers-header">
        <h2 className="section-title">Best Sellers</h2>
      </div>
      {loading ? (
        <Skeleton active paragraph={{ rows: 6 }} />
      ) : (
        <div className="product-grid">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product._id} className="product-card">
                <div className="card-image-wrapper">
                  <img
                    src={product.image || "/placeholder.png"}
                    alt={product.name}
                    className="product-card-img"
                  />
                  {product.discount && (
                    <span className="discount-tag">{product.discount}% OFF</span>
                  )}
                  <span className="best-seller-badge">Best Seller</span>
                </div>
                <div className="product-card-info">
                  <h3 className="product-title">{product.name}</h3>
                  <div className="price-section">
                    <span className="price">₹{roundPrice(product.price)}</span>
                    {product.originalPrice > product.price && (
                      <span className="old-price">
                        ₹{roundPrice(product.originalPrice)}
                      </span>
                    )}  <div className="action-buttons">
                    {isInCart(product._id) ? (
                      <Button
                        danger
                        shape="round"
                        size="small"
                        onClick={() => handleRemoveFromCartClick(product._id)}
                      >
                        REMOVE
                      </Button>
                    ) : (
                      <Button
                        type="primary"
                        shape="round"
                        size="small"
                        icon={<PlusOutlined />} // ✅ Add Plus icon here
                        onClick={() => handleAddToCartClick(product)}
                      >
                        ADD
                      </Button>
                    )}
                  </div>
                  </div>
                
                </div>
              </div>
            ))
          ) : (
            <p className="no-products-message">No best-selling products found.</p>
          )}
        </div>
      )}
    </div>
  );
}
