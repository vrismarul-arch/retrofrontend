import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../../api";
import { Skeleton } from "antd";
import "./TrendingServices.css";

export default function TrendingServices() {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await api.get("/api/admin/subcategories");
        setTrending(res.data.slice(0, 5) || []);
      } catch (err) {
        console.error("❌ Error fetching trending services:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  const largeItem = trending[0];
  const smallItems = trending.slice(1);

  return (
    <div className="trending-container">
      <h2 className="home-title">In the Spotlight</h2>
      <hr className="home-title-hr" />

      {loading ? (
        <div className="skeleton-grid">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton-card">
              <Skeleton.Image
                active
                style={{ width: "100%", height: 100, borderRadius: 8 }}
              />
              <Skeleton
                active
                paragraph={{ rows: 1 }}
                title={false}
                style={{ marginTop: 10 }}
              />
            </div>
          ))}
        </div>
      ) : trending.length > 0 ? (
        <div className="category-grid-container">
          {/* Large Card */}
          {largeItem && (
            <Link
              to={`/subcategories/${largeItem._id}`}
              className="large-card"
            >
              <img
                src={largeItem.imageUrl || "/placeholder.png"}
                alt={largeItem.name}
              />
              <div className="card-overlay">{largeItem.name}</div>
            </Link>
          )}

          {/* Small Cards Grid */}
          <div className="small-cards-grid">
            {smallItems.map((item) => (
              <Link
                key={item._id}
                to={`/subcategories/${item._id}`}
                className="small-card"
              >
                <img
                  src={item.imageUrl || "/placeholder.png"}
                  alt={item.name}
                />
                <div className="card-overlay">{item.name}</div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <p>No trending services found</p>
      )}
    </div>
  );
}
