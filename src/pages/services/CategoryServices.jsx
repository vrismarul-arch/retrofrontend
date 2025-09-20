import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Tabs } from "antd";
import "./CategoryServices.css";

export default function CategoryServices() {
  const location = useLocation();
  const navigate = useNavigate();

  const category = location.state; // full category object
  const [selectedSubCat, setSelectedSubCat] = useState("all");

  // Tabs for subcategories
  const tabItems = [
    // {
    //   key: "all",
    //   label: (
    //     <div className="tab-label">
    //       <img src="/retro.png" alt="All" className="tab-img" />
    //       <span>All</span>
    //     </div>
    //   ),
    // },
    ...(category.subCategories || []).map((sub) => ({
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
    })),
  ];

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
