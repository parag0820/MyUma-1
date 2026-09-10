// import React, { useState, useEffect } from "react";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import {
//   Plus,
//   Trash2,
//   Globe,
//   MapPin,
//   Layers,
//   Loader2,
//   Video,
// } from "lucide-react";
// import {
//   getCategoriesAPI,
//   createListingAPI,
//   getAllSubCategoriesApi,
// } from "../services/authService";
// import { getUser } from "../utils/storage";

// const Listing = () => {
//   const navigate = useNavigate();
//   const [categories, setCategories] = useState([]);
//   const [allSubCategories, setAllSubCategories] = useState([]);
//   const [filteredSubCats, setFilteredSubCats] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [formData, setFormData] = useState({
//     title: "",
//     categoryId: "",
//     subCategoryId: "",
//     description: "",
//     address: "",
//     phone: "",
//     youtubeVideo: "",
//     ownerId: "",
//     facebook: "",
//     twitter: "",
//     linkedin: "",
//     youtube: "",
//     instagram: "",
//     whatsappNo: "",
//   });

//   const [images, setImages] = useState([]);
//   const [items, setItems] = useState([{ name: "", price: "" }]);

//   const theme = {
//     primary: "#001f3f",
//     accent: "#f39c12",
//     lightBg: "#f8f9fa",
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [catRes, subRes] = await Promise.all([
//           getCategoriesAPI(),
//           getAllSubCategoriesApi(),
//         ]);

//         if (catRes.success) setCategories(catRes.categories);
//         if (subRes.success) setAllSubCategories(subRes.data);

//         const user = getUser();
//         if (user) {
//           setFormData((prev) => ({ ...prev, ownerId: user.id || user._id }));
//         }
//       } catch (err) {
//         toast.error("Failed to load categories! ❌");
//       }
//     };
//     fetchData();
//   }, []);

//   useEffect(() => {
//     if (formData.categoryId) {
//       const categoryGroup = allSubCategories.find(
//         (group) => group.categoryId?._id === formData.categoryId,
//       );
//       setFilteredSubCats(categoryGroup ? categoryGroup.subcategories : []);
//     } else {
//       setFilteredSubCats([]);
//     }
//   }, [formData.categoryId, allSubCategories]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     if (name === "categoryId") {
//       setFormData({ ...formData, categoryId: value, subCategoryId: "" });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const handleItemChange = (index, e) => {
//     const newItems = [...items];
//     newItems[index][e.target.name] = e.target.value;
//     setItems(newItems);
//   };

//   const addItem = () => setItems([...items, { name: "", price: "" }]);
//   const removeItem = (index) => setItems(items.filter((_, i) => i !== index));
//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files);
//     setImages(files);
//     toast.info(`${files.length} images selected 📸`);
//   };
// // const handleSubmit = async (e) => {
// //   e.preventDefault();

// //   // 1. Validations
// //   if (!formData.title) return toast.warn("Business Title is required! ⚠️");
// //   if (!formData.categoryId) return toast.warn("Please select a Category! ⚠️");
// //   if (images.length === 0)
// //     return toast.warn("Please upload at least one image! 📸");

// //   setLoading(true);
// //   const toastId = toast.loading("Publishing your listing... ⏳");

// //   try {
// //     const data = new FormData();
// //     data.append("categoryId", formData.categoryId);
// //     data.append("subCategoryId", formData.subCategoryId);
// //     data.append("ownerId", formData.ownerId);
// //     data.append("title", formData.title);
// //     data.append("description", formData.description);
// //     data.append("address", formData.address);
// //     data.append("phone", formData.phone);
// //     data.append("youtubeVideo", formData.youtubeVideo);
// //     data.append("whatsappNo", formData.whatsappNo);
// //     data.append("items", JSON.stringify(items));
// //     images.forEach((file) => data.append("images", file));

// //     const res = await createListingAPI(data);

// //     // ✅ SUCCESS CHECK (As per your JSON: {message: "Listing created successfully"})
// //     if (res.listing || res.message?.includes("successfully")) {
// //       // 1. Pehle Toast Update hoga (Isse GREEN dikhega)
// //       toast.update(toastId, {
// //         render: "Listing Created Successfully! 🎉",
// //         type: "success",
// //         isLoading: false,
// //         autoClose: 3000, // 3 second tak toast dikhega
// //       });

// //       // 2. Redirect ko 3 second baad rakha hai taaki aap toast dekh sakein
// //       // Agar aapko redirect NAHI chahiye, toh niche wali 3 lines delete kar dein

// //     } else {
// //       // ❌ Error Case
// //       toast.update(toastId, {
// //         render: res.message || "Failed to create listing ❌",
// //         type: "error",
// //         isLoading: false,
// //         autoClose: 3000,
// //       });
// //     }
// //   } catch (err) {
// //     // ❌ Network Error
// //     toast.update(toastId, {
// //       render: err.response?.data?.message || "Something went wrong! ❌",
// //       type: "error",
// //       isLoading: false,
// //       autoClose: 3000,
// //     });
// //   } finally {
// //     setLoading(false);
// //   }
// // };
// const handleSubmit = async (e) => {
//   e.preventDefault();

//   // 1. Validations
//   if (!formData.title) return toast.warn("Business Title is required! ⚠️");
//   if (!formData.categoryId) return toast.warn("Please select a Category! ⚠️");
//   if (!formData.subCategoryId)
//     return toast.warn("Please select a Sub-Category! ⚠️");
//   if (images.length === 0)
//     return toast.warn("Please upload at least one image! 📸");

//   setLoading(true);
//   const toastId = toast.loading("Publishing your listing... ⏳");

//   try {
//     const data = new FormData();

//     // Standard Information
//     data.append("ownerId", formData.ownerId);
//     data.append("categoryId", formData.categoryId);
//     data.append("subCategoryId", formData.subCategoryId);
//     data.append("title", formData.title);
//     data.append("description", formData.description);
//     data.append("address", formData.address);
//     data.append("phone", formData.phone);

//     // Media & Socials (Using .trim() to prevent malformed data like ",)
//     data.append("whatsappNo", (formData.whatsappNo || "").trim());
//     data.append("facebook", (formData.facebook || "").trim());
//     data.append("twitter", (formData.twitter || "").trim());
//     data.append("linkedin", (formData.linkedin || "").trim());
//     data.append("instagram", (formData.instagram || "").trim());

//     // Ensure both YouTube fields are sent correctly
//     data.append("youtube", (formData.youtube || "").trim());
//     data.append("youtubeVideo", (formData.youtubeVideo || "").trim());

//     // Complex data: Items (must be stringified)
//     data.append("items", JSON.stringify(items));

//     // Multiple Images
//     images.forEach((file) => data.append("images", file));

//     const res = await createListingAPI(data);

//     if (res.listing || res.message?.toLowerCase().includes("successfully")) {
//       toast.update(toastId, {
//         render: "Listing Created Successfully! 🎉",
//         type: "success",
//         isLoading: false,
//         autoClose: 3000,
//       });

//       // Redirect after success
//     } else {
//       toast.update(toastId, {
//         render: res.message || "Failed to create listing ❌",
//         type: "error",
//         isLoading: false,
//         autoClose: 3000,
//       });
//     }
//   } catch (err) {
//     toast.update(toastId, {
//       render: err.response?.data?.message || "Something went wrong! ❌",
//       type: "error",
//       isLoading: false,
//       autoClose: 3000,
//     });
//   } finally {
//     setLoading(false);
//   }
// };
//   return (
//     <div className="min-vh-100 py-5" style={{ backgroundColor: theme.lightBg }}>
//       <div className="container">
//         <div className="row justify-content-center">
//           <div className="col-lg-10">
//             <div
//               className="card border-0 shadow-lg"
//               style={{ borderRadius: "20px" }}>
//               <div
//                 className="p-5 text-white text-center"
//                 style={{
//                   backgroundColor: theme.primary,
//                   borderRadius: "20px 20px 0 0",
//                 }}>
//                 <h2 className="fw-bold mb-2">Create New Listing</h2>
//                 <p className="opacity-75">Submit your business details</p>
//               </div>

//               <form className="p-4 p-md-5" onSubmit={handleSubmit}>
//                 {/* Basic Info */}
//                 <div className="mb-5">
//                   <h5
//                     className="text-uppercase fw-bold mb-4"
//                     style={{ color: theme.primary }}>
//                     <Layers size={20} className="me-2" /> Basic Information
//                   </h5>
//                   <div className="row g-4">
//                     <div className="col-md-12">
//                       <label className="form-label small fw-bold">
//                         Listing Title *
//                       </label>
//                       <input
//                         type="text"
//                         name="title"
//                         className="form-control form-control-lg border-1 bg-light"
//                         placeholder="Business Name"
//                         value={formData.title}
//                         onChange={handleInputChange}
//                       />
//                     </div>
//                     <div className="col-md-6">
//                       <label className="form-label small fw-bold">
//                         Category *
//                       </label>
//                       <select
//                         name="categoryId"
//                         className="form-select border-1 bg-light"
//                         value={formData.categoryId}
//                         onChange={handleInputChange}>
//                         <option value="">Select Category...</option>
//                         {categories.map((cat) => (
//                           <option key={cat._id} value={cat._id}>
//                             {cat.name}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                     <div className="col-md-6">
//                       <label className="form-label small fw-bold">
//                         Subcategory *
//                       </label>
//                       <select
//                         name="subCategoryId"
//                         className="form-select border-1 bg-light"
//                         value={formData.subCategoryId}
//                         onChange={handleInputChange}
//                         disabled={!formData.categoryId}>
//                         <option value="">Select Sub-Category...</option>
//                         {filteredSubCats.map((sub) => (
//                           <option key={sub._id} value={sub._id}>
//                             {sub.subcategoryName}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                     <div className="col-12">
//                       <label className="form-label small fw-bold">
//                         Description
//                       </label>
//                       <textarea
//                         name="description"
//                         className="form-control border-1 bg-light"
//                         rows="3"
//                         placeholder="Tell us about your business..."
//                         value={formData.description}
//                         onChange={handleInputChange}></textarea>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Media */}
//                 <div className="mb-5">
//                   <h5
//                     className="text-uppercase fw-bold mb-4"
//                     style={{ color: theme.primary }}>
//                     <Video size={20} className="me-2" /> Media Gallery
//                   </h5>
//                   <div className="row g-4">
//                     <div className="col-12">
//                       <label className="form-label small fw-bold">
//                         YouTube Link
//                       </label>
//                       <input
//                         type="url"
//                         name="youtubeVideo"
//                         className="form-control border-1 bg-light"
//                         placeholder="https://youtube.com/..."
//                         value={formData.youtubeVideo}
//                         onChange={handleInputChange}
//                       />
//                     </div>
//                     <div className="col-12">
//                       <label className="form-label small fw-bold">
//                         Images *
//                       </label>
//                       <input
//                         type="file"
//                         multiple
//                         className="form-control border-1 bg-light"
//                         onChange={handleImageChange}
//                         accept="image/*"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {/* Contact */}
//                 <div className="mb-5">
//                   <h5
//                     className="text-uppercase fw-bold mb-4"
//                     style={{ color: theme.primary }}>
//                     <MapPin size={20} className="me-2" /> Address & Contact
//                   </h5>
//                   <div className="row g-4">
//                     <div className="col-md-8">
//                       <label className="form-label small fw-bold">
//                         Address *
//                       </label>
//                       <input
//                         type="text"
//                         name="address"
//                         className="form-control border-1 bg-light"
//                         value={formData.address}
//                         onChange={handleInputChange}
//                       />
//                     </div>
//                     <div className="col-md-4">
//                       <label className="form-label small fw-bold">
//                         Phone *
//                       </label>
//                       <input
//                         type="text"
//                         name="phone"
//                         className="form-control border-1 bg-light"
//                         value={formData.phone}
//                         onChange={handleInputChange}
//                       />
//                     </div>
//                     <div className="col-md-4">
//                       <label className="form-label small fw-bold">
//                         WhatsApp
//                       </label>
//                       <input
//                         type="text"
//                         name="whatsappNo"
//                         className="form-control border-1 bg-light"
//                         value={formData.whatsappNo}
//                         onChange={handleInputChange}
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {/* Socials */}
//                 <div className="mb-5">
//                   <h5
//                     className="text-uppercase fw-bold mb-4"
//                     style={{ color: theme.primary }}>
//                     <Globe size={20} className="me-2" /> Social Media
//                   </h5>
//                   <div className="row g-3">
//                     {[
//                       "facebook",
//                       "twitter",
//                       "linkedin",
//                       "youtube",
//                       "instagram",
//                     ].map((field) => (
//                       <div className="col-md-4" key={field}>
//                         <label className="form-label small text-capitalize">
//                           {field}
//                         </label>
//                         <input
//                           type="text"
//                           name={field}
//                           className="form-control border-1 bg-light"
//                           value={formData[field]}
//                           onChange={handleInputChange}
//                         />
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Items */}
//                 <div
//                   className="mb-5 p-4 rounded-4"
//                   style={{ backgroundColor: "#f0f4f8" }}>
//                   <div className="d-flex justify-content-between mb-3">
//                     <h6 className="fw-bold">Items & Pricing</h6>
//                     <button
//                       type="button"
//                       onClick={addItem}
//                       className="btn btn-sm btn-dark px-3">
//                       <Plus size={16} /> Add
//                     </button>
//                   </div>
//                   {items.map((item, index) => (
//                     <div key={index} className="row g-2 mb-2">
//                       <div className="col-7">
//                         <input
//                           type="text"
//                           name="name"
//                           className="form-control border-0"
//                           placeholder="Item name"
//                           value={item.name}
//                           onChange={(e) => handleItemChange(index, e)}
//                         />
//                       </div>
//                       <div className="col-3">
//                         <input
//                           type="number"
//                           name="price"
//                           className="form-control border-0"
//                           placeholder="Price"
//                           value={item.price}
//                           onChange={(e) => handleItemChange(index, e)}
//                         />
//                       </div>
//                       <div className="col-2">
//                         {items.length > 1 && (
//                           <button
//                             type="button"
//                             onClick={() => removeItem(index)}
//                             className="btn btn-outline-danger border-0">
//                             <Trash2 size={18} />
//                           </button>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="btn btn-lg text-white w-100 fw-bold shadow py-3"
//                   style={{
//                     backgroundColor: theme.primary,
//                     borderRadius: "12px",
//                   }}>
//                   {loading ? (
//                     <>
//                       <Loader2
//                         size={20}
//                         className="spinner-border spinner-border-sm me-2"
//                       />{" "}
//                       Publishing...
//                     </>
//                   ) : (
//                     "Publish Listing"
//                   )}
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Listing;

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  createListingAPI,
  getCategoriesAPI,
  getSubCategoriesAPI,
  getMySubscriptionAPI,
  getListingsByOwnerAPI,
  getPlansAPI,
} from "../services/authService";
import {
  Layers,
  MapPin,
  Video,
  Info,
  Share2,
  Plus,
  Trash2,
  ShieldCheck,
  Lock,
  AlertTriangle,
  Loader2,
  ImagePlus,
  Globe,
} from "lucide-react";

const Listing = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const theme = { primary: "#002147", accent: "#de9f57", lightBg: "#f8f9fa" };

  // --- Subscription Logic States ---
  const [isChecking, setIsChecking] = useState(true);
  const [listingLimit, setListingLimit] = useState(0);
  const [currentCount, setCurrentCount] = useState(0);
  const [activePlanName, setActivePlanName] = useState("");
  const [hasValidPlan, setHasValidPlan] = useState(false);

  // --- Form & Data States ---
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [masterSubData, setMasterSubData] = useState([]);
  const [filteredSubCats, setFilteredSubCats] = useState([]);
  const [images, setImages] = useState([]);
  const [items, setItems] = useState([{ name: "", price: "" }]);

  // --- All Parameters for backend ---
  const [formData, setFormData] = useState({
    ownerId: user?._id || user?.id || "",
    categoryId: "",
    subCategoryId: "",
    title: "",
    description: "",
    notes: "",
    address: "",
    phone: "",
    whatsappNo: "",
    facebook: "",
    instagram: "",
    twitter: "",
    linkedin: "",
    youtube: "",
    youtubeVideo: "",
  });

  useEffect(() => {
    const initializeListingFlow = async () => {
      if (!user) return;
      setIsChecking(true);
      const oId = user._id || user.id;

      try {
        // Parallel API fetching
        const [subRes, listRes, plansRes, catRes, subDataRes] =
          await Promise.all([
            getMySubscriptionAPI(oId),
            getListingsByOwnerAPI(oId),
            getPlansAPI(),
            getCategoriesAPI(),
            getSubCategoriesAPI(),
          ]);

        // 1. Sync Plan, check Expiry, and find numerical limit
        const payments = subRes?.payments || [];

        const latestSuccess = payments
          .filter((p) => p.status === "success")
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

        console.log("paymants ", latestSuccess);
        if (latestSuccess) {
          // NEW: Get today's date and the plan's expiry date
          const currentDate = new Date();

          // CHANGE 'expiryDate' TO MATCH YOUR BACKEND FIELD (e.g., endDate, validUntil)
          const planExpiryDate = new Date(
            latestSuccess.expiryDate || subRes.expiryDate,
          );
          console.log("planExpiryDate", planExpiryDate);

          // Check if the plan is still active
          if (planExpiryDate >= currentDate) {
            setHasValidPlan(true);
            setActivePlanName(latestSuccess.planName);

            const masterPlans = plansRes?.data?.[0]?.Plan || [];
            const matchedPlan = masterPlans.find(
              (p) => p.name === latestSuccess.planName,
            );
            if (matchedPlan) setListingLimit(Number(matchedPlan.listings));
          } else {
            // Plan has expired
            setHasValidPlan(false);
          }
        }

        // 2. Count owner's current items
        const existing = listRes?.listings || listRes?.data || [];
        setCurrentCount(existing.length);

        // 3. Setup Dropdowns
        setCategories(catRes.categories || []);
        setMasterSubData(subDataRes.data || []);
      } catch (err) {
        console.error("Dashboard Sync Error:", err);
      } finally {
        setIsChecking(false);
      }
    };
    initializeListingFlow();
  }, [user]);

  // useEffect(() => {
  //   const initializeListingFlow = async () => {
  //     if (!user) return;
  //     setIsChecking(true);
  //     const oId = user._id || user.id;

  //     try {
  //       // Parallel API fetching
  //       const [subRes, listRes, plansRes, catRes, subDataRes] =
  //         await Promise.all([
  //           getMySubscriptionAPI(oId),
  //           getListingsByOwnerAPI(oId),
  //           getPlansAPI(),
  //           getCategoriesAPI(),
  //           getSubCategoriesAPI(),
  //         ]);

  //       // 1. Sync Plan and find numerical limit
  //       const payments = subRes?.payments || [];
  //       const latestSuccess = payments
  //         .filter((p) => p.status === "success")
  //         .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

  //       if (latestSuccess) {
  //         setHasValidPlan(true);
  //         setActivePlanName(latestSuccess.planName);

  //         const masterPlans = plansRes?.data?.[0]?.Plan || [];
  //         const matchedPlan = masterPlans.find(
  //           (p) => p.name === latestSuccess.planName,
  //         );
  //         if (matchedPlan) setListingLimit(Number(matchedPlan.listings));
  //       }

  //       // 2. Count owner's current items
  //       const existing = listRes?.listings || listRes?.data || [];
  //       setCurrentCount(existing.length);

  //       // 3. Setup Dropdowns
  //       setCategories(catRes.categories || []);
  //       setMasterSubData(subDataRes.data || []);
  //     } catch (err) {
  //       console.error("Dashboard Sync Error:", err);
  //     } finally {
  //       setIsChecking(false);
  //     }
  //   };
  //   initializeListingFlow();
  // }, [user]);

  // --- Handlers ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "categoryId") {
      const group = masterSubData.find(
        (item) =>
          String(item.categoryId?._id || item.categoryId) === String(value),
      );
      setFilteredSubCats(group ? group.subcategories : []);
      setFormData((prev) => ({ ...prev, subCategoryId: "" }));
    }
  };

  const handleImageChange = (e) => setImages([...e.target.files]);

  const handleItemChange = (idx, e) => {
    const updated = [...items];
    updated[idx][e.target.name] = e.target.value;
    setItems(updated);
  };

  const addItemRow = () => setItems([...items, { name: "", price: "" }]);
  const removeItemRow = (idx) => setItems(items.filter((_, i) => i !== idx));

  // --- Final Form Submission ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (hasValidPlan) {
      return toast.error("Usage limit reached. Upgrade to add more.");
    }

    setLoading(true);
    const toastId = toast.loading("Verifying data and publishing...");

    try {
      const data = new FormData();

      // Append all text fields
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      // Append Items array as string
      data.append("items", JSON.stringify(items));

      // Append Image Files
      images.forEach((img) => {
        data.append("images", img);
      });

      const res = await createListingAPI(data);
      if (res.success || res.listing) {
        toast.update(toastId, {
          render: "Listing Published Successfully! 🎉",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
        navigate("/listing");
      }
    } catch (err) {
      toast.update(toastId, {
        render: "Process failed. Try again.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  if (isChecking)
    return (
      <div className="vh-100 d-flex align-items-center justify-content-center">
        <Loader2 className="animate-spin text-warning me-2" /> Authenticating
        Permissions...
      </div>
    );

  // --- HARD BLOCK LOGIC ---
  const isLimitReached =
    hasValidPlan && Number(currentCount) >= Number(listingLimit);
  console.log("isLimitReached", isLimitReached);

  if (isLimitReached) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light px-4">
        <div
          className="card border-0 shadow-lg p-5 rounded-5 text-center"
          style={{ maxWidth: "500px" }}
        >
          <div
            className={`d-inline-flex p-4 rounded-circle mb-4 ${hasValidPlan ? "bg-warning" : "bg-danger"} bg-opacity-10`}
          >
            {hasValidPlan ? (
              <AlertTriangle size={60} className="text-warning" />
            ) : (
              <Lock size={60} className="text-danger" />
            )}
          </div>
          <h2 className="fw-bold text-navy mb-3">
            {hasValidPlan ? "Limit Reached" : "Subscription Required"}
          </h2>
          <p className="text-muted mb-4">
            {hasValidPlan
              ? `Your '${activePlanName}' limit is ${listingLimit}. Please upgrade to continue.`
              : "You must have an active membership to publish listings."}
          </p>
          <button
            className="btn btn-warning btn-lg w-100 rounded-pill fw-bold py-3 shadow"
            onClick={() => navigate("/pricing")}
          >
            Upgrade Membership
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-vh-100 py-5 text-start"
      style={{ backgroundColor: theme.lightBg }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden mb-5">
              {/* Header: Slot Usage Counter */}
              <div
                className="p-4 text-white d-flex flex-column flex-md-row justify-content-between align-items-center px-md-5"
                style={{ backgroundColor: theme.primary }}
              >
                {/* <div>
                  <h3 className="fw-bold m-0">Publish Professional Listing</h3>
                  <small className="opacity-75">
                    Active Plan:{" "}
                    <span className="text-warning fw-bold">
                      {activePlanName}
                    </span>
                  </small>
                </div> */}
                {/* <div className="bg-white bg-opacity-10 p-2 px-4 rounded-pill border border-white border-opacity-25 mt-3 mt-md-0 fw-bold">
                  Slots Remaining:{" "}
                  <span className="text-warning">
                    {listingLimit - currentCount}
                  </span>{" "}
                  of {listingLimit}
                </div> */}
              </div>

              <form className="p-4 p-md-5 bg-white" onSubmit={handleSubmit}>
                {/* 1. CLASSIFICATION */}
                <div className="mb-5">
                  <h5 className="fw-bold mb-4 text-navy">
                    <Layers size={20} className="me-2 text-warning" /> Category
                    & Title
                  </h5>
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label small fw-bold">
                        BUSINESS TITLE *
                      </label>
                      <input
                        type="text"
                        name="title"
                        className="form-control py-2"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Enter business name"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">
                        SELECT CATEGORY *
                      </label>
                      <select
                        name="categoryId"
                        className="form-select py-2"
                        value={formData.categoryId}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Choose Main Category</option>
                        {categories.map((c) => (
                          <option key={c._id} value={c._id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">
                        SELECT SUBCATEGORY *
                      </label>
                      <select
                        name="subCategoryId"
                        className="form-select py-2"
                        value={formData.subCategoryId}
                        onChange={handleInputChange}
                        required
                        disabled={!formData.categoryId}
                      >
                        <option value="">Choose Subcategory</option>
                        {filteredSubCats.map((s) => (
                          <option key={s._id} value={s._id}>
                            {s.subcategoryName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* 2. DESCRIPTION & ITEMS */}
                <div className="mb-5">
                  <h5 className="fw-bold mb-4 text-navy">
                    <Info size={20} className="me-2 text-warning" /> Details &
                    Service List
                  </h5>
                  <div className="mb-4">
                    <label className="form-label small fw-bold">
                      BUSINESS DESCRIPTION
                    </label>
                    <textarea
                      name="description"
                      className="form-control shadow-none"
                      rows="4"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Tell us more about your business..."
                    ></textarea>
                    <div className="mt-3">
                      <label className="form-label small fw-bold">
                        Notes (optional)
                      </label>
                      <input
                        type="text"
                        name="notes"
                        className="form-control shadow-none"
                        placeholder="Internal notes for this listing"
                        value={formData.notes}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <label className="form-label small fw-bold m-0 text-muted">
                      MENU / CATALOGUE ITEMS
                    </label>
                    {/* <button
                      type="button"
                      onClick={addItemRow}
                      className="btn btn-sm btn-outline-primary rounded-pill px-3"
                    >
                      <Plus size={14} /> Add Item
                    </button> */}
                  </div>
                  {items.map((item, index) => (
                    <div className="row g-2 mb-2" key={index}>
                      <div className="col-5">
                        <input
                          type="text"
                          name="name"
                          className="form-control form-control-sm"
                          placeholder="Item Name"
                          value={item.name}
                          onChange={(e) => handleItemChange(index, e)}
                        />
                      </div>
                      <div className="col-3">
                        <input
                          type="number"
                          name="price"
                          className="form-control form-control-sm"
                          placeholder="Price ($)"
                          value={item.price}
                          onChange={(e) => handleItemChange(index, e)}
                        />
                      </div>
                      {/* <div className="col-2">
                        <button
                          type="button"
                          onClick={() => removeItemRow(index)}
                          className="btn btn-sm text-danger w-100 border-0 shadow-none"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div> */}
                    </div>
                  ))}
                </div>

                {/* 3. IMAGES & VIDEO */}
                <div className="mb-5">
                  <h5 className="fw-bold mb-4 text-navy">
                    <Video size={20} className="me-2 text-warning" /> Media
                    Gallery
                  </h5>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">
                        PHOTO UPLOADS (MULTIPLE)
                      </label>
                      <input
                        type="file"
                        multiple
                        className="form-control py-2"
                        onChange={handleImageChange}
                        accept="image/*"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">
                        YOUTUBE VIDEO URL
                      </label>
                      <input
                        type="text"
                        name="youtubeVideo"
                        className="form-control py-2"
                        placeholder="https://..."
                        value={formData.youtubeVideo}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                {/* 4. LOCATION & PHONE */}
                <div className="mb-5">
                  <h5 className="fw-bold mb-4 text-navy">
                    <MapPin size={20} className="me-2 text-warning" /> Contact
                    Information
                  </h5>
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label small fw-bold">
                        OFFICE/BUSINESS ADDRESS *
                      </label>
                      <input
                        type="text"
                        name="address"
                        className="form-control py-2"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">
                        OFFICIAL PHONE *
                      </label>
                      <input
                        type="text"
                        name="phone"
                        className="form-control py-2"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">
                        WHATSAPP NO
                      </label>
                      <input
                        type="text"
                        name="whatsappNo"
                        className="form-control py-2"
                        value={formData.whatsappNo}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                {/* 5. SOCIAL CHANNELS */}
                <div className="mb-5">
                  <h5 className="fw-bold mb-4 text-navy">
                    <Share2 size={20} className="me-2 text-warning" /> Online
                    Presence (Links)
                  </h5>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <input
                        type="text"
                        name="facebook"
                        className="form-control"
                        placeholder="Facebook URL"
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-4">
                      <input
                        type="text"
                        name="instagram"
                        className="form-control"
                        placeholder="Instagram URL"
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-4">
                      <input
                        type="text"
                        name="twitter"
                        className="form-control"
                        placeholder="Twitter URL"
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="text"
                        name="linkedin"
                        className="form-control"
                        placeholder="LinkedIn Profile"
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="text"
                        name="youtube"
                        className="form-control"
                        placeholder="YouTube Channel"
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-lg text-white w-100 fw-bold shadow-lg py-3 rounded-pill border-0 transition-all mt-4"
                  style={{ backgroundColor: theme.primary }}
                >
                  {loading
                    ? "Syncing with Server..."
                    : "Submit and Publish Listing"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Listing;
