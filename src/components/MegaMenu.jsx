import React, { useState, useEffect } from "react";
import { Collapse } from "antd";
import { Link } from "react-router-dom";
import api from "../../api";
import "./MegaMenu.css";

const { Panel } = Collapse;

const MegaMenu = ({ mobile = false }) => {
  const [menuData, setMenuData] = useState([]);

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
            .filter((sub) => sub.category && sub.category._id === cat._id)
            .map((sub) => ({
              ...sub,
              brands: brands.filter(
                (brand) =>
                  brand.categories.some((c) => c._id === cat._id) ||
                  brand.subCategories.some((s) => s._id === sub._id)
              ),
            }));
          return { ...cat, subcategories: subs };
        });

        setMenuData(menu);
      } catch (err) {
        console.error("Failed to fetch menu data:", err);
      }
    };
    fetchMenuData();
  }, []);

  // -------- MOBILE MENU --------
  if (mobile) {
    return (
      <div className="mobile-categories">
        <Collapse accordion>
          {menuData.length === 0 && <Panel header="No Categories" key="empty" />}
          {menuData.map((cat) => (
            <Panel header={cat.name} key={cat._id}>
              {cat.subcategories.length === 0 ? (
                <p>No subcategories</p>
              ) : (
                cat.subcategories.map((sub) => (
                  <Collapse key={sub._id} className="mobile-subcategory-collapse">
                    <Panel header={sub.name}>
                      {sub.brands.length === 0 ? (
                        <p className="disabled">No brands</p>
                      ) : (
                        sub.brands.map((brand) => (
                          <p key={brand._id}>
                            <Link to={`/brands/${brand._id}`}>{brand.name}</Link>
                          </p>
                        ))
                      )}
                    </Panel>
                  </Collapse>
                ))
              )}
            </Panel>
          ))}
        </Collapse>
      </div>
    );
  }

  // -------- DESKTOP MENU --------
  return (
    <div className="mega-menu-container">
      <ul className="mega-menu">
        {menuData.length === 0 && <li className="mega-menu-item">No Categories</li>}
        {menuData.map((cat) => (
          <li className="mega-menu-item" key={cat._id}>
            <span className="category-name">{cat.name}</span>
            {cat.subcategories.length > 0 && (
              <div className="mega-dropdown">
                {cat.subcategories.map((sub) => (
                  <div className="mega-column" key={sub._id}>
                    <Link to={`/subcategories/${sub._id}`}>
                      <h4>{sub.name}</h4>
                    </Link>
                    {sub.brands.length === 0 ? (
                      <span className="disabled">No Brands</span>
                    ) : (
                      sub.brands.map((brand) => (
                        <Link to={`/brands/${brand._id}`} key={brand._id}>
                          {brand.name}
                        </Link>
                      ))
                    )}
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

export default MegaMenu;
