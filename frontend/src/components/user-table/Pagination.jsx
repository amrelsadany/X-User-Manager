import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { paginationStyles } from '../../styles/appStyles';

export default function Pagination({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange,
  hoveredButton,
  setHoveredButton,
}) {
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  return (
    <div style={paginationStyles.pagination}>
      <div style={paginationStyles.paginationInfo}>
        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, totalItems)} of {totalItems} users
      </div>
      <div style={paginationStyles.paginationButtons}>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            ...paginationStyles.pageButton,
            ...(currentPage === 1 ? paginationStyles.pageButtonDisabled : {}),
            ...(hoveredButton === 'prev' && currentPage !== 1 ? paginationStyles.pageButtonHover : {}),
          }}
          onMouseEnter={() => setHoveredButton('prev')}
          onMouseLeave={() => setHoveredButton(null)}
        >
          <ChevronLeft size={16} />
          Previous
        </button>
        
        {[...Array(totalPages)].map((_, index) => {
          const pageNum = index + 1;
          // Show first, last, current, and adjacent pages
          if (
            pageNum === 1 ||
            pageNum === totalPages ||
            (pageNum >= currentPage - 3 && pageNum <= currentPage + 3)
          ) {
            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                style={{
                  ...paginationStyles.pageButton,
                  ...(currentPage === pageNum ? paginationStyles.pageButtonActive : {}),
                  ...(hoveredButton === `page-${pageNum}` && currentPage !== pageNum ? paginationStyles.pageButtonHover : {}),
                }}
                onMouseEnter={() => setHoveredButton(`page-${pageNum}`)}
                onMouseLeave={() => setHoveredButton(null)}
              >
                {pageNum}
              </button>
            );
          } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
            return <span key={pageNum} style={{ padding: '0 0.25rem', color: '#9ca3af' }}>...</span>;
          }
          return null;
        })}
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            ...paginationStyles.pageButton,
            ...(currentPage === totalPages ? paginationStyles.pageButtonDisabled : {}),
            ...(hoveredButton === 'next' && currentPage !== totalPages ? paginationStyles.pageButtonHover : {}),
          }}
          onMouseEnter={() => setHoveredButton('next')}
          onMouseLeave={() => setHoveredButton(null)}
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
