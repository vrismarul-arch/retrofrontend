import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../../api";
import { Skeleton } from "antd";
import toast from "react-hot-toast";
import "./Categories.css";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/api/admin/categories"); // nested data with subCategories & brands
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
    // Pass entire category object via state
    navigate(`/category/${category._id}`, { state: category });
  };

  return (
    <div className="categories-section">
        <div className="section-title-container">
  <h2 className="section-title">Explore Our Categories</h2>
  <hr className="section-title-hr" />
</div>
      <div className="grid">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card skeleton-card">
                <Skeleton.Avatar active shape="square" size={120} />
                <Skeleton active paragraph={false} title={{ width: "60%" }} />
              </div>
            ))
          : categories.map((cat) => (
              <div
                key={cat._id}
                className="card"
                onClick={() => handleCategoryClick(cat)}
              >
                <div className="card-img-wrapper">
                  <img
                    src={cat.imageUrl || "/placeholder.png"}
                    alt={cat.name}
                    className="card-img"
                    onError={(e) => (e.target.src = "/placeholder.png")}
                  />
                </div>
                <p className="card-title">{cat.name}</p>
              </div>
            ))}
      </div>
    </div>
  );
}
