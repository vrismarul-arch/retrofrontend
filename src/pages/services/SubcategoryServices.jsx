import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Skeleton, Breadcrumb } from "antd";
import toast from "react-hot-toast";
import api from "../../../api";
import { useCart } from "../../context/CartContext";
import "./SubcategoryServices.css";

export default function SubcategoryServices() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [brands, setBrands] = useState([]);
  const [subCategory, setSubCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const { cart, addToCart, removeFromCart } = useCart();

  const roundPrice = (p) => Number(Number(p || 0).toFixed(2));

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const subCatRes = await api.get(`/api/admin/subcategories/${id}`);
        setSubCategory(subCatRes.data);

        const prodRes = await api.get(`/api/admin/products?subCategory=${id}`);
        setServices(prodRes.data);

        const brandsRes = await api.get("/api/admin/brands");
        const filteredBrands = brandsRes.data.filter((brand) =>
          prodRes.data.some((p) => p.brand?._id === brand._id)
        );
        setBrands(filteredBrands);
      } catch (err) {
        console.error("❌ Fetch error:", err);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  return (
    <div className="subcategory-services">
      {/* Breadcrumb */}
      <div className="subcategory-services__breadcrumb">
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/">Home</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            {subCategory ? subCategory.name : "Subcategory"}
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <Skeleton active className="subcategory-services__skeleton" />
      ) : (
        <>
          {brands.length > 0 && (
            <div className="subcategory-services__grid">
  {brands.map((brand) => (
    <div
      key={brand._id}
      className="subcategory-services__brand-card"
      onClick={() => navigate(`/brands/${brand._id}`)}
    >
      <img
        src={brand.logoUrl || "/placeholder.png"}
        alt={brand.name}
        className="subcategory-services__brand-image"
      />
      <p className="subcategory-services__brand-name">{brand.name}</p>
    </div>
  ))}
</div>

          )}
        </>
      )}
    </div>
  );
}
