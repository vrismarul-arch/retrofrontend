import React, { useState } from "react";
import { Form, Input, Button, Upload, Typography, Divider, Row, Col, Space } from "antd";
import { UploadOutlined, MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import api from "../../../api"; // axios instance
import toast from "react-hot-toast";

const { TextArea } = Input;
const { Title, Paragraph } = Typography;

const VendorProduct = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const formData = new FormData();

      // Append vendor info
      ["name", "phone", "email", "city"].forEach(key => {
        formData.append(key, values[key]);
      });

      // Append products as JSON string with imageCount
      const productsWithCount = values.products.map(p => ({
        ...p,
        imageCount: p.images?.length || 0
      }));
      formData.append("products", JSON.stringify(productsWithCount));

      // Append all images in order
      values.products.forEach(product => {
        product.images?.forEach(file => {
          formData.append("images", file.originFileObj);
        });
      });

      await api.post("/api/vendor/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("✅ Products submitted successfully!");
      form.resetFields();
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to submit products");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <Title level={4}>Vendor Product Submission</Title>
        <Paragraph type="secondary" style={{ fontSize: 14 }}>
          Fill out the details below to list your products.
        </Paragraph>
      </div>

      <Divider />

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        {/* Vendor Info */}
        <Title level={5}>Vendor Details</Title>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
              <Input placeholder="Enter full name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
              <Input placeholder="Enter phone number" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
              <Input placeholder="Enter email address" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="city" label="City" rules={[{ required: true }]}>
              <Input placeholder="Enter city" />
            </Form.Item>
          </Col>
        </Row>

        <Divider />

        {/* Products */}
        <Form.List name="products">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} style={{ border: "1px solid #f0f0f0", padding: 16, marginBottom: 16, borderRadius: 8 }}>
                  <Space align="baseline" style={{ display: "flex", justifyContent: "space-between" }}>
                    <Title level={5}>Product {name + 1}</Title>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        {...restField}
                        name={[name, "productName"]}
                        label="Product Name"
                        rules={[{ required: true }]}
                      >
                        <Input placeholder="Enter product name" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        {...restField}
                        name={[name, "dimension"]}
                        label="Dimension"
                        rules={[{ required: true }]}
                      >
                        <Input placeholder="e.g., 20x30 cm" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item {...restField} name={[name, "productDetails"]} label="Product Details" rules={[{ required: true }]}>
                    <Input placeholder="e.g., Wooden, Handcrafted" />
                  </Form.Item>

                  <Form.Item {...restField} name={[name, "description"]} label="Description" rules={[{ required: true }]}>
                    <TextArea rows={3} placeholder="Detailed description" />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "images"]}
                    label="Upload Images (Max 3)"
                    valuePropName="fileList"
                    getValueFromEvent={e => e?.fileList || []}
                    rules={[{ required: true, message: "At least one image is required" }]}
                  >
                    <Upload beforeUpload={() => false} listType="picture-card" multiple maxCount={3}>
                      <div>
                        <UploadOutlined style={{ fontSize: 18 }} />
                        <div style={{ marginTop: 8 }}>Upload</div>
                      </div>
                    </Upload>
                  </Form.Item>
                </div>
              ))}

              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Add Another Product
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Button
          type="primary"
          htmlType="submit"
          block
          loading={loading}
          style={{ borderRadius: 8, height: 45, fontWeight: 500, fontSize: 16 }}
        >
          Submit Products
        </Button>
      </Form>
    </div>
  );
};

export default VendorProduct;
