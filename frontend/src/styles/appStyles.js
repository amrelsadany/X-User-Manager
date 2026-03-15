// styles/appStyles.js
export const styles = {
  container: {
    background: "linear-gradient(to bottom right, #eff6ff, #e0e7ff)",
    padding: "1.5rem 1rem 2rem 1rem",
    width: "100%",
    boxSizing: "border-box",
    fontFamily: '"Inter", sans-serif',
  },
  maxWidth: {
    maxWidth: "80rem",
    margin: "0 auto",
    width: "100%",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "1rem",
    flexWrap: "wrap",
    gap: "1rem",
  },
  addButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.75rem 1.25rem",
    backgroundColor: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "0.5rem",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "600",
    transition: "background-color 0.2s",
    fontFamily: '"Montserrat", sans-serif',
  },
  addButtonHover: {
    backgroundColor: "#059669",
  },
  errorBox: {
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#991b1b",
    padding: "1rem",
    borderRadius: "0.5rem",
    marginBottom: "1.5rem",
  },
  loadingContainer: {
    minHeight: "100vh",
    background: "linear-gradient(to bottom right, #eff6ff, #e0e7ff)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: "#4b5563",
    fontSize: "1.125rem",
  },
};

export const tableStyles = {
  tableContainer: {
    overflowX: "auto",
    backgroundColor: "white",
    borderRadius: "0.5rem",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  thead: {
    backgroundColor: "#f9fafb",
    borderBottom: "2px solid #e5e7eb",
  },
  th: {
    padding: "0.75rem 1rem",
    textAlign: "left",
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#6b7280",
    letterSpacing: "0.05em",
  },
  tr: {
    borderBottom: "1px solid #e5e7eb",
    transition: "background-color 0.2s",
  },
  trHover: {
    backgroundColor: "#ebeef1",
  },
  td: {
    padding: "1rem",
    fontSize: "0.875rem",
    color: "#374151",
  },
  username: {
    fontWeight: "600",
    color: "#1f2937",
    fontSize: "0.95rem",
  },
  url: {
    color: "#4f46e5",
    textDecoration: "none",
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: "0.85rem",
    fontWeight: "500",
    maxWidth: "300px",
    display: "inline-block",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  urlHover:{
    textDecoration: "underline"
  },
  actionButtons: {
    display: "flex",
    gap: "2rem",
    justifyContent: "center"
  },
  iconButton: {
    padding: "0.5rem",
    border: "none",
    borderRadius: "0.375rem",
    cursor: "pointer",
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem"
  },
  editButton: {
    backgroundColor: "RoyalBlue",
    color: "#ffffff",
  },
  editButtonHover: {
    backgroundColor: "MidnightBlue",
  },
  deleteButton: {
    backgroundColor: "#fee2e2",
    color: "#dc2626",
  },
  deleteButtonHover: {
    backgroundColor: "#fecaca",
  },
  markButton: {
    backgroundColor: "#d1fae5",
    color: "#059669",
  },
  markButtonHover: {
    backgroundColor: "#a7f3d0",
  },
};

export const paginationStyles = {
  pagination: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem 1.5rem",
    borderTop: "1px solid #e5e7eb",
    backgroundColor: "white",
    borderRadius: "0.5rem 0.5rem 0.5rem 0.5rem",
    position: "relative", 
    marginTop: "0.3rem"
  },
  paginationInfo: {
    fontSize: "0.875rem",
    color: "#6b7280",
    position: "absolute", 
  left: "1.5rem",  
  },
  paginationButtons: {
    display: "flex",
    gap: "0.5rem",
  },
  pageButton: {
    padding: "0.5rem 0.75rem",
    border: "1px solid #d1d5db",
    backgroundColor: "white",
    borderRadius: "0.375rem",
    cursor: "pointer",
    fontSize: "0.875rem",
    fontWeight: "500",
    color: "#374151",
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
  },
  pageButtonHover: {
    backgroundColor: "#f9fafb",
    borderColor: "#9ca3af",
  },
  pageButtonDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
  pageButtonActive: {
    backgroundColor: "#4f46e5",
    color: "white",
    borderColor: "#4f46e5",
  },
};

export const modalStyles = {
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "1rem",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: "0.5rem",
    padding: "2rem",
    maxWidth: "500px",
    width: "100%",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  },
  modalHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "1.5rem",
  },
  modalTitle: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#1f2937",
  },
  closeButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "0.5rem",
    color: "#6b7280",
    borderRadius: "0.25rem",
    transition: "all 0.2s",
  },
  closeButtonHover: {
    backgroundColor: "#f3f4f6",
    color: "#1f2937",
  },
  formGroup: {
    marginBottom: "1rem",
  },
  label: {
    display: "block",
    fontSize: "0.875rem",
    fontWeight: "500",
    color: "#374151",
    marginBottom: "0.5rem",
  },
  input: {
    width: "100%",
    padding: "0.5rem 0.75rem",
    border: "1px solid #d1d5db",
    borderRadius: "0.375rem",
    fontSize: "1rem",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  },
  inputFocus: {
    outline: "none",
    borderColor: "#4f46e5",
    boxShadow: "0 0 0 3px rgba(79, 70, 229, 0.1)",
  },
  modalActions: {
    display: "flex",
    gap: "0.75rem",
    justifyContent: "flex-end",
    marginTop: "1.5rem",
  },
  cancelButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "#f3f4f6",
    color: "#374151",
    border: "none",
    borderRadius: "0.375rem",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "500",
    transition: "background-color 0.2s",
  },
  cancelButtonHover: {
    backgroundColor: "#e5e7eb",
  },
  saveButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.5rem 1rem",
    backgroundColor: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "0.375rem",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "500",
    transition: "background-color 0.2s",
  },
  saveButtonHover: {
    backgroundColor: "#4338ca",
  },
  buttonDisabled: {
    backgroundColor: "#9ca3af",
    cursor: "not-allowed",
  },
};

export const confirmStyles = {
  confirmOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1100,
    padding: "1rem",
  },
  confirmDialog: {
    backgroundColor: "white",
    borderRadius: "0.5rem",
    padding: "1.5rem",
    maxWidth: "400px",
    width: "100%",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  },
  confirmTitle: {
    fontSize: "1.25rem",
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: "1rem",
  },
  confirmMessage: {
    color: "#4b5563",
    marginBottom: "1.5rem",
  },
  confirmActions: {
    display: "flex",
    gap: "0.75rem",
    justifyContent: "flex-end",
  },
  confirmButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.5rem 1rem",
    backgroundColor: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "0.375rem",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "500",
    transition: "background-color 0.2s",
  },
  confirmButtonHover: {
    backgroundColor: "#dc2626",
  },
};

export const emptyStateStyles = {
  emptyState: {
    textAlign: "center",
    padding: "3rem",
  },
  emptyIcon: {
    margin: "0 auto 1rem",
    color: "#10b981",
  },
  emptyTitle: {
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: "0.5rem",
  },
  emptyText: {
    color: "#4b5563",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "0.5rem",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    padding: "1.5rem",
    marginBottom: "1.5rem",
  },
};
