// utils/storage.js

// 🔐 Save token
export const setToken = (token) => {
  localStorage.setItem("token", token);
};

// 🔐 Get token
export const getToken = () => {
  return localStorage.getItem("token");
};

// ❌ Remove token
export const removeToken = () => {
  localStorage.removeItem("token");
};

// 👤 Save user
export const setUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

// 👤 Get user (SAFE)
export const getUser = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Error parsing user:", error);
    return null;
  }
};

// ✅ Get User ID (VERY USEFUL)
export const getUserId = () => {
  const user = getUser();
  return user?._id || null;
};

// ❌ Clear all
export const clearStorage = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("expiry");
  localStorage.removeItem("sessionExpiry");


};

// 🔐 Set session
export const setSession = (token, user, expiryTime) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("expiry", JSON.stringify(expiryTime)); // ✅ FIX
};

// ⏱ Check session expiry
export const isSessionExpired = () => {
  const expiry = JSON.parse(localStorage.getItem("expiry"));

  if (!expiry) return true;

  return new Date().getTime() > expiry;
};
