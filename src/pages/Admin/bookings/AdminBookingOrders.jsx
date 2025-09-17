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
} from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import toast, { Toaster } from "react-hot-toast";
import api from "../../../../api";
import BookingDetails from "./BookingDetails";

const { Option } = Select;

const AdminBookingOrders = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);

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

      // 🔥 Refetch to ensure fresh data from DB
      fetchBookings();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update delivery status ❌");
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
      render: (status) => {
        const color =
          status === "confirmed"
            ? "green"
            : status === "pending"
            ? "gold"
            : "red";
        return <Tag color={color}>{status?.toUpperCase()}</Tag>;
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
                onConfirm={() => {
                  toast("Cancel booking not implemented");
                }}
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

  return (
    <>
      {/* Toast notifications */}
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
        <Table
          dataSource={bookings}
          columns={columns}
          rowKey="_id"
          scroll={{ x: "max-content" }}
        />
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
