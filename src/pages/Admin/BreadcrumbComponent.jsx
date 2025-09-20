import { HomeOutlined } from "@ant-design/icons";
import { Breadcrumb } from "antd";
import { Link, useLocation } from "react-router-dom";
import "./Breadcrumb.css";

const PATH_NAME_MAPPING = {
  admin: "Admin",
  dashboard: "Dashboard",
  subcategories: "Subcategories",
  brands: "Brands",
  products: "Products",
};

export default function BreadcrumbComponent() {
  const location = useLocation();
  const pathSnippets = location.pathname.split("/").filter(Boolean);

  const breadcrumbItems = [
    {
      title: (
        <Link to="/admin/dashboard">
          <HomeOutlined />
        </Link>
      ),
    },
    ...pathSnippets.map((snippet, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
      const isLast = index === pathSnippets.length - 1;

      // Map friendly name if available, otherwise capitalize
      const name = PATH_NAME_MAPPING[snippet] || snippet.charAt(0).toUpperCase() + snippet.slice(1);

      return {
        title: isLast ? <span style={{ fontWeight: 600 }}>{name}</span> : <Link to={url}>{name}</Link>,
      };
    }),
  ];

  return (
    <Breadcrumb
      items={breadcrumbItems}
      style={{
        margin: "16px 0",
        fontSize: "15px",
      }}
    />
  );
}
