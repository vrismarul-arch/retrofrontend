import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import "./MegaMenu.css"; // Assuming you have the styles in this file

// ===================================
// Reusable Component: MobileSubcategory
// - Toggles brands list visibility
// ===================================
const MobileSubcategory = ({ sub, onLinkClick }) => {
  const [open, setOpen] = useState(false);
  const hasBrands = sub.brands.length > 0;

  const handleSubHeaderClick = (e) => {
    // Prevent navigating to subcategory link if there are brands to expand
    if (hasBrands) {
      e.preventDefault();
      setOpen(!open);
    } else {
      // If no brands, allow navigation to the subcategory link
      if (onLinkClick) onLinkClick();
    }
  };

  return (
    <li className="mobile-subcategory-item">
      <Link
        to={`/subcategories/${sub._id}`}
        className="subcategory-link"
        onClick={handleSubHeaderClick}
      >
        <span className="mobile-subcategory-name">{sub.name}</span>
        {hasBrands && (
          <span className="toggle-icon">{open ? "▲" : "▼"}</span>
        )}
      </Link>
      
      {/* Brands List (Collapsible Content) */}
      <div className={`mobile-brands-container ${open ? "open" : ""}`}>
        {hasBrands ? (
          <ul className="mobile-brands">
            {sub.brands.map((brand) => (
              <li key={brand._id}>
                <Link to={`/brands/${brand._id}`} onClick={onLinkClick}>
                  {brand.name}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-brands-msg-small">No brands available</p>
        )}
      </div>
    </li>
  );
};

// ===================================
// Reusable Component: MobileCategory
// - Toggles subcategories list visibility
// ===================================
const MobileCategory = ({ cat, onLinkClick }) => {
  const [open, setOpen] = useState(false);
  const hasSubcategories = cat.subcategories.length > 0;

  const toggleOpen = () => {
    setOpen(!open);
  };

  return (
    <li className="mobile-category-item">
      <div className="mobile-category-header" onClick={toggleOpen}>
        {cat.name}
        <span className="toggle-icon">{open ? "▲" : "▼"}</span>
      </div>
      
      {/* Subcategories List (Collapsible Content) */}
      <div className={`mobile-subcategories-container ${open ? "open" : ""}`}>
        {hasSubcategories ? (
          <ul className="mobile-subcategories">
            {cat.subcategories.map((sub) => (
              <MobileSubcategory
                key={sub._id}
                sub={sub}
                onLinkClick={onLinkClick}
              />
            ))}
          </ul>
        ) : (
          <p className="no-subs-msg">No subcategories available</p>
        )}
      </div>
    </li>
  );
};


// ===================================
// Main Component: MegaMenuFull
// ===================================
const MegaMenuFull = ({ mobile = false, onLinkClick }) => {
  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data and structure the menu hierarchy
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

        // Structure the data: Category -> Subcategory -> Brands
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
        // Optionally set menuData to empty array on error
        setMenuData([]); 
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
        {/* Using a simple text-based spinner for consistency, 
            but you could use an Ant Design Spin component here */}
        Loading...
      </div>
    );

  // ----------------------------------------
  // 1. MOBILE VIEW (Custom UI)
  // ----------------------------------------
  if (mobile) {
    return (
      <div className="mobile-menu">
        {menuData.length === 0 ? (
          <p className="no-categories-msg">No Categories available</p>
        ) : (
          <ul className="mobile-menu-new">
            {menuData.map((cat) => (
              <MobileCategory
                key={cat._id}
                cat={cat}
                onLinkClick={handleLinkClick}
              />
            ))}
          </ul>
        )}
      </div>
    );
  }

  // ----------------------------------------
  // 2. DESKTOP VIEW (Original UI)
  // ----------------------------------------
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
                      <Link to={`/subcategories/${sub._id}`} onClick={handleLinkClick}>
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