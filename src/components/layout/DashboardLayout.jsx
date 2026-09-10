

import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../common/Sidebar";
import { AlignLeft } from "lucide-react";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // URL change hote hi sidebar band
  useEffect(() => {
    setIsSidebarOpen(false);
    document.body.style.overflow = "auto";
  }, [location.pathname]);

  return (
    <div className="container-fluid p-0 text-start">
      <div className="d-flex">
        {/* DESKTOP SIDEBAR */}
        <aside
          className="d-none d-lg-block bg-navy"
          style={{
            width: "260px",
            height: "100vh",
            position: "sticky",
            top: "0",
            zIndex: 1000,
          }}>
          <div style={{ height: "30px" }}></div>
          <Sidebar />
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-grow-1 bg-light min-vh-100 overflow-hidden">
          <div style={{ height: "20px" }}></div>
          <div className="d-lg-none px-3 mb-3">
            <div className="bg-white p-3 rounded-4 shadow-sm d-flex align-items-center justify-content-between border">
              <h6 className="m-0 fw-bold text-navy text-uppercase ls-1">
                Dashboard
              </h6>
              <button
                className="btn btn-navy d-flex align-items-center gap-2 rounded-3"
                onClick={() => setIsSidebarOpen(true)}>
                <AlignLeft size={20} />{" "}
                <span className="fw-bold small">MENU</span>
              </button>
            </div>
          </div>
          <div className="px-3 px-md-4 pb-5">
            <Outlet />
          </div>
        </main>
      </div>

      {/* MOBILE SIDEBAR */}
      <div
        className={`offcanvas offcanvas-start bg-navy text-white ${isSidebarOpen ? "show" : ""}`}
        style={{
          width: "280px",
          visibility: isSidebarOpen ? "visible" : "hidden",
          transition: "0.3s",
        }}
        id="mobileSidebar">
        <div className="offcanvas-header border-bottom border-secondary border-opacity-25 p-4">
          <h5 className="offcanvas-title fw-bold ls-1">USER MENU</h5>
          <button
            type="button"
            className="btn-close btn-close-white shadow-none"
            onClick={() => setIsSidebarOpen(false)}></button>
        </div>
        <div className="offcanvas-body p-0">
          <Sidebar onClose={() => setIsSidebarOpen(false)} />
        </div>
      </div>

      {/* Manual Backdrop */}
      {isSidebarOpen && (
        <div
          className="offcanvas-backdrop fade show"
          style={{ zIndex: 1040 }}
          onClick={() => setIsSidebarOpen(false)}></div>
      )}

      <style>{`.bg-navy { background-color: #1a2b49 !important; } .btn-navy { background-color: #1a2b49; color: white; border: none; padding: 8px 16px; }`}</style>
    </div>
  );
};
export default DashboardLayout;