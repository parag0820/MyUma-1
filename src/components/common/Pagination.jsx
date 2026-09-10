
//componets/commom/pagination.jsx
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 0) return null;

  return (
    <div className="d-flex justify-content-center align-items-center mt-4 gap-2">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="btn btn-light btn-sm rounded-circle shadow-sm border">
        <ChevronLeft size={20} />
      </button>

      {[...Array(totalPages)].map((_, i) => (
        <button
          key={i}
          onClick={() => onPageChange(i + 1)}
          className={`btn btn-sm rounded-circle px-3 ${
            currentPage === i + 1
              ? "btn-danger shadow text-white"
              : "btn-light border"
          }`}>
          {i + 1}
        </button>
      ))}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="btn btn-light btn-sm rounded-circle shadow-sm border">
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default Pagination;
