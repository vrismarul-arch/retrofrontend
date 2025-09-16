import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Skeleton, Tabs } from "antd";
import toast from "react-hot-toast";
import api from "../../../api";
import { useCart } from "../../context/CartContext";
import "./CategoryServices.css";

export default function CategoryServices() {
  const { id } = useParams(); // category id
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCat, setSelectedSubCat] = useState("all");
  const [loading, setLoading] = useState(true);

  const { cart } = useCart();
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all products for this category
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
      } catch (err) {
        console.error("❌ Fetch error:", err);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // ✅ Filter services by selected subcategory
  const filteredServices = services.filter(
    (s) => selectedSubCat === "all" || s.subCategory?._id === selectedSubCat
  );

  // ✅ Get unique brands using Map
  const brandMap = new Map();
  filteredServices.forEach((service) => {
    if (service.brand && service.brand._id) {
      brandMap.set(service.brand._id, service.brand);
    }
  });

  const filteredBrands = Array.from(brandMap.values());

  // ✅ Sort alphabetically by name
  filteredBrands.sort((a, b) => a.name.localeCompare(b.name));

  // ✅ Tabs data for subcategories (with image + text)
  const tabItems = [
    {
      key: "all",
      label: (
        <div className="tab-label">
          <img src="/retro.png" alt="All" className="tab-img" />
          <span>All</span>
        </div>
      ),
    },
    ...subCategories.map((sub) => ({
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
      {loading ? (
        <Skeleton active />
      ) : (
        <>
          {/* Ant Design Tabs with images */}
          <Tabs
            activeKey={selectedSubCat}
            onChange={(key) => setSelectedSubCat(key)}
            items={tabItems}
            tabPosition="top"
            className="category-tabs"
          />

          {/* Unique, Sorted Brands in Grid */}
          {filteredBrands.length > 0 && (
            <div className="brands-container">
              {filteredBrands.map((brand) => (
                <div
                  key={brand._id}
                  className="brand-card-item"
                  onClick={() => navigate(`/brands/${brand._id}`)}
                >
                  <img
                    src={brand.logoUrl || "/placeholder.png"}
                    alt={brand.name}
                  />
                  <p className="brand-name">{brand.name}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
