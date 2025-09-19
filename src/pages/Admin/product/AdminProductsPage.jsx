import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Tag,
  Popconfirm,
  Space,
  Drawer,
  Descriptions,
  Tabs,
  Image,
  Form,
  Input,
  Upload,
  List,
  Card,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import toast, { Toaster } from "react-hot-toast";
import api from "../../../../api";
import "./products.css";
/*  */

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();

  // Fetch all products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/api/vendor/products");
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Approve / Reject
  const approveProduct = async (id) => {
    try {
      await api.put(`/api/vendor/products/${id}/approve`);
      toast.success("Product approved");
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to approve product");
    }
  };

  const rejectProduct = async (id) => {
    try {
      await api.put(`/api/vendor/products/${id}/reject`);
      toast.success("Product rejected");
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to reject product");
    }
  };

  // Open drawer and populate form
  const openDrawer = (product) => {
    setSelectedProduct(product);
    form.setFieldsValue({
      name: product.name,
      phone: product.phone,
      email: product.email,
      city: product.city,
      productName: product.productName,
      dimension: product.dimension,
      productDetails: product.productDetails,
      description: product.description,
    });

    const files = product.images?.map((url, idx) => ({
      uid: idx,
      name: `image-${idx}`,
      status: "done",
      url,
    }));
    setFileList(files || []);
    setDrawerOpen(true);
  };

  // Update product
  const updateProduct = async (values) => {
    try {
      const formData = new FormData();
      Object.keys(values).forEach((key) => formData.append(key, values[key]));
      fileList.forEach((file) => {
        if (file.originFileObj) formData.append("images", file.originFileObj);
      });

      await api.put(`/api/vendor/products/${selectedProduct._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Product updated successfully");
      fetchProducts();
      setDrawerOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update product");
    }
  };

  // Table columns
  const columns = [
    { title: "S.No", render: (_, __, index) => index + 1, width: 70 },
    { title: "Product Name", dataIndex: "productName", key: "productName" },
    { title: "City", dataIndex: "city", key: "city" },
    {
      title: "Image",
      dataIndex: "images",
      key: "image",
      render: (images, record) =>
        images?.length > 0 ? (
          <img
            src={images[0]}
            alt={record.productName}
            style={{
              width: "60px",
              height: "60px",
              objectFit: "cover",
              borderRadius: "6px",
              border: "1px solid #eee",
            }}
          />
        ) : (
          "No Image"
        ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => {
        const color =
          status === "approved" ? "green" : status === "rejected" ? "red" : "orange";
        return <Tag color={color}>{status?.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button onClick={() => openDrawer(record)}>View / Edit</Button>
          {record.status === "pending" && (
            <>
              <Popconfirm title="Approve?" onConfirm={() => approveProduct(record._id)}>
                <Button type="primary">Approve</Button>
              </Popconfirm>
              <Popconfirm title="Reject?" onConfirm={() => rejectProduct(record._id)}>
                <Button danger>Reject</Button>
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    },
  ];

  const filteredProducts =
    filter === "all" ? products : products.filter((p) => p.status === filter);

  return (
    <div style={{ padding: 20 }}>
      <Toaster position="top-right" reverseOrder={false} />
      <h2 className="text-xl font-bold mb-4">Vendor Product Management</h2>

      {/* Tabs */}
      <Tabs
        activeKey={filter}
        onChange={(key) => setFilter(key)}
        items={[
          { key: "all", label: "All" },
          { key: "pending", label: "Pending" },
          { key: "approved", label: "Approved" },
          { key: "rejected", label: "Rejected" },
        ]}
      />

      {/* Desktop Table */}
      <div className="desktop-table">
        <Table
          rowKey="_id"
          loading={loading}
          columns={columns}
          dataSource={filteredProducts}
        />
      </div>

      {/* Mobile Cards */}
      <div className="mobile-cards">
        <List
          loading={loading}
          dataSource={filteredProducts}
          grid={{ gutter: 16, column: 1 }}
          renderItem={(item, index) => (
            <List.Item>
              <Card
                className="product-card"
                cover={
                  item.images?.length > 0 ? (
                    <img
                      alt={item.productName}
                      src={item.images[0]}
                      className="product-card-img"
                    />
                  ) : null
                }
                title={`${index + 1}. ${item.productName}`}
                extra={
                  <Tag
                    color={
                      item.status === "approved"
                        ? "green"
                        : item.status === "rejected"
                        ? "red"
                        : "orange"
                    }
                  >
                    {item.status.toUpperCase()}
                  </Tag>
                }
              >
                <p>
                  <b>City:</b> {item.city}
                </p>
                <p>
                  <b>Vendor:</b> {item.name} ({item.phone})
                </p>
                <Button size="small" onClick={() => openDrawer(item)}>
                  View / Edit
                </Button>
                {item.status === "pending" && (
                  <Space style={{ marginLeft: 10 }}>
                    <Popconfirm title="Approve?" onConfirm={() => approveProduct(item._id)}>
                      <Button size="small" type="primary">
                        Approve
                      </Button>
                    </Popconfirm>
                    <Popconfirm title="Reject?" onConfirm={() => rejectProduct(item._id)}>
                      <Button size="small" danger>
                        Reject
                      </Button>
                    </Popconfirm>
                  </Space>
                )}
              </Card>
            </List.Item>
          )}
        />
      </div>

      {/* Drawer */}
      <Drawer
        title={`Product Details - ${selectedProduct?.productName || ""}`}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={600}
      >
        {selectedProduct && (
          <>
            <Form form={form} layout="vertical" onFinish={updateProduct}>
              <Form.Item label="Name" name="name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Phone" name="phone" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Email" name="email" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item label="City" name="city" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item
                label="Product Name"
                name="productName"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Dimension"
                name="dimension"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Product Details"
                name="productDetails"
                rules={[{ required: true }]}
              >
                <Input.TextArea rows={3} />
              </Form.Item>
              <Form.Item
                label="Description"
                name="description"
                rules={[{ required: true }]}
              >
                <Input.TextArea rows={3} />
              </Form.Item>

              {/* Upload Images (limit to 3) */}
              <Form.Item label="Images">
                <Upload
                  listType="picture"
                  fileList={fileList}
                  beforeUpload={(file) => {
                    if (fileList.length >= 3) {
                      toast.error("You can only upload up to 3 images");
                      return Upload.LIST_IGNORE;
                    }
                    setFileList([...fileList, file]);
                    return false;
                  }}
                  onRemove={(file) => {
                    setFileList(fileList.filter((f) => f.uid !== file.uid));
                  }}
                >
                  {fileList.length < 3 && (
                    <Button icon={<UploadOutlined />}>Select Images</Button>
                  )}
                </Upload>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Update Product
                </Button>
              </Form.Item>
            </Form>

            {/* Preview Images */}
            <div
              style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}
            >
              {fileList.map((file) => {
                const src =
                  file.url || (file.originFileObj && URL.createObjectURL(file.originFileObj));
                return src ? <Image key={file.uid} src={src} width={80} /> : null;
              })}
            </div>

            {/* Product Info */}
            <Descriptions bordered column={1} size="small" title="Product Info">
              <Descriptions.Item label="Status">
                <Tag>{selectedProduct.status.toUpperCase()}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Created At">
                {new Date(selectedProduct.createdAt).toLocaleString()}
              </Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Drawer>
    </div>
  );
}
