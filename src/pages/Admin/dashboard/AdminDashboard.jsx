import React, { useEffect, useState } from "react";
import {
  Tabs,
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Tag,
  message,
  Spin,
} from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import api from "../../../../api";
import "./admindashboard.css";

const { TabPane } = Tabs;

export default function AdminDashboard() {
  return (
    <div style={{ padding: 24, fontFamily: "'Inter', sans-serif" }}>
      <h2
        style={{
          fontSize: "2.2rem",
          fontWeight: 700,
          background: "linear-gradient(90deg,#4f46e5,#3b82f6)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: "2rem",
        }}
      >
        Admin Dashboard
      </h2>
      <Tabs
        defaultActiveKey="input"
        destroyInactiveTabPane
        type="card"
        tabBarStyle={{ fontWeight: 600 }}
      >
        <TabPane tab="Input / Catalog" key="input">
          <CatalogDashboard />
        </TabPane>
        <TabPane tab="Output / Orders" key="output">
          <VendorBookingDashboard />
        </TabPane>
      </Tabs>
    </div>
  );
}

// =========================
// Catalog / Input Tab
// =========================
function CatalogDashboard() {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState({
    categories: 0,
    subcategories: 0,
    brands: 0,
    products: 0,
  });
  const [products, setProducts] = useState([]);
  const [categoryChartData, setCategoryChartData] = useState([]);

  const fetchCatalogData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const [categoriesRes, subcategoriesRes, brandsRes, productsRes] =
        await Promise.all([
          api.get("/api/admin/categories", { headers: { Authorization: `Bearer ${token}` } }),
          api.get("/api/admin/subcategories", { headers: { Authorization: `Bearer ${token}` } }),
          api.get("/api/admin/brands", { headers: { Authorization: `Bearer ${token}` } }),
          api.get("/api/admin/products", { headers: { Authorization: `Bearer ${token}` } }),
        ]);

      setSummary({
        categories: categoriesRes.data.length,
        subcategories: subcategoriesRes.data.length,
        brands: brandsRes.data.length,
        products: productsRes.data.length,
      });

      setProducts(productsRes.data || []);
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch catalog data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalogData();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      const categoryCounts = products.reduce((acc, product) => {
        acc[product.category] = (acc[product.category] || 0) + 1;
        return acc;
      }, {});
      setCategoryChartData(
        Object.entries(categoryCounts).map(([category, count]) => ({ category, count }))
      );
    }
  }, [products]);

  const productColumns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Category", dataIndex: "category", key: "category" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const colors = { approved: "green", rejected: "red", pending: "orange" };
        return <Tag color={colors[status] || "gray"}>{status?.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleString(),
    },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <>
      {loading ? (
        <Spin tip="Loading..." style={{ display: "block", margin: "2rem auto" }} size="large" />
      ) : (
        <>
          {/* Summary Cards */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            {Object.entries(summary).map(([key, value]) => (
              <Col xs={24} sm={12} md={6} key={key}>
                <Card
                  style={{
                    borderRadius: 16,
                    background: "linear-gradient(145deg,#f0f4ff,#ffffff)",
                    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                  }}
                  hoverable
                  bodyStyle={{ textAlign: "center", padding: "1.8rem" }}
                >
                  <Statistic
                    title={key.charAt(0).toUpperCase() + key.slice(1)}
                    value={value}
                    valueStyle={{ fontSize: "1.7rem", fontWeight: 700, color: "#3b82f6" }}
                  />
                </Card>
              </Col>
            ))}
          </Row>

          {/* Charts */}
          <Row gutter={24} style={{ marginBottom: 24 }}>
            <Col xs={24} md={12}>
              <Card
                title="Catalog Summary (Donut)"
                style={{ borderRadius: 16, boxShadow: "0 6px 18px rgba(0,0,0,0.08)" }}
              >
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Products", value: summary.products },
                        { name: "Categories", value: summary.categories },
                        { name: "Brands", value: summary.brands },
                        { name: "Subcategories", value: summary.subcategories },
                      ]}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={100}
                      label
                    >
                      {COLORS.map((color, index) => (
                        <Cell key={index} fill={color} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card
                title="Products by Category (Bar)"
                style={{ borderRadius: 16, boxShadow: "0 6px 18px rgba(0,0,0,0.08)" }}
              >
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={categoryChartData}>
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#4f46e5" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>

          {/* Products Table */}
          <Card
            title="Products Table"
            bodyStyle={{ padding: "1rem" }}
            style={{ borderRadius: 16, boxShadow: "0 6px 18px rgba(0,0,0,0.08)" }}
          >
            <Table
              rowKey="_id"
              columns={productColumns}
              dataSource={products}
              pagination={{ pageSize: 6 }}
              rowClassName={() => "hover-row"}
            />
          </Card>
        </>
      )}
    </>
  );
}

// =========================
// Vendor & Booking / Output Tab
// =========================
function VendorBookingDashboard() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [bookings, setBookings] = useState([]);

  const fetchOutputData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const [productsRes, bookingsRes] = await Promise.all([
        api.get("/api/vendor/products", { headers: { Authorization: `Bearer ${token}` } }),
        api.get("/api/admin/bookings", { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setProducts(productsRes.data || []);
      setBookings(bookingsRes.data.bookings || []);
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch output data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOutputData();
  }, []);

  const pendingBookings = bookings.filter((b) => b.status === "pending").length;
  const deliveredBookings = bookings.filter((b) => b.deliveryStatus === "delivered").length;

  const totalAmount = bookings.reduce(
    (sum, b) => sum + b.products.reduce((pSum, p) => pSum + (p.productId?.price || 0) * (p.quantity || 1), 0),
    0
  );
  const pendingAmount = bookings
    .filter((b) => b.status === "pending")
    .reduce(
      (sum, b) => sum + b.products.reduce((pSum, p) => pSum + (p.productId?.price || 0) * (p.quantity || 1), 0),
      0
    );
  const earnedAmount = bookings
    .filter((b) => b.status === "confirmed" || b.deliveryStatus === "delivered")
    .reduce(
      (sum, b) => sum + b.products.reduce((pSum, p) => pSum + (p.productId?.price || 0) * (p.quantity || 1), 0),
      0
    );

  const summaryCards = [
    { title: "Vendor Products", value: products.length },
    { title: "Total Bookings", value: bookings.length },
    { title: "Pending Bookings", value: pendingBookings },
    { title: "Delivered Bookings", value: deliveredBookings },
    { title: "Total Amount", value: totalAmount, prefix: "₹" },
    { title: "Pending Amount", value: pendingAmount, prefix: "₹" },
    { title: "Earned Amount", value: earnedAmount, prefix: "₹" },
  ];

  const bookingsChartData = [
    { status: "Pending", count: pendingBookings },
    { status: "Delivered", count: deliveredBookings },
    { status: "Confirmed", count: bookings.filter((b) => b.status === "confirmed").length },
  ];

  return (
    <>
      {loading ? (
        <Spin tip="Loading..." style={{ display: "block", margin: "2rem auto" }} size="large" />
      ) : (
        <>
          {/* Summary Cards */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            {summaryCards.map((item) => (
              <Col xs={24} sm={12} md={6} key={item.title}>
                <Card
                  style={{
                    borderRadius: 16,
                    background: "linear-gradient(145deg,#fff9f0,#ffffff)",
                    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                  }}
                  hoverable
                  bodyStyle={{ textAlign: "center", padding: "1.5rem" }}
                >
                  <Statistic
                    title={item.title}
                    value={item.value}
                    prefix={item.prefix || ""}
                    valueStyle={{ fontSize: "1.6rem", fontWeight: 700, color: "#3b82f6" }}
                  />
                </Card>
              </Col>
            ))}
          </Row>

          {/* Bookings Chart */}
          <Row gutter={24} style={{ marginBottom: 24 }}>
            <Col xs={24} md={12}>
              <Card
                title="Bookings Overview"
                style={{ borderRadius: 16, boxShadow: "0 6px 18px rgba(0,0,0,0.08)" }}
              >
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={bookingsChartData}>
                    <XAxis dataKey="status" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </>
  );
}
