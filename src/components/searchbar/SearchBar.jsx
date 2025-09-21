import { useState, useEffect, useRef } from "react";
import { Input, List, Spin, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import api from "../../../api";
import { useNavigate } from "react-router-dom";
import "./SearchBar.css";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Close overlay on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowOverlay(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch services/products with debounce
  useEffect(() => {
    if (!query.trim()) {
      setServices([]);
      setShowOverlay(false);
      return;
    }

    const fetchServices = async () => {
      setLoading(true);
      try {
        const res = await api.get("/api/products", { params: { search: query } });
        setServices(res.data);
        setShowOverlay(true);
      } catch (err) {
        console.error("Error fetching services:", err);
        message.error("Failed to fetch services.");
        setShowOverlay(false);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => fetchServices(), 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Handle click on service/product
  const handleServiceClick = (service) => {
    if (service.brand?._id) {
      navigate(`/brands/${service.brand._id}`); // ✅ Navigate to brand page
    } else {
      navigate(`/product/${service._id}`); // ✅ Fallback navigation
    }
    setShowOverlay(false);
  };

  return (
    <div className="searchbar-container" ref={searchRef}>
      <Input
        placeholder="Search services, categories, salons..."
        prefix={<SearchOutlined style={{ color: "#078d89" }} />}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query.length > 0 && setShowOverlay(true)}
        allowClear
      />

      {showOverlay && (
        <div className="search-overlay">
          {loading && <Spin className="search-spin" />}
          {!loading && services.length > 0 ? (
            <List
              dataSource={services}
              renderItem={(service) => (
                <List.Item
                  className="search-item"
                  onClick={() => handleServiceClick(service)}
                >
                  <img
                    src={service.brand?.logoUrl || "/placeholder.png"} // ✅ Use brand image
                    alt={service.brand?.name || "Brand"}
                    className="search-item-image"
                  />
                  <div className="search-item-details">
                    <div className="search-item-name">{service.name}</div>
                    <div className="search-item-info">
                     
                      <span>
                        ₹{service.price.toFixed(2)}
                        {service.originalPrice > service.price && (
                          <span style={{ textDecoration: "line-through", marginLeft: 4 }}>
                            ₹{service.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </span>
                      <span style={{ margin: "0 6px" }}>•</span>
                      <span>{service.discount ? `${service.discount}% OFF` : "—"}</span>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          ) : !loading ? (
            <div className="empty-search-results">No services found.</div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
