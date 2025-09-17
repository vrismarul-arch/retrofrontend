// src/routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import PartnerRoute from "./PartnerRoute";

import Home from "../pages/home/Home";
import CategoryServices from "../pages/services/CategoryServices";
import Navbar from "../components/Navbar";
import NotFoundPage from "../pages/NotFoundPage";

// User pages
import CartPage from "../pages/cart/CartPage";
import CheckoutPage from "../pages/checkout/CheckoutPage";
import PaymentPage from "../pages/payment/PaymentPage";
import ProfilePage from "../pages/profile/ProfilePage";
import UserBookingDetails from "../pages/profile/UserBookingDetails";
import SuccessPage from "../pages/payment/SuccessPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";

// Admin pages
import AdminLayout from "../pages/Admin/AdminLayout";
import ServicesPage from "../pages/Admin/categories/ServicesPage";
import CategoriesPage from "../pages/Admin/categories/CategoriesPage";
import BannersPage from "../pages/Admin/addbanner/BannersPage";
import AdminBookingOrders from "../pages/Admin/bookings/AdminBookingOrders";
import BookingDetails from "../pages/Admin/bookings/BookingDetails";
import AdminProfile from "../pages/Admin/profile/AdminProfile";
import AdminPartnersPage from "../pages/Admin/partner/AdminPartnersPage";

// Partner pages
import PartnerLayout from "../pages/partner/layout/PartnerLayout";
import PartnerRegisterForm from "../pages/partner/home/PartnerRegisterForm";
import Sendotp from "../pages/partner/otp/Sendotp";
import VerifyOTP from "../pages/partner/otp/VerifyOTP";
import PartnerLoginPage from "../pages/partner/login/PartnerLoginPage";

// Partner App pages
import PartnerAppLayout from "../pages/partner/layout/PartnerAppLayout";
import PartnerDashboard from "../pages/partner/dashboard/PartnerDashboard";
import PartnerProfile from "../pages/partner/home/profile/PartnerProfile";
import PartnerNotifications from "../pages/partner/notification/PartnerNotifications";
import PartnerMessages from "../pages/partner/notification/PartnerMessages";
import PartnerOrderHistory from "../pages/partner/home/history/PartnerOrderHistory";
import BookingHistoryPage from "../pages/profile/BookingHistoryPage";
import SubcategoryServices from "../pages/services/SubcategoryServices";
import BrandProducts from "../pages/services/BrandProducts";
import SingleProductPage from "../pages/services/details/SingleProductPage";
import VendorProduct from "../pages/vendor/VendorProduct";
import AdminProductsPage from "../pages/Admin/product/AdminProductsPage";
import AdminDashboard from "../pages/Admin/dashboard/AdminDashboard";

// Wrapper for pages with Navbar
function WithNavbar({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<WithNavbar><Home /></WithNavbar>} />
      <Route path="/home" element={<WithNavbar><Home /></WithNavbar>} />
      <Route path="/subcategories/:id" element={<WithNavbar><SubcategoryServices /></WithNavbar>} />
      <Route path="/brands/:id" element={<WithNavbar><BrandProducts /></WithNavbar>} />
      <Route path="/product/:id" element={<WithNavbar><SingleProductPage /></WithNavbar>} />

      <Route path="/category/:id" element={<WithNavbar><CategoryServices /></WithNavbar>} />
      <Route path="/category" element={<WithNavbar><CategoryServices /></WithNavbar>} />
      <Route path="/booking-history" element={<WithNavbar><BookingHistoryPage /></WithNavbar>} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/success" element={<SuccessPage />} />
      <Route path="/seller" element={<VendorProduct />} />

      {/* Protected User Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/cart" element={<WithNavbar><CartPage /></WithNavbar>} />
        <Route path="/checkout" element={<WithNavbar><CheckoutPage /></WithNavbar>} />
        <Route path="/payment" element={<WithNavbar><PaymentPage /></WithNavbar>} />
        <Route path="/profile" element={<WithNavbar><ProfilePage /></WithNavbar>} />
        <Route path="/profile/bookings/:id" element={<WithNavbar><UserBookingDetails /></WithNavbar>} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="retroproduct" element={<ServicesPage />} />
        <Route path="banners" element={<BannersPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="partners" element={<AdminPartnersPage />} />
        <Route path="bookings" element={<AdminBookingOrders />} />
        <Route path="bookings/:id" element={<BookingDetails />} />
      </Route>

      {/* Partner Public Routes */}
      <Route path="/partner" element={<PartnerLayout />}>
        <Route path="register" element={<PartnerRegisterForm />} />
        <Route path="sendotp" element={<Sendotp />} />
        <Route path="verifyotp" element={<VerifyOTP />} />
        <Route path="login" element={<PartnerLoginPage />} />
      </Route>

      {/* Partner Protected App Routes */}
      <Route path="/partnerapp" element={<PartnerAppLayout />}>
        <Route element={<PartnerRoute />}>
          <Route path="dashboard" element={<PartnerDashboard />} />
          <Route path="profile" element={<PartnerProfile />} />
          <Route path="order-history" element={<PartnerOrderHistory />} />
          <Route path="notifications" element={<PartnerNotifications />} />
          <Route path="messages" element={<PartnerMessages />} />
        </Route>
      </Route>

      {/* Fallback 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
