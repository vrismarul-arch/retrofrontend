import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  Space,
  InputNumber,
  Radio,
  Rate,
  Tabs,
  Collapse,
} from "antd";
import {
  ShoppingCartOutlined,
  ArrowLeftOutlined,
  HeartOutlined,
  HeartFilled,
} from "@ant-design/icons";
import toast from "react-hot-toast";

import api from "../../../../api";
import { useCart } from "../../../context/CartContext";
import LoadingScreen from "../../../components/loading/LoadingScreen"; 
import "./SingleProductPage.css";

const { Panel } = Collapse;

export default function SingleProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  
  // ✅ Loading states for buttons
  const [addingToCart, setAddingToCart] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);

  const { cart, addToCart } = useCart();
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/admin/products/${id}`);
        setProduct(res.data);
        if (res.data.colors?.length > 0) setSelectedColor(res.data.colors[0]);
        if (res.data.images?.length > 0) setSelectedImage(res.data.images[0]);
      } catch (err) {
        toast.error("Failed to load product details.");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleAddToCartClick = async () => {
    if (!isLoggedIn) {
      toast("Please log in first", { icon: "🔑" });
      navigate("/login");
      return;
    }

    try {
      setAddingToCart(true); // ✅ start button spinner
      await addToCart(product._id, quantity, product, selectedColor);
      toast.success(`${product.name} added to cart!`);
    } catch {
      toast.error("Could not add to cart.");
    } finally {
      setAddingToCart(false); // ✅ stop spinner
    }
  };

  const handleBuyNowClick = async () => {
    if (!isLoggedIn) {
      toast("Please log in first", { icon: "🔑" });
      navigate("/login");
      return;
    }

    try {
      setBuyingNow(true); // ✅ start button spinner
      await addToCart(product._id, quantity, product, selectedColor);
      navigate("/checkout");
    } catch {
      toast.error("Could not proceed to checkout.");
    } finally {
      setBuyingNow(false); // ✅ stop spinner
    }
  };

  const isInCart = (productId) =>
    cart.some((item) => item.product._id === productId);

  const roundPrice = (p) => Number(Number(p).toFixed(2));

  if (loading) return <LoadingScreen message="Loading Product..." />;

  if (!product) return <div className="single-product-container">Product not found.</div>;

  return (
    <div className="single-product-page">
      <div className="back-button-container">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
      </div>

      <div className="product-details-container">
        {/* LEFT: Images */}
        <div className="product-image-section">
          <div className="thumbnail-list">
            {product.images?.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${product.name} - ${index + 1}`}
                className={`thumbnail ${img === selectedImage ? "active" : ""}`}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
          <div className="main-image">
            <img src={selectedImage} alt="Product" />
          </div>
        </div>

        {/* RIGHT: Info */}
        <div className="product-info-section">
          <h1 className="product-title">{product.name}</h1>

          <div className="rating-reviews">
            <Rate disabled defaultValue={product.rating || 4} />
            <span className="review-count">({product.reviewsCount || 3345})</span>
          </div>

          <div className="product-price-details">
            <span className="current-price">₹{roundPrice(product.finalPrice)}</span>
            {product.discount > 0 && (
              <span className="original-price">₹{roundPrice(product.price)}</span>
            )}
          </div>

          {product.colors?.length > 0 && (
            <div className="color-selector-section">
              <p><strong>Colors:</strong></p>
              <Radio.Group
                onChange={(e) => setSelectedColor(e.target.value)}
                value={selectedColor}
              >
                <Space>
                  {product.colors.map((color, index) => (
                    <Radio.Button
                      key={index}
                      value={color}
                      className="color-option"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </Space>
              </Radio.Group>
            </div>
          )}

          <div className="quantity-selector-section">
            <p><strong>Quantity:</strong></p>
            <InputNumber
              min={1}
              max={product.stock}
              value={quantity}
              onChange={setQuantity}
              disabled={product.stock === 0}
            />
          </div>

          <div className="product-action-buttons">
            {product.stock > 0 ? (
              <>
                <Button
                  size="large"
                  type="primary"
                  shape="round"
                  icon={<ShoppingCartOutlined />}
                  loading={addingToCart} // ✅ spinner
                  onClick={handleAddToCartClick}
                  disabled={isInCart(product._id)}
                >
                  {isInCart(product._id) ? "ADDED TO CART" : "ADD TO CART"}
                </Button>

                <Button
                  size="large"
                  shape="round"
                  loading={buyingNow} // ✅ spinner
                  onClick={handleBuyNowClick}
                  className="buy-now-button"
                >
                  BUY NOW
                </Button>
              </>
            ) : (
              <Button size="large" shape="round" disabled>
                OUT OF STOCK
              </Button>
            )}

            <Button
              size="large"
              shape="circle"
              icon={
                isWishlisted ? <HeartFilled style={{ color: "red" }} /> : <HeartOutlined />
              }
              onClick={() => setIsWishlisted(!isWishlisted)}
              className="wishlist-button"
            />
          </div>
        </div>
      </div>

      <div className="product-details-tabs">
        <Tabs defaultActiveKey="1" centered size="large" className="modern-tabs" tabBarGutter={40}>
          <Tabs.TabPane tab="Description" key="1">
            <p className="product-description">{product.description}</p>
          </Tabs.TabPane>

          <Tabs.TabPane tab="Specifications" key="2">
            <dl className="product-specs">
              {product.moreInformation?.dimensions && (
                <div className="spec-item">
                  <dt>Dimensions:</dt>
                  <dd>{product.moreInformation.dimensions}</dd>
                </div>
              )}
              {product.moreInformation?.material && (
                <div className="spec-item">
                  <dt>Material:</dt>
                  <dd>{product.moreInformation.material}</dd>
                </div>
              )}
              {product.moreInformation?.warranty && (
                <div className="spec-item">
                  <dt>Warranty:</dt>
                  <dd>{product.moreInformation.warranty} year(s)</dd>
                </div>
              )}
            </dl>
          </Tabs.TabPane>

          <Tabs.TabPane tab="FAQs" key="3">
            <Collapse accordion bordered={false} expandIconPosition="end" className="modern-accordion">
              <Panel header="What is the return policy?" key="1">
                <p>We offer a 7-day return policy with a full refund.</p>
              </Panel>
              <Panel header="Is assembly required?" key="2">
                <p>Yes, minimal assembly is required. Tools are included.</p>
              </Panel>
              <Panel header="Do you provide warranty?" key="3">
                <p>
                  Yes, {product.moreInformation?.warranty || "N/A"} year(s) of manufacturer warranty is included.
                </p>
              </Panel>
            </Collapse>
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
  );
}
