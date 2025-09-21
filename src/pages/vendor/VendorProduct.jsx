import React, { useState } from "react";
import { Form, Input, Button, Upload, Typography, Divider, Row, Col } from "antd";
import { UploadOutlined } from "@ant-design/icons";
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
      Object.keys(values).forEach(
        (key) => key !== "images" && formData.append(key, values[key])
      );
      values.images?.forEach((file) =>
        formData.append("images", file.originFileObj)
      );

      await api.post("/api/vendor/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("✅ Product submitted successfully!");
      form.resetFields();
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to submit product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <Title level={4} style={{ marginBottom: 4 }}>
          Vendor Product Submission
        </Title>
        <Paragraph type="secondary" style={{ fontSize: 14 }}>
          Fill out the details below to list your product.
        </Paragraph>
      </div>

      <Divider />

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
              <Input placeholder="Enter your full name" />
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

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="productName" label="Product Name" rules={[{ required: true }]}>
              <Input placeholder="Enter product name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="dimension" label="Dimension" rules={[{ required: true }]}>
              <Input placeholder="e.g., 20x30 cm" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="productDetails" label="Product Details" rules={[{ required: true }]}>
          <Input placeholder="e.g., Wooden, Handcrafted" />
        </Form.Item>

        <Form.Item name="description" label="Description" rules={[{ required: true }]}>
          <TextArea rows={4} placeholder="Write a detailed description of your product" />
        </Form.Item>

        <Form.Item
          name="images"
          label="Upload Images (Max 3)"
          valuePropName="fileList"
          getValueFromEvent={(e) => e?.fileList || []}
          rules={[{ required: true, message: "At least one image is required" }]}
        >
          <Upload beforeUpload={() => false} listType="picture-card" multiple maxCount={3}>
            <div>
              <UploadOutlined style={{ fontSize: 18 }} />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          </Upload>
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          block
          loading={loading}
          style={{
            borderRadius: "8px",
            height: "45px",
            fontWeight: 500,
            fontSize: "16px",
          }}
        >
          Submit Product
        </Button>
      </Form>
    </div>
  );
};

export default VendorProduct;
