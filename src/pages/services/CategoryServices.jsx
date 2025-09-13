// src/pages/category/CategoryServices.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Skeleton, Button } from "antd";
import toast from "react-hot-toast";
import api from "../../../api";
import { useCart } from "../../context/CartContext";
import Salonservicesdrawer from "./details/Salonservicesdrawer";
import "../../css/CategoryServices.css";

export default function CategoryServices() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedSubCat, setSelectedSubCat] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const { cart, addToCart, removeFromCart } = useCart();
  const isLoggedIn = !!localStorage.getItem("token");

  const roundPrice = (p) => Number(Number(p).toFixed(2));

  // Fetch services and categories
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/admin/products?category=${id}`);
        setServices(res.data);

        // Extract unique subcategories
        const subs = [];
        res.data.forEach((s) => {
          if (s.subCategory && !subs.find((x) => x._id === s.subCategory._id)) {
            subs.push(s.subCategory);
          }
        });
        setSubCategories(subs);

        const brandsRes = await api.get("/api/admin/brands");
        setBrands(brandsRes.data);
      } catch (err) {
        console.error("❌ Fetch error:", err);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Add to cart
  const handleAddToCartClick = async (service) => {
    if (!isLoggedIn) {
      toast("Please login first", { icon: "🔑" });
      navigate("/login");
      return;
    }
    try {
      await addToCart(service._id, 1, service);
      toast.success(`${service.name} added to cart`);
    } catch (err) {
      console.error("❌ Add to cart failed:", err);
      toast.error("Could not add to cart");
    }
  };

  // Remove from cart
  const handleRemoveFromCartClick = async (serviceId) => {
    try {
      await removeFromCart(serviceId);
      toast.success("Removed from cart");
    } catch (err) {
      console.error("❌ Remove from cart failed:", err);
      toast.error("Could not remove from cart");
    }
  };

  // Check if a service is in cart
  const isInCart = (serviceId) =>
    cart.some((item) => item.product._id === serviceId);

  // Filter services by selected subcategory & brand
  const filteredServices = services.filter(
    (s) =>
      (!selectedSubCat || s.subCategory?._id === selectedSubCat) &&
      (!selectedBrand || s.brand?._id === selectedBrand)
  );

  return (
    <div className="category-services">
      {loading ? (
        <Skeleton active />
      ) : (
        <>
          {/* Subcategory Filter */}
          <div className="subcat-scroll">
            <div
              className={`subcat-card ${!selectedSubCat ? "active" : ""}`}
              onClick={() => {
                setSelectedSubCat(null);
                setSelectedBrand(null);
              }}
            >
              <img src="/retro.png" alt="All" className="subcat-img" />
              <p>All</p>
            </div>
            {subCategories.map((sub) => (
              <div
                key={sub._id}
                className={`subcat-card ${selectedSubCat === sub._id ? "active" : ""}`}
                onClick={() => {
                  setSelectedSubCat(sub._id);
                  setSelectedBrand(null);
                }}
              >
                <img src={sub.imageUrl || "/placeholder.png"} alt={sub.name} className="subcat-img" />
                <p>{sub.name}</p>
              </div>
            ))}
          </div>

          {/* Brand Filter */}
          {selectedSubCat && brands.length > 0 && (
            <div className="variety-chips">
              {brands.map((brand) => (
                <button
                  key={brand._id}
                  className={`chip ${selectedBrand === brand._id ? "active" : ""}`}
                  onClick={() => setSelectedBrand(brand._id)}
                >
                  {brand.name}
                </button>
              ))}
            </div>
          )}

          {/* Services Grid */}
          <div className="service-grid">
            {filteredServices.map((service) => (
              <div key={service._id} className="service-card modern-card">
                <div className="card-image-wrapper">
                  <img
                    src={service.image || "/placeholder.png"}
                    alt={service.name}
                    className="service-card-img default-img"
                  />
                  {service.discount && (
                    <span className="discount-tag">{service.discount}% OFF</span>
                  )}
                </div>

                <div className="service-card-info">
                  <h3 className="service-title">{service.name}</h3>
                  <p className="service-duration">
                    {service.duration
                      ? `${Math.floor(service.duration / 60)} hr ${service.duration % 60} mins`
                      : "N/A"}
                  </p>

                  <div className="price-section">
                    <span className="price">₹{roundPrice(service.price)}</span>
                    {service.originalPrice > service.price && (
                      <span className="old-price">₹{roundPrice(service.originalPrice)}</span>
                    )}
                  </div>

                  <div className="action-buttons">
                    {isInCart(service._id) ? (
                      <Button
                        danger
                        shape="round"
                        size="small"
                        onClick={() => handleRemoveFromCartClick(service._id)}
                      >
                        REMOVE
                      </Button>
                    ) : (
                      <Button
                        type="primary"
                        shape="round"
                        size="small"
                        onClick={() => handleAddToCartClick(service)}
                      >
                        ADD
                      </Button>
                    )}
                    <Button
                      size="small"
                      className="view-btn"
                      onClick={() => {
                        setSelectedService(service);
                        setDrawerOpen(true);
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Service Details Drawer */}
          {drawerOpen && selectedService && (
            <Salonservicesdrawer
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
              service={selectedService}
              isMobile={window.innerWidth < 768}
            />
          )}
        </>
      )}
    </div>
  );
}
