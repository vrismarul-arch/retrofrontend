import React, { useState, useEffect } from "react";
import { Slider, Checkbox, Button, Drawer, Divider } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import "./FiltersBar.css";

export default function FiltersBar({ onApplyFilters, products = [] }) {
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [status, setStatus] = useState(["all"]); // default "all" checked
  const [condition, setCondition] = useState(["all"]); // default "all" checked
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const statusOptions = ["all", "New Arrival", "Best Selling", "Out of Stock"];
  const conditionOptions = ["all", "New", "Used", "Refurbished"];

  // Handle window resize for mobile
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Initialize price range when products change
  useEffect(() => {
    const maxPrice = products.length
      ? Math.max(...products.map((p) => p.finalPrice || p.price))
      : 100000;
    setPriceRange([0, maxPrice]);
    onApplyFilters({ priceRange: [0, maxPrice], status, condition });
  }, [products]);

  // Apply filters whenever any filter changes
  useEffect(() => {
    onApplyFilters({ priceRange, status, condition });
  }, [priceRange, status, condition]);

  const handleReset = () => {
    const maxPrice = products.length
      ? Math.max(...products.map((p) => p.finalPrice || p.price))
      : 100000;
    setStatus(["all"]);
    setCondition(["all"]);
    setPriceRange([0, maxPrice]);
    onApplyFilters({ priceRange: [0, maxPrice], status: ["all"], condition: ["all"] });
  };

  const renderFiltersContent = () => {
    const contentClass = isMobile ? "filters-bar-content-mobile" : "filters-bar-content";
    const maxSliderPrice = products.length
      ? Math.max(...products.map((p) => p.finalPrice || p.price))
      : 100000;

    return (
      <div className={contentClass}>
        <div className="head">
          <h2>Filters</h2>
          <Button type="default" onClick={handleReset}>Reset</Button>
        </div>
        <Divider />

        <h4>Filter Status (New Arrival, Bestselling...)</h4>
        <Checkbox.Group
          options={statusOptions}
          value={status}
          onChange={setStatus}
        />

        <h4>Filter Condition (Used, New...)</h4>
        <Checkbox.Group
          options={conditionOptions}
          value={condition}
          onChange={setCondition}
        />

        <div className="filters-bar-price">
          <p>Price: ₹{priceRange[0]} – ₹{priceRange[1]}</p>
          <Slider
            range
            min={0}
            max={maxSliderPrice}
            step={100}
            value={priceRange}
            onChange={setPriceRange}
          />
        </div>

      </div>
    );
  };

  return (
    <div className="filters-bar">
      {isMobile ? (
        <>
          <Button
            type="primary"
            icon={<FilterOutlined />}
            onClick={() => setDrawerVisible(true)}
          >
            Filters
          </Button>
          <Drawer
            title="Filters"
            placement="bottom"
            height="auto"
            onClose={() => setDrawerVisible(false)}
            open={drawerVisible}
            closable={true}
            bodyStyle={{ padding: "16px 20px" }}
            drawerStyle={{ borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
          >
            {renderFiltersContent()}
          </Drawer>
        </>
      ) : (
        renderFiltersContent()
      )}
    </div>
  );
}
