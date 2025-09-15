import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  ShoppingCartOutlined,
  HomeOutlined,
  ProfileOutlined,
  UserOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { Avatar, Dropdown, Menu, Badge, message, Drawer, Button } from "antd";
import SearchBar from "./searchbar/SearchBar";
import MegaMenu from "./MegaMenu";
import api from "../../api";
import { useCart } from "../context/CartContext";
import "./Navbar.css";

const menuData = {
  mobileNav: [
    { name: "Home", icon: HomeOutlined, link: "/" },
    { name: "Bookings", icon: ProfileOutlined, link: "/booking-history" },
    { name: "Profile", icon: ProfileOutlined, link: "/profile" },
  ],
};

const ResponsiveNavbar = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [userAvatar, setUserAvatar] = useState(localStorage.getItem("avatar") || null);
  const [user, setUser] = useState(null);
  const [animateBadge, setAnimateBadge] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { cart, fetchCart, lastUpdated } = useCart();

  const totalCartQuantity = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);

  // ------------------ HANDLE RESIZE ------------------
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ------------------ CART BADGE ANIMATION ------------------
  useEffect(() => {
    if (cart.length >= 0) {
      setAnimateBadge(true);
      const timer = setTimeout(() => setAnimateBadge(false), 600);
      return () => clearTimeout(timer);
    }
  }, [lastUpdated]);

  // ------------------ FETCH CART ------------------
  useEffect(() => {
    fetchCart();
  }, []);

  // ------------------ FETCH USER PROFILE ------------------
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (userId && localStorage.getItem("token")) {
          const res = await api.get(`/users/${userId}`);
          if (res.data) {
            setUser(res.data);
            if (res.data.avatar) {
              setUserAvatar(res.data.avatar);
              localStorage.setItem("avatar", res.data.avatar);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
        message.error("Could not load profile.");
      }
    };
    setIsLoggedIn(!!localStorage.getItem("token"));
    fetchUserProfile();
  }, [location.pathname, isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("avatar");
    setIsLoggedIn(false);
    setUser(null);
    setUserAvatar(null);
    navigate("/login");
  };

  const profileMenu = (
    <Menu>
      <Menu.Item key="profile"><Link to="/profile">Profile</Link></Menu.Item>
      <Menu.Item key="bookings"><Link to="/booking-history">My Bookings</Link></Menu.Item>
      <Menu.Item key="logout" onClick={handleLogout}>Logout</Menu.Item>
    </Menu>
  );

  const showDrawer = () => setDrawerVisible(true);
  const closeDrawer = () => setDrawerVisible(false);

  // ------------------- MOBILE NAVBAR -------------------
  if (isMobile) {
    return (
      <>
        <div className="mobile-top-bar">
          <Button type="text" icon={<MenuOutlined />} onClick={showDrawer} />
          <Link to="/"><img src="/retrologo.png" alt="Logo" className="uc-logo-mobile" /></Link>
          {!isLoggedIn ? (
            <Link to="/login">
              <Avatar size={36} icon={<UserOutlined />} style={{ backgroundColor: "#078d89" }} />
            </Link>
          ) : (
            <Dropdown overlay={profileMenu} trigger={["click"]} placement="bottomRight">
              <Avatar size={36} src={userAvatar || undefined} icon={<UserOutlined />} style={{ backgroundColor: "#078d89", cursor: "pointer" }} />
            </Dropdown>
          )}
        </div>

        <div className="mobile-middle-bar">
    
          <SearchBar />
        </div>

        <div className="mobile-bottom-navbar">
          {menuData.mobileNav.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.link;
            return (
              <Link key={index} to={item.link} className={`tab-item ${isActive ? "active" : ""}`}>
                <Icon className="tab-icon" />
                <span>{item.name}</span>
              </Link>
            );
          })}
          <Link to="/cart" className="tab-item">
            <Badge count={totalCartQuantity} offset={[0, 0]} showZero={false} className={animateBadge ? "badge-pulse" : ""}>
              <ShoppingCartOutlined className="tab-icon" />
            </Badge>
            <span>Cart</span>
          </Link>
        </div>

        <Drawer
          title="Categories"
          placement="left"
          onClose={closeDrawer}
          visible={drawerVisible}
          bodyStyle={{ padding: 0 }}
        >
          <MegaMenu mobile />
        </Drawer>
      </>
    );
  }

  // ------------------- DESKTOP NAVBAR -------------------
  return (
    <>
      <div className="desktop-navbar">
        <div className="nav-left">
          <Link to="/"><img src="/retrologo.png" alt="Logo" className="uc-logo" /></Link>
        </div>

        <div className="nav-middle">
     
          <SearchBar />
        </div>

        <div className="nav-right">
          <Link to="/cart" className="nav-link">
            <Badge count={totalCartQuantity} offset={[0, 0]} showZero={false} className={animateBadge ? "badge-pulse" : ""}>
              <ShoppingCartOutlined className="nav-icon" />
            </Badge>
          </Link>

          {!isLoggedIn ? (
            <Link to="/login" className="nav-link">
              <Avatar size={36} icon={<UserOutlined />} style={{ backgroundColor: "#078d89" }} />
              <span style={{ marginLeft: 6 }}>Sign In</span>
            </Link>
          ) : (
            <Dropdown overlay={profileMenu} trigger={["click"]} placement="bottomRight">
              <div className="nav-link" style={{ cursor: "pointer" }}>
                <Avatar size={36} src={userAvatar || undefined} icon={<UserOutlined />} style={{ backgroundColor: "#078d89" }} />
                <span style={{ marginLeft: 6 }}>{user?.name || "Profile"}</span>
              </div>
            </Dropdown>
          )}
        </div>
      </div>

      {/* MegaMenu BELOW navbar */}
      <div className="desktop-megamenu">
        <MegaMenu />
      </div>
    </>
  );
};

export default ResponsiveNavbar;
