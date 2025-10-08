import { useEffect, useState } from "react";
import {
  Button,
  Drawer,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
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
import toast from "react-hot-toast";

const { Panel } = Collapse;

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form] = Form.useForm();

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
    try {
        const res = await api.get("/api/admin/products");
        setProducts(res.data || []);
    } catch(error) {
        toast.error("Failed to fetch products.");
        setProducts([]);
    }
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

  // Utility function for Antd Upload component
  const normalizeUpload = (e) => {
    // If the event target is just the file array (from initial value), return it
    if (Array.isArray(e)) return e; 
    // Otherwise, it's the Upload event object
    return e?.fileList || [];
  };

  // ---------------------------
  // Handle dropdown changes
  // ---------------------------
  const handleCategoryChange = (categoryId) => {
    // Filter subcategories that belong to the selected category
    const filteredSC = subCategories.filter(
      (sc) => sc.category?._id === categoryId || sc.category === categoryId
    );
    setFilteredSubCategories(filteredSC);
    // Reset dependent fields
    form.setFieldsValue({ subCategory: undefined, brand: undefined });
    setFilteredBrands([]);
  };

  const handleSubCategoryChange = (subCategoryId) => {
    // Filter brands that are associated with the selected subcategory
    const filteredB = brands.filter((b) =>
      Array.isArray(b.subCategories)
        ? b.subCategories.some(
            (id) => id === subCategoryId || id?._id === subCategoryId
          )
        : false
    );
    setFilteredBrands(filteredB);
    // Reset dependent field
    form.setFieldsValue({ brand: undefined });
  };

  // ---------------------------
  // ✅ Corrected Save Product logic (now triggered by Form onFinish)
  // ---------------------------
  const handleSave = async (values) => {
    const toastId = toast.loading(editingItem ? "Updating product..." : "Adding product...");
    try {
      setSaving(true);
      
      // ✅ Now that validation passed, we proceed to API call
      const formData = new FormData();

      // 1. Append simple fields
      Object.keys(values).forEach((key) => {
        if (key === "moreInformation") {
            // Handle nested object structure (More Info) by stringifying
            formData.append(key, JSON.stringify(values[key] || {}));
        } else if (values[key] !== undefined && values[key] !== null && 
                   key !== "images" && key !== "mainImage") {
            // Append all other simple fields
            formData.append(key, values[key]);
        }
      });
      
      // 2. Handle Main Image Upload
      const mainImageFile = values.mainImage?.[0]?.originFileObj;
      if (mainImageFile) {
          formData.append("mainImage", mainImageFile);
      } else if (values.mainImage?.[0]?.url) {
          // Send existing main image URL for update
          formData.append("existingMainImageUrl", values.mainImage[0].url);
      }
      
      // 3. Handle Additional Images
      const newImagesToUpload = [];
      const existingImageUrls = [];

      (values.images || []).forEach((file) => {
        if (file.originFileObj) {
          newImagesToUpload.push(file.originFileObj);
        } else if (file.url) {
          existingImageUrls.push(file.url);
        }
      });

      // Append new files
      newImagesToUpload.forEach(file => formData.append("images", file));

      // Append existing URLs to keep them (backend must handle this)
      formData.append("existingImages", JSON.stringify(existingImageUrls));

      // 4. API Call
      if (editingItem) {
        await api.put(`/api/admin/products/${editingItem._id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("✅ Product updated successfully", { id: toastId });
      } else {
        await api.post("/api/admin/products", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("✅ Product added successfully", { id: toastId });
      }

      setDrawerOpen(false);
      setEditingItem(null);
      form.resetFields();
      setFilteredSubCategories([]);
      setFilteredBrands([]);
      fetchProducts();
    } catch (err) {
        // This catches API errors (400, 500 etc.)
        console.error(err);
        toast.error(err.response?.data?.error || "❌ Error saving product. Check server logs.", { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  // ---------------------------
  // Delete Product
  // ---------------------------
  const handleDelete = async (id) => {
    try {
        await api.delete(`/api/admin/products/${id}`);
        toast.success("🗑️ Product deleted!");
        fetchProducts();
    } catch(err) {
        toast.error(err.response?.data?.error || "❌ Failed to delete product.");
    }
  };

  // ---------------------------
  // Table columns
  // ---------------------------
  const columns = [
    { title: "S.No", render: (_, __, index) => index + 1 },
    {
      title: "Images",
      render: (_, record) => {
        // Use record.image for main image if it exists, otherwise use the first in images array
        const mainImage = record.image || record.images?.[0]; 
        
        return (
          <div className="product-image-container">
            {mainImage ? (
              <img
                src={mainImage}
                alt="Product"
                className="product-image"
                style={{ width: 60, height: 60, objectFit: 'cover' }}
                onClick={() => window.open(mainImage, "_blank")}
              />
            ) : (
              <span className="text-gray-400">No Image</span>
            )}
          </div>
        );
      },
    },
    { title: "Name", dataIndex: "name" },
    { title: "Price", dataIndex: "price" },
    { title: "Status", dataIndex: "status" },
    { title: "Stock", dataIndex: "stock" },
    { title: "Category", render: (_, r) => r.category?.name || "—" },
    { title: "SubCategory", render: (_, r) => r.subCategory?.name || "—" },
    { title: "Brand", render: (_, r) => r.brand?.name || "—" },
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

                // --- Filtering Logic for Edit ---
                // 1. Set SubCategories
                const filteredSC = subCategories.filter(
                  (sc) =>
                    sc.category?._id === record.category?._id ||
                    sc.category === record.category?._id
                );
                setFilteredSubCategories(filteredSC);

                // 2. Set Brands
                const filteredB = brands.filter((b) =>
                  Array.isArray(b.subCategories)
                    ? b.subCategories.some(
                        (id) =>
                          id === record.subCategory?._id ||
                          id?._id === record.subCategory?._id
                      )
                    : false
                );
                setFilteredBrands(filteredB);

                // --- Form Field Initialization ---
                // Setup existing main image file list for Antd Upload component
                const mainImageFileList = record.image
                  ? [
                      {
                        uid: record.image, // Use URL as UID
                        name: "main.png",
                        status: "done",
                        url: record.image,
                      },
                    ]
                  : [];
                
                // Setup existing additional images file list
                const additionalImagesFileList = record.images?.map((img, index) => ({
                    uid: img,
                    name: `img-${index}.png`,
                    status: "done",
                    url: img,
                })) || [];


                form.setFieldsValue({
                  ...record,
                  category: record.category?._id,
                  subCategory: record.subCategory?._id,
                  brand: record.brand?._id,
                  // Set image fields with file list structure
                  mainImage: mainImageFileList, 
                  images: additionalImagesFileList,
                  // Ensure moreInformation is an object for nested fields
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
      {/* Toast Container for all messages */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Products</h2>
        <Button
          type="primary"
          onClick={() => {
            setEditingItem(null);
            form.resetFields();
            setFilteredSubCategories([]);
            setFilteredBrands([]);
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

      {/* Product Drawer */}
      <Drawer
        title={editingItem ? "Edit Product" : "Add Product"}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={700}
        bodyStyle={{ paddingBottom: 80 }}
        extra={
          <div className="flex gap-2">
            <Button onClick={() => setDrawerOpen(false)}>Cancel</Button>
            {/* 💡 Use form.submit() to trigger validation before calling handleSave */}
            <Button 
              type="primary" 
              onClick={() => form.submit()} 
              loading={saving}
            >
              Save
            </Button>
          </div>
        }
      >
        <Form 
          form={form} 
          layout="vertical"
          // ✅ THIS IS THE KEY FIX: Call handleSave ONLY if validation succeeds
          onFinish={handleSave} 
          // ✅ Optional: Show a toast if validation fails (errors are already shown on fields)
          onFinishFailed={() => {
            toast.error("Please fill in all required fields and correct errors.");
          }}
        >
          <Collapse defaultActiveKey={["1"]} ghost>
            {/* Basic Info */}
            <Panel header="Basic Info" key="1">
              <Form.Item
                name="name"
                label="Product Name"
                rules={[{ required: true, message: "Product name is required" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item name="description" label="Description">
                <Input.TextArea rows={3} />
              </Form.Item>
              <Form.Item
                name="price"
                label="Price"
                rules={[{ required: true, message: "Price is required" }]}
              >
                <InputNumber min={0} style={{ width: "100%" }} precision={2} />
              </Form.Item>
              <Form.Item name="discount" label="Discount (%)">
                <InputNumber min={0} max={100} style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item
                name="category"
                label="Category"
                rules={[{ required: true, message: "Category is required" }]}
              >
                <Select
                  placeholder="Select category"
                  onChange={handleCategoryChange}
                >
                  {categories.map((c) => (
                    <Select.Option key={c._id} value={c._id}>
                      {c.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item name="subCategory" label="SubCategory">
                <Select
                  placeholder="Select subcategory"
                  onChange={handleSubCategoryChange}
                  // Disable if no categories are selected
                  disabled={!form.getFieldValue('category')}
                >
                  {filteredSubCategories.map((sc) => (
                    <Select.Option key={sc._id} value={sc._id}>
                      {sc.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item name="brand" label="Brand">
                <Select 
                    placeholder="Select brand"
                    // Disable if no subcategory is selected
                    disabled={!form.getFieldValue('subCategory')}
                >
                  {filteredBrands.map((b) => (
                    <Select.Option key={b._id} value={b._id}>
                      {b.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Panel>

            {/* Images Panel */}
            <Panel header="Images" key="2">
              <Form.Item
                name="mainImage"
                label="Main Image"
                valuePropName="fileList"
                getValueFromEvent={normalizeUpload}
                rules={[{ required: true, message: "Main image is required" }]}
              >
                <Upload
                  listType="picture-card"
                  beforeUpload={() => false}
                  maxCount={1}
                >
                  {form.getFieldValue('mainImage')?.length === 1 ? null : <Button icon={<UploadOutlined />}>Upload Main Image</Button>}
                </Upload>
              </Form.Item>
              <Form.Item
                name="images"
                label="Additional Images"
                valuePropName="fileList"
                getValueFromEvent={normalizeUpload}
              >
                <Upload
                  listType="picture"
                  beforeUpload={() => false}
                  multiple
                  maxCount={12}
                >
                  <Button icon={<UploadOutlined />}>Upload Images</Button>
                </Upload>
              </Form.Item>
            </Panel>

            {/* More Info */}
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
                <Form.Item
                  name={["moreInformation", "assemblyDetails"]}
                  noStyle
                >
                  <Input placeholder="Assembly Details" />
                </Form.Item>
              </Form.Item>
            </Panel>

            {/* Stock & SKU */}
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
                  <Select.Option value="Best Selling">
                    Best Selling
                  </Select.Option>
                  <Select.Option value="Out of Stock">
                    Out of Stock
                  </Select.Option>
                </Select>
              </Form.Item>
            </Panel>
          </Collapse>
        </Form>
      </Drawer>
    </div>
  );
}