import React from "react";
import {
    BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useSelector } from "react-redux";

// Common Components
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

// Pages Imports
import Home from "../pages/Home";
// Auth Features Imports
import Login from "../features/auth/Login";
import Register from "../features/auth/Register";
import ForgotPassword from "../features/auth/ForgotPassword";
import VerifyOtp from "../features/auth/VerifyOtp";
import ResetPassword from "../features/auth/ResetPassword";

import Pricing from "../pages/Pricing";
import PaymentSuccess from "../pages/PaymentSuccess";
import Blog from "../pages/Blog";
import BlogDetail from "../pages/BlogDetail";
import ProfileUpdate from "../pages/Profile";
import BrowseListings from "../pages/BrowseListings";
import BrowseDetails from "../pages/BrowseDetails";
import AboutUs from "../pages/AboutUs";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import TermsConditions from "../pages/TermsConditions";
import Listing from "../pages/Listing";
import ListingDetails from "../pages/ListingDetails";
import Messages from "../pages/Messages";
import DashboardLayout from "../components/layout/DashboardLayout";
import Reviews from "../pages/Reviews";
import ListingReviews from "../pages/ListingReviews";
import ContactUs from "../pages/ContactUs";
import TestimonialPage from "../pages/TestimonialPage";
import OwnerBookmarks from "../pages/OwnerBookmarks";
import HomeSearchBar from "../pages/HomeSearchBar";
import Inquiry from "../pages/Inquiry";
import UserProfileUpdate from "../pages/UserProfileUpdate";
import ManageListings from "../pages/ManageListings";
import BlogComments from "../pages/BlogComments";
import UserBookmarks from "../pages/UserBookmarks";// --- Route Protection Logic ---
import UserFavorites from "../pages/UserFavorites";
import UserReviews from "../pages/UserReviews";
import UserInquiry from "../pages/UserInquiry";
import UserBlogComments from "../pages/UserBlogComments";
import OwnerDashboard from "../pages/OwnerDashboard";
import CheckoutPage from "../pages/CheckoutPage";
import OwnerSubscription from "../pages/OwnerSubscription";
import SuccessPage from "../pages/SuccessPage";
const ProtectedRoute = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // ONLY redirect to pricing if they are active/deactive and NOT verifying OTP
  // However, since /verify-otp is PUBLIC, it won't hit this logic.
  // The issue is likely the user being auto-logged in.
  if (user && user.status === "deactive") {
    return <Navigate to="/pricing" replace />;
  }

  return <Outlet />;
};

const AppRoutes = () => {
  return (
    <Router>
      <Navbar />

      <div className="page-wrapper" style={{ minHeight: "80vh" }}>
        <Routes>
          {/* --- PUBLIC ROUTES --- */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsConditions />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/testimonials" element={<TestimonialPage />} />
          <Route path="/home-search" element={<HomeSearchBar />} />
          <Route path="/browse/:slug" element={<BrowseDetails />} />
          <Route path="/browse" element={<BrowseListings />} />
          <Route path="/checkout-details" element={<CheckoutPage />} />
          <Route path="success" element={<SuccessPage />} />
          {/* --- PROTECTED ROUTES --- */}
          <Route element={<ProtectedRoute />}>
            <Route path="/reviews/:slug" element={<ListingReviews />} />
            <Route path="/listing/:slug" element={<ListingDetails />} />

            <Route element={<DashboardLayout />}>
              <Route path="/listing" element={<Listing />} />
              <Route path="/profile" element={<ProfileUpdate />} />
              <Route path="/reviews" element={<Reviews />} />
                                  <Route path="/booking" element={<Bookings />} />

              <Route path="/messages" element={<Messages />} />
              <Route path="/bookmarks" element={<OwnerBookmarks />} />
              <Route path="/inquiries" element={<Inquiry />} />
              <Route path="/manage-listings" element={<ManageListings />} />
              <Route path="/blog-comments" element={<BlogComments />} />
              <Route
                path="/user-update-profile"
                element={<UserProfileUpdate />}
              />
              <Route path="/user-bookmarks" element={<UserBookmarks />} />
              <Route path="/user-favorites" element={<UserFavorites />} />
              <Route path="/user-reviews" element={<UserReviews />} />
              <Route path="/user-inquiries" element={<UserInquiry />} />
              <Route
                path="/user-blog-comments"
                element={<UserBlogComments />}
              />
              <Route path="/subscription" element={<OwnerSubscription />} />
              <Route path="/owner-dashboard" element={<OwnerDashboard />} />
            </Route>
          </Route>
        </Routes>
      </div>

      <Footer />
    </Router>
  );
};

export default AppRoutes;
