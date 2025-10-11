import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Table,
  Tag,
  Spin,
  message,
  Collapse,
  Descriptions,
} from "antd";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { motion } from "framer-motion";
import api from "../../../../api";
import "./admindashboard.css";

const { Panel } = Collapse;
const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444"];
const cardStyle = {
  borderRadius: 20,
  boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
};

const MotionCard = ({ children, delay = 0, ...props }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay }}
  >
    <Card style={cardStyle} {...props} styles={{ body: { padding: "1rem" } }}>
      {children}
    </Card>
  </motion.div>
);

export default function AdminDashboard() {
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
          api.get("/api/admin/categories", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/api/admin/subcategories", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/api/admin/brands", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/api/admin/products", {
            headers: { Authorization: `Bearer ${token}` },
          }),
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
    if (products.length) {
      const counts = products.reduce((acc, p) => {
        // Safe access to category name
        const name = p.category?.name || p.category || "N/A";
        acc[name] = (acc[name] || 0) + 1;
        return acc;
      }, {});
      setCategoryChartData(
        Object.entries(counts).map(([category, count]) => ({
          category,
          count,
        }))
      );
    }
  }, [products]);

  const productColumns = [
    {
      title: "S.No.",
      render: (_, __, index) => index + 1,
      width: 40,
      align: "center",
    },
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (cat) => (cat?.name ? cat.name : cat || "N/A"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={{ approved: "green", rejected: "red", pending: "orange" }[status] || "gray"}
        >
          {status?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (d) => new Date(d).toLocaleString(),
    },
  ];

  // Collapse items for new AntD API
  const collapseItems = products.map((product) => ({
    key: product._id,
    label: (
      <>
        {product.name} ({product.category?.name || product.category || "N/A"})
        <Tag
          color={{ approved: "green", rejected: "red", pending: "orange" }[product.status] || "gray"}
          style={{ marginLeft: 8 }}
        >
          {product.status?.toUpperCase()}
        </Tag>
      </>
    ),
    children: (
      <Descriptions bordered column={1} size="small">
        <Descriptions.Item label="Name">{product.name}</Descriptions.Item>
        <Descriptions.Item label="Category">{product.category?.name || product.category || "N/A"}</Descriptions.Item>
        <Descriptions.Item label="Stock">{product.stock ?? 0}</Descriptions.Item>
        <Descriptions.Item label="Status">{product.status}</Descriptions.Item>
        <Descriptions.Item label="Description">{product.description || "N/A"}</Descriptions.Item>
        <Descriptions.Item label="Created At">{new Date(product.createdAt).toLocaleString()}</Descriptions.Item>
        {product.images && product.images.length > 0 && (
          <Descriptions.Item label="Images">
            <Row gutter={[8, 8]}>
              {product.images.map((img, idx) => (
                <Col key={idx}>
                  <img src={img} alt={product.name} width={80} style={{ borderRadius: 6 }} />
                </Col>
              ))}
            </Row>
          </Descriptions.Item>
        )}
      </Descriptions>
    ),
  }));

  if (loading) {
    return (
      <Spin
        size="large"
        style={{ display: "block", margin: "2rem auto" }}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Summary Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {Object.keys(summary).map((key, i) => (
          <Col xs={24} sm={12} md={6} key={key}>
            <MotionCard delay={i * 0.1}>
              <h3 style={{ fontSize: "1rem", marginBottom: 8, color: "#6b7280" }}>
                {key[0].toUpperCase() + key.slice(1)}
              </h3>
              <h2 style={{ fontSize: "1.8rem", fontWeight: 700, color: "#111827" }}>
                {summary[key]}
              </h2>
              <AreaChart
                width={150}
                height={50}
                data={[{ uv: 20 }, { uv: 40 }, { uv: 25 }, { uv: 50 }, { uv: 35 }]}
              >
                <defs>
                  <linearGradient id={`colorUv${i}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS[i]} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={COLORS[i]} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="uv"
                  stroke={COLORS[i]}
                  fillOpacity={1}
                  fill={`url(#colorUv${i})`}
                />
              </AreaChart>
            </MotionCard>
          </Col>
        ))}
      </Row>

      {/* Charts */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={12}>
          <MotionCard title={<span style={{ fontWeight: 600 }}>Catalog Overview</span>}>
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
                  innerRadius={60}
                  outerRadius={100}
                  label
                >
                  {COLORS.map((c, i) => (
                    <Cell key={i} fill={c} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </MotionCard>
        </Col>
        <Col xs={24} md={12}>
          <MotionCard title={<span style={{ fontWeight: 600 }}>Products by Category</span>}>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={categoryChartData}>
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </MotionCard>
        </Col>
      </Row>

      {/* Table + Accordion */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={12}>
          <MotionCard title={<span style={{ fontWeight: 600 }}>Products Table</span>}>
            <Table
              rowKey="_id"
              columns={productColumns}
              dataSource={products}
              pagination={{ pageSize: 6 }}
              rowClassName={() => "hover-row"}
              scroll={{ x: "max-content" }}
            />
          </MotionCard>
        </Col>
        <Col xs={24} md={12}>
          <MotionCard title={<span style={{ fontWeight: 600 }}>Products List</span>}>
            <Collapse accordion items={collapseItems} />
          </MotionCard>
        </Col>
      </Row>
    </motion.div>
  );
}
