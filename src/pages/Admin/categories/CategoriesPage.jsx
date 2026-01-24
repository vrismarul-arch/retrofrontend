import { useEffect, useState } from "react";
import {
  Button, Drawer, Form, Input, Upload, Tabs, Card, Grid, Space, Typography, Popconfirm, Divider, Tooltip
} from "antd";
import {
  UploadOutlined, EditOutlined, DeleteOutlined, FolderOpenOutlined, 
  AppstoreOutlined, TagsOutlined, PlusOutlined, SearchOutlined
} from "@ant-design/icons";
import toast from "react-hot-toast";
import api from "../../../../api";
import "./categories.css";
import SubCategoriesPage from "./SubCategoriesPage";
import BrandsPage from "./BrandsPage";

const { TabPane } = Tabs;
const { useBreakpoint } = Grid;
const { Title, Text } = Typography;

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();
  const [editingItem, setEditingItem] = useState(null);
  const screens = useBreakpoint();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/api/admin/categories");
      setCategories(res.data);
    } catch (err) {
      toast.error("Failed to fetch categories");
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const values = await form.validateFields();
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        if (key !== "image") formData.append(key, values[key]);
      });

      if (values.image && values.image[0]?.originFileObj) {
        formData.append("image", values.image[0].originFileObj);
      }

      if (editingItem) {
        await api.put(`/api/admin/categories/${editingItem._id}`, formData);
        toast.success("Updated successfully!");
      } else {
        await api.post("/api/admin/categories", formData);
        toast.success("Added successfully!");
      }

      setIsDrawerOpen(false);
      form.resetFields();
      setEditingItem(null);
      fetchCategories();
    } catch (err) {
      toast.error("Something went wrong!");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/admin/categories/${id}`);
      fetchCategories();
      toast.success("Deleted successfully!");
    } catch (err) {
      toast.error("Delete failed!");
    }
  };

  const handleEdit = (record) => {
    setEditingItem(record);
    form.setFieldsValue({
      name: record.name,
      description: record.description,
      image: record.imageUrl ? [{ uid: "-1", name: "current.png", status: "done", url: record.imageUrl }] : [],
    });
    setIsDrawerOpen(true);
  };

  return (
    <div className="modern-categories-wrapper">
      {/* HEADER SECTION */}
      <div className="page-header-glass">
        <div className="title-section">
          <Title level={2}><FolderOpenOutlined className="icon-accent" /> Categories</Title>
          <Text type="secondary">Organize your products into accessible collections</Text>
        </div>
        <div className="stats-header-card">
          <div className="stat-item">
            <span className="stat-value">{categories.length}</span>
            <span className="stat-label">Total Categories</span>
          </div>
          <Divider type="vertical" style={{ height: '40px' }} />
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            size="large"
            className="btn-teal-gradient"
            onClick={() => {
              setIsDrawerOpen(true);
              setEditingItem(null);
              form.resetFields();
            }}
          >
            Add New
          </Button>
        </div>
      </div>

      <Tabs defaultActiveKey="categories" className="custom-tabs-modern">
        <TabPane tab={<span><AppstoreOutlined /> Categories</span>} key="categories">
          
          <div className="category-visual-grid">
            {categories.map((cat) => (
              <Card
                key={cat._id}
                className="category-glass-card"
                cover={
                  <div className="img-container">
                    <img alt={cat.name} src={cat.imageUrl || "/placeholder.png"} />
                    <div className="card-overlay">
                       <Space>
                          <Tooltip title="Edit">
                            <Button shape="circle" icon={<EditOutlined />} onClick={() => handleEdit(cat)} />
                          </Tooltip>
                          <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(cat._id)}>
                            <Button shape="circle" danger icon={<DeleteOutlined />} />
                          </Popconfirm>
                       </Space>
                    </div>
                  </div>
                }
              >
                <Card.Meta 
                  title={cat.name} 
                  description={cat.description || "No description provided for this category."} 
                />
              </Card>
            ))}
          </div>
        </TabPane>

        <TabPane tab={<span><AppstoreOutlined /> Sub-Categories</span>} key="subcategories">
          <SubCategoriesPage />
        </TabPane>

        <TabPane tab={<span><TagsOutlined /> Varieties</span>} key="varieties">
          <BrandsPage />
        </TabPane>
      </Tabs>

      {/* DRAWER FORM */}
      <Drawer
        title={<Title level={4}>{editingItem ? "Edit Category" : "New Category"}</Title>}
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        width={screens.xs ? "100%" : 420}
        footer={
          <div className="drawer-footer">
            <Button onClick={() => setIsDrawerOpen(false)} size="large">Cancel</Button>
            <Button type="primary" onClick={handleSave} loading={saving} size="large" className="btn-teal-gradient">
              {editingItem ? "Update Category" : "Create Category"}
            </Button>
          </div>
        }
      >
        <Form form={form} layout="vertical" className="modern-form">
          <Form.Item name="name" label="Category Name" rules={[{ required: true }]}>
            <Input prefix={<FolderOpenOutlined />} placeholder="Enter name" />
          </Form.Item>
          <Form.Item name="description" label="Short Description">
            <Input.TextArea rows={4} placeholder="What is this category about?" />
          </Form.Item>
          <Form.Item name="image" label="Display Image">
            <Upload.Dragger listType="picture" beforeUpload={() => false} maxCount={1} className="modern-dragger">
              <p className="ant-upload-drag-icon"><UploadOutlined style={{color: '#078d89'}} /></p>
              <p className="ant-upload-text">Click or drag image to upload</p>
            </Upload.Dragger>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}