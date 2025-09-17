import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Skeleton, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";
import api from "../../../../api";
import { useCart } from "../../../context/CartContext";
import Slider from "react-slick";

// slick styles (import here or in a global CSS)
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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
        setProducts(prodRes.data || []);
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

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2200,
    pauseOnHover: true,
    swipeToSlide: true,
    responsive: [
      { breakpoint: 1440, settings: { slidesToShow: 4 } },
      { breakpoint: 1280, settings: { slidesToShow: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } }
    ]
  };

  return (
    <div className="best-sellers-section">
      <div className="best-sellers-header">
        <h2 className="section-title">Best Sellers</h2>
      </div>

      {loading ? (
        <Skeleton active paragraph={{ rows: 6 }} />
      ) : (
        <>
          {products.length > 0 ? (
            <Slider {...settings} className="product-carousel">
              {products.map((product) => (
                <div key={product._id} className="product-card-wrapper">
                  <div className="product-card">
                    <div className="card-image-wrapper">
                      <img
                        src={product.image || "/placeholder.png"}
                        alt={product.name}
                        className="product-card-img"
                      />
                      {product.discount && (
                        <span className="discount-tag">
                          {product.discount}% OFF
                        </span>
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
                        )}
                      </div>

                      <div className="action-buttons">
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
                            icon={<PlusOutlined />}
                            onClick={() => handleAddToCartClick(product)}
                          >
                            ADD
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          ) : (
            <p className="no-products-message">No best-selling products found.</p>
          )}
        </>
      )}
    </div>
  );
}
