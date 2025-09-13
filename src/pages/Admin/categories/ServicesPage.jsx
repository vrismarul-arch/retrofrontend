import { useEffect, useState } from "react";
import {
  Button,
  Drawer,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  message,
  Table,
  Dropdown,
  Menu,
  Spin,
  Collapse,
} from "antd";
import {
  UploadOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import api from "../../../../api";
import "./servicepage.css";
const { Panel } = Collapse;

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchProducts(),
          fetchCategories(),
          fetchSubCategories(),
          fetchBrands(),
        ]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const fetchProducts = async () => {
    const res = await api.get("/api/admin/products");
    setProducts(res.data || []);
  };

  const fetchCategories = async () => {
    const res = await api.get("/api/admin/categories");
    setCategories(res.data || []);
  };

  const fetchSubCategories = async () => {
    const res = await api.get("/api/admin/subcategories");
    setSubCategories(res.data || []);
  };

  const fetchBrands = async () => {
    const res = await api.get("/api/admin/brands");
    setBrands(res.data || []);
  };

  const normalizeUpload = (e) => (Array.isArray(e) ? e : e?.fileList || []);

  const handleSave = async () => {
    try {
      setSaving(true);
      const values = await form.validateFields();
      const formData = new FormData();

      Object.keys(values).forEach((key) => {
        if (["moreInformation"].includes(key)) {
          formData.append(key, JSON.stringify(values[key] || {}));
        } else if (values[key] instanceof Array || typeof values[key] === "object") {
          if (key !== "images" && key !== "mainImage") {
            formData.append(key, JSON.stringify(values[key] || {}));
          }
        } else if (values[key] !== undefined && values[key] !== null) {
          formData.append(key, values[key]);
        }
      });

      const mainImage = values.mainImage?.[0]?.originFileObj;
      if (mainImage) formData.append("mainImage", mainImage);

      (values.images || []).forEach((file) => {
        if (file.originFileObj) formData.append("images", file.originFileObj);
      });

      if (editingItem) {
        const existing = editingItem.images || [];
        formData.append("existingImages", JSON.stringify(existing));
        await api.put(`/api/admin/products/${editingItem._id}`, formData);
        message.success("✅ Product updated successfully");
      } else {
        await api.post("/api/admin/products", formData);
        message.success("✅ Product added successfully");
      }

      setDrawerOpen(false);
      setEditingItem(null);
      form.resetFields();
      fetchProducts();
    } catch (err) {
      console.error(err);
      message.error("❌ Error saving product");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    await api.delete(`/api/admin/products/${id}`);
    message.success("🗑️ Product deleted!");
    fetchProducts();
  };

  const columns = [
    { title: "S.No", render: (_, __, index) => index + 1 },

    {
      title: "Images",
      render: (_, record) => {
        const mainImage = record.image;
        const allImages = record.images || [];
        return (
          <div className="product-image-container">
            {mainImage ? (
              <img
                src={mainImage}
                alt="Main"
                className="product-image"
                onClick={() => window.open(mainImage, "_blank")}
              />
            ) : (
              <span className="text-gray-400">No Main Image</span>
            )}
            {allImages.length > 0 && (
              <>
                {allImages.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`img-${idx}`}
                    className="product-image"
                    onClick={() => window.open(img, "_blank")}
                  />
                ))}
              </>
            )}
          </div>
        );
      },
    },

    { title: "Name", dataIndex: "name" },
    { title: "Price", dataIndex: "price" },
    { title: "Status", dataIndex: "status" },
    { title: "Stock", dataIndex: "stock" },
    {
      title: "Actions",
      render: (_, record) => {
        const menu = (
          <Menu>
            <Menu.Item
              key="edit"
              icon={<EditOutlined />}
              onClick={() => {
                setEditingItem(record);
                form.setFieldsValue({
                  ...record,
                  category: record.category?._id,
                  subCategory: record.subCategory?._id,
                  brand: record.brand?._id,
                  mainImage: record.image
                    ? [
                        {
                          uid: "-1",
                          name: "main.png",
                          status: "done",
                          url: record.image,
                        },
                      ]
                    : [],
                  images: record.images?.map((img, index) => ({
                    uid: index,
                    name: `img-${index}.png`,
                    status: "done",
                    url: img,
                  })),
                  moreInformation: record.moreInformation || {},
                });
                setDrawerOpen(true);
              }}
            >
              Edit
            </Menu.Item>
            <Menu.Item
              key="delete"
              icon={<DeleteOutlined />}
              danger
              onClick={() => handleDelete(record._id)}
            >
              Delete
            </Menu.Item>
          </Menu>
        );
        return (
          <Dropdown overlay={menu} trigger={["click"]}>
            <Button icon={<MoreOutlined />} />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Products</h2>
        <Button
          type="primary"
          onClick={() => {
            setEditingItem(null);
            form.resetFields();
            setDrawerOpen(true);
          }}
        >
          + Add Product
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center mt-20">
          <Spin size="large" />
        </div>
      ) : (
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={products}
          pagination={{ pageSize: 6 }}
          className="bg-white rounded shadow-sm overflow-hidden"
        />
      )}

      <Drawer
        title={editingItem ? "Edit Product" : "Add Product"}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={700}
        bodyStyle={{ paddingBottom: 80 }}
        extra={
          <div className="flex gap-2">
            <Button onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button type="primary" onClick={handleSave} loading={saving}>
              Save
            </Button>
          </div>
        }
      >
        <Form form={form} layout="vertical">
          <Collapse defaultActiveKey={["1"]} ghost>
            <Panel header="Basic Info" key="1">
              <Form.Item name="name" label="Product Name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="description" label="Description">
                <Input.TextArea rows={3} />
              </Form.Item>
              <Form.Item name="price" label="Price" rules={[{ required: true }]}>
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item name="discount" label="Discount (%)">
                <InputNumber min={0} max={100} style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item name="category" label="Category" rules={[{ required: true }]}>
                <Select placeholder="Select category">
                  {categories.map((c) => (
                    <Select.Option key={c._id} value={c._id}>
                      {c.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="subCategory" label="SubCategory">
                <Select placeholder="Select subcategory">
                  {subCategories.map((sc) => (
                    <Select.Option key={sc._id} value={sc._id}>
                      {sc.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="brand" label="Brand">
                <Select placeholder="Select brand">
                  {brands.map((b) => (
                    <Select.Option key={b._id} value={b._id}>
                      {b.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Panel>

            <Panel header="Images" key="2">
              <Form.Item
                name="mainImage"
                label="Main Image"
                valuePropName="fileList"
                getValueFromEvent={normalizeUpload}
              >
                <Upload listType="picture-card" beforeUpload={() => false} maxCount={1}>
                  <Button icon={<UploadOutlined />}>Upload Main Image</Button>
                </Upload>
              </Form.Item>
              <Form.Item
                name="images"
                label="Additional Images"
                valuePropName="fileList"
                getValueFromEvent={normalizeUpload}
              >
                <Upload listType="picture" beforeUpload={() => false} multiple maxCount={12}>
                  <Button icon={<UploadOutlined />}>Upload Images</Button>
                </Upload>
              </Form.Item>
            </Panel>

            <Panel header="More Info" key="3">
              <Form.Item label="Dimensions">
                <Form.Item name={["moreInformation", "dimensions"]} noStyle>
                  <Input placeholder="Dimensions" />
                </Form.Item>
              </Form.Item>
              <Form.Item label="Warranty">
                <Form.Item name={["moreInformation", "warranty"]} noStyle>
                  <Input placeholder="Warranty" />
                </Form.Item>
              </Form.Item>
              <Form.Item label="Material">
                <Form.Item name={["moreInformation", "material"]} noStyle>
                  <Input placeholder="Material" />
                </Form.Item>
              </Form.Item>
              <Form.Item label="Assembly Details">
                <Form.Item name={["moreInformation", "assemblyDetails"]} noStyle>
                  <Input placeholder="Assembly Details" />
                </Form.Item>
              </Form.Item>
            </Panel>

            <Panel header="Stock & SKU" key="4">
              <Form.Item name="stock" label="Stock">
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item name="availableQuantity" label="Available Quantity">
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item name="sku" label="SKU">
                <Input />
              </Form.Item>
              <Form.Item name="status" label="Product Status">
                <Select>
                  <Select.Option value="Normal">Normal</Select.Option>
                  <Select.Option value="New Arrival">New Arrival</Select.Option>
                  <Select.Option value="Best Selling">Best Selling</Select.Option>
                  <Select.Option value="Out of Stock">Out of Stock</Select.Option>
                </Select>
              </Form.Item>
            </Panel>
          </Collapse>
        </Form>
      </Drawer>
    </div>
  );
}
