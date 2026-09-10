import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { getUser } from "../utils/storage";
import { getProfileAPI, updateProfileAPI } from "../features/auth/api";
import { getImgURL } from "../services/authService";
import { updateUser } from "../features/auth/authSlice";

const UserProfileUpdate = () => {
  const dispatch = useDispatch();
  const [dbImage, setDbImage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
    contactNo: "",
    city: "",
    country: "",
    status: "deactive",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Inside UserProfileUpdate.jsx, replace the useEffect with this:
  useEffect(() => {
    const getprofileHandler = async () => {
      const user = getUser();
      const userId = user?._id || user?.id;
      if (!userId) return;

      try {
        const res = await getProfileAPI(userId);
        const profile = res?.auth || res?.data || res;

        if (profile) {
          setFormData({
            fullName: profile.fullName || "",
            email: profile.email || "",
            address: profile.address || "",
            contactNo: profile.contactNo || "",
            city: profile.city || "",
            country: profile.country || "",
            status: profile.status || "deactive",
          });
          setDbImage(profile.profileImage || "");

          // This ensures Redux is updated as soon as the page loads
          dispatch(updateUser(profile));
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    getprofileHandler();
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = getUser();
    const userId = user?.id || user?._id; // Handles both id formats
    if (!userId) return;

    const data = new FormData();
    data.append("fullName", formData.fullName);
    data.append("email", formData.email);
    data.append("address", formData.address);
    data.append("contactNo", formData.contactNo);
    data.append("city", formData.city);
    data.append("country", formData.country);
    data.append("role", user.role); // Keep original role
    data.append("status", formData.status);

    if (selectedFile) {
      data.append("profileImage", selectedFile);
    }
    // Inside handleSubmit in UserProfileUpdate.jsx

    try {
      const response = await updateProfileAPI(userId, data);
      const updatedUser = response?.auth || response?.data;

      if (updatedUser) {
        // This sends the data to Redux authSlice.js -> updateUser
        dispatch(updateUser(updatedUser));

        toast.success("Profile Updated Successfully!");
        setPreviewImage(null);
        setSelectedFile(null);
        setDbImage(updatedUser.profileImage);
      }
    } catch (error) {
      toast.error("Update failed");
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const user = getUser();
  //   const userId = user?._id || user?.id;
  //   if (!userId) return;

  //   const data = new FormData();
  //   data.append("fullName", formData.fullName);
  //   data.append("email", formData.email);
  //   data.append("address", formData.address);
  //   data.append("contactNo", formData.contactNo);
  //   data.append("city", formData.city);
  //   data.append("country", formData.country);
  //   data.append("role", "user");
  //   data.append("status", formData.status);

  //   if (selectedFile) {
  //     data.append("profileImage", selectedFile);
  //   }

  //   try {
  //     const response = await updateProfileAPI(userId, data);
  //     const updatedUser = response?.auth || response?.data || response;

  //     if (updatedUser) {
  //       dispatch(updateUser(updatedUser));
  //       toast.success("Profile Updated Successfully!");
  //       setDbImage(updatedUser.profileImage);
  //       setSelectedFile(null);
  //       setPreviewImage(null);
  //     }
  //   } catch (error) {
  //     console.error("Update error:", error);
  //     toast.error("Failed to update profile");
  //   }
  // };
  return (
    <div className="page-wrapper bg-light min-vh-100 py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-9">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
              <div className="row g-0">
                {/* Left Sidebar */}
                <div className="col-md-4 bg-navy text-white text-center p-4">
                  <div className="position-relative d-inline-block mb-3 mt-4">
                    <img
                      src={
                        previewImage ||
                        (dbImage
                          ? getImgURL(dbImage)
                          : "https://cdn-icons-png.flaticon.com/512/149/149071.png")
                      }
                      alt="Avatar"
                      className="rounded-circle border border-4 border-white shadow"
                      style={{
                        width: "140px",
                        height: "140px",
                        objectFit: "cover",
                      }}
                    />
                    <label
                      htmlFor="userImg"
                      className="position-absolute bottom-0 end-0 bg-tan rounded-circle p-2 shadow-sm border border-white"
                      style={{ cursor: "pointer" }}>
                      <span>📷</span>
                      <input
                        type="file"
                        id="userImg"
                        hidden
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                  <h5 className="fw-800">{formData.fullName || "User"}</h5>
                  <p className="small text-tan text-uppercase ls-1">
                    Role: User
                  </p>

                  {/* Status Indicator */}
                  <div className="mt-3">
                    <span
                      className={`badge rounded-pill ${formData.status === "active" ? "bg-success" : "bg-danger"}`}>
                      Account {formData.status}
                    </span>
                  </div>
                </div>

                {/* Form Section */}
                <div className="col-md-8 bg-white p-4 p-md-5">
                  <h3 className="fw-800 text-navy mb-4">Edit Profile</h3>
                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="small fw-bold text-muted text-uppercase">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          className="form-control bg-light border-0"
                          value={formData.fullName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="small fw-bold text-muted text-uppercase">
                          Phone
                        </label>
                        <input
                          type="text"
                          name="contactNo"
                          className="form-control bg-light border-0"
                          value={formData.contactNo}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col-md-12">
                        <label className="small fw-bold text-muted text-uppercase">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          className="form-control bg-light border-0"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="small fw-bold text-muted text-uppercase">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          className="form-control bg-light border-0"
                          value={formData.city}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="small fw-bold text-muted text-uppercase">
                          Country
                        </label>
                        <input
                          type="text"
                          name="country"
                          className="form-control bg-light border-0"
                          value={formData.country}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col-12">
                        <label className="small fw-bold text-muted text-uppercase">
                          Address
                        </label>
                        <textarea
                          name="address"
                          className="form-control bg-light border-0"
                          rows="3"
                          value={formData.address}
                          onChange={handleInputChange}></textarea>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="uma-btn-navy w-100 mt-4 border-0">
                      SAVE PROFILE
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};;

export default UserProfileUpdate;