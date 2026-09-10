// import React, { useState } from "react";
// import { X } from "lucide-react";
// import { toast } from "react-toastify";
// import { sendInquireApi } from "../services/authService";

// const InquiryModal = ({ show, onClose, listingId }) => {
//   const [loading, setLoading] = useState(false);
//   const [form, setForm] = useState({
//     fullName: "",
//     email: "",
//     phoneNo: "",
//     comment: "",
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const res = await sendInquireApi({ itemId: listingId, ...form });
//       if (res.success) {
//         toast.success("Inquiry Sent Successfully!");
//         onClose();
//       }
//     } catch (err) {
//       toast.error("Failed to send inquiry");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!show) return null;

//   return (
//     <div
//       className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center px-3"
//       style={{ zIndex: 11000, backgroundColor: "rgba(0,0,0,0.5)" }}>
//       <div
//         className="bg-white rounded-4 shadow-lg w-100 overflow-hidden"
//         style={{ maxWidth: "420px" }}>
//         <div
//           className="p-3 text-white d-flex justify-content-between align-items-center"
//           style={{ backgroundColor: "#001f3f" }}>
//           <h6 className="m-0">Direct Inquiry</h6>
//           <X className="cursor-pointer" onClick={onClose} />
//         </div>
//         <form onSubmit={handleSubmit} className="p-4">
//           <input
//             type="text"
//             placeholder="Full Name"
//             className="form-control rounded-pill mb-3"
//             required
//             onChange={(e) => setForm({ ...form, fullName: e.target.value })}
//           />
//           <input
//             type="email"
//             placeholder="Email"
//             className="form-control rounded-pill mb-3"
//             required
//             onChange={(e) => setForm({ ...form, email: e.target.value })}
//           />
//           <input
//             type="text"
//             placeholder="Phone Number"
//             className="form-control rounded-pill mb-3"
//             required
//             onChange={(e) => setForm({ ...form, phoneNo: e.target.value })}
//           />
//           <textarea
//             placeholder="Your message..."
//             className="form-control rounded-4 mb-3"
//             rows="3"
//             required
//             onChange={(e) =>
//               setForm({ ...form, comment: e.target.value })
//             }></textarea>
//           <button
//             className="btn text-white w-100 rounded-pill fw-bold py-2 shadow-sm"
//             style={{ backgroundColor: "#001f3f" }}
//             disabled={loading}>
//             {loading ? "Sending..." : "SUBMIT"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default InquiryModal;



import React, { useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { sendInquireApi } from "../services/authService";
import { getUser } from "../utils/storage"; 

const InquiryModal = ({ show, onClose, listingId }) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phoneNo: "",
    comment: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 1. Logged in user ki details nikalna
    const currentUser = getUser();
    const userId = currentUser?._id || currentUser?.id;

    // 2. Payload banana (itemId aur userId ke saath)
    const payload = { 
      itemId: listingId, 
      userId: userId || null, 
      ...form 
    };

    // --- DEBUG CONSOLE LOGS ---
    console.log("🚀 INQUIRY SUBMIT INITIATED");
    console.log("🆔 LOGGED IN USER ID:", userId);
    console.log("📦 FINAL PAYLOAD SENDING TO API:", payload);

    try {
      const res = await sendInquireApi(payload);
      
      console.log("✅ API SUCCESS RESPONSE:", res);

      if (res.success || res) {
        toast.success("Inquiry Sent Successfully!");
        onClose();
      }
    } catch (err) {
      console.error("❌ API ERROR DETAILS:", err.response?.data || err.message);
      toast.error("Failed to send inquiry");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center px-3"
      style={{ zIndex: 11000, backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div
        className="bg-white rounded-4 shadow-lg w-100 overflow-hidden"
        style={{ maxWidth: "420px" }}>
        <div
          className="p-3 text-white d-flex justify-content-between align-items-center"
          style={{ backgroundColor: "#001f3f" }}>
          <h6 className="m-0 fw-bold">Direct Inquiry</h6>
          <X className="cursor-pointer" onClick={onClose} style={{ cursor: 'pointer' }} />
        </div>
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-3">
            <input
              type="text"
              placeholder="Full Name"
              className="form-control rounded-pill border-light-subtle"
              required
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <input
              type="email"
              placeholder="Email"
              className="form-control rounded-pill border-light-subtle"
              required
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              placeholder="Phone Number"
              className="form-control rounded-pill border-light-subtle"
              required
              onChange={(e) => setForm({ ...form, phoneNo: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <textarea
              placeholder="Your message..."
              className="form-control rounded-4 border-light-subtle"
              rows="3"
              required
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
            ></textarea>
          </div>
          <button
            className="btn text-white w-100 rounded-pill fw-bold py-2 shadow-sm"
            style={{ backgroundColor: "#001f3f" }}
            disabled={loading}>
            {loading ? (
              <span className="spinner-border spinner-border-sm me-2"></span>
            ) : "SUBMIT"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default InquiryModal;