    import React, { useEffect, useState } from "react";
    import { Card, Row, Col, Statistic, Table, Tag, message, Spin } from "antd";
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

    export default function CatalogDashboard() {
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
