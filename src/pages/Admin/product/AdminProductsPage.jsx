import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Tag,
  message,
  Popconfirm,
  Space,
  Drawer,
  Descriptions,
  Tabs,
  Image,
  Form,
  Input,
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import api from "../../../../api";

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
      message.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Approve / Reject product
  const approveProduct = async (id) => {
    try {
      await api.put(`/api/vendor/products/${id}/approve`);
      message.success("Product approved");
      fetchProducts();
    } catch (err) {
      message.error(err.response?.data?.error || "Failed to approve product");
    }
  };

  const rejectProduct = async (id) => {
    try {
      await api.put(`/api/vendor/products/${id}/reject`);
      message.success("Product rejected");
      fetchProducts();
    } catch (err) {
      message.error(err.response?.data?.error || "Failed to reject product");
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

  // Update product (with new images)
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

      message.success("Product updated successfully");
      fetchProducts();
      setDrawerOpen(false);
    } catch (err) {
      message.error(err.response?.data?.error || "Failed to update product");
    }
  };

  // Table columns
  const columns = [
    { title: "S.No", render: (_, __, index) => index + 1, width: 70 },
    { title: "Product Name", dataIndex: "productName", key: "productName" },
    { title: "City", dataIndex: "city", key: "city" },
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

      {/* Table */}
      <Table
        rowKey="_id"
        loading={loading}
        columns={columns}
        dataSource={filteredProducts}
      />

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

              <Form.Item label="Images">
                <Upload
                  listType="picture"
                  fileList={fileList}
                  beforeUpload={(file) => {
                    setFileList([...fileList, file]);
                    return false;
                  }}
                  onRemove={(file) =>
                    setFileList(fileList.filter((f) => f.uid !== file.uid))
                  }
                >
                  <Button icon={<UploadOutlined />}>Select Images</Button>
                </Upload>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Update Product
                </Button>
              </Form.Item>
            </Form>

            {/* Preview Images */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {fileList.map(
                (file) =>
                  file.url && <Image key={file.uid} src={file.url} width={80} />
              )}
            </div>

            {/* Product Info */}
            <Descriptions bordered column={1} size="small" title="Product Info">
              <Descriptions.Item label="Status">
                <Tag>{selectedProduct.status}</Tag>
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
