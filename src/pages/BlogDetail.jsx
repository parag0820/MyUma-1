
import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  getBlogDetailsApi,
  getImgURL,
  sendCommentAPI,
  updateCommentAPI,
  getAllCommentsAPI,
} from "../services/authService";
import { getUser } from "../utils/storage";

const BlogDetail = () => {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [detailsBlog, setDetailsBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // States for Edit Logic
  const [existingCommentId, setExistingCommentId] = useState(null);
  const [isUpdateMode, setIsUpdateMode] = useState(false);

  const blogId = location.state?.blogId;
  const currentUser = getUser();
  const currentUserId = currentUser?._id || currentUser?.id;

  const getBlogDetails = async (id) => {
    try {
      setLoading(true);
      const response = await getBlogDetailsApi(id);
      if (response?.blog) {
        setDetailsBlog(response.blog);
      }
    } catch (error) {
      console.error("Error fetching blog details:", error);
    } finally {
      setLoading(false);
    }
  };

  // Logic to find if the current user already has a comment on this specific blog
  const checkUserComment = useCallback(async () => {
    if (!currentUserId || !blogId) return;
    try {
      const response = await getAllCommentsAPI();
      // Based on your JSON, the array is in response.comments
      const allComments = response?.comments || [];

      if (allComments.length > 0) {
        const myComment = allComments.find(
          (c) =>
            // Check matching Blog ID
            (c.blogId?._id === blogId || c.blogId === blogId) &&
            // Check matching User ID
            (c.userId?._id === currentUserId || c.userId === currentUserId),
        );

        if (myComment) {
          setCommentText(myComment.comment);
          setExistingCommentId(myComment._id);
          setIsUpdateMode(true);
        }
      }
    } catch (error) {
      console.error("Error checking comments:", error);
    }
  }, [blogId, currentUserId]);

  const handleCommentSubmit = async () => {
    if (!isAuthenticated) {
      toast.warn("Please login to post or edit a comment");
      navigate("/login");
      return;
    }

    if (!commentText.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    try {
      setSubmitting(true);

      // Payload including all required fields: blogId, userId, comment
      const payload = {
        blogId: detailsBlog._id,
        userId: currentUserId,
        comment: commentText,
      };

      if (isUpdateMode) {
        // UPDATE: PUT /comment/update/:id
        const response = await updateCommentAPI(existingCommentId, payload);
        if (response) {
          toast.success("Comment updated successfully!");
        }
      } else {
        // POST: POST /comment/send
        const response = await sendCommentAPI(payload);
        if (response) {
          toast.success("Comment posted successfully!");
          // Switch to update mode so they can't post a 2nd time
          checkUserComment();
        }
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (blogId) {
      getBlogDetails(blogId);
      checkUserComment();
    }
  }, [blogId, checkUserComment]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  if (!detailsBlog) return null;

  const displayDate = new Date(detailsBlog.createdAt).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "2-digit",
      year: "numeric",
    },
  );

  return (
    <div className="bg-white min-vh-100 py-5">
      <div className="container px-4">
        {/* Blog Header */}
        <div className="row justify-content-center text-center mb-5">
          <div className="col-12 col-lg-8">
            <nav className="mb-4">
              <Link
                to="/blog"
                className="text-decoration-none fw-bold small text-uppercase"
                style={{ color: "#c49a6c" }}>
                <i className="bi bi-arrow-left me-1"></i> Back to Journal
              </Link>
            </nav>
            <h1
              className="fw-bolder display-6 mb-3"
              style={{ color: "#1a2b49" }}>
              {detailsBlog.title}
            </h1>
          </div>
        </div>

        {/* Blog Image */}
        <div className="row justify-content-center mb-5">
          <div className="col-12 col-md-10 text-center">
            <img
              src={getImgURL(detailsBlog.image)}
              className="img-fluid rounded-4 shadow-sm"
              alt={detailsBlog.title}
              style={{ maxHeight: "500px", width: "100%", objectFit: "cover" }}
            />
          </div>
        </div>

        {/* Blog Content */}
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            <article 
              className="text-secondary fs-5 lh-lg mb-5 text-start" 
              style={{ 
                wordBreak: "normal",        // ⭐ This prevents cutting the word in the middle
                overflowWrap: "break-word",  // ⭐ This ensures the text stays inside the container
                hyphens: "none"              // ⭐ This ensures no automatic dashes are added
              }}
            >
              <div
                className="blog-content-body"
                dangerouslySetInnerHTML={{ __html: detailsBlog.description }}
              />
            </article>

            {/* Response Section */}
            <div className="mt-5 pt-5 border-top d-flex justify-content-center">
              <div
                className="card border-0 bg-light p-4 p-md-5 rounded-4 shadow-sm w-100"
                style={{ maxWidth: "700px" }}>
                <h4 className="fw-bold mb-2 text-center">
                  {isUpdateMode ? "Your Response" : "Leave a Response"}
                </h4>
                {isUpdateMode && (
                  <p className="text-center text-primary small mb-4">
                    You have already commented. You can edit your message below.
                  </p>
                )}

                <textarea
                  className="form-control border-0 mb-3 rounded-4 p-3 shadow-none"
                  rows="5"
                  placeholder={
                    isAuthenticated
                      ? "Share your thoughts..."
                      : "Please login to write a comment"
                  }
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  disabled={submitting || !isAuthenticated}></textarea>

                <button
                  className={`btn w-100 rounded-pill py-3 fw-bold ${isUpdateMode ? "btn-primary" : "btn-dark"}`}
                  onClick={handleCommentSubmit}
                  disabled={submitting}>
                  {submitting ? (
                    <span className="spinner-border spinner-border-sm me-2"></span>
                  ) : !isAuthenticated ? (
                    "LOGIN TO POST"
                  ) : isUpdateMode ? (
                    "UPDATE MY COMMENT"
                  ) : (
                    "POST COMMENT"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;