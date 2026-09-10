// import React, { useState, useRef } from "react";
// import { useDispatch } from "react-redux";
// import { registerUser } from "./authSlice";
// import { toast } from "react-toastify";
// import { useNavigate, Link } from "react-router-dom";
// import { getImgURL } from "../../services/authService";

// const Register = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const fileInputRef = useRef(null);

//   const [imagePreview, setImagePreview] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const [registerData, setRegisterData] = useState({
//     fullName: "",
//     email: "",
//     password: "",
//     address: "",
//     country: "",
//     city: "",
//     contactNo: "",
//     role: "user",
//     status: "deactive",
//     profileImage: null,
//   });

//   // Trigger file input when clicking the image
//   const handleImageClick = () => {
//     fileInputRef.current.click();
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       // Validation: File Type
//       const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
//       if (!allowedTypes.includes(file.type)) {
//         return toast.error("Only JPG, JPEG, and PNG files are allowed");
//       }
//       // Validation: File Size (Max 2MB)
//       if (file.size > 2 * 1024 * 1024) {
//         return toast.error("Image size should be less than 2MB");
//       }

//       setRegisterData({ ...registerData, profileImage: file });
//       setImagePreview(URL.createObjectURL(file));
//     }
//   };

//   const validateForm = () => {
//     const {
//       fullName,
//       email,
//       password,
//       contactNo,
//       address,
//       city,
//       country,
//     } = registerData;

//     if (fullName.length < 3) {
//       toast.error("Full Name must be at least 3 characters");
//       return false;
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       toast.error("Please enter a valid email address");
//       return false;
//     }

//     const phoneRegex = /^\d{10,15}$/;
//     if (!phoneRegex.test(contactNo)) {
//       toast.error("Contact number must be 10-15 digits");
//       return false;
//     }

//     if (password.length < 6) {
//       toast.error("Password must be at least 6 characters long");
//       return false;
//     }
//     if (!city.trim()) {
//       toast.error("City is required");
//       return false;
//     }
//     if (!country.trim()) {
//       toast.error("Country is required");
//       return false;
//     }
//     if (address.length < 5) {
//       toast.error("Please provide a complete address");
//       return false;
//     }

//     return true;
//   };

//   const handleRegister = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) return;

//     setLoading(true);
//     const formData = new FormData();
//     Object.keys(registerData).forEach((key) => {
//       formData.append(key, registerData[key]);
//     });

//     try {
//       const res = await dispatch(registerUser(formData));
//       if (res.meta.requestStatus === "fulfilled") {
//         toast.success("Account created! Verification code sent to your email.");
//         navigate("/verify-otp", {
//           state: { email: registerData.email, type: "signup" },
//         });
//       } else {
//         toast.error(res.payload || "Registration failed. Try again.");
//       }
//     } catch (error) {
//       toast.error("Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container py-5 d-flex justify-content-center align-items-center min-vh-100">
//       <div
//         className="card shadow-lg border-0 p-4"
//         style={{ maxWidth: "700px", width: "100%", borderRadius: "20px" }}>
//         <h2 className="fw-bold text-center mb-2" style={{ color: "#001f3f" }}>
//           Join MyUma
//         </h2>
//         <p className="text-center text-muted mb-4">
//           Create your account to get started
//         </p>

//         <form onSubmit={handleRegister}>
//           {/* Role Selection */}
//           <div className="d-flex justify-content-center mb-4">
//             <div className="btn-group w-100" style={{ maxWidth: "300px" }}>
//               <button
//                 type="button"
//                 className={`btn py-2 ${registerData.role === "owner" ? "btn-dark shadow" : "btn-outline-dark"}`}
//                 onClick={() =>
//                   setRegisterData({ ...registerData, role: "owner" })
//                 }>
//                 As Owner
//               </button>
//               <button
//                 type="button"
//                 className={`btn py-2 ${registerData.role === "user" ? "btn-dark shadow" : "btn-outline-dark"}`}
//                 onClick={() =>
//                   setRegisterData({ ...registerData, role: "user" })
//                 }>
//                 As Guest/User
//               </button>
//             </div>
//           </div>

//           {/* Image Upload Section */}
//           <div className="text-center mb-4">
//             <div className="position-relative d-inline-block">
//               <img
//                 src={imagePreview || getImgURL(null)}
//                 alt="Profile"
//                 className="rounded-circle border shadow-sm"
//                 style={{
//                   width: "110px",
//                   height: "110px",
//                   objectFit: "cover",
//                   cursor: "pointer",
//                   border: "3px solid #001f3f",
//                 }}
//                 onClick={handleImageClick}
//               />
//               <div
//                 className="position-absolute bottom-0 end-0 bg-dark text-white rounded-circle d-flex align-items-center justify-content-center shadow"
//                 style={{
//                   width: "32px",
//                   height: "32px",
//                   cursor: "pointer",
//                   border: "2px solid white",
//                 }}
//                 onClick={handleImageClick}>
//                 <i
//                   className="bi bi-camera-fill"
//                   style={{ fontSize: "14px" }}></i>
//               </div>
//             </div>
//             <input
//               type="file"
//               ref={fileInputRef}
//               hidden
//               accept="image/*"
//               onChange={handleImageChange}
//             />
//             <small className="d-block text-muted mt-2">
//               Click image to upload photo
//             </small>
//           </div>

//           {/* Form Fields */}
//           <div className="row g-3">
//             <div className="col-md-6">
//               <label className="form-label small fw-bold">Full Name</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 placeholder="John Doe"
//                 required
//                 onChange={(e) =>
//                   setRegisterData({ ...registerData, fullName: e.target.value })
//                 }
//               />
//             </div>
//             <div className="col-md-6">
//               <label className="form-label small fw-bold">Email Address</label>
//               <input
//                 type="email"
//                 className="form-control"
//                 placeholder="john@example.com"
//                 required
//                 onChange={(e) =>
//                   setRegisterData({ ...registerData, email: e.target.value })
//                 }
//               />
//             </div>
//             <div className="col-md-6">
//               <label className="form-label small fw-bold">Contact Number</label>
//               <input
//                 type="tel"
//                 className="form-control"
//                 placeholder="phone number..."
//                 required
//                 onChange={(e) =>
//                   setRegisterData({
//                     ...registerData,
//                     contactNo: e.target.value,
//                   })
//                 }
//               />
//             </div>
//             <div className="col-md-6">
//               <label className="form-label small fw-bold">City</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 placeholder="city..."
//                 required
//                 onChange={(e) =>
//                   setRegisterData({ ...registerData, city: e.target.value })
//                 }
//               />
//             </div>
//             <div className="col-md-6">
//               <label className="form-label small fw-bold">Country</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 placeholder="country..."
//                 required
//                 onChange={(e) =>
//                   setRegisterData({ ...registerData, country: e.target.value })
//                 }
//               />
//             </div>
//             <div className="col-md-6">
//               <label className="form-label small fw-bold">Password</label>
//               <input
//                 type="password"
//                 title="password"
//                 className="form-control"
//                 placeholder="Min 6 characters"
//                 required
//                 onChange={(e) =>
//                   setRegisterData({ ...registerData, password: e.target.value })
//                 }
//               />
//             </div>
//             <div className="col-12">
//               <label className="form-label small fw-bold">
//                 Complete Address
//               </label>
//               <textarea
//                 className="form-control"
//                 rows="2"
//                 placeholder="Street, Apartment, Zip Code..."
//                 required
//                 onChange={(e) =>
//                   setRegisterData({ ...registerData, address: e.target.value })
//                 }
//               />
//             </div>
//           </div>

//           <button
//             className="btn btn-lg w-100 mt-4 text-white shadow"
//             style={{ backgroundColor: "#001f3f", borderRadius: "10px" }}
//             disabled={loading}>
//             {loading ? (
//               <span className="spinner-border spinner-border-sm me-2"></span>
//             ) : (
//               "Create Account"
//             )}
//           </button>
//         </form>

//         <p className="text-center mt-4 small mb-0">
//           Already have an account?{" "}
//           <Link
//             to="/login"
//             className="fw-bold text-decoration-none"
//             style={{ color: "#f39c12" }}>
//             Log In
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Register;



import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "./authSlice";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { getImgURL } from "../../services/authService";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const [registerData, setRegisterData] = useState({
    fullName: "",
    email: "",
    password: "",
    address: "",
    country: "",
    city: "",
    contactNo: "",
    role: "owner", // Default to owner for your flow
    status: "deactive",
    profileImage: null,
  });

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        return toast.error("Only JPG, JPEG, and PNG files are allowed");
      }
      if (file.size > 2 * 1024 * 1024) {
        return toast.error("Image size should be less than 2MB");
      }
      setRegisterData({ ...registerData, profileImage: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    const { fullName, email, password, contactNo, address, city, country } =
      registerData;
    if (fullName.length < 3) {
      toast.error("Full Name must be at least 3 characters");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Valid email required");
      return false;
    }
    if (password.length < 6) {
      toast.error("Password min 6 chars");
      return false;
    }
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    const formData = new FormData();
    Object.keys(registerData).forEach((key) => {
      formData.append(key, registerData[key]);
    });

    try {
     // Inside your handleRegister function in Register.jsx
const res = await dispatch(registerUser(formData));
if (res.meta.requestStatus === "fulfilled") {
  toast.success("Account created! Verify your email.");
  
  // Update this navigate call to include the payload
  navigate("/verify-otp", {
    state: {
      email: registerData.email,
      type: "signup",
      role: registerData.role,
      pendingData: res.payload.auth || res.payload.user // Store the data received during registration
    },
  });

      } else {
        toast.error(res.payload || "Registration failed.");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 d-flex justify-content-center align-items-center min-vh-100">
      <div
        className="card shadow-lg border-0 p-4"
        style={{ maxWidth: "700px", width: "100%", borderRadius: "20px" }}>
        <h2 className="fw-bold text-center mb-2" style={{ color: "#001f3f" }}>
          Join MyUma
        </h2>
        <p className="text-center text-muted mb-4">
          Create your account to get started
        </p>
        <form onSubmit={handleRegister}>
          <div className="d-flex justify-content-center mb-4">
            <div className="btn-group w-100" style={{ maxWidth: "300px" }}>
              <button
                type="button"
                className={`btn py-2 ${registerData.role === "owner" ? "btn-dark shadow" : "btn-outline-dark"}`}
                onClick={() =>
                  setRegisterData({ ...registerData, role: "owner" })
                }>
                As Owner
              </button>
              <button
                type="button"
                className={`btn py-2 ${registerData.role === "user" ? "btn-dark shadow" : "btn-outline-dark"}`}
                onClick={() =>
                  setRegisterData({ ...registerData, role: "user" })
                }>
                As Guest
              </button>
            </div>
          </div>
          <div className="text-center mb-4" onClick={handleImageClick}>
            <img
              src={imagePreview || getImgURL(null)}
              alt="Profile"
              className="rounded-circle border shadow-sm"
              style={{
                width: "110px",
                height: "110px",
                objectFit: "cover",
                cursor: "pointer",
                border: "3px solid #001f3f",
              }}
            />
            <input
              type="file"
              ref={fileInputRef}
              hidden
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label small fw-bold">Full Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Name"
                required
                onChange={(e) =>
                  setRegisterData({ ...registerData, fullName: e.target.value })
                }
              />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-bold">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                required
                onChange={(e) =>
                  setRegisterData({ ...registerData, email: e.target.value })
                }
              />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-bold">Contact</label>
              <input
                type="tel"
                className="form-control"
                placeholder="Phone"
                required
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    contactNo: e.target.value,
                  })
                }
              />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-bold">City</label>
              <input
                type="text"
                className="form-control"
                placeholder="City"
                required
                onChange={(e) =>
                  setRegisterData({ ...registerData, city: e.target.value })
                }
              />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-bold">Country</label>
              <input
                type="text"
                className="form-control"
                placeholder="Country"
                required
                onChange={(e) =>
                  setRegisterData({ ...registerData, country: e.target.value })
                }
              />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-bold">Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Password"
                required
                onChange={(e) =>
                  setRegisterData({ ...registerData, password: e.target.value })
                }
              />
            </div>
            <div className="col-12">
              <label className="form-label small fw-bold">Address</label>
              <textarea
                className="form-control"
                rows="2"
                placeholder="Full Address"
                required
                onChange={(e) =>
                  setRegisterData({ ...registerData, address: e.target.value })
                }
              />
            </div>
          </div>
          <button
            className="btn btn-lg w-100 mt-4 text-white shadow"
            style={{ backgroundColor: "#001f3f", borderRadius: "10px" }}
            disabled={loading}>
            {loading ? "Processing..." : "Create Account"}
          </button>
        </form>
        <p className="text-center mt-4 small mb-0">
          Already have an account?{" "}
          <Link
            to="/login"
            className="fw-bold text-decoration-none"
            style={{ color: "#f39c12" }}>
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};
export default Register;