import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Tabs } from "antd";
import LoadingScreen from "../../components/loading/LoadingScreen"; // full-page loader
import "./CategoryServices.css";

export default function CategoryServices() {
  const location = useLocation();
  const navigate = useNavigate();

  const [category, setCategory] = useState(null);
  const [selectedSubCat, setSelectedSubCat] = useState("all");
  const [loading, setLoading] = useState(true);

  // Load category from location state or API
  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(true);
      try {
        // If location.state has category, use it
        if (location.state) {
          setCategory(location.state);
        } else {
          // Optional: fetch category from API if state not passed
          // const res = await api.get(`/api/categories/${id}`);
          // setCategory(res.data);
        }
      } catch (err) {
        console.error("❌ Failed to load category:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [location.state]);

  // Show full-page loader while loading
  if (loading || !category) {
    return <LoadingScreen loading={loading} />;
  }

  // Tabs for subcategories
  const tabItems = (category.subCategories || []).map((sub) => ({
    key: sub._id,
    label: (
      <div className="tab-label">
        <img
          src={sub.imageUrl || "/placeholder.png"}
          alt={sub.name}
          className="tab-img"
        />
        <span>{sub.name}</span>
      </div>
    ),
  }));

  return (
    <div className="category-services-page">
      <h2>{category.name}</h2>

      <Tabs
        activeKey={selectedSubCat}
        onChange={(key) => setSelectedSubCat(key)}
        items={tabItems}
        tabPosition="top"
        className="category-tabs"
      />

      {/* Brands Grid */}
      {category.brands && category.brands.length > 0 && (
        <div className="brands-container">
          {category.brands.map((brand) => (
            <div
              key={brand._id}
              className="brand-card-item"
              onClick={() => navigate(`/brands/${brand._id}`)}
            >
              <img src={brand.logoUrl || "/placeholder.png"} alt={brand.name} />
              <p className="brand-name">{brand.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
