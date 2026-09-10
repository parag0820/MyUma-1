

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { getUser } from "../utils/storage";
import { getProfileAPI, updateProfileAPI } from "../features/auth/api";
import { getImgURL } from "../services/authService";
import { updateUser } from "../features/auth/authSlice";

const ProfileUpdate = () => {
  const dispatch = useDispatch();

  const [role, setRole] = useState("owner");
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
          setRole(profile.role || "owner");
          setDbImage(profile.profileImage || "");

          // SYNC WITH HEADER IMMEDIATELY
          dispatch(updateUser(profile));
        }
      } catch (error) {
        console.error("Fetch Error:", error);
      }
    };

    getprofileHandler();
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = getUser();
    const userId = user?._id || user?.id;
    if (!userId) return;

    const data = new FormData();
    data.append("fullName", formData.fullName);
    data.append("email", formData.email);
    data.append("address", formData.address);
    data.append("contactNo", formData.contactNo);
    data.append("city", formData.city);
    data.append("country", formData.country);
    data.append("status", formData.status);
    data.append("role", role);

    if (selectedFile) {
      data.append("profileImage", selectedFile);
    }

    try {
      const response = await updateProfileAPI(userId, data);
      const updatedUser = response?.auth || response?.data || response;

      if (updatedUser) {
        // UPDATE REDUX & HEADER
        dispatch(updateUser(updatedUser));
        toast.success("Owner Profile Updated Successfully! ✨");

        setDbImage(updatedUser.profileImage);
        setSelectedFile(null);
        setPreviewImage(null);
      }
    } catch (error) {
      toast.error("Failed to update profile ❌");
    }
  };

  return (
    <div className="bg-light min-vh-100 py-5 page-wrapper">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card border-0 shadow-lg overflow-hidden rounded-4">
              <div className="row g-0">
                <div className="col-md-4 bg-navy text-white text-center p-4 d-flex flex-column align-items-center justify-content-center">
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
                        width: "150px",
                        height: "150px",
                        objectFit: "cover",
                      }}
                    />
                    <label
                      htmlFor="avatarUpload"
                      className="position-absolute bottom-0 end-0 bg-tan rounded-circle p-2 shadow border border-white"
                      style={{
                        cursor: "pointer",
                        width: "45px",
                        height: "45px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}>
                      <span className="text-navy">📷</span>
                      <input
                        type="file"
                        id="avatarUpload"
                        hidden
                        onChange={handleImageChange}
                        accept="image/*"
                      />
                    </label>
                  </div>
                  <h4 className="fw-800 mb-1 px-2">
                    {formData.fullName || "Owner Name"}
                  </h4>
                  <p className="small text-tan fw-bold text-uppercase ls-1">
                    {role === "owner" ? "Business Owner" : role}
                  </p>
                  <hr className="my-3 w-50 opacity-25" />
                  <div
                    className={`badge rounded-pill px-3 py-2 ${formData.status === "active" ? "bg-success" : "bg-danger"}`}>
                    {formData.status.toUpperCase()}
                  </div>
                </div>

                <div className="col-md-8 bg-white p-4 p-md-5">
                  <h2 className="fw-800 text-navy mb-4">Owner Settings</h2>
                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="small fw-800 text-muted mb-1 text-uppercase ls-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          className="form-control bg-light border-0 py-2 shadow-sm"
                          value={formData.fullName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="small fw-800 text-muted mb-1 text-uppercase ls-1">
                          Contact Number
                        </label>
                        <input
                          type="text"
                          name="contactNo"
                          className="form-control bg-light border-0 py-2 shadow-sm"
                          value={formData.contactNo}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col-md-12">
                        <label className="small fw-800 text-muted mb-1 text-uppercase ls-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          className="form-control bg-light border-0 py-2 shadow-sm"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="small fw-800 text-muted mb-1 text-uppercase ls-1">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          className="form-control bg-light border-0 py-2 shadow-sm"
                          value={formData.city}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="small fw-800 text-muted mb-1 text-uppercase ls-1">
                          Country
                        </label>
                        <input
                          type="text"
                          name="country"
                          className="form-control bg-light border-0 py-2 shadow-sm"
                          value={formData.country}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col-12">
                        <label className="small fw-800 text-muted mb-1 text-uppercase ls-1">
                          Full Address
                        </label>
                        <textarea
                          name="address"
                          className="form-control bg-light border-0 shadow-sm"
                          rows="3"
                          value={formData.address}
                          onChange={handleInputChange}></textarea>
                      </div>
                    </div>
                    <div className="mt-5">
                      <button
                        type="submit"
                        className="uma-btn-navy w-100 fw-800 border-0 shadow">
                        UPDATE OWNER PROFILE
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileUpdate;