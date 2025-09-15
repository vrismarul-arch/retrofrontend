import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Skeleton, Button } from "antd";
import toast from "react-hot-toast";
import api from "../../../api";
import { useCart } from "../../context/CartContext";
import "./BrandProducts.css";

export default function BrandProducts() {
  const { id } = useParams(); // brand id
  const navigate = useNavigate();

  const [brand, setBrand] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { cart, addToCart, removeFromCart } = useCart();
  const isLoggedIn = !!localStorage.getItem("token");

  const roundPrice = (p) => Number(Number(p).toFixed(2));

  useEffect(() => {
    const fetchBrandData = async () => {
      setLoading(true);
      try {
        const brandRes = await api.get(`/api/admin/brands/${id}`);
        setBrand(brandRes.data);

        const prodRes = await api.get(`/api/admin/products?brand=${id}`);
        setProducts(prodRes.data);
      } catch (err) {
        console.error("❌ Brand fetch error:", err);
        toast.error("Failed to load brand details");
      } finally {
        setLoading(false);
      }
    };

    fetchBrandData();
  }, [id]);

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
    <div className="category-services">
      {loading ? (
        <div className="service-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="service-card skeleton-card">
              <Skeleton.Image active className="skeleton-image" />
              <div className="skeleton-content">
                <Skeleton active title={{ width: '80%' }} paragraph={{ rows: 1 }} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Brand Header */}
          <div className="category-header">
            <img
              src={brand?.logoUrl || "/placeholder.png"}
              alt={brand?.name}
              className="brand-header-img"
            />
            <h1 className="category-title">{brand?.name || "Brand"}</h1>
          </div>

          {/* Product Grid */}
          <div className="service-grid">
            {products.length > 0 ? (
              products.map((product) => (
                <div key={product._id} className="service-card modern-card">
                  <div className="card-image-wrapper">
                    <img
                      src={product.image || "/placeholder.png"}
                      alt={product.name}
                      className="service-card-img default-img"
                      onError={(e) => (e.target.src = "/placeholder.png")}
                    />
                    {product.discount > 0 && (
                      <span className="discount-tag">
                        {product.discount}% OFF
                      </span>
                    )}
                  </div>

                  <div className="service-card-info">
                    <h3 className="service-title">{product.name}</h3>
                    <p className="product-description">{product.description?.substring(0, 50)}...</p>

                    <div className="price-section">
                      <span className="price">₹{roundPrice(product.price)}</span>
                      {product.originalPrice && product.originalPrice > product.price && (
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
                          Remove from Cart
                        </Button>
                      ) : (
                        <Button
                          type="primary"
                          shape="round"
                          size="small"
                          onClick={() => handleAddToCartClick(product)}
                        >
                          Add to Cart
                        </Button>
                      )}
                      <Button
                        size="small"
                        className="view-btn"
                        onClick={() => {
                          navigate(`/product/${product._id}`);
                        }}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-products-message">No products found for this brand.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}