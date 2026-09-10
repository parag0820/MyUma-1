import API from "./apiClient";
// services/authService.js

const IMAGE_BASE_URL = "https://node.myuma.net";

export const getImgURL = (imagePath) => {
  if (!imagePath || imagePath === "null")
    return "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  const cleanPath = imagePath.toString().trim(); // Removes the hidden space
  if (cleanPath.startsWith("http")) return cleanPath;

  const formattedPath = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;
  return `${IMAGE_BASE_URL}${formattedPath}`;
};
// --- Auth APIs ---
export const loginAPI = async (credentials) => {
  const response = await API.post("/auth/login", credentials);
  console.log("login", response);

  return response.data;
};

export const registerAPI = async (userData) => {
  const response = await API.post("/auth/signup", userData);
  console.log("register", response.data);

  return response.data;
};

// services/authService.js
export const verifyOtpAPI = async (data) => {
  try {
    const response = await API.post("/auth/verify-otp", data);
    return response.data; // Component receives this in 'res'
  } catch (error) {
    // This is vital: throw the error so the .jsx catch block triggers
    throw error;
  }
};
// Method to resend OTP
export const resendOtpAPI = async (data) => {
  try {
    // data should contain { email, role }
    const response = await API.post("/auth/resend-otp", data);
    return response.data;
  } catch (error) {
    console.error("Error in resendOtpAPI:", error);
    throw error;
  }
};
export const forgotPasswordAPI = async (data) => {
  const response = await API.post("/auth/forgot-password", data);
  return response.data;
};

export const resetPasswordAPI = async (data) => {
  const response = await API.put("/auth/reset-password", data);
  return response.data;
};

// --- Blog & Comments ---
export const getBlogDetailsApi = async (id) => {
  const response = await API.get(`/blog/get-by-id/${id}`);
  return response.data;
};

export const sendCommentAPI = async (data) => {
  const response = await API.post("/comment/send", data);
  return response.data;
};
// Bannner API
export const getBannerAPI = async () => {
  try {
    const response = await API.get("/home-banner/get-all");
    return response.data;
  } catch (error) {
    console.error("Error in getBannerAPI:", error);
    throw error;
  }
};
// end Bannner API

// get profile

export const getProfileAPI = async (id) => {
  const response = await API.get(`/auth/get-by-id/${id}`);
  // Adjust URL to your backend
  return response.data;
};
// update profile

export const updateProfileAPI = async (id, data) => {
  const response = await API.put(`/auth/update/${id}`, data);
  console.log("updated profile", response.data);

  return response.data;
};

//get all category

export const getSubCategoriesAPI = async () => {
  try {
    const response = await API.get("/subcategory/get-all");
    console.log("Subcategory", response.data);

    return response.data; // Returns { success, subcategories, etc. }
  } catch (error) {
    console.error("Error in getSubCategoriesAPI:", error);
    throw error;
  }
};

// listing post api
// Function to create a new listing

// Add this to your authService.js if not already there
export const getAllListingsApi = async () => {
  const response = await API.get("/newListing/get-all");
  return response.data;
};
// About us api
// --- Update Listing (Handles Multipart for images) ---
export const updateListingAPI = async (id, formData) => {
  try {
    const response = await API.put(`/newListing/update/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error in updateListingAPI:", error);
    throw error;
  }
};

// --- Delete Listing ---
export const deleteListingAPI = async (id) => {
  try {
    const response = await API.delete(`/newListing/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error in deleteListingAPI:", error);
    throw error;
  }
};

export const getAboutUsAPI = async () => {
  try {
    const response = await API.get("/aboutus/get-all");
    return response.data;
  } catch (error) {
    console.error("Error fetching About Us:", error);
    throw error;
  }
};
// About us apiend

// terms and condition api
export const getTermsAPI = async () => {
  try {
    const response = await API.get("/termcondition/get-all");
    return response.data;
  } catch (error) {
    console.error("Error fetching Terms:", error);
    throw error;
  }
};

// privacy policy api
export const getPrivacyPolicyAPI = async () => {
  try {
    const response = await API.get("/privacy-policy/get-all");
    return response.data;
  } catch (error) {
    console.error("Error fetching Privacy Policy:", error);
    throw error;
  }
};

// footer api
export const getFooterAPI = async () => {
  try {
    const response = await API.get("/footer-text/get-all");
    return response?.data?.footer;
  } catch (error) {
    console.error("Error fetching Footer:", error);
    throw error;
  }
};

//src/services/authService
// Blog
export const getBLogsApi = async () => {
  try {
    console.log("API Calling: /blog/get-all"); // 👈 call check

    const response = await API.get("/blog/get-all");

    // 👇 Proper console prints
    console.log("Full Response:", response);
    console.log("Response Data:", response.data);

    return response?.data;
  } catch (error) {
    console.error("Error in getBlogApi:", error);
    throw error;
  }
};

// ==========================================
// RATING / REVIEWS API METHODS
// ==========================================

// 1. Add Rating
export const addRatingAPI = async (data) => {
  try {
    const response = await API.post("/rating/add", data);
    return response.data;
  } catch (error) {
    console.error("Error in addRatingAPI:", error);
    throw error;
  }
};

// 2. Get All Ratings
export const getRatingsAPI = async () => {
  try {
    console.log("API CALL: /rating/get-all");
    const response = await API.get("/rating/get-all");
    console.log("API RESPONSE: /rating/get-all | Data:", response.data);
    return response.data; // Returns { status, count, data: [] }
  } catch (error) {
    console.error("Error in getRatingsAPI:", error);
    throw error;
  }
};
export const updateRatingAPI = async (id, data) => {
  try {
    const response = await API.put(`/rating/update/${id}`, data);
    return response.data; // Should return { status: true, message: "...", data: {...} }
  } catch (error) {
    console.error("Error in updateRatingAPI:", error);
    throw error;
  }
};

// 3. Delete Rating
export const deleteRatingAPI = async (id) => {
  try {
    const response = await API.delete(`/rating/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error in deleteRatingAPI:", error);
    throw error;
  }
};

// ✅ SEND CONTACT MESSAGE
export const sendContactAPI = async (contactData) => {
  try {
    const response = await API.post("/contactus/send", contactData);
    return response.data;
  } catch (error) {
    console.error("Error sending contact message:", error);
    throw error;
  }
};
export const getChatByAdminOwnerAPI = async (adminId, ownerId) => {
  try {
    const response = await API.get(
      `/chat/get-by-admin-owner/${adminId}/${ownerId}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error in getChatByAdminOwnerAPI:", error);
    throw error;
  }
};
export const getChatByUserOwnerAPI = async (userId, ownerId) => {
  try {
    const response = await API.get(
      `/chat/get-by-user-owner/${userId}/${ownerId}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error in getChatByUserOwnerAPI:", error);
    throw error;
  }
};
// Testimonial GET API
export const getTestimonialsAPI = async () => {
  try {
    const response = await API.get("/testimonial/get-all");
    // Returns the array of testimonials
    return response.data;
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    throw error;
  }
};

// ==========================================
// REVIEW API METHODS
// ==========================================

export const addReviewAPI = async (data) => {
  try {
    const response = await API.post("/review/add", data);
    return response.data;
  } catch (error) {
    console.error("Error in addReviewAPI:", error);
    throw error;
  }
};

export const getReviewsAPI = async () => {
  try {
    const response = await API.get("/review/get-all");
    return response.data;
  } catch (error) {
    console.error("Error in getReviewsAPI:", error);
    throw error;
  }
};

// ==========================================
// BOOK NOW API METHODS
// ==========================================
export const getBookingByUserAPI = async (userId) => {
  try {
    // 1. Removed BASE_URL (using the API instance's internal config)
    const response = await API.get(`/booknow/get-by-user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error in getBookingByUserAPI:", error);
    // 2. Add a check to prevent "reading data of undefined"
    throw error?.response?.data || error.message || "An error occurred";
  }
};
// Pehle galti thi: Api.get (Case sensitive error)
// Ab theek hai: API.get

export const getBookingsByUserAPI = async (id) => {
  try {
    const response = await API.get(`/booknow/get-by-user/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error in getBookingsByUserAPI:", error);
    throw error;
  }
};

export const getBookingsByOwnerAPI = async (id) => {
  try {
    const response = await API.get(`/booknow/get-by-owner/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error in getBookingsByOwnerAPI:", error);
    throw error;
  }
};
export const createBookingAPI = async (data) => {
  try {
    const response = await API.post("/booknow/add", data);
    return response.data;
  } catch (error) {
    console.error("Error in createBookingAPI:", error);
    throw error;
  }
};

export const getAllBookingsAPI = async () => {
  try {
    const response = await API.get("/booknow/get-all");
    console.log("getAllBookingsAPI response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in getAllBookingsAPI:", error);
    throw error;
  }
};

export const deleteBookingAPI = async (id) => {
  try {
    const response = await API.delete(`/booknow/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error in deleteBookingAPI:", error);
    throw error;
  }
};

// ==========================================
// 8. PRICING MANAGEMENT APIS (Full CRUD)
// ==========================================

// GET ALL Plans
export const getPlansAPI = async () => {
  try {
    const response = await API.get("/pricing/get-all");
    return response.data;
  } catch (error) {
    console.error("Error fetching plans:", error);
    throw error;
  }
};

// ADD New Pricing (bannerText, plan array)
export const addPricingAPI = async (data) => {
  const response = await API.post("/pricing/add", data);
  return response.data;
};

// GET Pricing By ID
export const getPricingByIdAPI = async (id) => {
  const response = await API.get(`/pricing/get-by-id/${id}`);
  return response.data;
};

// UPDATE Pricing
export const updatePricingAPI = async (id, data) => {
  const response = await API.put(`/pricing/update/${id}`, data);
  return response.data;
};

// DELETE Pricing
export const deletePricingAPI = async (id) => {
  const response = await API.delete(`/pricing/delete/${id}`);
  return response.data;
};

// ==========================================
// 13. PAYMENT & WEBHOOK APIS
// ==========================================

// 1. Checkout (Body: planId, userId, email)
export const checkoutAPI = async (data) => {
  const response = await API.post("/payment/checkout", data);
  return response.data;
};

// 2. Webhook (Automatic status change - backend handles this)
// Frontend can call this for manual simulation if needed
export const paymentWebhookAPI = async () => {
  const response = await API.post("/payment/webhook");
  return response.data;
};

// 3. Get All Payments (Admin)
export const getAllPaymentsAPI = async () => {
  const response = await API.get("/payment/get-all");
  return response.data;
};

// 4. Get Payment By ID
export const getPaymentByIdAPI = async (id) => {
  const response = await API.get(`/payment/get-by-id/${id}`);
  return response.data;
};

// 5. Get Payments By User ID (For User Dashboard/Pricing check)
export const getPaymentsByUserIdAPI = async (userId) => {
  const response = await API.get(`/payment/get-by-userId/${userId}`);
  return response.data;
};

// ==========================================
// COMMENT API METHODS
// ==========================================

// Add Comment

// Get All Comments (Optional: Use this if you want to display them below the blog)
export const getAllCommentsAPI = async () => {
  try {
    const response = await API.get("/comment/get-all");
    return response.data;
  } catch (error) {
    console.error("Error in getAllCommentsAPI:", error);
    throw error;
  }
};

export const updateCommentAPI = async (id, data) => {
  const response = await API.put(`/comment/update/${id}`, data);
  return response.data;
};

// Delete a comment
export const deleteCommentAPI = async (id) => {
  const response = await API.delete(`/comment/delete/${id}`);
  return response.data;
};

// ... other imports

// CORRECT: uses uppercase 'API'
export const getAllSubCategoriesApi = async () => {
  try {
    const response = await API.get("/subcategory/get-all");
    return response.data;
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    throw error;
  }
};
export const createListingAPI = async (formData) => {
  try {
    const response = await API.post("/newListing/add", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("create listing response", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in createListingAPI:", error);
    throw error;
  }
};

export const getCategoriesAPI = async () => {
  try {
    const response = await API.get("/category/get-all"); // Adjust to your actual endpoint
    console.log("category response", response.data);

    return response.data; // This returns the whole object { success, categories, etc. }
  } catch (error) {
    console.error("Error in getCategoriesAPI:", error);
    throw error;
  }
};

// --- Logo APIs ---
export const getLogoAPI = async () => {
  try {
    const response = await API.get("/logo/get-all");
    // Based on your snippet, the data is in response.data
    return response.data;
  } catch (error) {
    console.error("Error fetching logo:", error);
    throw error;
  }
};

export const getAllUsersAPI = async () => {
  const response = await API.get("/auth/get-all-users");
  return response.data; // This returns { message, count, users: [...] }
};

export const getAllOwnersAPI = async () => {
  const response = await API.get("/auth/get-all-owner");
  return response.data; // This returns { message, count, owners: [...] }
};
// Add to services/authService.js
export const addFavoriteAPI = async (data) => {
  const response = await API.post("/favorite/add", data);
  return response.data;
};

export const deleteFavoriteAPI = async (id) => {
  const response = await API.delete(`/favorite/delete/${id}`);
  return response.data;
};

export const getFavoritesByUserAPI = async (userId) => {
  const response = await API.get(`/favorite/get-by-user/${userId}`);
  return response.data;
};
// --- Updated Chat APIs in authService.js ---

export const sendMessageAPI = async (data) => {
  const response = await API.post("/chat/send", data);
  return response.data;
};

// 1. History for User <-> Owner
export const getChatHistoryAPI = async (userId, ownerId) => {
  const response = await API.get(
    `/chat/get-by-user-owner/${userId}/${ownerId}`,
  );
  return response.data;
};

// 2. History for Admin <-> Owner (New Endpoint)
export const getChatAdminOwnerHistoryAPI = async (adminId, ownerId) => {
  const response = await API.get(
    `/chat/get-by-admin-owner/${adminId}/${ownerId}`,
  );
  return response.data;
};

// 3. General history for Admin (New Endpoint)
export const getChatByAdminAPI = async (adminId) => {
  const response = await API.get(`/chat/get-by-admin/${adminId}`);
  return response.data;
};

export const deleteChatMessageAPI = async (id) => {
  const response = await API.delete(`/chat/delete/${id}`);
  return response.data;
};

// --- Auth List APIs ---
export const getAllAuthsAPI = async () => {
  const response = await API.get("/auth/get-all");
  return response.data;
};
// ==========================================
// ALL INQUIRY / LEAD API METHODS (WITH CONSOLE LOGS)
// ==========================================

// 1. ADD (Send Inquiry)
// Fields: itemId, userId, fullName, email, phoneNo, comment
export const sendInquireApi = async (data) => {
  try {
    console.log("📡 SENDING NEW INQUIRY. Data:", data);
    const response = await API.post("/inquire/send", data);
    console.log("✅ SEND SUCCESS. Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ ERROR in sendInquireApi:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

// 2. GET ALL (Fetch every inquiry in the database)
export const getInquiriesApi = async () => {
  try {
    console.log("📡 FETCHING ALL INQUIRIES FROM DB...");
    const response = await API.get("/inquire/get-all");
    console.log(
      "✅ FETCH ALL SUCCESS. Count:",
      response.data?.count,
      "Data:",
      response.data,
    );
    return response.data;
  } catch (error) {
    console.error(
      "❌ ERROR in getInquiriesApi:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

// 3. GET BY ID (Fetch one specific inquiry)
export const getInquireByIdApi = async (id) => {
  try {
    console.log(`📡 FETCHING INQUIRY BY ID: ${id}`);
    const response = await API.get(`/inquire/get-by-id/${id}`);
    console.log("✅ FETCH BY ID SUCCESS:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ ERROR in getInquireByIdApi:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

// 4. UPDATE (Modify an existing inquiry)
export const updateInquireApi = async (id, data) => {
  try {
    console.log(`📡 UPDATING INQUIRY ID: ${id}. New Data:`, data);
    const response = await API.put(`/inquire/update/${id}`, data);
    console.log("✅ UPDATE SUCCESS:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ ERROR in updateInquireApi:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

// 5. DELETE (Remove an inquiry)
export const deleteInquireApi = async (id) => {
  try {
    console.log(`📡 DELETING INQUIRY ID: ${id}`);
    const response = await API.delete(`/inquire/delete/${id}`);
    console.log("✅ DELETE SUCCESS:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ ERROR in deleteInquireApi:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

// 6. GET BY OWNER ID (For Owner Dashboard - SHOWS LEADS RECEIVED)
export const getInquiriesByOwnerApi = async (ownerId) => {
  try {
    console.log(`📡 FETCHING LEADS FOR OWNER ID: ${ownerId}`);
    const response = await API.get(`/inquire/get-by-owner/${ownerId}`);
    console.log("✅ FETCH BY OWNER SUCCESS. Data:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ ERROR in getInquiriesByOwnerApi:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

// 7. GET BY ITEM ID (Fetch leads for a specific listing/product)
export const getInquiriesByItemApi = async (itemId) => {
  try {
    console.log(`📡 FETCHING LEADS FOR ITEM ID: ${itemId}`);
    const response = await API.get(`/inquire/get-by-item/${itemId}`);
    console.log("✅ FETCH BY ITEM SUCCESS:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ ERROR in getInquiriesByItemApi:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

// 8. GET BY USER ID (For User Dashboard - SHOWS LEADS SENT BY USER)
export const getInquireByUserIdApi = async (userId) => {
  try {
    console.log(`📡 FETCHING LEADS SENT BY USER ID: ${userId}`);
    const response = await API.get(`/inquire/get-by-user/${userId}`);
    console.log("✅ FETCH BY USER SUCCESS:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ ERROR in getInquireByUserIdApi:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const getMySubscriptionAPI = async (ownerId) => {
  try {
    // URL changed from get-by-userId to get-by-ownerId
    const response = await API.get(`/payment/get-by-ownerId/${ownerId}`);
    return response.data;
  } catch (error) {
    console.error("Error in getMySubscriptionAPI:", error);
    throw error;
  }
};
// authService.js
export const getListingsByOwnerAPI = async (ownerId) => {
  try {
    // Aapka bataya hua route: /newListing/get-by-owner/:ownerId
    const response = await API.get(`/newListing/get-by-owner/${ownerId}`);
    return response.data; // Yeh response.data.data (array) return karega
  } catch (error) {
    console.error("Error fetching owner listings:", error);
    throw error;
  }
};