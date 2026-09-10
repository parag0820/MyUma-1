import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setPaymentSuccess } from "../features/auth/authSlice";
import { toast } from "react-toastify";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
   
    dispatch(setPaymentSuccess());

    toast.success("Payment successful! Your account is now active.");

    // 2. Redirect to Home after 3 seconds
    const timer = setTimeout(() => {
      navigate("/");
    }, 3000);

    return () => clearTimeout(timer);
  }, [dispatch, navigate]);

  return (
    <div className="vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="text-center p-5 shadow bg-white rounded-4">
        <div className="mb-4">
          <i
            className="bi bi-check-circle-fill text-success"
            style={{ fontSize: "4rem" }}></i>
        </div>
        <h2 className="fw-bold mb-2">Payment Received!</h2>
        <p className="text-muted">
          Thank you for your purchase. We are activating your dashboard...
        </p>
        <div className="spinner-border text-primary mt-3" role="status"></div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
