import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Skeleton, Button, Tooltip } from "antd";
import { EyeOutlined, CopyOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";
import api from "../../../api";
import { useCart } from "../../context/CartContext";
import LoadingScreen from "../../components/loading/LoadingScreen"; // full-page loader
import "./BrandProducts.css";
import FiltersBar from "../../components/filter/FiltersBar";
import ServiceInfo from "./ServiceInfo";

export default function BrandProducts() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [brand, setBrand] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { cart, addToCart, removeFromCart } = useCart();
  const isLoggedIn = !!localStorage.getItem("token");

  const roundPrice = (p) => Number(Number(p).toFixed(2));

  // Fetch brand + products
  useEffect(() => {
    const fetchBrandData = async () => {
      setLoading(true);
      try {
        const brandRes = await api.get(`/api/admin/brands/${id}`);
        setBrand(brandRes.data);

        const prodRes = await api.get(`/api/admin/products?brand=${id}`);
        setProducts(prodRes.data);
        setFilteredProducts(prodRes.data); // initially all
      } catch (err) {
        console.error("❌ Brand fetch error:", err);
        toast.error("Failed to load brand details");
      } finally {
        setLoading(false);
      }
    };

    fetchBrandData();
  }, [id]);

  // Filter handler
  const handleFilter = ({ priceRange, status, condition }) => {
    const [min, max] = priceRange;
    const filtered = products.filter((p) => {
      const price = p.finalPrice || p.price;
      const statusMatch = status === "all" || p.status === status;
      const conditionMatch = condition === "all" || p.condition === condition;
      return price >= min && price <= max && statusMatch && conditionMatch;
    });
    setFilteredProducts(filtered);
  };

  // Cart handlers
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

  // Share product link
 const handleShareClick = (product) => {
  const link = `${window.location.origin}/product/${product._id}`;
  const shortDesc = product.description?.substring(0, 80) || "";
  const shareText = `${product.name}\n${shortDesc}\nCheck it out: ${link}\n`;

  if (navigator.share) {
    navigator
      .share({
        title: product.name,
        text: shortDesc,
        url: link,
      })
      .then(() => toast.success("Product shared successfully"))
      .catch((err) => console.error("Share failed:", err));
  } else {
    // fallback: copy formatted text to clipboard
    const formatted = `${shareText}${product.image ? `Image: ${product.image}` : ""}`;
    navigator.clipboard.writeText(formatted);
    toast.success("Product details copied to clipboard!");
  }
};


  // ✅ Show full-page loader while data is fetching
  if (loading) {
    return <LoadingScreen loading={loading} />;
  }

  return (
    <div className="category-services">
      {/* Filters */}
      <div style={{ marginBottom: "20px" }}>
        <FiltersBar onApplyFilters={handleFilter} products={products} />
        <ServiceInfo />
      </div>

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
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product._id} className="service-card modern-card">
              <div className="card-image-wrapper">
                <img
                  src={product.image || "/placeholder.png"}
                  alt={product.name}
                  className="service-card-img default-img"
                  onError={(e) => (e.target.src = "/placeholder.png")}
                />
                {product.discount > 0 && (
                  <span className="discount-tag">{product.discount}% OFF</span>
                )}
              </div>

              <div className="service-card-info">
                <h3 className="service-title">{product.name}</h3>
                <p className="product-description">
                  {product.description?.substring(0, 50)}...
                </p>

                <div className="price-section">
                  <span className="price">₹{roundPrice(product.price)}</span>
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
                      onClick={() => handleRemoveFromCartClick(product._id)}
                    >
                      Remove
                    </Button>
                  ) : (
                    <Button
                      type="primary"
                      shape="round"
                      size="small"
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

                  <Tooltip title="Share Product">
                    <Button
                      size="small"
                      shape="circle"
                      icon={<CopyOutlined />}
                      onClick={() => handleShareClick(product)}
                    />
                  </Tooltip>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="no-products-message">No products found for this filter.</p>
        )}
      </div>
    </div>
  );
}
