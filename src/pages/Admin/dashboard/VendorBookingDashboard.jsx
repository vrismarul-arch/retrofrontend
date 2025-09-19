import React, { useEffect, useState } from "react";
import api from "../../../../api";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Row, Col, Card, Spin, Table, Tag } from "antd";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import "./VendorBookingDashboard.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function VendorBookingDashboard() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [bookings, setBookings] = useState([]);

  const fetchOutputData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const [productsRes, bookingsRes] = await Promise.all([
        api.get("/api/vendor/products", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        api.get("/api/admin/bookings", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setProducts(productsRes.data || []);
      setBookings(bookingsRes.data.bookings || []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch output data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOutputData();
  }, []);

  // Metrics
  const pendingBookings = bookings.filter((b) => b.status === "pending").length;
  const deliveredBookings = bookings.filter((b) => b.deliveryStatus === "delivered").length;
  const confirmedBookings = bookings.filter((b) => b.status === "confirmed").length;

  const totalAmount = bookings.reduce(
    (sum, b) =>
      sum +
      b.products.reduce(
        (pSum, p) => pSum + (p.productId?.price || 0) * (p.quantity || 1),
        0
      ),
    0
  );

  const pendingAmount = bookings
    .filter((b) => b.status === "pending")
    .reduce(
      (sum, b) =>
        sum +
        b.products.reduce(
          (pSum, p) => pSum + (p.productId?.price || 0) * (p.quantity || 1),
          0
        ),
      0
    );

  const earnedAmount = bookings
    .filter((b) => b.status === "confirmed" || b.deliveryStatus === "delivered")
    .reduce(
      (sum, b) =>
        sum +
        b.products.reduce(
          (pSum, p) => pSum + (p.productId?.price || 0) * (p.quantity || 1),
          0
        ),
      0
    );

  // Chart data (Stacked bar for bookings overview)
  const chartData = {
    labels: ["Bookings"],
    datasets: [
      {
        label: "Pending",
        data: [pendingBookings],
        backgroundColor: "#facc15",
        borderRadius: 6,
      },
      {
        label: "Confirmed + Delivered",
        data: [confirmedBookings + deliveredBookings],
        backgroundColor: "#3b82f6",
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "bottom" } },
    scales: {
      x: { stacked: true },
      y: { stacked: true, beginAtZero: true, ticks: { stepSize: 1 } },
    },
  };

  // Table columns
  const bookingColumns = [
    {
      title: "Booking ID",
      dataIndex: "bookingId",
      key: "bookingId",
      render: (id) => id || "N/A",
    },
    {
      title: "Customer Name",
      dataIndex: "name",
      key: "name",
      render: (name) => name || "N/A",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email) => email || "N/A",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (phone) => phone || "N/A",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={
            {
              pending: "orange",
              confirmed: "blue",
              cancelled: "red",
            }[status] || "gray"
          }
        >
          {status?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Delivery",
      dataIndex: "deliveryStatus",
      key: "deliveryStatus",
      render: (d) => (
        <Tag color={d === "delivered" ? "green" : "volcano"}>
          {d ? d.toUpperCase() : "PENDING"}
        </Tag>
      ),
    },
    {
      title: "Total Amount",
      key: "totalAmount",
      render: (_, record) => `₹${record.totalAmount || 0}`,
    },
    {
      title: "Products",
      key: "products",
      render: (_, record) =>
        record.products?.map((p) => p.productId?.name).join(", ") || "N/A",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (d) => new Date(d).toLocaleString(),
    },
  ];

  if (loading) return <Spin size="large" className="loading-spinner" />;

  return (
    <div className="vendor-dashboard">
      <h2 className="dashboard-title">Vendor Dashboard</h2>

      {/* Cards with AreaChart sparklines */}
      <Row gutter={[16, 16]} className="dashboard-cards">
        {/* Products */}
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card" bordered={false}>
            <p className="stat-title">Products</p>
            <h2 className="stat-value">{products.length}</h2>
            <ResponsiveContainer width="100%" height={60}>
              <AreaChart
                data={products.map((_, i) => ({ name: `P${i + 1}`, value: i + 1 }))}
              >
                <defs>
                  <linearGradient id="colorProducts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="url(#colorProducts)" />
              </AreaChart>
            </ResponsiveContainer>
            <p className="stat-sub">Total Products Listed</p>
          </Card>
        </Col>

        {/* Total Bookings */}
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card" bordered={false}>
            <p className="stat-title">Total Bookings</p>
            <h2 className="stat-value">{bookings.length}</h2>
            <ResponsiveContainer width="100%" height={60}>
              <AreaChart
                data={bookings.map((_, i) => ({ name: `B${i + 1}`, value: i + 1 }))}
              >
                <defs>
                  <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="value" stroke="#16a34a" fill="url(#colorBookings)" />
              </AreaChart>
            </ResponsiveContainer>
            <p className="stat-sub">Across All Services</p>
          </Card>
        </Col>

        {/* Pending Amount */}
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card" bordered={false}>
            <p className="stat-title">Pending Amount</p>
            <h2 className="stat-value">₹{pendingAmount}</h2>
            <ResponsiveContainer width="100%" height={60}>
              <AreaChart
                data={bookings
                  .filter((b) => b.status === "pending")
                  .map((_, i) => ({ name: `PB${i + 1}`, value: i + 1 }))}
              >
                <defs>
                  <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#facc15" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#facc15" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="value" stroke="#facc15" fill="url(#colorPending)" />
              </AreaChart>
            </ResponsiveContainer>
            <p className="stat-sub">{pendingBookings} Pending Bookings</p>
          </Card>
        </Col>

        {/* Earned Amount */}
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card" bordered={false}>
            <p className="stat-title">Earned Amount</p>
            <h2 className="stat-value">₹{earnedAmount}</h2>
            <ResponsiveContainer width="100%" height={60}>
              <AreaChart
                data={bookings
                  .filter((b) => b.status === "confirmed" || b.deliveryStatus === "delivered")
                  .map((_, i) => ({ name: `EB${i + 1}`, value: i + 1 }))}
              >
                <defs>
                  <linearGradient id="colorEarned" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="url(#colorEarned)" />
              </AreaChart>
            </ResponsiveContainer>
            <p className="stat-sub">{confirmedBookings + deliveredBookings} Completed</p>
          </Card>
        </Col>
      </Row>

      {/* Chart + Table */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card className="chart-card" bordered={false}>
            <h3 className="chart-title">Bookings Overview</h3>
            <Bar data={chartData} options={chartOptions} height={280} />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card className="table-card" bordered={false}>
            <h3 className="chart-title">Bookings Table</h3>
            <Table
              rowKey="_id"
              columns={bookingColumns}
              dataSource={bookings}
              pagination={{ pageSize: 6 }}
              scroll={{ x: "max-content" }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
