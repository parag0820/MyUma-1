import React, { useState, useEffect } from "react";
import { getTestimonialsAPI, getImgURL } from "../services/authService";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const TestimonialPage = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchList = async () => {
      try {
        const res = await getTestimonialsAPI();
        if (res.success) {
          setTestimonials(res.data);
        }
      } catch (err) {
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchList();
  }, []);

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "60vh" }}>
        <div className="spinner-border text-tan" role="status"></div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#f4f4f4", padding: "80px 0" }}>
      <div className="container">
        {/* PAGE HEADING */}
        <div className="text-center mb-5">
          <h2
            className="fw-bold text-navy text-uppercase"
            style={{ letterSpacing: "2px", color: "#001529" }}>
            Testimonial
          </h2>
          <div
            className="mx-auto"
            style={{
              height: "3px",
              width: "60px",
              marginTop: "10px",
              backgroundColor: "#001529",
            }}></div>
        </div>

        {/* SWIPER CAROUSEL */}
        <div
          className="shadow-sm"
          style={{
            borderRadius: "8px",
            overflow: "hidden",
            maxWidth: "1100px",
            margin: "0 auto",
            backgroundColor: "#fff",
          }}>
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={0}
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            pagination={{ clickable: true }}
            style={{
              "--swiper-pagination-color": "#001529",
              "--swiper-navigation-color": "#001529",
            }}>
            {testimonials.map((item) => (
              <SwiperSlide key={item._id}>
                <div className="row g-0 align-items-stretch">
                  {/* LEFT SIDE: IMAGE */}
                  <div className="col-md-5">
                    <img
                      src={getImgURL(item.profileImage)}
                      alt={item.fullName}
                      style={{
                        width: "100%",
                        height: "450px",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  </div>

                  {/* RIGHT SIDE: CONTENT */}
                  <div className="col-md-7 d-flex align-items-center">
                    <div className="p-5 w-100">
                      <blockquote className="mb-4">
                        <h2
                          className="text-navy"
                          style={{
                            fontSize: "2rem",
                            fontWeight: "400",
                            lineHeight: "1.4",
                            fontFamily: "serif",
                            color: "#001529",
                          }}>
                          “{item.message}”
                        </h2>
                      </blockquote>

                      <div className="d-flex align-items-center mt-5">
                        <div
                          style={{
                            width: "40px",
                            height: "1px",
                            backgroundColor: "#ccc",
                            marginRight: "15px",
                          }}></div>
                        <div
                          className="text-muted"
                          style={{ fontSize: "14px" }}>
                          <span
                            className="text-navy fw-bold"
                            style={{ color: "#001529" }}>
                            {item.fullName}
                          </span>
                          {item.address && (
                            <>
                              <span className="mx-2" style={{ color: "#ccc" }}>
                                |
                              </span>
                              <span className="fw-bold">{item.address}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {!loading && testimonials.length === 0 && (
          <div className="text-center py-5">
            <h4 className="text-navy opacity-50">No stories available.</h4>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestimonialPage;
