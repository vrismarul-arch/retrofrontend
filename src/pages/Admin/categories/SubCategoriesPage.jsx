import { useEffect, useState } from "react";
import {
  Button,
  Table,
  Drawer,
  Form,
  Input,
  Upload,
  Dropdown,
  Menu,
  Select,
  Card,
  Grid,
} from "antd";
import {
  UploadOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import toast from "react-hot-toast"; // ✅ import toast
import api from "../../../../api";
import "./categories.css";

const { useBreakpoint } = Grid;

export default function SubCategoriesPage() {
  const [subCategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingItem, setEditingItem] = useState(null);
  const screens = useBreakpoint();

  useEffect(() => {
    fetchSubCategories();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/api/admin/categories");
      setCategories(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch categories");
    }
  };

  const fetchSubCategories = async () => {
    try {
      const res = await api.get("/api/admin/subcategories");
      setSubCategories(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch subcategories");
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();
      Object.keys(values).forEach((key) => formData.append(key, values[key]));

      if (values.image && values.image[0]?.originFileObj) {
        formData.append("image", values.image[0].originFileObj);
      }

      if (editingItem) {
        await api.put(`/api/admin/subcategories/${editingItem._id}`, formData);
        toast.success("SubCategory updated successfully!"); // ✅ toast
      } else {
        await api.post("/api/admin/subcategories", formData);
        toast.success("SubCategory added successfully!"); // ✅ toast
      }

      setIsDrawerOpen(false);
      form.resetFields();
      setEditingItem(null);
      fetchSubCategories();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while saving!"); // ✅ toast
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/admin/subcategories/${id}`);
      fetchSubCategories();
      toast.success("SubCategory deleted successfully!"); // ✅ toast
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete subcategory"); // ✅ toast
    }
  };

  return (
    <div className="categories-page">
      <div className="header flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          <AppstoreOutlined className="mr-2 text-blue-500" /> SubCategories
        </h2>
      </div>

      <Button
        type="primary"
        size="large"
        onClick={() => {
          setIsDrawerOpen(true);
          setEditingItem(null);
          form.resetFields();
        }}
        className="mb-4"
      >
        + Add SubCategory
      </Button>

      {/* ✅ Desktop Table | Mobile Cards */}
      {screens.md ? (
        <Table
          dataSource={subCategories}
          rowKey="_id"
          pagination={{ pageSize: 5 }}
          columns={[
            { title: "S.No", render: (_, __, index) => index + 1 },
            {
              title: "Image",
              dataIndex: "imageUrl",
              render: (image, record) => (
                <img
                  src={image}
                  alt={record.name}
                  className="w-16 h-16 rounded-lg object-cover shadow-sm border serviceimage"
                  onError={(e) => (e.target.src = "/placeholder.png")}
                />
              ),
            },
            { title: "Category", dataIndex: ["category", "name"] },
            { title: "Name", dataIndex: "name" },
            { title: "Description", dataIndex: "description" },
            {
              title: "Actions",
              render: (_, record) => (
                <Dropdown
                  overlay={
                    <Menu>
                      <Menu.Item
                        icon={<EditOutlined />}
                        onClick={() => {
                          setEditingItem(record);
                          form.setFieldsValue({
                            name: record.name,
                            description: record.description,
                            category: record.category?._id,
                          });
                          setIsDrawerOpen(true);
                        }}
                      >
                        Edit
                      </Menu.Item>
                      <Menu.Item
                        icon={<DeleteOutlined />}
                        danger
                        onClick={() => handleDelete(record._id)}
                      >
                        Delete
                      </Menu.Item>
                    </Menu>
                  }
                >
                  <Button icon={<MoreOutlined />} />
                </Dropdown>
              ),
            },
          ]}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {subCategories.map((sub) => (
            <Card
              key={sub._id}
              className="shadow-sm rounded-lg border"
              cover={
                <img
                  src={sub.imageUrl || "/placeholder.png"}
                  alt={sub.name}
                  className="h-40 w-full object-contain p-2"
                />
              }
              actions={[
                <EditOutlined
                  key="edit"
                  onClick={() => {
                    setEditingItem(sub);
                    form.setFieldsValue({
                      name: sub.name,
                      description: sub.description,
                      category: sub.category?._id,
                    });
                    setIsDrawerOpen(true);
                  }}
                />,
                <DeleteOutlined
                  key="delete"
                  onClick={() => handleDelete(sub._id)}
                  className="text-red-500"
                />,
              ]}
            >
              <Card.Meta
                title={sub.name}
                description={
                  <>
                    <p className="text-sm text-gray-600">
                      {sub.description || "No description"}
                    </p>
                    <p className="text-xs mt-1">
                      <strong>Category:</strong> {sub.category?.name || "-"}
                    </p>
                  </>
                }
              />
            </Card>
          ))}
        </div>
      )}

      <Drawer
        title={`${editingItem ? "Edit" : "Add"} SubCategory`}
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        width={screens.xs ? "90%" : 420}
        extra={
          <div className="flex gap-2">
            <Button onClick={() => setIsDrawerOpen(false)}>Cancel</Button>
            <Button type="primary" onClick={handleSave}>
              Save
            </Button>
          </div>
        }
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input placeholder="Enter subcategory name" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} placeholder="Enter description" />
          </Form.Item>
          <Form.Item
            name="category"
            label="Select Category"
            rules={[{ required: true }]}
          >
            <Select placeholder="Choose a category">
              {categories.map((c) => (
                <Select.Option key={c._id} value={c._id}>
                  {c.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="image"
            label="Upload Image"
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
          >
            <Upload listType="picture-card" beforeUpload={() => false} maxCount={1}>
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}
