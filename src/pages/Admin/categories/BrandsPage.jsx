import { useEffect, useState } from "react";
import {
  Button,
  Table,
  Drawer,
  Form,
  Input,
  Upload,
  message,
  Dropdown,
  Menu,
  Select,
} from "antd";
import {
  UploadOutlined,
  MoreOutlined,
  EditOutlined,
  TagsOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import api from "../../../../api";
import "./categories.css";

export default function BrandsPage() {
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchBrands();
    fetchCategories();
    fetchSubCategories();
  }, []);

  const fetchBrands = async () => {
    try {
      const res = await api.get("/api/admin/brands");
      setBrands(res.data || []);
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch brands");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/api/admin/categories");
      setCategories(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSubCategories = async () => {
    try {
      const res = await api.get("/api/admin/subcategories");
      setSubCategories(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const normalizeUpload = (e) => (Array.isArray(e) ? e : e?.fileList || []);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();

      Object.keys(values).forEach((key) => {
        if (key === "image" && values.image?.[0]?.originFileObj) {
          formData.append("logo", values.image[0].originFileObj);
        } else if (values[key] !== undefined && values[key] !== null) {
          formData.append(
            key,
            Array.isArray(values[key]) ? JSON.stringify(values[key]) : values[key]
          );
        }
      });

      if (editingItem) {
        await api.put(`/api/admin/brands/${editingItem._id}`, formData);
        message.success("✅ Brand updated!");
      } else {
        await api.post("/api/admin/brands", formData);
        message.success("✅ Brand added!");
      }

      setDrawerOpen(false);
      form.resetFields();
      setEditingItem(null);
      fetchBrands();
    } catch (err) {
      console.error(err);
      message.error("❌ Something went wrong!");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/admin/brands/${id}`);
      message.success("🗑️ Brand deleted!");
      fetchBrands();
    } catch (err) {
      console.error(err);
      message.error("Failed to delete brand");
    }
  };

  const columns = [
    { title: "S.No", render: (_, __, index) => index + 1, responsive: ["sm"] },
    {
      title: "Logo",
      dataIndex: "logoUrl",
      render: (image) => (
        <img
          src={image}
          alt=""
          className="w-16 h-16 rounded-lg object-cover shadow-sm border serviceimage"
          onError={(e) => (e.target.src = "/placeholder.png")}
        />
      ),
      responsive: ["xs", "sm", "md", "lg"],
    },
    { title: "Name", dataIndex: "name", responsive: ["xs", "sm", "md"] },
    { title: "Description", dataIndex: "description", responsive: ["md"] },
    {
      title: "Categories",
      render: (_, record) =>
        record.categories?.map((c) => c.name).join(", ") || "-",
      responsive: ["md"],
    },
    {
      title: "SubCategories",
      render: (_, record) =>
        record.subCategories?.map((sc) => sc.name).join(", ") || "-",
      responsive: ["lg"],
    },
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
                    categories: record.categories?.map((c) => c._id) || [],
                    subCategories: record.subCategories?.map((sc) => sc._id) || [],
                    image: record.logoUrl
                      ? [
                          {
                            uid: "-1",
                            name: "current.png",
                            status: "done",
                            url: record.logoUrl,
                          },
                        ]
                      : [],
                  });
                  setDrawerOpen(true);
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
      responsive: ["xs", "sm", "md", "lg"],
    },
  ];

  return (
    <div className="categories-page p-2 sm:p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 sm:gap-0">
        <h2 className="text-xl sm:text-2xl font-bold flex items-center">
          <TagsOutlined className="mr-2 text-blue-500" /> Brands
        </h2>
        <Button
          type="primary"
          onClick={() => {
            setEditingItem(null);
            form.resetFields();
            setDrawerOpen(true);
          }}
        >
          + Add Brand
        </Button>
      </div>

      <Table
        rowKey="_id"
        columns={columns}
        dataSource={brands}
        pagination={{ pageSize: 5 }}
        scroll={{ x: 800 }} // horizontal scroll on small screens
      />

      <Drawer
        title={`${editingItem ? "Edit" : "Add"} Brand`}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={window.innerWidth < 600 ? "90%" : 500}
        extra={
          <div className="flex gap-2">
            <Button onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button type="primary" onClick={handleSave}>
              Save
            </Button>
          </div>
        }
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input placeholder="Enter brand name" />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} placeholder="Enter description" />
          </Form.Item>

          <Form.Item
            name="categories"
            label="Categories"
            rules={[{ required: true, message: "Select at least one category" }]}
          >
            <Select mode="multiple" placeholder="Select categories" allowClear>
              {categories.map((c) => (
                <Select.Option key={c._id} value={c._id}>
                  {c.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="subCategories" label="SubCategories">
            <Select mode="multiple" placeholder="Select subcategories" allowClear>
              {subCategories.map((sc) => (
                <Select.Option key={sc._id} value={sc._id}>
                  {sc.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="image"
            label="Upload Logo"
            valuePropName="fileList"
            getValueFromEvent={normalizeUpload}
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
