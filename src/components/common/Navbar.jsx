// import React, { useState, useEffect } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { logout } from "../../features/auth/authSlice";
// import { getLogoAPI, getImgURL } from "../../services/authService";

// export default function Navbar() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const dispatch = useDispatch();

//   // Redux Auth State
//   const {
//     token,
//     user: userData,
//     isAuthenticated,
//   } = useSelector((state) => state.auth);

//   const [logoUrl, setLogoUrl] = useState("");
//   const [imageError, setImageError] = useState(false);

//   // Auth Logic
//   const isLoggedIn = !!(token || userData?.token || isAuthenticated);
//   const role = userData?.role || "";
//   const fullName = userData?.fullName || userData?.name || "User";
//   const profileImgPath = userData?.profileImage;
//   const firstLetter = fullName.charAt(0).toUpperCase();

//   const isActive = (path) => location.pathname === path;

//   // ⭐ CRITICAL FIX: Auto-close sidebar whenever URL changes
//   useEffect(() => {
//     const offcanvasElement = document.getElementById("navbarOffcanvas");
//     if (offcanvasElement) {
//       // 1. Get bootstrap instance
//       const bsOffcanvas =
//         window.bootstrap?.Offcanvas.getInstance(offcanvasElement);
//       if (bsOffcanvas) {
//         bsOffcanvas.hide();
//       }

//       // 2. Manual Cleanup (Backdrop stuck hone se rokne ke liye)
//       const backdrops = document.querySelectorAll(".offcanvas-backdrop");
//       backdrops.forEach((backdrop) => backdrop.remove());
//       document.body.style.overflow = "auto";
//       document.body.style.paddingRight = "0";
//     }
//   }, [location.pathname]); // Yeh line URL change ko monitor karti hai

//   const handleNavigation = (path) => {
//     navigate(path);
//   };

//   // const handleLogout = () => {
//     // dispatch(logout());
//     // navigate("/");
//   // };
// // const handleLogout = () => {
// //   localStorage.removeItem("user");
// //   localStorage.removeItem("token");
// //   localStorage.removeItem("sessionExpiry");
// //   // localStorage.clear();  <-- Is line ko COMMENT kar den ya hata den
// //   navigate("/login");
// // };

// const handleLogout = () => {
//   // 1. Redux State Clear
//   dispatch(logout());

//   // 2. Sidebar Cleanup (Backdrop removal)
//   const offcanvasElement = document.getElementById("navbarOffcanvas");
//   if (offcanvasElement) {
//     const bsOffcanvas = window.bootstrap?.Offcanvas?.getInstance(offcanvasElement);
//     if (bsOffcanvas) bsOffcanvas.hide();
//   }
//   const backdrops = document.querySelectorAll(".offcanvas-backdrop");
//   backdrops.forEach((backdrop) => backdrop.remove());
//   document.body.style.overflow = "auto";

//   // 3. ⭐ CRITICAL FIX: Reset the base URL to root and clear the /login path
//   // Ye line URL se /login ko hata degi aur sirf localhost:5173/#/ rakhegi
//   window.location.href = "/#/";
// };
//   // Fetch Logo
//   useEffect(() => {
//     const fetchLogo = async () => {
//       try {
//         const res = await getLogoAPI();
//         if (res?.logo?.logo) {
//           setLogoUrl(getImgURL(res.logo.logo));
//         }
//       } catch (error) {
//         console.error("Failed to fetch logo", error);
//       }
//     };
//     fetchLogo();
//   }, []);

//   return (
//     <nav className="navbar navbar-expand-lg bg-white fixed-top shadow-sm w-100 border-0 py-2">
//       <div className="container px-4">
//         {/* LOGO */}
//         <Link
//           className="navbar-brand d-flex align-items-center text-decoration-none"
//           to="/">
//           {logoUrl ? (
//             <img
//               src={logoUrl}
//               alt="Logo"
//               style={{ maxHeight: "45px", width: "auto", objectFit: "contain" }}
//             />
//           ) : (
//             <span className="brand-text text-dark fs-3 fw-bold">
//               My
//               <span className="text-tan" style={{ color: "#de9f57" }}>
//                 Uma
//               </span>
//             </span>
//           )}
//         </Link>

//         {/* MOBILE TOGGLE */}
//         <button
//           className="navbar-toggler border-0 shadow-none bg-light"
//           type="button"
//           data-bs-toggle="offcanvas"
//           data-bs-target="#navbarOffcanvas">
//           <span className="navbar-toggler-icon"></span>
//         </button>

//         {/* MENU (Offcanvas) */}
//         <div
//           className="offcanvas offcanvas-end bg-white border-0"
//           id="navbarOffcanvas"
//           tabIndex="-1">
//           <div className="offcanvas-header px-4 pt-4 border-bottom">
//             <h5 className="offcanvas-title text-dark fw-bold">Menu</h5>
//             <button
//               type="button"
//               className="btn-close shadow-none"
//               data-bs-dismiss="offcanvas"></button>
//           </div>

//           <div className="offcanvas-body align-items-center">
//             <ul className="navbar-nav mx-auto text-start text-lg-center mb-4 mb-lg-0 w-100 justify-content-center align-items-lg-center gap-lg-2">
//               <li className="nav-item">
//                 <button
//                   onClick={() => handleNavigation("/")}
//                   className={`nav-link-uma bg-transparent border-0 text-black py-2 px-3 fw-bold ${isActive("/") ? "active text-tan" : ""}`}>
//                   Home
//                 </button>
//               </li>
//               <li className="nav-item">
//                 <button
//                   onClick={() => handleNavigation("/pricing")}
//                   className={`nav-link-uma bg-transparent border-0 text-black py-2 px-3 fw-bold ${isActive("/pricing") ? "active text-tan" : ""}`}>
//                   Pricing
//                 </button>
//               </li>
//               <li className="nav-item">
//                 <button
//                   onClick={() => handleNavigation("/blog")}
//                   className={`nav-link-uma bg-transparent border-0 text-black py-2 px-3 fw-bold ${isActive("/blog") ? "active text-tan" : ""}`}>
//                   Blog
//                 </button>
//               </li>
//               <li className="nav-item">
//                 <button
//                   onClick={() => handleNavigation("/contact")}
//                   className={`nav-link-uma bg-transparent border-0 text-black py-2 px-3 fw-bold ${isActive("/contact") ? "active text-tan" : ""}`}>
//                   Contact us
//                 </button>
//               </li>

//               {/* OWNER BUTTON */}
//               {isLoggedIn && role === "owner" && (
//                 <li className="nav-item mt-2 mt-lg-0 ms-lg-2">
//                   <button
//                     onClick={() => handleNavigation("/listing")}
//                     className="uma-btn-primary btn-sm px-3 text-nowrap w-100 fw-bold border-0"
//                     style={{
//                       fontSize: "13px",
//                       borderRadius: "20px",
//                       padding: "8px 20px",
//                       backgroundColor: "#de9f57",
//                       color: "#002147",
//                     }}>
//                     New Listing
//                   </button>
//                 </li>
//               )}
//             </ul>

//             {/* PROFILE SECTION */}
//             <div className="d-flex align-items-center mt-3 mt-lg-0 ms-lg-3 ps-lg-3 border-lg-start">
//               {isLoggedIn ? (
//                 <div className="dropdown">
//                   <button
//                     className="btn bg-transparent border-0 p-0 d-flex align-items-center flex-nowrap gap-3 shadow-none dropdown-toggle-no-caret"
//                     type="button"
//                     data-bs-toggle="dropdown">
//                     <div className="text-end" style={{ lineHeight: "1.1" }}>
//                       <div
//                         className="fw-bold text-black"
//                         style={{
//                           fontSize: "14px",
//                           whiteSpace: "nowrap",
//                           maxWidth: "130px",
//                           overflow: "hidden",
//                           textOverflow: "ellipsis",
//                         }}>
//                         {fullName}
//                       </div>
//                       <small
//                         className="text-muted text-capitalize d-block fw-bold"
//                         style={{ fontSize: "11px", color: "#de9f57" }}>
//                         {role}
//                       </small>
//                     </div>

//                     {profileImgPath && !imageError ? (
//                       <img
//                         src={getImgURL(profileImgPath.trim())}
//                         alt="Profile"
//                         className="rounded-circle border"
//                         style={{
//                           width: "42px",
//                           height: "42px",
//                           objectFit: "cover",
//                           border: "2px solid #de9f57",
//                         }}
//                         onError={() => setImageError(true)}
//                       />
//                     ) : (
//                       <div
//                         className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white shadow-sm"
//                         style={{
//                           width: "42px",
//                           height: "42px",
//                           backgroundColor: "#001f3f",
//                           fontSize: "18px",
//                           border: "2px solid #de9f57",
//                         }}>
//                         {firstLetter}
//                       </div>
//                     )}
//                   </button>

//                   <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2">
//                     {role === "owner" ? (
//                       <>
//                         <li>
//                           <button
//                             className="dropdown-item py-2"
//                             onClick={() => handleNavigation("/listing")}>
//                             My Listing
//                           </button>
//                         </li>
//                         <li>
//                           <button
//                             className="dropdown-item py-2"
//                             onClick={() => handleNavigation("/reviews")}>
//                             Reviews
//                           </button>
//                         </li>
//                         <li>
//                           <button
//                             className="dropdown-item py-2"
//                             onClick={() => handleNavigation("/bookmarks")}>
//                             Bookmarks
//                           </button>
//                         </li>
//                         <li>
//                           <button
//                             className="dropdown-item py-2 fw-bold"
//                             onClick={() => handleNavigation("/profile")}>
//                             My Account
//                           </button>
//                         </li>
//                       </>
//                     ) : (
//                       <li>
//                         <button
//                           className="dropdown-item py-2 fw-bold"
//                           onClick={() =>
//                             handleNavigation("/user-update-profile")
//                           }>
//                           My Account
//                         </button>
//                       </li>
//                     )}
//                     <li>
//                       <hr className="dropdown-divider" />
//                     </li>
//                     <li>
//                       <button
//                         className="dropdown-item text-danger fw-bold"
//                         onClick={handleLogout}>
//                         Logout
//                       </button>
//                     </li>
//                   </ul>
//                 </div>
//               ) : (
//                 <button
//                   onClick={() => handleNavigation("/login")}
//                   className="uma-btn-navy py-2 px-4 fw-bold text-nowrap shadow-none border-0"
//                   style={{
//                     borderRadius: "20px",
//                     backgroundColor: "#002147",
//                     color: "white",
//                   }}>
//                   Sign In
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }




import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import { getLogoAPI, getImgURL } from "../../services/authService";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // ⭐ Navbar State (Admin ki tarah)
  const [isNavOpen, setIsNavOpen] = useState(false);

  const {
    token,
    user: userData,
    isAuthenticated,
  } = useSelector((state) => state.auth);
  const [logoUrl, setLogoUrl] = useState("");
  const [imageError, setImageError] = useState(false);

  const isLoggedIn = !!(token || userData?.token || isAuthenticated);
  const role = userData?.role || "";
  const fullName = userData?.fullName || userData?.name || "User";
  const profileImgPath = userData?.profileImage;
  const firstLetter = fullName.charAt(0).toUpperCase();

  const isActive = (path) => location.pathname === path;

  // URL change hote hi menu band karo
  useEffect(() => {
    setIsNavOpen(false);
    document.body.style.overflow = "auto";
  }, [location.pathname]);

  const handleLogout = () => {
    dispatch(logout());
    setIsNavOpen(false);
    window.location.href = "/";
  };

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const res = await getLogoAPI();
        if (res?.logo?.logo) setLogoUrl(getImgURL(res.logo.logo));
      } catch (error) {
        console.error(error);
      }
    };
    fetchLogo();
  }, []);

  return (
    <nav className="navbar navbar-expand-lg bg-white fixed-top shadow-sm w-100 border-0 py-2">
      <div className="container px-4">
        <Link
          className="navbar-brand d-flex align-items-center text-decoration-none"
          to="/">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="Logo"
              style={{ maxHeight: "45px", width: "auto" }}
            />
          ) : (
            <span className="brand-text text-dark fs-3 fw-bold">
              My<span style={{ color: "#de9f57" }}>Uma</span>
            </span>
          )}
        </Link>

        {/* ⭐ Toggle Button change to State */}
        <button
          className="navbar-toggler border-0 shadow-none bg-light"
          type="button"
          onClick={() => setIsNavOpen(true)}>
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* ⭐ Menu container with State-based classes */}
        <div
          className={`offcanvas offcanvas-end bg-white border-0 ${isNavOpen ? "show" : ""}`}
          style={{
            visibility: isNavOpen ? "visible" : "hidden",
            transition: "0.3s",
          }}
          id="navbarOffcanvas">
          <div className="offcanvas-header px-4 pt-4 border-bottom">
            <h5 className="offcanvas-title text-dark fw-bold">Menu</h5>
            <button
              type="button"
              className="btn-close shadow-none"
              onClick={() => setIsNavOpen(false)}></button>
          </div>

          <div className="offcanvas-body align-items-center">
            {/* <ul className="navbar-nav mx-auto text-start text-lg-center mb-4 mb-lg-0 w-100 justify-content-center align-items-lg-center gap-lg-2">
              {["/", "/pricing", "/blog", "/contact"].map((path) => (
                <li className="nav-item" key={path}>
                  <Link
                    to={path}
                    className={`nav-link-uma bg-transparent border-0 text-black py-2 px-3 fw-bold text-decoration-none d-block ${isActive(path) ? "active text-tan" : ""}`}>
                    {path === "/"
                      ? "Home"
                      : path.replace("/", "").charAt(0).toUpperCase() +
                        path.slice(2).replace("-", " ")}
                  </Link>
                </li>
              ))}

              {isLoggedIn && role === "owner" && (
                <li className="nav-item mt-2 mt-lg-0 ms-lg-2">
                  <Link
                    to="/listing"
                    className="uma-btn-primary btn-sm px-3 text-nowrap w-100 fw-bold border-0 text-decoration-none text-center d-block"
                    style={{
                      fontSize: "13px",
                      borderRadius: "20px",
                      padding: "8px 20px",
                      backgroundColor: "#de9f57",
                      color: "#002147",
                    }}>
                    New Listing
                  </Link>
                </li>
              )}
            </ul> */}
            <ul className="navbar-nav mx-auto text-start text-lg-center mb-4 mb-lg-0 w-100 justify-content-center align-items-lg-center gap-lg-2">
              {["/", "/pricing", "/blog", "/contact"].map((path) => {
                // Agar path pricing hai aur role "user" hai, toh kuch mat dikhao (return null)
                if (path === "/pricing" && role === "user") return null;

                return (
                  <li className="nav-item" key={path}>
                    <Link
                      to={path}
                      className={`nav-link-uma bg-transparent border-0 text-black py-2 px-3 fw-bold text-decoration-none d-block ${
                        isActive(path) ? "active text-tan" : ""
                      }`}>
                      {path === "/"
                        ? "Home"
                        : path.replace("/", "").charAt(0).toUpperCase() +
                          path.slice(2).replace("-", " ")}
                    </Link>
                  </li>
                );
              })}

              {isLoggedIn && role === "owner" && (
                <li className="nav-item mt-2 mt-lg-0 ms-lg-2">
                  <Link
                    to="/listing"
                    className="uma-btn-primary btn-sm px-3 text-nowrap w-100 fw-bold border-0 text-decoration-none text-center d-block"
                    style={{
                      fontSize: "13px",
                      borderRadius: "20px",
                      padding: "8px 20px",
                      backgroundColor: "#de9f57",
                      color: "#002147",
                    }}>
                    New Listing
                  </Link>
                </li>
              )}
            </ul>

            <div className="d-flex align-items-center mt-3 mt-lg-0 ms-lg-3 ps-lg-3 border-lg-start">
              {isLoggedIn ? (
                <div className="dropdown">
                  <button
                    className="btn bg-transparent border-0 p-0 d-flex align-items-center flex-nowrap gap-3 shadow-none dropdown-toggle-no-caret"
                    type="button"
                    data-bs-toggle="dropdown">
                    <div className="text-end" style={{ lineHeight: "1.2" }}>
                      {/* Name Section - One Row Fix */}
                      <div
                        className="fw-bold text-black text-nowrap"
                        style={{
                          fontSize: "14px",
                          maxWidth: "180px", // Name ke liye kafi space di hai
                          overflow: "hidden",
                          textOverflow: "ellipsis", // Lamba naam hone par ... dikhayega
                        }}>
                        {fullName}
                      </div>
                      {/* Role Section */}
                      <small
                        className="text-muted text-capitalize d-block fw-bold"
                        style={{ fontSize: "11px", color: "#de9f57" }}>
                        {role}
                      </small>
                    </div>

                    {/* Profile Image / Initials Section */}
                    {profileImgPath && !imageError ? (
                      <img
                        src={getImgURL(profileImgPath)}
                        alt="Profile"
                        className="rounded-circle border"
                        style={{
                          width: "42px",
                          height: "42px",
                          objectFit: "cover",
                          border: "2px solid #de9f57",
                        }}
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white shadow-sm"
                        style={{
                          width: "42px",
                          height: "42px",
                          backgroundColor: "#001f3f",
                          border: "2px solid #de9f57",
                          fontSize: "16px",
                        }}>
                        {firstLetter}
                      </div>
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2">
                    <li>
                      <Link
                        className="dropdown-item py-2 fw-bold"
                        to={
                          role === "owner" ? "/profile" : "/user-update-profile"
                        }>
                        My Account
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button
                        className="dropdown-item text-danger fw-bold bg-transparent border-0 w-100 text-start"
                        onClick={handleLogout}>
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="uma-btn-navy py-2 px-4 fw-bold text-nowrap text-decoration-none"
                  style={{
                    borderRadius: "20px",
                    backgroundColor: "#002147",
                    color: "white",
                  }}>
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
        {/* ⭐ Manual Backdrop */}
        {isNavOpen && (
          <div
            className="offcanvas-backdrop fade show"
            onClick={() => setIsNavOpen(false)}></div>
        )}
      </div>
    </nav>
  );
}