import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Collapse, Spin } from "antd";
import api from "../../api";
import "./MegaMenu.css";

const { Panel } = Collapse;

// Reusable component for mobile subcategory + brands
const MobileSubcategory = ({ sub, onLinkClick }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="mobile-subcategory">
      <div
        className="mobile-subcategory-header"
        onClick={() => setOpen(!open)}
      >
        {sub.name} {sub.brands.length > 0 && <span>{open ? "▲" : "▼"}</span>}
      </div>
      {open && sub.brands.length > 0 && (
        <ul className="mobile-brands">
          {sub.brands.map((brand) => (
            <li key={brand._id}>
              <Link to={`/brands/${brand._id}`} onClick={onLinkClick}>
                {brand.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const MegaMenuFull = ({ mobile = false, onLinkClick }) => {
  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const [catRes, subRes, brandRes] = await Promise.all([
          api.get("/api/admin/categories"),
          api.get("/api/admin/subcategories"),
          api.get("/api/admin/brands"),
        ]);

        const categories = catRes.data;
        const subcategories = subRes.data;
        const brands = brandRes.data;

        const menu = categories.map((cat) => {
          const subs = subcategories
            .filter((sub) => sub.category?._id === cat._id)
            .map((sub) => ({
              ...sub,
              brands: brands.filter((brand) =>
                brand.subCategories.some((s) => s._id === sub._id)
              ),
            }));
          return { ...cat, subcategories: subs };
        });

        setMenuData(menu);
      } catch (err) {
        console.error("Failed to fetch menu data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenuData();
  }, []);

  const handleLinkClick = () => {
    if (onLinkClick) onLinkClick();
  };

if (loading) 
  return (
    <div style={{ textAlign: "center", marginTop: "2rem", fontSize: "1.2rem" }}>
      Loading...
    </div>
  );

  // -------- MOBILE VIEW --------
  if (mobile) {
    return (
      <div className="mobile-menu">
        {menuData.length === 0 && <p>No Categories</p>}
        {menuData.map((cat) => (
          <Collapse
            key={cat._id}
            bordered={false}
            accordion
            expandIconPosition="end"
          >
            <Panel header={cat.name} key={cat._id}>
              {cat.subcategories.length === 0 ? (
                <p>No subcategories</p>
              ) : (
                cat.subcategories.map((sub) => (
                  <MobileSubcategory
                    key={sub._id}
                    sub={sub}
                    onLinkClick={handleLinkClick}
                  />
                ))
              )}
            </Panel>
          </Collapse>
        ))}
      </div>
    );
  }

  // -------- DESKTOP VIEW --------
  return (
     <div className="desktop-menu">
      <ul className="mega-menu">
        {menuData.map((cat) => (
          <li className="mega-menu-item" key={cat._id}>
            <span className="category-name">{cat.name}</span>
            {cat.subcategories.length > 0 && (
              <div className="mega-dropdown">
                {cat.subcategories.map((sub) => (
                  <div className="mega-column" key={sub._id}>
                    <h4 className="subcategory-title">
                      <Link to={`/subcategories/${sub._id}`}>
                        {sub.name}
                      </Link>
                    </h4>
                    <ul>
                      {sub.brands.length === 0 ? (
                        <li className="disabled">No Items</li>
                      ) : (
                        sub.brands.map((brand) => (
                          <li key={brand._id}>
                            <Link to={`/brands/${brand._id}`} onClick={handleLinkClick}>
                              {brand.name}
                            </Link>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MegaMenuFull;
