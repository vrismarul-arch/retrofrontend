import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Tooltip, Spin, Tag } from "antd";
import { EyeOutlined, LinkOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";
import api from "../../../api";
import { useCart } from "../../context/CartContext";
import FiltersBar from "../../components/filter/FiltersBar";
import ServiceInfo from "./ServiceInfo";
import "./BrandProducts.css";

export default function BrandProducts() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [brand, setBrand] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState({});

  const { cart, addToCart, removeFromCart } = useCart();
  const isLoggedIn = !!localStorage.getItem("token");

  const roundPrice = (p) => Number(Number(p).toFixed(2));

  // Fetch brand & products
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const brandRes = await api.get(`/api/admin/brands/${id}`);
        setBrand(brandRes.data);

        const prodRes = await api.get(`/api/admin/products?brand=${id}`);
        setProducts(prodRes.data);
        setFilteredProducts(prodRes.data);
      } catch (err) {
        toast.error("Failed to load brand details");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // ✅ Updated filter logic for checkbox arrays
  const handleFilter = ({ priceRange, status, condition }) => {
    const [min, max] = priceRange;
    const filtered = products.filter((p) => {
      const price = p.finalPrice || p.price;

      const statusMatch = status.includes("all") || status.includes(p.status);
      const conditionMatch =
        condition.includes("all") || condition.includes(p.condition);

      return price >= min && price <= max && statusMatch && conditionMatch;
    });
    setFilteredProducts(filtered);
  };

  const handleAddToCartClick = async (product) => {
    if (!isLoggedIn) {
      toast("Please login first", { icon: "🔑" });
      navigate("/login");
      return;
    }
    try {
      setCartLoading((prev) => ({ ...prev, [product._id]: true }));
      await addToCart(product._id, 1, product);
      toast.success(`${product.name} added to cart`);
    } finally {
      setCartLoading((prev) => ({ ...prev, [product._id]: false }));
    }
  };

  const handleRemoveFromCartClick = async (productId) => {
    try {
      setCartLoading((prev) => ({ ...prev, [productId]: true }));
      await removeFromCart(productId);
      toast.success("Removed from cart");
    } finally {
      setCartLoading((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const isInCart = (productId) =>
    cart.some((item) => item.product._id === productId);

  const handleShareClick = (product) => {
    const slug = product.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const link = `${window.location.origin}/product/${slug}-${product._id}`;
    const shortDesc = product.description?.substring(0, 80) || "";

    if (navigator.share) {
      navigator
        .share({
          title: product.name,
          text: `${product.name} - ${shortDesc}`,
          url: link,
        })
        .then(() => toast.success("Shared successfully"))
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(`${product.name}\n${link}`);
      toast.success("Copied product link!");
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="brand-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <FiltersBar onApplyFilters={handleFilter} products={products} />
      </aside>

      {/* Main content */}
      <main className="main-content">
        <ServiceInfo />

        <div className="category-header">
          <h1 className="category-title">
            {brand?.name || "Brand"}{" "}
            <span className="porduct-count">
              Product Count : ({filteredProducts.length})
            </span>
          </h1>
          <hr className="home-title-hr" />
        </div>

        <div className="service-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product._id} className="service-card modern-card">
                <div className="card-image-wrapper">
                  <img
                    src={product.image || "/placeholder.png"}
                    alt={product.name}
                    className="service-card-img"
                    onClick={() => navigate(`/product/${product._id}`)}
                    onError={(e) => (e.target.src = "/placeholder.png")}
                  />

                  {/* ✅ Discount Badge */}
                  {product.discount > 0 && (
                    <span className="discount-tag">{product.discount}% OFF</span>
                  )}

                  {/* ✅ Status Badge */}
                  {product.status && (
                    <span
                      className={`status-badge ${
                        product.status
                          .toLowerCase()
                          .replace(/\s+/g, "-")
                      }`}
                    >
                      {product.status}
                    </span>
                  )}
                </div>

                <div className="service-card-info">
                  <h3 className="service-title">{product.name}</h3>
                  <p className="product-description">
                    {product.description?.substring(0, 50)}...
                  </p>

                  <div className="price-section">
                    <span className="price">
                      ₹{roundPrice(product.finalPrice || product.price)}
                    </span>
                    {product.originalPrice &&
                      product.originalPrice > product.price && (
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
                        loading={cartLoading[product._id]}
                        onClick={() => handleRemoveFromCartClick(product._id)}
                      >
                        Remove
                      </Button>
                    ) : (
                      <Button
                        type="primary"
                        shape="round"
                        size="small"
                        loading={cartLoading[product._id]}
                        onClick={() => handleAddToCartClick(product)}
                      >
                        Add
                      </Button>
                    )}
                    <Tooltip title="View Details">
                      <Button
                        size="small"
                        shape="circle"
                        icon={<EyeOutlined />}
                        onClick={() => navigate(`/product/${product._id}`)}
                      />
                    </Tooltip>
                    <Tooltip title="Share">
                      <Button
                        size="small"
                        shape="circle"
                        icon={<LinkOutlined />}
                        onClick={() => handleShareClick(product)}
                      />
                    </Tooltip>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="no-products-message">No products found</p>
          )}
        </div>
      </main>
    </div>
  );
}
