import React, { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Button,
  Popconfirm,
  Spin,
  Drawer,
  Select,
  Row,
  Col,
  Avatar,
  Dropdown,
  Menu,
  Tabs,
  Card,
  Grid,
} from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import toast, { Toaster } from "react-hot-toast";
import api from "../../../../api";
import BookingDetails from "./BookingDetails";
import "./AdminBookingOrders.css"; // 👈 import CSS

const { Option } = Select;
const { TabPane } = Tabs;
const { useBreakpoint } = Grid;

const AdminBookingOrders = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const screens = useBreakpoint();

  // =========================
  // Fetch all bookings
  // =========================
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/admin/bookings", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setBookings(res.data.bookings || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load bookings ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // =========================
  // Update delivery status
  // =========================
  const handleDeliveryUpdate = async (id, value) => {
    try {
      await api.put(
        `/api/admin/bookings/${id}`,
        { deliveryStatus: value },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      toast.success("Delivery status updated ✅");
      fetchBookings();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update delivery status ❌");
    }
  };

  // =========================
  // Update booking status
  // =========================
  const handleStatusUpdate = async (id, value) => {
    try {
      await api.put(
        `/api/admin/bookings/${id}`,
        { status: value },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      toast.success("Booking status updated ✅");
      fetchBookings();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update booking status ❌");
    }
  };

  const showDrawer = (bookingId) => {
    setSelectedBookingId(bookingId);
    setDrawerVisible(true);
  };

  // =========================
  // Table Columns
  // =========================
  const columns = [
    { title: "#", render: (_, __, index) => index + 1, width: 50 },
    {
      title: "Booking ID",
      dataIndex: "bookingId",
      render: (id) => <strong>{id}</strong>,
    },
    {
      title: "Customer",
      key: "customer",
      render: (_, record) => {
        const user = record.user || {};
        return (
          <div>
            <strong>{user.name || record.name || "Unknown"}</strong>
            <br />
            {user.email || record.email || "-"}
            <br />
            {user.phone || record.phone || "-"}
          </div>
        );
      },
    },
    {
      title: "Products",
      key: "products",
      render: (_, record) =>
        record.products?.length > 0 ? (
          <Row gutter={[4, 4]}>
            {record.products.map((p) => {
              const product = p.productId || {};
              const img = product.image || product.images?.[0];
              return (
                <Col key={p._id} span={24}>
                  <Tag
                    color="blue"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    {img && (
                      <Avatar
                        src={img}
                        size={20}
                        shape="square"
                        style={{ marginRight: 4 }}
                      />
                    )}
                    {product.name || "Product"} × {p.quantity || 1} ₹
                    {product.price || 0}
                  </Tag>
                </Col>
              );
            })}
          </Row>
        ) : (
          <span>-</span>
        ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => {
        return (
          <Popconfirm
            title="Change booking status?"
            okText="Yes"
            cancelText="No"
            onConfirm={() =>
              handleStatusUpdate(record._id, record.newStatus || status)
            }
          >
            <Select
              value={status}
              style={{ width: 140 }}
              onChange={(value) => {
                record.newStatus = value;
              }}
            >
              <Option value="pending">Pending</Option>
              <Option value="confirmed">Confirmed</Option>
              <Option value="cancelled">Cancelled</Option>
            </Select>
          </Popconfirm>
        );
      },
    },
    {
      title: "Delivery Status",
      dataIndex: "deliveryStatus",
      key: "deliveryStatus",
      render: (status, record) => (
        <Select
          value={status || "pending"}
          style={{ width: 140 }}
          onChange={(value) => handleDeliveryUpdate(record._id, value)}
        >
          <Option value="pending">Pending</Option>
          <Option value="shipping">Shipping</Option>
          <Option value="delivered">Delivered</Option>
        </Select>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        const menu = (
          <Menu>
            <Menu.Item key="view">
              <Button type="text" onClick={() => showDrawer(record._id)}>
                View
              </Button>
            </Menu.Item>
            <Menu.Item key="cancel">
              <Popconfirm
                title="Are you sure?"
                onConfirm={() => toast("Cancel booking not implemented")}
              >
                <Button type="text" danger>
                  Cancel
                </Button>
              </Popconfirm>
            </Menu.Item>
          </Menu>
        );
        return (
          <Dropdown overlay={menu} trigger={["click"]}>
            <Button icon={<EllipsisOutlined />} />
          </Dropdown>
        );
      },
    },
  ];

  // =========================
  // Mobile card view (styled + functional)
  // =========================
  const renderCards = (data) => (
    <Row gutter={[16, 16]}>
      {data.map((record, idx) => {
        const user = record.user || {};
        return (
          <Col xs={24} key={record._id}>
            <Card
              className="booking-card"
              title={`#${idx + 1} - ${record.bookingId}`}
              extra={
                <Dropdown
                  overlay={
                    <Menu>
                      <Menu.Item key="view">
                        <Button type="text" onClick={() => showDrawer(record._id)}>
                          View
                        </Button>
                      </Menu.Item>
                      <Menu.Item key="cancel">
                        <Popconfirm
                          title="Are you sure?"
                          onConfirm={() => toast("Cancel booking not implemented")}
                        >
                          <Button type="text" danger>
                            Cancel
                          </Button>
                        </Popconfirm>
                      </Menu.Item>
                    </Menu>
                  }
                  trigger={["click"]}
                >
                  <Button icon={<EllipsisOutlined />} />
                </Dropdown>
              }
            >
              {/* Customer */}
              <p>
                <strong>Customer:</strong> {user.name || record.name || "Unknown"}
                <br />
                {user.email || record.email || "-"}
                <br />
                {user.phone || record.phone || "-"}
              </p>

              {/* Products */}
              <div>
                <strong>Products:</strong>
                {record.products?.map((p) => {
                  const product = p.productId || {};
                  const img = product.image || product.images?.[0];
                  return (
                    <Tag
                      key={p._id}
                      color="blue"
                      style={{ display: "flex", alignItems: "center", marginTop: 4 }}
                    >
                      {img && (
                        <Avatar
                          src={img}
                          size={20}
                          shape="square"
                          style={{ marginRight: 4 }}
                        />
                      )}
                      {product.name || "Product"} × {p.quantity || 1} ₹
                      {product.price || 0}
                    </Tag>
                  );
                })}
              </div>

              {/* Status */}
              <div style={{ marginTop: 12 }}>
                <strong>Status: </strong>
                <Popconfirm
                  title="Change booking status?"
                  okText="Yes"
                  cancelText="No"
                  onConfirm={() =>
                    handleStatusUpdate(record._id, record.newStatus || record.status)
                  }
                >
                  <Select
                    value={record.status}
                    style={{ width: "100%" }}
                    onChange={(value) => {
                      record.newStatus = value;
                    }}
                  >
                    <Option value="pending">Pending</Option>
                    <Option value="confirmed">Confirmed</Option>
                    <Option value="cancelled">Cancelled</Option>
                  </Select>
                </Popconfirm>
              </div>

              {/* Delivery */}
              <div style={{ marginTop: 12 }}>
                <strong>Delivery: </strong>
                <Select
                  value={record.deliveryStatus || "pending"}
                  style={{ width: "100%" }}
                  onChange={(value) => handleDeliveryUpdate(record._id, value)}
                >
                  <Option value="pending">Pending</Option>
                  <Option value="shipping">Shipping</Option>
                  <Option value="delivered">Delivered</Option>
                </Select>
              </div>
            </Card>
          </Col>
        );
      })}
    </Row>
  );

  // =========================
  // Tabs
  // =========================
  const statusTabs = ["all", "pending", "confirmed", "cancelled"];

  const getColor = (status) => {
    switch (status) {
      case "confirmed":
        return "green";
      case "pending":
        return "gold";
      case "cancelled":
        return "red";
      default:
        return "blue";
    }
  };

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          success: { style: { background: "#4CAF50", color: "#fff" } },
          error: { style: { background: "#F44336", color: "#fff" } },
        }}
      />

      {loading ? (
        <Spin tip="Loading..." style={{ display: "block", margin: "2rem auto" }} />
      ) : (
        <Tabs defaultActiveKey="all">
          {statusTabs.map((status) => {
            const filtered =
              status === "all"
                ? bookings
                : bookings.filter((b) => b.status === status);
            return (
              <TabPane
                tab={
                  <span>
                    <Tag color={getColor(status)}>
                      {status.toUpperCase()}
                    </Tag>{" "}
                    ({filtered.length})
                  </span>
                }
                key={status}
              >
                {screens.xs
                  ? renderCards(filtered) // mobile → cards
                  : (
                    <Table
                      dataSource={filtered}
                      columns={columns}
                      rowKey="_id"
                      scroll={{ x: "max-content" }}
                    />
                  )}
              </TabPane>
            );
          })}
        </Tabs>
      )}

      <Drawer
        title="Booking Details"
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        width={720}
      >
        {selectedBookingId && (
          <BookingDetails
            bookingId={selectedBookingId}
            onDeliveryChange={(id, value) => handleDeliveryUpdate(id, value)}
          />
        )}
      </Drawer>
    </>
  );
};

export default AdminBookingOrders;
