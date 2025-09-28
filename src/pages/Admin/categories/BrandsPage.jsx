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
  TagsOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import toast from "react-hot-toast";
import api from "../../../../api";
import "./categories.css";

const { useBreakpoint } = Grid;

export default function BrandsPage() {
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const screens = useBreakpoint();

  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/api/admin/categories");
      const categoriesData = res.data || [];
      const allSubCategories = categoriesData.reduce((acc, cat) => {
        const subs = cat.subCategories.map((sub) => ({
          ...sub,
          parentCategory: cat._id,
        }));
        return [...acc, ...subs];
      }, []);
      setCategories(categoriesData);
      setSubCategories(allSubCategories);
    } catch (err) {
      toast.error("Failed to fetch categories");
    }
  };

  const fetchBrands = async () => {
    try {
      const res = await api.get("/api/admin/brands");
      const mapped = res.data.map((b) => ({
        ...b,
        category: b.categories?.[0] || null,
        subCategory: b.subCategories?.[0] || null,
      }));
      setBrands(mapped);
    } catch (err) {
      toast.error("Failed to fetch brands");
    }
  };

  const normalizeUpload = (e) => (Array.isArray(e) ? e : e?.fileList || []);

  const handleSave = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description || "");
      formData.append(
        "categories",
        JSON.stringify(values.category ? [values.category] : [])
      );
      formData.append(
        "subCategories",
        JSON.stringify(values.subCategory ? [values.subCategory] : [])
      );
      if (values.image?.[0]?.originFileObj)
        formData.append("logo", values.image[0].originFileObj);

      if (editingItem) {
        await api.put(`/api/admin/brands/${editingItem._id}`, formData);
        toast.success("Brand updated successfully!");
      } else {
        await api.post("/api/admin/brands", formData);
        toast.success("Brand added successfully!");
      }

      setDrawerOpen(false);
      form.resetFields();
      setEditingItem(null);
      setFilteredSubCategories([]);
      fetchBrands();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while saving!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/admin/brands/${id}`);
      toast.success("Brand deleted successfully!");
      fetchBrands();
    } catch (err) {
      toast.error("Failed to delete brand");
    }
  };

  const columns = [
    { title: "S.No", render: (_, __, index) => index + 1 },
    {
      title: "Logo",
      dataIndex: "logoUrl",
      render: (img) => (
        <img
          src={img}
          className="w-16 h-16 object-cover rounded-lg shadow-sm border"
          onError={(e) => (e.target.src = "/placeholder.png")}
        />
      ),
    },
    { title: "Name", dataIndex: "name" },
    { title: "Description", dataIndex: "description" },
    { title: "Category", render: (_, r) => r.category?.name || "-" },
    { title: "SubCategory", render: (_, r) => r.subCategory?.name || "-" },
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
                    subCategory: record.subCategory?._id,
                    image: record.logoUrl
                      ? [{ uid: "-1", status: "done", url: record.logoUrl }]
                      : [],
                  });
                  const filtered = subCategories.filter(
                    (sc) => sc.parentCategory === record.category?._id
                  );
                  setFilteredSubCategories(filtered);
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
          <Button icon={<MoreOutlined />} type="text" />
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="categories-page p-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center text-gray-800 mb-3 sm:mb-0">
          <TagsOutlined className="mr-2 text-blue-500" /> Brands
        </h2>
        <Button
          type="primary"
          className="bg-blue-500 hover:bg-blue-600 text-white"
          onClick={() => {
            setEditingItem(null);
            form.resetFields();
            setFilteredSubCategories([]);
            setDrawerOpen(true);
          }}
        >
          + Add Brand
        </Button>
      </div>

      {/* Desktop Table */}
      {screens.md ? (
        <Card className="shadow-lg rounded-lg overflow-hidden">
          <Table
            rowKey="_id"
            columns={columns}
            dataSource={brands}
            pagination={{ pageSize: 5 }}
            bordered
            className="bg-white"
          />
        </Card>
      ) : (
        /* Mobile Cards */
        <div className="grid grid-cols-1 gap-4">
          {brands.map((b) => (
            <Card
              key={b._id}
              className="shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-200 bg-white"
              cover={
                <img
                  src={b.logoUrl || "/placeholder.png"}
                  className="h-40 w-full object-contain bg-gray-100 p-4"
                />
              }
            >
              <Card.Meta
                title={<span className="font-semibold text-lg">{b.name}</span>}
                description={
                  <div className="text-gray-600 mt-2 text-sm">
                    <p>{b.description || "No description"}</p>
                    <p className="mt-1">
                      <span className="font-medium">Category:</span>{" "}
                      {b.category?.name || "-"}
                      <br />
                      <span className="font-medium">SubCategory:</span>{" "}
                      {b.subCategory?.name || "-"}
                    </p>
                  </div>
                }
              />
              <div className="flex justify-end gap-3 mt-3 text-lg">
                <EditOutlined
                  className="text-blue-500 hover:text-blue-700 cursor-pointer"
                  onClick={() => {
                    setEditingItem(b);
                    form.setFieldsValue({
                      name: b.name,
                      description: b.description,
                      category: b.category?._id,
                      subCategory: b.subCategory?._id,
                      image: b.logoUrl
                        ? [{ uid: "-1", status: "done", url: b.logoUrl }]
                        : [],
                    });
                    setFilteredSubCategories(
                      subCategories.filter(
                        (sc) => sc.parentCategory === b.category?._id
                      )
                    );
                    setDrawerOpen(true);
                  }}
                />
                <DeleteOutlined
                  className="text-red-500 hover:text-red-700 cursor-pointer"
                  onClick={() => handleDelete(b._id)}
                />
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Drawer */}
      <Drawer
        title={`${editingItem ? "Edit" : "Add"} Brand`}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={screens.xs ? "90%" : 500}
        bodyStyle={{ paddingBottom: 24 }}
        extra={
          <div className="flex gap-2">
            <Button onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button type="primary" onClick={handleSave} loading={loading}>
              Save
            </Button>
          </div>
        }
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Brand Name"
            rules={[{ required: true, message: "Please enter brand name" }]}
          >
            <Input placeholder="Enter brand name" />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} placeholder="Enter description" />
          </Form.Item>

          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: "Select a category" }]}
          >
            <Select
              placeholder="Select category"
              onChange={(catId) => {
                const filtered = subCategories.filter(
                  (sc) => sc.parentCategory === catId
                );
                setFilteredSubCategories(filtered);
                if (
                  !filtered.find(
                    (sc) => sc._id === form.getFieldValue("subCategory")
                  )
                )
                  form.setFieldsValue({ subCategory: undefined });
              }}
            >
              {categories.map((c) => (
                <Select.Option key={c._id} value={c._id}>
                  {c.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="subCategory" label="SubCategory">
            <Select placeholder="Select subcategory" allowClear>
              {filteredSubCategories.map((sc) => (
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
            <Upload
              listType="picture-card"
              beforeUpload={() => false}
              maxCount={1}
              className="custom-upload"
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}
