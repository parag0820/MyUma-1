// import React from "react";
// import { Link, useLocation } from "react-router-dom";
// import { useSelector } from "react-redux";

// const Sidebar = () => {
//   const location = useLocation();
//   const { user } = useSelector((state) => state.auth);
//   const role = user?.role;

//   // ⭐ MANUAL CLOSE FUNCTION
//   const closeMobileMenu = () => {
//     const offcanvasElement = document.getElementById("mobileSidebar");
//     if (offcanvasElement) {
//       // Access the Bootstrap Instance
//       const bsOffcanvas = window.bootstrap?.Offcanvas.getInstance(offcanvasElement);
//       if (bsOffcanvas) bsOffcanvas.hide();
//     }
//   };

//  const ownerMenuItems = [
//    { name: "Dashboard", icon: "bi-speedometer2", path: "/owner-dashboard" },
//    { name: "My Listing", icon: "bi-file-earmark-plus", path: "/listing" },
//    { name: "Listing Manage", icon: "bi-kanban", path: "/manage-listings" },
//    { name: "Messages", icon: "bi-chat-dots", path: "/messages" },
//    { name: "Reviews", icon: "bi-star", path: "/reviews" },
//    { name: "Bookmarks", icon: "bi-bookmark-check", path: "/bookmarks" },
//    {
//      name: "Blog Comments",
//      icon: "bi-chat-left-quote",
//      path: "/blog-comments",
//    },
//    {
//      name: "My Subscription",
//      icon: "bi-wallet2",
//      path: "/subscription",
//    },
//    { name: "Inquiries", icon: "bi-envelope-paper", path: "/inquiries" },
//    { name: "My Profile", icon: "bi-person-gear", path: "/profile" },
//  ];

//  const userMenuItems = [
//    {
//      name: "My Account",
//      icon: "bi-person-circle",
//      path: "/user-update-profile",
//    },
//    { name: "My Bookmarks", icon: "bi-bookmark-heart", path: "/user-bookmarks" },
//    { name: "My Reviews", icon: "bi-star-half", path: "/user-reviews" },
//    {
//      name: "My Inquiries",
//      icon: "bi-question-circle",
//      path: "/user-inquiries",
//    },
//    {
//      name: "My Blog Comments",
//      icon: "bi-chat-left-text",
//      path: "/user-blog-comments",
//    },
//    { name: "My Favorites", icon: "bi-heart-fill", path: "/user-favorites" },
//  ];

//   const menuItems = role === "owner" ? ownerMenuItems : userMenuItems;

//   return (
//     <div className="nav flex-column py-2">
//       {menuItems.map((item, index) => (
//         <Link
//           key={index}
//           to={item.path}
//           onClick={closeMobileMenu} // ⭐ CALL CLOSE FUNCTION
//           className={`nav-link d-flex align-items-center gap-3 px-4 py-3 border-start border-4 ${
//             location.pathname === item.path
//               ? "bg-tan text-navy fw-bold border-white"
//               : "text-white opacity-75 border-transparent"
//           }`}
//         >
//           <i className={`bi ${item.icon} fs-5`}></i>
//           <span className="small text-uppercase ls-1 fw-bold">{item.name}</span>
//         </Link>
//       ))}
//    <style>{`
//         .bg-tan { background-color: #c49a6c !important; }
//         .text-navy { color: #1a2b49 !important; }
//         .border-transparent { border-left-color: transparent !important; }
//         .hover-bg-navy-light:hover { background-color: rgba(255,255,255,0.05); color: white; opacity: 1; }
//         .ls-1 { letter-spacing: 1px; }
//       `}</style>    </div>
//   );
// };

// export default Sidebar;
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const Sidebar = ({ onClose }) => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const role = user?.role;

  const menuItems =
    role === "owner"
      ? [
          {
            name: "Dashboard",
            icon: "bi-speedometer2",
            path: "/owner-dashboard",
          },
          {
            name: "My Listing",
            icon: "bi-file-earmark-plus",
            path: "/listing",
          },
          {
            name: "Listing Manage",
            icon: "bi-kanban",
            path: "/manage-listings",
          },
          { name: "Messages", icon: "bi-chat-dots", path: "/messages" },
          { name: "Reviews", icon: "bi-star", path: "/reviews" },
          { name: "Bookmarks", icon: "bi-bookmark-check", path: "/bookmarks" },
          {
            name: "Blog Comments",
            icon: "bi-chat-left-quote",
            path: "/blog-comments",
          },
          {
            name: "My Subscription",
            icon: "bi-wallet2",
            path: "/subscription",
          },
          { name: "Inquiries", icon: "bi-envelope-paper", path: "/inquiries" },
          { name: "My Profile", icon: "bi-person-gear", path: "/profile" },
        ]
      : [
          {
            name: "My Account",
            icon: "bi-person-circle",
            path: "/user-update-profile",
          },
          {
            name: "My Bookmarks",
            icon: "bi-bookmark-heart",
            path: "/user-bookmarks",
          },
          { name: "My Reviews", icon: "bi-star-half", path: "/user-reviews" },
          {
            name: "My Inquiries",
            icon: "bi-question-circle",
            path: "/user-inquiries",
          },
          {
            name: "My Blog Comments",
            icon: "bi-chat-left-text",
            path: "/user-blog-comments",
          },
          {
            name: "My Favorites",
            icon: "bi-heart-fill",
            path: "/user-favorites",
          },
        ];

  return (
    <div className="nav flex-column py-2">
      {menuItems.map((item, index) => (
        <Link
          key={index}
          to={item.path}
          onClick={onClose}
          className={`nav-link d-flex align-items-center gap-3 px-4 py-3 border-start border-4 text-decoration-none ${
            location.pathname === item.path
              ? "bg-tan text-navy fw-bold border-white"
              : "text-white opacity-75 border-transparent"
          }`}>
          <i className={`bi ${item.icon} fs-5`}></i>
          <span className="small text-uppercase ls-1 fw-bold">{item.name}</span>
        </Link>
      ))}
      <style>{`.bg-tan { background-color: #c49a6c !important; } .text-navy { color: #1a2b49 !important; }`}</style>
    </div>
  );
};
export default Sidebar;