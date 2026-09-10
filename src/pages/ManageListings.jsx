import React, { useState, useEffect } from "react";
import {
  Trash2,
  Edit,
  MapPin,
  X,
  Layers,
  Phone,
  Video,
  User,
  Image as ImageIcon,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaLinkedin,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa6";

import {
  getAllListingsApi,
  deleteListingAPI,
  updateListingAPI,
  getImgURL,
  getCategoriesAPI,
  getAllSubCategoriesApi,
} from "../services/authService";
import { getUser } from "../utils/storage";
import { toast } from "react-toastify";

const ManageListings = () => {
  const [listings, setListings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // State for image handling
  const [newImages, setNewImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const currentUser = getUser();
  const ownerId = currentUser?._id || currentUser?.id;

  const fetchData = async () => {
    try {
      setLoading(true);
      const [listRes, catRes, subCatRes] = await Promise.all([
        getAllListingsApi(),
        getCategoriesAPI(),
        getAllSubCategoriesApi(),
      ]);

      const myData = listRes?.listings?.filter(
        (item) => (item.ownerId?._id || item.ownerId) === ownerId,
      );

      setListings(myData || []);
      setCategories(catRes?.categories || []);
      setSubCategories(subCatRes?.data || subCatRes?.subcategories || []);
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ownerId) fetchData();
  }, [ownerId]);

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = listings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(listings.length / itemsPerPage);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      toast.error("You can only upload up to 5 images");
      e.target.value = "";
      return;
    }
    setNewImages(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing?"))
      return;
    try {
      const res = await deleteListingAPI(id);
      // Fixed: Showing toast based on successful response
      if (res) {
        toast.success("Listing Deleted Successfully!");
        setListings(listings.filter((l) => l._id !== id));
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Delete failed");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append("ownerId", ownerId);

    if (newImages.length > 0) {
      newImages.forEach((file) => {
        formData.append("images", file);
      });
    }

    try {
      const res = await updateListingAPI(editItem._id, formData);
      // Fixed: Showing toast based on successful response
      if (res) {
        toast.success("Listing Updated Successfully!");
        setEditItem(null);
        setNewImages([]);
        setImagePreviews([]);
        fetchData();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
    }
  };

  const handleEditClick = (item) => {
    setEditItem(item);
    setSelectedCategoryId(item.categoryId?._id || "");
    setNewImages([]);
    setImagePreviews([]);
  };

  const truncate = (text, limit = 3) => {
    if (!text) return "";
    const words = text.split(" ");
    return words.length > limit
      ? words.slice(0, limit).join(" ") + "..."
      : text;
  };

  const filteredSubCategories =
    subCategories.find(
      (item) =>
        (item.categoryId?._id || item.categoryId) === selectedCategoryId,
    )?.subcategories || [];

  if (loading)
    return <div className="text-center py-5 fw-bold">LOADING...</div>;

  return (
    <div className="container-fluid py-5 px-4 bg-light min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-dark mb-0">MY BUSINESS LISTINGS</h3>
        <div className="badge bg-dark px-3 py-2">Total: {listings.length}</div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-white border-bottom">
              <tr>
                <th className="px-4 py-3 small fw-bold">BUSINESS & OWNER</th>
                <th className="px-4 py-3 small fw-bold">CONTACT & INFO</th>
                <th className="px-4 py-3 small fw-bold">PRICE/ITEM</th>
                <th className="px-4 py-3 small fw-bold text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item) => (
                <tr key={item._id}>
                  <td className="px-4">
                    <div className="d-flex align-items-center gap-3">
                      <div className="position-relative">
                        <img
                          src={getImgURL(item.images?.[0])}
                          width="70"
                          height="60"
                          className="rounded border object-fit-cover shadow-sm"
                          alt="Listing"
                        />
                      </div>
                      <div>
                        <div className="fw-bold text-primary">{item.title}</div>
                        <small className="text-muted d-block">
                          <Layers size={12} /> {item.categoryId?.name}
                        </small>
                        <small className="text-dark d-block fw-semibold">
                          <User size={12} className="text-secondary" />{" "}
                          {item.ownerId?.fullName || "Owner"}
                        </small>
                      </div>
                    </div>
                  </td>
                  <td className="px-4">
                    <div className="small mb-1">
                      <Phone size={14} className="me-1 text-success" />{" "}
                      {item.phone || "N/A"}
                    </div>
                    <div className="small text-muted">
                      <MapPin size={14} className="me-1 text-danger" />
                      {truncate(item.address, 4)}
                      {item.address?.length > 20 && (
                        <button
                          onClick={() => setSelectedAddress(item.address)}
                          className="btn btn-link btn-sm p-0 ms-1 text-decoration-none fw-bold"
                        >
                          View
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-4">
                    <div className="fw-bold text-dark">
                      ${item.items?.[0]?.price || "0"}
                    </div>
                    <div className="small text-muted">
                      {item.items?.[0]?.name || "Service"}
                    </div>
                  </td>
                  <td className="px-4 text-center">
                    <div className="d-flex justify-content-center gap-2">
                      <button
                        onClick={() => handleEditClick(item)}
                        className="btn btn-sm btn-outline-primary rounded-circle"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="btn btn-sm btn-outline-danger rounded-circle"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center align-items-center gap-3">
          <button
            className="btn btn-white btn-sm shadow-sm rounded-circle border"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            <ChevronLeft size={20} />
          </button>
          <span className="fw-bold small">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="btn btn-white btn-sm shadow-sm rounded-circle border"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {/* UPDATE MODAL */}
      {editItem && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.7)", zIndex: 1050 }}
        >
          <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <form
              onSubmit={handleUpdate}
              className="modal-content rounded-4 border-0 shadow-lg"
            >
              <div className="modal-header border-bottom p-4 bg-dark text-white">
                <h5 className="m-0 fw-bold">Update Listing Information</h5>
                <X
                  className="cursor-pointer"
                  onClick={() => setEditItem(null)}
                />
              </div>
              <div className="modal-body p-4">
                <div className="row g-4">
                  {/* Basic Identity */}
                  <div className="col-12">
                    <h6 className="fw-bold border-bottom pb-2">
                      Business Identity
                    </h6>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-bold">
                      Listing Title
                    </label>
                    <input
                      name="title"
                      defaultValue={editItem.title}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-bold">Phone</label>
                    <input
                      name="phone"
                      defaultValue={editItem.phone}
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-bold">
                      WhatsApp No
                    </label>
                    <input
                      name="whatsappNo"
                      defaultValue={editItem.whatsappNo}
                      className="form-control"
                    />
                  </div>

                  {/* Categories */}
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Category</label>
                    <select
                      name="categoryId"
                      className="form-select"
                      value={selectedCategoryId}
                      onChange={(e) => setSelectedCategoryId(e.target.value)}
                    >
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Notes</label>
                    <input
                      name="notes"
                      defaultValue={editItem.notes}
                      className="form-control"
                      placeholder="Internal notes for this listing"
                    />
                  </div>

                  {/* Pricing */}
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">
                      Item Name
                    </label>
                    <input
                      name="itemName"
                      defaultValue={editItem.items?.[0]?.name}
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">
                      Price ($)
                    </label>
                    <input
                      name="price"
                      type="number"
                      defaultValue={editItem.items?.[0]?.price}
                      className="form-control"
                    />
                  </div>

                  {/* Images */}
                  <div className="col-12">
                    <h6 className="fw-bold border-bottom pb-2 mt-3">
                      Business Gallery (Max 5 Images)
                    </h6>
                  </div>
                  <div className="col-md-12">
                    <div className="border rounded p-3 bg-light">
                      <div className="d-flex flex-wrap gap-2 mb-3">
                        {editItem.images?.map((img, idx) => (
                          <div key={idx} className="position-relative">
                            <img
                              src={getImgURL(img)}
                              width="80"
                              height="80"
                              className="rounded border object-fit-cover"
                              alt="current"
                            />
                            <span className="badge bg-dark position-absolute top-0 start-0 m-1">
                              Saved
                            </span>
                          </div>
                        ))}
                        {imagePreviews.map((preview, idx) => (
                          <div key={idx} className="position-relative">
                            <img
                              src={preview}
                              width="80"
                              height="80"
                              className="rounded border border-primary object-fit-cover shadow-sm"
                              alt="new"
                            />
                            <span className="badge bg-primary position-absolute top-0 start-0 m-1">
                              New
                            </span>
                          </div>
                        ))}
                      </div>
                      <label className="btn btn-outline-dark btn-sm">
                        <Plus size={16} /> Choose New Images
                        <input
                          type="file"
                          hidden
                          multiple
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-bold">Notes</label>
                    <input
                      name="notes"
                      defaultValue={editItem.notes}
                      className="form-control"
                      placeholder="Internal notes for this listing"
                    />
                  </div>

                  <div className="col-md-12">
                    <label className="form-label small fw-bold">
                      YouTube Video URL
                    </label>
                    <input
                      name="youtubeVideo"
                      defaultValue={editItem.youtubeVideo}
                      className="form-control"
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-bold">Address</label>
                    <textarea
                      name="address"
                      defaultValue={editItem.address}
                      className="form-control"
                      rows="2"
                    ></textarea>
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-bold">
                      Description
                    </label>
                    <textarea
                      name="description"
                      defaultValue={editItem.description}
                      className="form-control"
                      rows="3"
                    ></textarea>
                  </div>

                  {/* Socials */}
                  <div className="col-12">
                    <h6 className="fw-bold border-bottom pb-2 mt-3">
                      Social Media Links
                    </h6>
                  </div>
                  <div className="col-md-4">
                    <label className="small fw-bold mb-1">
                      <FaFacebook className="text-primary" /> Facebook
                    </label>
                    <input
                      name="facebook"
                      defaultValue={editItem.facebook}
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="small fw-bold mb-1">
                      <FaInstagram className="text-danger" /> Instagram
                    </label>
                    <input
                      name="instagram"
                      defaultValue={editItem.instagram}
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="small fw-bold mb-1">
                      <FaTwitter className="text-info" /> Twitter
                    </label>
                    <input
                      name="twitter"
                      defaultValue={editItem.twitter}
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="small fw-bold mb-1">
                      <FaLinkedin className="text-primary" /> LinkedIn
                    </label>
                    <input
                      name="linkedin"
                      defaultValue={editItem.linkedin}
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="small fw-bold mb-1">
                      <FaYoutube className="text-danger" /> YouTube Channel
                    </label>
                    <input
                      name="youtube"
                      defaultValue={editItem.youtube}
                      className="form-control"
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer bg-light p-3">
                <button
                  type="button"
                  className="btn btn-outline-secondary px-4"
                  onClick={() => setEditItem(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-dark px-5 shadow">
                  Save All Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADDRESS POPUP */}
      {selectedAddress && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center px-3"
          style={{ zIndex: 11000, backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div
            className="bg-white rounded-4 shadow-lg w-100 p-4"
            style={{ maxWidth: "450px" }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
              <h6 className="m-0 fw-bold text-dark">
                <MapPin size={18} className="text-danger me-2" />
                Full Address
              </h6>
              <X
                className="cursor-pointer"
                onClick={() => setSelectedAddress(null)}
              />
            </div>
            <p className="text-muted mb-4">{selectedAddress}</p>
            <button
              className="btn btn-dark w-100 rounded-pill"
              onClick={() => setSelectedAddress(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageListings;
