import React, { useState, useEffect } from "react";
import {
  Trash2,
  Edit,
  MapPin,
  X,
  Layers,
  Phone,
  Plus,
  Search,
  Layout,
  User,
} from "lucide-react";
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
import Pagination from "../components/common/Pagination"; // Shared Pagination

const UserListings = () => {
  const [listings, setListings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Image handling
  const [newImages, setNewImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const currentUser = getUser();
  const currentUserId = currentUser?._id || currentUser?.id;

  const fetchData = async () => {
    try {
      setLoading(true);
      const [listRes, catRes, subCatRes] = await Promise.all([
        getAllListingsApi(),
        getCategoriesAPI(),
        getAllSubCategoriesApi(),
      ]);

      // Filter Listings: Only show listings where ownerId matches logged-in user
      const myData = listRes?.listings?.filter(
        (item) => (item.ownerId?._id || item.ownerId) === currentUserId,
      );

      setListings(myData || []);
      setCategories(catRes?.categories || []);
      setSubCategories(subCatRes?.data || subCatRes?.subcategories || []);
    } catch (error) {
      toast.error("Failed to load your listings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUserId) fetchData();
  }, [currentUserId]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      toast.error("Max 5 images allowed");
      return;
    }
    setNewImages(files);
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing?"))
      return;
    try {
      const res = await deleteListingAPI(id);
      if (res) {
        toast.success("Listing Removed! 🗑️");
        setListings(listings.filter((l) => l._id !== id));
      }
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append("ownerId", currentUserId);
    if (newImages.length > 0) {
      newImages.forEach((file) => formData.append("images", file));
    }

    try {
      const res = await updateListingAPI(editItem._id, formData);
      if (res) {
        toast.success("Listing Updated! ✨");
        setEditItem(null);
        fetchData();
      }
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const handleEditClick = (item) => {
    setEditItem(item);
    setSelectedCategoryId(item.categoryId?._id || "");
    setNewImages([]);
    setImagePreviews([]);
  };

  // Search Logic
  const filteredData = listings.filter((item) =>
    item.title?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentItems = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const filteredSubCategories =
    subCategories.find(
      (item) =>
        (item.categoryId?._id || item.categoryId) === selectedCategoryId,
    )?.subcategories || [];

  if (loading)
    return (
      <div className="text-center py-5 fw-bold text-navy">
        Loading Your Listings...
      </div>
    );

  return (
    <div className="container-fluid py-4 bg-light min-vh-100 text-start">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-800 text-navy m-0 text-uppercase">
            My Business Listings
          </h4>
          <p className="text-muted small m-0">
            Manage all your published businesses and services.
          </p>
        </div>
        <div
          className="position-relative mt-3 mt-md-0"
          style={{ width: "100%", maxWidth: "350px" }}
        >
          <Search
            className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
            size={18}
          />
          <input
            type="text"
            className="form-control ps-5 rounded-pill border-0 shadow-sm"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-white border-bottom">
              <tr>
                <th className="px-4 py-3 small fw-bold text-navy">
                  BUSINESS INFO
                </th>
                <th className="py-3 small fw-bold text-navy">CONTACT</th>
                <th className="py-3 small fw-bold text-navy">PRICE</th>
                <th className="px-4 py-3 small fw-bold text-navy text-center">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <tr key={item._id}>
                    <td className="px-4">
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={getImgURL(item.images?.[0])}
                          width="60"
                          height="50"
                          className="rounded border object-fit-cover shadow-sm"
                          alt="Listing"
                        />
                        <div>
                          <div className="fw-bold text-primary small">
                            {item.title}
                          </div>
                          <small className="text-muted d-block">
                            <Layout size={10} /> {item.categoryId?.name}
                          </small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="small mb-1">
                        <Phone size={12} className="text-success" />{" "}
                        {item.phone || "N/A"}
                      </div>
                      <div
                        className="small text-muted text-truncate"
                        style={{ maxWidth: "150px" }}
                      >
                        <MapPin size={12} className="text-danger" />{" "}
                        {item.address}
                      </div>
                    </td>
                    <td className="fw-bold text-dark small">
                      ${item.items?.[0]?.price || "0"}
                    </td>
                    <td className="px-4 text-center">
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          className="btn btn-sm btn-outline-primary border-0 rounded-circle p-2"
                          onClick={() => handleEditClick(item)}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger border-0 rounded-circle p-2"
                          onClick={() => handleDelete(item._id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-5 text-muted">
                    No listings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(p) => setCurrentPage(p)}
      />

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
              <div
                className="modal-header border-bottom p-4 bg-navy text-white"
                style={{ backgroundColor: "#001f3f" }}
              >
                <h5 className="m-0 fw-bold">Update My Listing</h5>
                <X
                  className="cursor-pointer"
                  onClick={() => setEditItem(null)}
                />
              </div>
              <div className="modal-body p-4">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">
                      Business Title
                    </label>
                    <input
                      name="title"
                      defaultValue={editItem.title}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label small fw-bold">Phone</label>
                    <input
                      name="phone"
                      defaultValue={editItem.phone}
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label small fw-bold">WhatsApp</label>
                    <input
                      name="whatsappNo"
                      defaultValue={editItem.whatsappNo}
                      className="form-control"
                    />
                  </div>
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
                    <label className="form-label small fw-bold">
                      Sub-Category
                    </label>
                    <select
                      name="subCategoryId"
                      className="form-select"
                      defaultValue={editItem.subCategoryId?._id}
                    >
                      {filteredSubCategories.map((sub) => (
                        <option key={sub._id} value={sub._id}>
                          {sub.subcategoryName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-12">
                    <label className="form-label small fw-bold">
                      YouTube Video URL
                    </label>
                    <input
                      name="youtubeVideo"
                      defaultValue={editItem.youtubeVideo}
                      className="form-control"
                      placeholder="https://youtube.com/watch?v=..."
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
                      Gallery (Select to Replace)
                    </label>
                    <div className="border rounded p-2 bg-light d-flex flex-wrap gap-2">
                      {imagePreviews.length > 0 ? (
                        imagePreviews.map((p, i) => (
                          <img
                            key={i}
                            src={p}
                            width="60"
                            height="60"
                            className="rounded border border-primary"
                            alt="new"
                          />
                        ))
                      ) : (
                        <small className="text-muted">
                          No new images selected
                        </small>
                      )}
                      <input
                        type="file"
                        multiple
                        hidden
                        id="newImgs"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      <label
                        htmlFor="newImgs"
                        className="btn btn-sm btn-dark ms-auto"
                      >
                        Choose Files
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer bg-light">
                <button
                  type="button"
                  className="btn btn-outline-secondary px-4 rounded-pill"
                  onClick={() => setEditItem(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary px-5 rounded-pill shadow fw-bold"
                >
                  Update Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`.fw-800 { font-weight: 800; } .text-navy { color: #001f3f; } .cursor-pointer { cursor: pointer; }`}</style>
    </div>
  );
};

export default UserListings;
