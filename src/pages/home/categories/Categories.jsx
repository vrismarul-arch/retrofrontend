import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../../api";
import toast from "react-hot-toast";
import LoadingScreen from "../../../components/loading/LoadingScreen";
import "./Categories.css";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await api.get("/api/admin/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
        toast.error("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryClick = (category) => {
    // Navigating to category details page
    navigate(`/category/${category._id}`, { state: category });
  };

  if (loading) {
    return <LoadingScreen message="Loading Categories..." />;
  }

  return (
    <section className="categories-section">
      <div className="section-title-container">
        <h2 className="section-title">Explore Our Categories</h2>
        <hr className="section-title-hr" />
      </div>

      <div className="category-grid">
        {categories.map((cat) => (
          <div
            key={cat._id}
            className="category-card"
            onClick={() => handleCategoryClick(cat)}
          >
            <div className="category-img-wrapper">
              <img
                src={cat.imageUrl || "/placeholder.png"}
                alt={cat.name}
                className="category-img"
                loading="lazy"
                onError={(e) => (e.target.src = "/placeholder.png")}
              />
            </div>
            <p className="category-card-title">{cat.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}