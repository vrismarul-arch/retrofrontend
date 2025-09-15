import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../../api";
import { Skeleton } from "antd";
import "./TrendingServices.css";

export default function TrendingServices() {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const subRes = await api.get("/api/admin/subcategories");
        // Limit to a specific number of items to fit the layout
        setTrending(subRes.data.slice(0, 5) || []); 
      } catch (err) {
        console.error("❌ Error fetching trending services:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  // Split the data into a large item and a grid of small items
  const largeItem = trending[0];
  const smallItems = trending.slice(1);

  return (
    <div className="trending-container">
   <h2 className="home-title">Transform Your Home with Premium Furniture</h2>

      
      {loading ? (
        <div className="skeleton-grid">
          {/* Skeleton loading state */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton-card">
              <Skeleton.Image active style={{ width: "100%", height: 100, borderRadius: 8 }} />
              <Skeleton active paragraph={{ rows: 1 }} title={false} style={{ marginTop: 10 }} />
            </div>
          ))}
        </div>
      ) : trending.length > 0 ? (
        <div className="category-grid-container">
          {/* Large Card */}
          {largeItem && (
            <div 
              className="large-card"
              onClick={() => navigate(`/category/${largeItem.category?._id}`)}
            >
              <img src={largeItem.imageUrl || "/placeholder.png"} alt={largeItem.name} />
              <div className="card-overlay">{largeItem.name}</div>
            </div>
          )}

          {/* Small Cards Grid */}
          <div className="small-cards-grid">
            {smallItems.map((item) => (
              <div 
                key={item._id}
                className="small-card"
                onClick={() => navigate(`/category/${item.category?._id}`)}
              >
                <img src={item.imageUrl || "/placeholder.png"} alt={item.name} />
                <div className="card-overlay">{item.name}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>No trending services found</p>
      )}
    </div>
  );
}