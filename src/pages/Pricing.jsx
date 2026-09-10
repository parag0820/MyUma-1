import React, { useEffect, useState, useCallback } from "react"; // Added useCallback
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { getPlansAPI, getMySubscriptionAPI } from "../services/authService";
import { CheckCircle, X } from "lucide-react";

const Pricing = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [plans, setPlans] = useState([]);
  const [bannerHeading, setBannerHeading] = useState("");
  const [activeSub, setActiveSub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const accent = "#de9f57";

  // 1. Check for Success URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "true") {
      setShowSuccessPopup(true);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // 2. ⭐ REAL-TIME FETCH LOGIC using useCallback
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // A. Fetch current Admin Settings (Plans)
      const res = await getPlansAPI();
      const currentPlans = res?.data?.[0]?.Plan || res?.data || [];
      setPlans(currentPlans);
      if (res?.data?.[0]?.bannerText) setBannerHeading(res.data[0].bannerText);

      // B. Fetch Owner Subscription
      if (user) {
        const oId = user._id || user.id;
        const subRes = await getMySubscriptionAPI(oId);

        if (subRes?.success && subRes.payments?.length > 0) {
          const successfulPayments = [...subRes.payments]
            .filter((p) => p.status === "success")
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

          if (successfulPayments.length > 0) {
            let latest = successfulPayments[0];

            // ⭐ LOGIC FIX: Always recalculate using current admin settings
            // This ensures if Admin changes 4 months to 3 months, it updates here instantly.
            const planMeta = currentPlans.find(
              (p) => p.name === latest.planName,
            );

            let start = latest.subscriptionStartDate
              ? new Date(latest.subscriptionStartDate)
              : new Date(latest.createdAt);
            let end = new Date(start);

            if (planMeta) {
              const count = Number(planMeta.durationCount);
              const unit = planMeta.duration?.toLowerCase();

              if (unit === "day") end.setDate(end.getDate() + count);
              else if (unit === "week") end.setDate(end.getDate() + count * 7);
              else if (unit === "month") end.setMonth(end.getMonth() + count);
              else if (unit === "year")
                end.setFullYear(end.getFullYear() + count);
            } else {
              end.setMonth(end.getMonth() + 1); // Default fallback
            }

            setActiveSub({
              ...latest,
              subscriptionStartDate: start,
              subscriptionEndDate: end,
            });
          }
        }
      }
    } catch (error) {
      console.error("Fetch Logic Error:", error);
    } finally {
      setLoading(false);
    }
  }, [user]); // Re-create function only if user changes

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 3. Real-time Progress calculation
  const getProgress = (start, end) => {
    if (!start || !end) return null;
    const today = new Date();
    const total = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const remaining = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
    const used = total - remaining;
    const percent = Math.min(100, Math.max(0, (used / total) * 100));
    return {
      used: Math.max(0, used),
      remaining: Math.max(0, remaining),
      percent,
    };
  };

  const handleSelect = (plan) => {
    if (!user) return navigate("/login");
    if (user.role === "user") {
      return toast.info(
        "Access Denied: Only business owners can purchase subscriptions.",
      );
    }
    navigate("/checkout-details", { state: { plan } });
  };

  if (loading) {
    return (
      <div className="vh-100 d-flex flex-column align-items-center justify-content-center bg-white">
        <div className="spinner-border text-warning mb-3"></div>
        <p className="text-muted fw-bold">Synchronizing your plans...</p>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100 pb-5 text-start">
      {/* Dynamic Banner */}
      <div
        className="bg-navy pt-5 pb-5 mb-5 text-center shadow-sm"
        style={{
          backgroundColor: "#002147",
          borderBottom: `4px solid ${accent}`,
        }}
      >
        <div className="container py-4">
          <h1 className="display-5 fw-bold text-white mb-3 text-uppercase ls-1">
            {bannerHeading}
          </h1>
        </div>
      </div>

      <div
        className="container"
        style={{ marginTop: "-80px", position: "relative", zIndex: "10" }}
      >
        {activeSub && (
          <div className="row justify-content-center mb-5">
            <div className="col-lg-10">
              <div className="card border-0 shadow-lg rounded-4 p-4 bg-white border-start border-5 border-success">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h5 className="fw-bold mb-1 text-navy">
                      Active Plan: {activeSub.planName}
                    </h5>
                    <div className="d-flex flex-wrap gap-3 mt-1">
                      <span className="small text-muted">
                        <i className="bi bi-calendar-check me-1"></i>
                        <strong>Started:</strong>{" "}
                        {activeSub.subscriptionStartDate.toLocaleDateString(
                          "en-GB",
                        )}
                      </span>
                      <span className="small text-danger">
                        <i className="bi bi-calendar-x me-1"></i>
                        <strong>Expires:</strong>{" "}
                        {activeSub.subscriptionEndDate.toLocaleDateString(
                          "en-GB",
                        )}
                      </span>
                    </div>
                  </div>
                  <span className="badge rounded-pill bg-success px-4 py-2">
                    ACTIVE
                  </span>
                </div>
                {(() => {
                  const prog = getProgress(
                    activeSub.subscriptionStartDate,
                    activeSub.subscriptionEndDate,
                  );
                  return (
                    prog && (
                      <div className="mt-3">
                        <div
                          className="progress mb-2"
                          style={{ height: "10px", borderRadius: "10px" }}
                        >
                          <div
                            className="progress-bar bg-warning progress-bar-striped progress-bar-animated"
                            style={{ width: `${prog.percent}%` }}
                          ></div>
                        </div>
                        <div className="d-flex justify-content-between small fw-bold text-navy">
                          <span>{prog.used} Days Completed</span>
                          <span>{prog.remaining} Days Remaining</span>
                        </div>
                      </div>
                    )
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        <div className="row g-4 justify-content-center">
          {plans.map((plan, idx) => {
            const isCurrent = activeSub && activeSub.planName === plan.name;
            return (
              <div key={idx} className="col-12 col-md-6 col-lg-4">
                <div className="card h-100 border-0 shadow rounded-5 overflow-hidden transition-hover">
                  <div
                    style={{
                      height: "10px",
                      backgroundColor: isCurrent ? accent : "#002147",
                    }}
                  ></div>
                  <div className="card-body p-4 p-xl-5 d-flex flex-column">
                    {isCurrent && (
                      <div className="badge bg-warning text-dark mb-2 align-self-start shadow-sm">
                        Current Plan
                      </div>
                    )}
                    <h3 className="fw-bold text-navy mb-1">{plan.name}</h3>
                    <div className="d-flex align-items-end my-4">
                      <h2 className="display-5 fw-bold text-navy mb-0">
                        ${plan.price}
                      </h2>
                      <span className="text-muted ms-2 pb-2 small text-capitalize">
                        / {plan.durationCount} {plan.duration}
                      </span>
                    </div>

                    <div
                      className="mb-4 p-3 rounded-4 bg-light border-start border-4 shadow-sm"
                      style={{ borderColor: accent }}
                    >
                      <div className="d-flex align-items-center mb-2">
                        <i
                          className="bi bi-file-earmark-plus-fill me-2"
                          style={{ color: "#002147" }}
                        ></i>
                        <span className="small fw-bold text-navy">
                          {plan.listings > 0
                            ? `Unlimited Listings`
                            : "Unlimited Listings"}
                        </span>
                      </div>
                      {/* <div className="d-flex align-items-center">
                        <i
                          className={`bi ${plan.chatIsActive ? "bi-chat-dots-fill text-success" : "bi-chat-left-x-fill text-danger"} me-2`}
                        ></i>
                        <span
                          className={`small fw-bold ${plan.chatIsActive ? "text-navy" : "text-muted opacity-75"}`}
                        >
                          {plan.chatIsActive
                            ? "Instant Chat Available"
                            : "Chat Not Included"}
                        </span>
                      </div> */}
                    </div>

                    <ul className="list-unstyled mb-5">
                      {/* {plan.features?.map((f, i) => (
                        <li
                          key={i}
                          className="mb-3 d-flex align-items-start small text-muted"
                        >
                          <i
                            className="bi bi-check-circle-fill me-2"
                            style={{ color: accent }}
                          ></i>{" "}
                          {f}
                        </li>
                      ))} */}
                      {/* <li className="mb-3 d-flex align-items-start small text-muted">
                        <i className="bi bi-check-circle-fill me-2"></i>
                        {"market place , will be free"}
                      </li> */}
                    </ul>

                    <button
                      onClick={() => handleSelect(plan)}
                      disabled={isCurrent}
                      className="btn w-100 text-white py-3 rounded-pill fw-bold border-0 mt-auto shadow-sm"
                      style={{
                        backgroundColor: isCurrent ? "#adb5bd" : "#002147",
                      }}
                    >
                      {isCurrent ? "Plan Active" : "Purchase Plan"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessPopup && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{
            backgroundColor: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(8px)",
            zIndex: 1050,
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-5 shadow-lg overflow-hidden py-4 px-3">
              <div className="text-end">
                <button
                  className="btn border-0 p-0 text-muted"
                  onClick={() => setShowSuccessPopup(false)}
                >
                  <X size={24} />
                </button>
              </div>
              <div className="modal-body text-center p-4">
                <div className="mb-4">
                  <div className="d-inline-flex p-4 rounded-circle bg-success bg-opacity-10 text-success">
                    <CheckCircle size={64} strokeWidth={2.5} />
                  </div>
                </div>
                <h2 className="fw-bold text-navy mb-2">Payment Successful!</h2>
                <p className="text-muted mb-4">
                  Your subscription plan has been activated successfully.
                </p>
                <button
                  className="btn btn-warning w-100 py-3 rounded-pill fw-bold shadow-sm"
                  style={{
                    backgroundColor: accent,
                    color: "white",
                    border: "none",
                  }}
                  onClick={() => setShowSuccessPopup(false)}
                >
                  Great, Let's Start!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pricing;
