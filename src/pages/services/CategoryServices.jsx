import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Skeleton, Button } from "antd";
import toast from "react-hot-toast";
import api from "../../../api";
import { useCart } from "../../context/CartContext";
import "../../css/CategoryServices.css";

export default function CategoryServices() {
  const { id } = useParams(); // category id
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedSubCat, setSelectedSubCat] = useState(null);
  const [loading, setLoading] = useState(true);

  const { cart, addToCart, removeFromCart } = useCart();
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

        // Extract unique brands
        const uniqueBrands = new Set();
        res.data.forEach((service) => {
          if (service.brand) {
            uniqueBrands.add(JSON.stringify(service.brand));
          }
        });
        const brandArray = Array.from(uniqueBrands).map((b) => JSON.parse(b));
        setBrands(brandArray);

      } catch (err) {
        console.error("❌ Fetch error:", err);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);


  const isInCart = (serviceId) =>
    cart.some((item) => item.product._id === serviceId);

  


  const filteredServices = services.filter(
    (s) =>
      (!selectedSubCat || s.subCategory?._id === selectedSubCat)
  );

  return (
    <div className="category-services">
      {loading ? (
        <Skeleton active />
      ) : (
        <>
          {/* Subcategory Filter */}
          {subCategories.length > 0 && (
            <div className="subcat-scroll">
            
              {subCategories.map((sub) => (
                <div
                  key={sub._id}
                  className={`subcat-card ${selectedSubCat === sub._id ? "active" : ""}`}
                  onClick={() => setSelectedSubCat(sub._id)}
                >
                  <img src={sub.imageUrl || "/placeholder.png"} alt={sub.name} className="subcat-img" />
                  <p>{sub.name}</p>
                </div>
              ))}
            </div>
          )}

          {/* Brands (click to navigate) */}
          {brands.length > 0 && (
            <div className="subcat-scroll">
              {brands.map((brand) => (
                <div
                  key={brand._id}
                  className="subcat-card"
                  onClick={() => navigate(`/brands/${brand._id}`)} // ✅ Navigate to brand page
                >
                  <img src={brand.logoUrl || "/placeholder.png"} alt={brand.name} className="subcat-img" />
                  <p>{brand.name}</p>
                </div>
              ))}
            </div>
          )}

         

         
        </>
      )}
    </div>
  );
}
