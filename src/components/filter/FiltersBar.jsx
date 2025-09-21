import React, { useState, useEffect } from "react";
import { Slider, Select, Button, Drawer } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import "./FiltersBar.css";

const { Option } = Select;

export default function FiltersBar({ onApplyFilters, products }) {
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [status, setStatus] = useState("all");
  const [condition, setCondition] = useState("all");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const statusOptions = ["all", "New Arrival", "Best Selling", "Out of Stock"];
  const conditionOptions = ["all", "New", "Used", "Refurbished"];

  // Detect screen resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Dynamically set max price
  useEffect(() => {
    if (products?.length) {
      const maxPrice = Math.max(...products.map((p) => p.finalPrice || p.price));
      setPriceRange([0, maxPrice]);
      onApplyFilters({ priceRange: [0, maxPrice], status, condition });
    }
  }, [products]);

  // Apply filters on change
  useEffect(() => {
    onApplyFilters({ priceRange, status, condition });
  }, [priceRange, status, condition]);

  const handleReset = () => {
    const maxPrice = Math.max(...products.map((p) => p.finalPrice || p.price), 100000);
    setStatus("all");
    setCondition("all");
    setPriceRange([0, maxPrice]);
    onApplyFilters({ priceRange: [0, maxPrice], status: "all", condition: "all" });
  };

  // Content rendering
  const renderFiltersContent = () => {
    const contentClass = isMobile ? "filters-bar-content-mobile" : "filters-bar-content";
    return (
      <div className={contentClass}>
        {/* Status Dropdown */}
        <Select value={status} onChange={setStatus} placeholder="Select Status">
          {statusOptions.map((s) => (
            <Option key={s} value={s}>{s}</Option>
          ))}
        </Select>

        {/* Condition Dropdown */}
        <Select value={condition} onChange={setCondition} placeholder="Select Condition">
          {conditionOptions.map((c) => (
            <Option key={c} value={c}>{c}</Option>
          ))}
        </Select>

        {/* Price Slider */}
        <div className="filters-bar-price">
          <p>Price: ₹{priceRange[0]} – ₹{priceRange[1]}</p>
          <Slider
            range
            min={0}
            max={Math.max(...products.map((p) => p.finalPrice || p.price), 100000)}
            step={100}
            value={priceRange}
            onChange={setPriceRange}
          />
        </div>

        {/* Reset Button */}
        <Button type="default" onClick={handleReset}>
          Reset
        </Button>
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
