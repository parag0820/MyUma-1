// // // import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// // // import {
// // //   loginAPI,
// // //   registerAPI,
// // //   verifyOtpAPI,
// // // } from "../../services/authService";

// // // /**
// // //  * Helper function to safely parse JSON from localStorage.
// // //  */
// // // const safeParse = (key) => {
// // //   const item = localStorage.getItem(key);
// // //   if (!item || item === "undefined") return null;
// // //   try {
// // //     const parsed = JSON.parse(item);
// // //     // Role missing hone par bhi user object ko valid maanein
// // //     return parsed && (parsed.id || parsed._id) ? parsed : null;
// // //   } catch (e) {
// // //     console.error(`Error parsing ${key} from localStorage:`, e);
// // //     return null;
// // //   }
// // // };

// // // // --- Async Thunks ---

// // // export const loginUser = createAsyncThunk(
// // //   "auth/login",
// // //   async (data, thunkAPI) => {
// // //     try {
// // //       const response = await loginAPI(data);
// // //       return response;
// // //     } catch (error) {
// // //       return thunkAPI.rejectWithValue(
// // //         error.response?.data?.message || "Login Failed",
// // //       );
// // //     }
// // //   },
// // // );

// // // export const registerUser = createAsyncThunk(
// // //   "auth/signup",
// // //   async (data, thunkAPI) => {
// // //     try {
// // //       const response = await registerAPI(data);
// // //       return response;
// // //     } catch (error) {
// // //       return thunkAPI.rejectWithValue(
// // //         error.response?.data?.message || "Signup Failed",
// // //       );
// // //     }
// // //   },
// // // );

// // // export const verifyOtp = createAsyncThunk(
// // //   "auth/verifyOtp",
// // //   async (data, thunkAPI) => {
// // //     try {
// // //       const response = await verifyOtpAPI(data);
// // //       return response;
// // //     } catch (error) {
// // //       return thunkAPI.rejectWithValue(
// // //         error.response?.data?.message || "Verification Failed",
// // //       );
// // //     }
// // //   },
// // // );

// // // // --- Slice Definition ---

// // // const authSlice = createSlice({
// // //   name: "auth",
// // //   initialState: {
// // //     user: safeParse("user"),
// // //     token: localStorage.getItem("token") || null,
// // //     isAuthenticated: !!(localStorage.getItem("token") && safeParse("user")),
// // //     isLoading: false,
// // //     otpEmail: sessionStorage.getItem("otpEmail") || null,
// // //   },
// // //   reducers: {
// // //     logout: (state) => {
// // //       state.user = null;
// // //       state.token = null;
// // //       state.isAuthenticated = false;
// // //       localStorage.clear();
// // //       sessionStorage.clear();
// // //     },
// // //     setPaymentSuccess: (state) => {
// // //       if (state.user) {
// // //         state.user.status = "active";
// // //         localStorage.setItem("user", JSON.stringify(state.user));
// // //       }
// // //     },
// // //   },
// // //   extraReducers: (builder) => {
// // //     builder
// // //       // Handling Registration
// // //       .addCase(registerUser.fulfilled, (state, action) => {
// // //         state.isLoading = false;
// // //         const email =
// // //           action.meta.arg instanceof FormData
// // //             ? action.meta.arg.get("email")
// // //             : action.meta.arg.email;

// // //         state.otpEmail = email;
// // //         sessionStorage.setItem("otpEmail", email);
// // //       })

// // //       // Handling OTP Verification
// // //       .addCase(verifyOtp.fulfilled, (state, action) => {
// // //         state.isLoading = false;
// // //         state.isAuthenticated = true;

// // //         const userData =
// // //           action.payload.auth || action.payload.user || action.payload;
// // //         const tokenData = action.payload.token || userData?.token;

// // //         if (userData) {
// // //           state.user = userData;
// // //           state.token = tokenData;
// // //           localStorage.setItem("user", JSON.stringify(userData));
// // //           if (tokenData) localStorage.setItem("token", tokenData);
// // //         }
// // //         sessionStorage.removeItem("otpEmail");
// // //       })

// // //       // Handling Login
// // //       .addCase(loginUser.fulfilled, (state, action) => {
// // //         state.isLoading = false;

// // //         // Aapka API response structure: { auth: { id, fullName, email, token }, message: "..." }
// // //         const userData =
// // //           action.payload.auth || action.payload.user || action.payload;
// // //         const tokenData = action.payload.token || userData?.token;

// // //         if (userData) {
// // //           // IMPORTANT: Agar backend role nahi bhej raha, toh hume poora object save karna hoga
// // //           state.user = userData;
// // //           state.token = tokenData;
// // //           state.isAuthenticated = true;

// // //           // LocalStorage sync
// // //           localStorage.setItem("user", JSON.stringify(userData));
// // //           if (tokenData) {
// // //             localStorage.setItem("token", tokenData);
// // //           }
// // //         }
// // //       })

// // //       // Global Loading State Matchers
// // //       .addMatcher(
// // //         (action) => action.type.endsWith("/pending"),
// // //         (state) => {
// // //           state.isLoading = true;
// // //         },
// // //       )
// // //       .addMatcher(
// // //         (action) => action.type.endsWith("/rejected"),
// // //         (state) => {
// // //           state.isLoading = false;
// // //         },
// // //       );
// // //   },
// // // });

// // // export const { logout, setPaymentSuccess } = authSlice.actions;
// // // export default authSlice.reducer;
// // import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// // import {
// //   loginAPI,
// //   registerAPI,
// //   verifyOtpAPI,
// // } from "../../services/authService";

// // /**
// //  * Helper function to safely parse JSON from localStorage.
// //  */
// // const safeParse = (key) => {
// //   const item = localStorage.getItem(key);
// //   if (!item || item === "undefined") return null;
// //   try {
// //     const parsed = JSON.parse(item);
// //     return parsed && (parsed.id || parsed._id) ? parsed : null;
// //   } catch (e) {
// //     console.error(`Error parsing ${key} from localStorage:`, e);
// //     return null;
// //   }
// // };

// // // --- Async Thunks ---

// // export const loginUser = createAsyncThunk(
// //   "auth/login",
// //   async (data, thunkAPI) => {
// //     try {
// //       const response = await loginAPI(data);
// //       return response;
// //     } catch (error) {
// //       return thunkAPI.rejectWithValue(
// //         error.response?.data?.message || "Login Failed",
// //       );
// //     }
// //   },
// // );

// // export const registerUser = createAsyncThunk(
// //   "auth/signup",
// //   async (data, thunkAPI) => {
// //     try {
// //       const response = await registerAPI(data);
// //       return response;
// //     } catch (error) {
// //       return thunkAPI.rejectWithValue(
// //         error.response?.data?.message || "Signup Failed",
// //       );
// //     }
// //   },
// // );

// // export const verifyOtp = createAsyncThunk(
// //   "auth/verifyOtp",
// //   async (data, thunkAPI) => {
// //     try {
// //       const response = await verifyOtpAPI(data);
// //       return response;
// //     } catch (error) {
// //       return thunkAPI.rejectWithValue(
// //         error.response?.data?.message || "Verification Failed",
// //       );
// //     }
// //   },
// // );

// // // --- Slice Definition ---

// // const authSlice = createSlice({
// //   name: "auth",
// //   initialState: {
// //     user: safeParse("user"),
// //     token: localStorage.getItem("token") || null,
// //     isAuthenticated: !!(localStorage.getItem("token") && safeParse("user")),
// //     isLoading: false,
// //     otpEmail: sessionStorage.getItem("otpEmail") || null,
// //   },
// //   reducers: {
// //     logout: (state) => {
// //       state.user = null;
// //       state.token = null;
// //       state.isAuthenticated = false;
// //       localStorage.clear();
// //       sessionStorage.clear();
// //     },
// //     // Action to handle real-time profile updates
// //     updateUser: (state, action) => {
// //       if (state.user) {
// //         // Merge existing state with new data from payload
// //         state.user = { ...state.user, ...action.payload };
// //         // Sync with localStorage so data persists on refresh
// //         localStorage.setItem("user", JSON.stringify(state.user));
// //       }
// //     },
// //     setPaymentSuccess: (state) => {
// //       if (state.user) {
// //         state.user.status = "active";
// //         localStorage.setItem("user", JSON.stringify(state.user));
// //       }
// //     },
// //   },
// //   extraReducers: (builder) => {
// //     builder
// //       // Handling Registration
// //       .addCase(registerUser.fulfilled, (state, action) => {
// //         state.isLoading = false;
// //         const email =
// //           action.meta.arg instanceof FormData
// //             ? action.meta.arg.get("email")
// //             : action.meta.arg.email;

// //         state.otpEmail = email;
// //         sessionStorage.setItem("otpEmail", email);
// //       })

// //       // Handling OTP Verification
// //       .addCase(verifyOtp.fulfilled, (state, action) => {
// //         state.isLoading = false;
// //         state.isAuthenticated = true;

// //         const userData =
// //           action.payload.auth || action.payload.user || action.payload;
// //         const tokenData = action.payload.token || userData?.token;

// //         if (userData) {
// //           state.user = userData;
// //           state.token = tokenData;
// //           localStorage.setItem("user", JSON.stringify(userData));
// //           if (tokenData) localStorage.setItem("token", tokenData);
// //         }
// //         sessionStorage.removeItem("otpEmail");
// //       })

// //       // Handling Login
// //       .addCase(loginUser.fulfilled, (state, action) => {
// //         state.isLoading = false;

// //         const userData =
// //           action.payload.auth || action.payload.user || action.payload;
// //         const tokenData = action.payload.token || userData?.token;

// //         if (userData) {
// //           state.user = userData;
// //           state.token = tokenData;
// //           state.isAuthenticated = true;

// //           localStorage.setItem("user", JSON.stringify(userData));
// //           if (tokenData) {
// //             localStorage.setItem("token", tokenData);
// //           }
// //         }
// //       })

// //       // Global Loading State Matchers
// //       .addMatcher(
// //         (action) => action.type.endsWith("/pending"),
// //         (state) => {
// //           state.isLoading = true;
// //         },
// //       )
// //       .addMatcher(
// //         (action) => action.type.endsWith("/rejected"),
// //         (state) => {
// //           state.isLoading = false;
// //         },
// //       );
// //   },
// // });

// // export const { logout, setPaymentSuccess, updateUser } = authSlice.actions;
// // export default authSlice.reducer;

// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import {
//   loginAPI,
//   registerAPI,
//   verifyOtpAPI,
//   getProfileAPI,
// } from "../../services/authService";
// import {
//   setUser,
//   setToken,
//   getUser,
//   getToken,
//   clearStorage,
// } from "../../utils/storage";

// // LOGIN: Robust logic to fetch profile after login
// export const loginUser = createAsyncThunk(
//   "auth/login",
//   async (data, thunkAPI) => {
//     try {
//       const loginRes = await loginAPI(data);
//       const tempUser = loginRes.auth || loginRes.user || loginRes;
//       const userId = tempUser.id || tempUser._id;
//       const token = loginRes.token || tempUser.token;

//       if (userId) {
//         try {
//           // Try to fetch full profile, but don't crash if it fails
//           const profileRes = await getProfileAPI(userId);
//           const fullUser = {
//             ...(profileRes.auth || profileRes),
//             token: token,
//           };
//           return { user: fullUser, token: token };
//         } catch (e) {
//           console.warn("Profile fetch failed, logging in with basic data", e);
//           return { user: tempUser, token: token };
//         }
//       }
//       return { user: tempUser, token: token };
//     } catch (error) {
//       return thunkAPI.rejectWithValue(
//         error.response?.data?.message || "Login Failed",
//       );
//     }
//   },
// );

// export const verifyOtp = createAsyncThunk(
//   "auth/verifyOtp",
//   async (data, thunkAPI) => {
//     try {
//       const verifyRes = await verifyOtpAPI(data);
//       const tempUser = verifyRes.auth || verifyRes.user || verifyRes;
//       const userId = tempUser.id || tempUser._id;
//       const token = verifyRes.token || tempUser.token;

//       if (userId) {
//         try {
//           const profileRes = await getProfileAPI(userId);
//           const fullUser = { ...(profileRes.auth || profileRes), token: token };
//           return { user: fullUser, token: token };
//         } catch (e) {
//           return { user: tempUser, token: token };
//         }
//       }
//       return { user: tempUser, token: token };
//     } catch (error) {
//       return thunkAPI.rejectWithValue(
//         error.response?.data?.message || "Verification Failed",
//       );
//     }
//   },
// );

// export const registerUser = createAsyncThunk(
//   "auth/signup",
//   async (data, thunkAPI) => {
//     try {
//       const response = await registerAPI(data);
//       return response;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(
//         error.response?.data?.message || "Signup Failed",
//       );
//     }
//   },
// );

// const authSlice = createSlice({
//   name: "auth",
//   initialState: {
//     user: getUser(),
//     token: getToken(),
//     isAuthenticated: !!(getToken() && getUser()),
//     isLoading: false,
//   },
//   reducers: {
//     logout: (state) => {
//       state.user = null;
//       state.token = null;
//       state.isAuthenticated = false;
//       clearStorage();
//       sessionStorage.clear();
//     },
//     updateUser: (state, action) => {
//       if (state.user) {
//         state.user = { ...state.user, ...action.payload };
//         setUser(state.user);
//       }
//     },
//     setPaymentSuccess: (state) => {
//       if (state.user) {
//         state.user.status = "active";
//         setUser(state.user);
//       }
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(loginUser.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.isAuthenticated = true;
//         state.user = action.payload.user;
//         state.token = action.payload.token;
//         setUser(action.payload.user);
//         setToken(action.payload.token);
//       })
//       .addCase(verifyOtp.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.isAuthenticated = true;
//         state.user = action.payload.user;
//         state.token = action.payload.token;
//         setUser(action.payload.user);
//         setToken(action.payload.token);
//       })
//       .addMatcher(
//         (action) => action.type.endsWith("/pending"),
//         (state) => {
//           state.isLoading = true;
//         },
//       )
//       .addMatcher(
//         (action) => action.type.endsWith("/rejected"),
//         (state) => {
//           state.isLoading = false;
//         },
//       );
//   },
// });

// export const { logout, updateUser, setPaymentSuccess } = authSlice.actions;
// export default authSlice.reducer;

// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import {
//   loginAPI,
//   registerAPI,
//   verifyOtpAPI,
//   getProfileAPI,
// } from "../../services/authService";
// import {
//   setUser,
//   setToken,
//   getUser,
//   getToken,
//   clearStorage,
// } from "../../utils/storage";

// export const loginUser = createAsyncThunk(
//   "auth/login",
//   async (data, thunkAPI) => {
//     try {
//       const loginRes = await loginAPI(data);
//       const tempUser = loginRes.auth || loginRes.user || loginRes;
//       const userId = tempUser.id || tempUser._id;
//       const token = loginRes.token || tempUser.token;

//       if (userId) {
//         const profileRes = await getProfileAPI(userId);
//         const fullUser = { ...(profileRes.auth || profileRes), token };
//         return { user: fullUser, token };
//       }
//       return { user: tempUser, token };
//     } catch (error) {
//       return thunkAPI.rejectWithValue(
//         error.response?.data?.message || "Login Failed",
//       );
//     }
//   },
// );

// export const registerUser = createAsyncThunk(
//   "auth/signup",
//   async (data, thunkAPI) => {
//     try {
//       const response = await registerAPI(data);
//       return response; // Registration only returns success, doesn't log in
//     } catch (error) {
//       return thunkAPI.rejectWithValue(
//         error.response?.data?.message || "Signup Failed",
//       );
//     }
//   },
// );

// export const verifyOtp = createAsyncThunk(
//   "auth/verifyOtp",
//   async (data, thunkAPI) => {
//     try {
//       const verifyRes = await verifyOtpAPI(data);
//       const tempUser = verifyRes.auth || verifyRes.user || verifyRes;
//       const userId = tempUser.id || tempUser._id;
//       const token = verifyRes.token || tempUser.token;

//       if (userId) {
//         const profileRes = await getProfileAPI(userId);
//         const fullUser = { ...(profileRes.auth || profileRes), token };
//         return { user: fullUser, token };
//       }
//       return { user: tempUser, token };
//     } catch (error) {
//       return thunkAPI.rejectWithValue(
//         error.response?.data?.message || "Verification Failed",
//       );
//     }
//   },
// );

// const authSlice = createSlice({
//   name: "auth",
//   initialState: {
//     user: getUser(),
//     token: getToken(),
//     isAuthenticated: !!(getToken() && getUser()),
//     isLoading: false,
//   },
//   reducers: {
//     logout: (state) => {
//       state.user = null;
//       state.token = null;
//       state.isAuthenticated = false;
//       clearStorage();
//     },
//     updateUser: (state, action) => {
//       if (state.user) {
//         state.user = { ...state.user, ...action.payload };
//         setUser(state.user);
//       }
//     },
//     setPaymentSuccess: (state) => {
//       if (state.user) {
//         state.user.status = "active";
//         setUser(state.user);
//       }
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(loginUser.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.isAuthenticated = true;
//         state.user = action.payload.user;
//         state.token = action.payload.token;
//         setUser(action.payload.user);
//         setToken(action.payload.token);
//       })
//       // Inside authSlice.js - update verifyOtp.fulfilled
//       .addCase(verifyOtp.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.isAuthenticated = true;

//         // IMPORTANT: Based on your API, the user data is in action.payload.auth
//         const userData =
//           action.payload.auth || action.payload.user || action.payload;
//         const tokenData = action.payload.token || userData?.token;

//         if (userData && userData.role) {
//           state.user = userData;
//           state.token = tokenData;

//           // Save ONLY the user object, not the success message
//           setUser(userData);
//           if (tokenData) setToken(tokenData);
//         }
//       })
//       .addMatcher(
//         (action) => action.type.endsWith("/pending"),
//         (state) => {
//           state.isLoading = true;
//         },
//       )
//       .addMatcher(
//         (action) => action.type.endsWith("/rejected"),
//         (state) => {
//           state.isLoading = false;
//         },
//       );
//   },
// });

// export const { logout, updateUser, setPaymentSuccess } = authSlice.actions;
// export default authSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginAPI,
  registerAPI,
  verifyOtpAPI,
  getProfileAPI,
} from "../../services/authService";
import {
  setUser,
  setToken,
  getUser,
  getToken,
  clearStorage,
} from "../../utils/storage";

// --- Thunks ---
export const loginUser = createAsyncThunk(
  "auth/login",
  async (data, thunkAPI) => {
    try {
      const loginRes = await loginAPI(data);
      const tempUser = loginRes.auth || loginRes.user || loginRes;
      const userId = tempUser.id || tempUser._id;
      const token = loginRes.token || tempUser.token;

      if (userId) {
        const profileRes = await getProfileAPI(userId);
        const fullUser = { ...(profileRes.auth || profileRes), token };
        return { user: fullUser, token };
      }
      return { user: tempUser, token };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Login Failed",
      );
    }
  },
);

export const registerUser = createAsyncThunk(
  "auth/signup",
  async (data, thunkAPI) => {
    try {
      return await registerAPI(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Signup Failed",
      );
    }
  },
);

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (data, thunkAPI) => {
    const { email, otp, pendingUser } = data;
    try {
      const verifyRes = await verifyOtpAPI({ email, otp });

      // Merge backend message with existing user data if details are missing in response
      let userData =
        verifyRes.auth ||
        verifyRes.user ||
        (verifyRes.message ? pendingUser : verifyRes);

      const userId = userData?.id || userData?._id;
      const token = verifyRes.token || userData?.token;

      if (userId) {
        try {
          const profileRes = await getProfileAPI(userId);
          const fullUser = { ...(profileRes.auth || profileRes), token };
          return { user: fullUser, token };
        } catch (err) {
          // Fallback if profile API fails
          return { user: { ...userData, token }, token };
        }
      }
      return { user: userData, token };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Verification Failed",
      );
    }
  },
);

// --- Slice ---
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: getUser(),
    token: getToken(),
    isAuthenticated: !!(getToken() && getUser()),
    isLoading: false,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      clearStorage();
    },
    updateUser: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        setUser(state.user);
      }
    },
    // This was the missing action!
    setPaymentSuccess: (state) => {
      if (state.user) {
        state.user.status = "active";
        setUser(state.user);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        setUser(action.payload.user);
        setToken(action.payload.token);
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        setUser(action.payload.user);
        setToken(action.payload.token);
      })
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.isLoading = true;
        },
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state) => {
          state.isLoading = false;
        },
      );
  },
});

// ⭐ IMPORTANT: Added setPaymentSuccess to the exports below
export const { logout, updateUser, setPaymentSuccess } = authSlice.actions;
export default authSlice.reducer;