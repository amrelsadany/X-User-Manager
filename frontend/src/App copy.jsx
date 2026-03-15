import React, { useState, useEffect } from "react";
import {
  ExternalLink,
  CheckCircle,
  RefreshCw,
  Edit2,
  X,
  Save,
  Plus,
  Trash2,
} from "lucide-react";

const getApiBaseUrl = () => {
  const isDevelopment =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  if (isDevelopment) {
    return "http://localhost:3001/api";
  } else {
    return import.meta.env.VITE_API_BASE_URL || "https://your-project.vercel.app/api";
  }
};

const API_BASE_URL = getApiBaseUrl();

// Secure fetch wrapper with JWT token - FIXED to prevent infinite loop
const secureFetch = async (url, options = {}) => {
  const token = localStorage.getItem('authToken');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle authentication errors - DO NOT reload, just throw error
    if (response.status === 401 || response.status === 403) {
      // Clear invalid token
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      
      // Throw error instead of reloading
      // AuthenticatedApp will handle showing login screen
      throw new Error('AUTHENTICATION_REQUIRED');
    }

    if (response.status === 429) {
      throw new Error('Too many requests. Please try again later.');
    }

    return response;
  } catch (error) {
    // If it's our auth error, re-throw it
    if (error.message === 'AUTHENTICATION_REQUIRED') {
      throw error;
    }
    
    // Network errors
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Cannot connect to server. Please check if the backend is running.');
    }
    throw error;
  }
};

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(to bottom right, #eff6ff, #e0e7ff)",
    padding: "2rem 1rem",
    width: "100%",
    boxSizing: "border-box",
    justifyContent: "center",
    display: "flex",
    fontFamily: '"Inter", sans-serif',
  },
  maxWidth: {
    maxWidth: "56rem",
    margin: "0 auto",
    width: "100%",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "0.5rem",
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    padding: "1.5rem",
    marginBottom: "1.5rem",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "1rem",
  },
  title: {
    fontFamily: '"Montserrat", sans-serif',
    fontWeight: 700,
    fontSize: "1.3rem",
    color: "#1f2937",
    marginBottom: "0.5rem",
  },
  subtitle: {
    color: "#4b5563",
  },
  button: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.5rem 1rem",
    backgroundColor: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "0.5rem",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "background-color 0.2s",
  },
  buttonHover: {
    backgroundColor: "#4338ca",
  },
  buttonDisabled: {
    backgroundColor: "#9ca3af",
    cursor: "not-allowed",
  },
  addButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.5rem 1rem",
    backgroundColor: "#16a34a",
    color: "white",
    border: "none",
    borderRadius: "0.5rem",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "background-color 0.2s",
    fontFamily: '"Montserrat", sans-serif',
    fontWeight: 600,
  },
  addButtonHover: {
    backgroundColor: "#16a34a",
  },
  errorBox: {
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#991b1b",
    padding: "1rem",
    borderRadius: "0.5rem",
    marginBottom: "1.5rem",
  },
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
  linkCard: {
    backgroundColor: "white",
    borderRadius: "0.5rem",
    boxShadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    marginBottom: "1rem",
    transition: "all 0.3s",
  },
  linkCardHover: {
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  },
  linkContent: {
    padding: "1.5rem",
  },
  linkFlex: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "1rem",
    flexWrap: "wrap",
  },
  linkInfo: {
    flex: 1,
    minWidth: 0,
  },
  linkTitleRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    marginBottom: "0.5rem",
  },
  linkIcon: {
    color: "#4f46e5",
    flexShrink: 0,
  },
  linkTitle: {
    fontSize: "1.125rem",
    fontWeight: "600",
    color: "#1f2937",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  linkUrl: {
    color: "#4f46e5",
    textDecoration: "none",
    wordBreak: "break-all",
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: "0.90rem",
    letterSpacing: '-0.02em',
    fontWeight: "700"
  },
  markButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.5rem 1rem",
    backgroundColor: "#16a34a",
    color: "white",
    border: "none",
    borderRadius: "0.5rem",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "background-color 0.2s",
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  markButtonHover: {
    backgroundColor: "#15803d",
  },
  loadingContainer: {
    minHeight: "100vh",
    background: "linear-gradient(to bottom right, #eff6ff, #e0e7ff)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContent: {
    textAlign: "center",
  },
  loadingText: {
    color: "#4b5563",
    fontSize: "1.125rem",
  },
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
    boxShadow:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
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
    boxShadow:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
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
  buttonGroup: {
  display: 'flex',
  gap: '1rem',
  flexShrink: 0,               // Prevents the buttons from getting squashed
  alignItems: 'center',
}
};

function App({ onAuthError }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ username: "", url: "", userId: "" });
  const [saving, setSaving] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ username: "", url: "", userId: "" });
  const [adding, setAdding] = useState(false);

  const [deletingUser, setDeletingUser] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [markingAsReadUser, setMarkingAsReadUser] = useState(null);
  const [markingAsRead, setMarkingAsRead] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await secureFetch(`${API_BASE_URL}/users`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch users');
      }
      
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      // If authentication error, notify parent to show login
      if (err.message === 'AUTHENTICATION_REQUIRED') {
        if (onAuthError) onAuthError();
        return;
      }
      
      setError(err.message);
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsOpenedClick = (user) => {
    setMarkingAsReadUser(user);
  };

  const handleCancelMarkAsRead = () => {
    setMarkingAsReadUser(null);
  };

  const handleConfirmMarkAsRead = async () => {
    if (!markingAsReadUser) return;

    const userId = markingAsReadUser._id;
    setMarkingAsRead(true);

    try {
      const response = await secureFetch(`${API_BASE_URL}/users/${userId}/mark-read`, {
        method: "POST",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to mark user as read');
      }

      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      handleCancelMarkAsRead();
    } catch (err) {
      if (err.message === 'AUTHENTICATION_REQUIRED') {
        if (onAuthError) onAuthError();
        return;
      }
      console.error("Error marking user as read:", err);
      alert(err.message || "Failed to mark user as read. Please try again.");
    } finally {
      setMarkingAsRead(false);
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setEditForm({
      username: user.username || "",
      url: user.url || "",
      userId: user.userId || "",
    });
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditForm({ username: "", url: "", userId: "" });
  };

  const handleSaveEdit = async () => {
    if (!editForm.url.trim()) {
      alert("URL is required");
      return;
    }

    setSaving(true);

    try {
      const response = await secureFetch(`${API_BASE_URL}/users/${editingUser._id}`, {
        method: "PUT",
        body: JSON.stringify(editForm),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update user");
      }

      const data = await response.json();

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === editingUser._id ? data.user : user
        )
      );

      handleCancelEdit();
    } catch (err) {
      if (err.message === 'AUTHENTICATION_REQUIRED') {
        if (onAuthError) onAuthError();
        return;
      }
      console.error("Error updating user:", err);
      alert(err.message || "Failed to update user. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddClick = () => {
    setShowAddModal(true);
    setAddForm({ username: "", url: "", userId: "" });
  };

  const handleCancelAdd = () => {
    setShowAddModal(false);
    setAddForm({ username: "", url: "", userId: "" });
  };

  const handleSaveAdd = async () => {
    if (!addForm.url.trim()) {
      alert("URL is required");
      return;
    }

    setAdding(true);

    try {
      const response = await secureFetch(`${API_BASE_URL}/users`, {
        method: "POST",
        body: JSON.stringify(addForm),
      });

      if (!response.ok) {
        const data = await response.json();

        if (response.status === 409) {
          alert(
            `This URL already exists!\n\nExisting user: ${
              data.existingUser.username || "Untitled"
            }\nURL: ${data.existingUser.url}`
          );
        } else {
          throw new Error(data.error || "Failed to create user");
        }
        return;
      }

      const data = await response.json();
      setUsers((prevUsers) => [data.user, ...prevUsers]);
      handleCancelAdd();
    } catch (err) {
      if (err.message === 'AUTHENTICATION_REQUIRED') {
        if (onAuthError) onAuthError();
        return;
      }
      console.error("Error creating user:", err);
      alert(err.message || "Failed to create user. Please try again.");
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteClick = (user) => {
    setDeletingUser(user);
  };

  const handleCancelDelete = () => {
    setDeletingUser(null);
  };

  const handleConfirmDelete = async () => {
    if (!deletingUser) return;

    setDeleting(true);

    try {
      const response = await secureFetch(`${API_BASE_URL}/users/${deletingUser._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete user');
      }

      setUsers((prevUsers) =>
        prevUsers.filter((user) => user._id !== deletingUser._id)
      );
      handleCancelDelete();
    } catch (err) {
      if (err.message === 'AUTHENTICATION_REQUIRED') {
        if (onAuthError) onAuthError();
        return;
      }
      console.error("Error deleting user:", err);
      alert(err.message || "Failed to delete user. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingContent}>
          <RefreshCw size={48} color="#4f46e5" style={{ margin: "0 auto 1rem" }} />
          <p style={styles.loadingText}>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.maxWidth}>
        <div style={styles.card}>
          <div style={styles.header}>
            <div>
              <h1 style={styles.title}>Actions</h1>
              
            </div>
            <button
              onClick={handleAddClick}
              style={{
                ...styles.addButton,
                ...(hoveredButton === "add" ? styles.addButtonHover : {}),
              }}
              onMouseEnter={() => setHoveredButton("add")}
              onMouseLeave={() => setHoveredButton(null)}
            >
              <Plus size={20} />
              Add User
            </button>
          </div>
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}

        {users.length === 0 ? (
          <div style={styles.card}>
            <div style={styles.emptyState}>
              <CheckCircle size={64} style={styles.emptyIcon} />
              <h2 style={styles.emptyTitle}>All Caught Up!</h2>
              <p style={styles.emptyText}>
                No unread users. Add new ones using the button above.
              </p>
            </div>
          </div>
        ) : (
          users.map((user) => (
            <div
              key={user._id}
              style={{
                ...styles.linkCard,
                ...(hoveredCard === user._id ? styles.linkCardHover : {}),
              }}
              onMouseEnter={() => setHoveredCard(user._id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={styles.linkContent}>
                <div style={styles.linkFlex}>
                  <div style={styles.linkInfo}>
                    <div style={styles.linkTitleRow}>
                      <ExternalLink size={20} style={styles.linkIcon} />
                      <h3 style={styles.linkTitle}>
                        {user.username || user.title || "Untitled User"}
                      </h3>
                    </div>
                    <a
                      href={user.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={styles.linkUrl}
                    >
                      {user.url}
                    </a>
                    {user.userId && (
                      <p style={{ color: "#6b7280", marginTop: "0.25rem", fontSize: "0.75rem" }}>
                        ID: {user.userId}
                      </p>
                    )}
                  </div>
                  <div style={styles.buttonGroup}>
                    <button
                      onClick={() => handleMarkAsOpenedClick(user)}
                      style={{
                        ...styles.markButton,
                        ...(hoveredButton === `mark-${user._id}`
                          ? styles.markButtonHover
                          : {}),
                      }}
                      onMouseEnter={() => setHoveredButton(`mark-${user._id}`)}
                      onMouseLeave={() => setHoveredButton(null)}
                    >
                      <CheckCircle size={18} />
                      Mark as Read
                    </button>
                    <button
                      onClick={() => handleEditClick(user)}
                      style={{
                        ...styles.button,
                        ...(hoveredButton === `edit-${user._id}`
                          ? styles.buttonHover
                          : {}),
                      }}
                      onMouseEnter={() => setHoveredButton(`edit-${user._id}`)}
                      onMouseLeave={() => setHoveredButton(null)}
                    >
                      <Edit2 size={18} />
                      Edit User
                    </button>
                    <button
                      onClick={() => handleDeleteClick(user)}
                      style={{
                        ...styles.button,
                        backgroundColor: "#ef4444",
                        ...(hoveredButton === `delete-${user._id}`
                          ? { backgroundColor: "#dc2626" }
                          : {}),
                      }}
                      onMouseEnter={() => setHoveredButton(`delete-${user._id}`)}
                      onMouseLeave={() => setHoveredButton(null)}
                    >
                      <Trash2 size={18} />
                      Delete User
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}

        {/* Edit Modal */}
        {editingUser && (
          <div style={styles.modalOverlay} onClick={handleCancelEdit}>
            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>Edit User</h2>
                <button
                  onClick={handleCancelEdit}
                  style={{
                    ...styles.closeButton,
                    ...(hoveredButton === "close-edit" ? styles.closeButtonHover : {}),
                  }}
                  onMouseEnter={() => setHoveredButton("close-edit")}
                  onMouseLeave={() => setHoveredButton(null)}
                >
                  <X size={24} />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveEdit();
                }}
              >
                <div style={styles.formGroup}>
                  <label style={styles.label}>Username</label>
                  <input
                    type="text"
                    value={editForm.username}
                    onChange={(e) =>
                      setEditForm({ ...editForm, username: e.target.value })
                    }
                    style={{
                      ...styles.input,
                      ...(focusedInput === "edit-username" ? styles.inputFocus : {}),
                    }}
                    onFocus={() => setFocusedInput("edit-username")}
                    onBlur={() => setFocusedInput(null)}
                    placeholder="Enter username"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>URL *</label>
                  <input
                    type="url"
                    value={editForm.url}
                    onChange={(e) =>
                      setEditForm({ ...editForm, url: e.target.value })
                    }
                    style={{
                      ...styles.input,
                      ...(focusedInput === "edit-url" ? styles.inputFocus : {}),
                    }}
                    onFocus={() => setFocusedInput("edit-url")}
                    onBlur={() => setFocusedInput(null)}
                    placeholder="https://example.com"
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>User ID</label>
                  <input
                    type="text"
                    value={editForm.userId}
                    onChange={(e) =>
                      setEditForm({ ...editForm, userId: e.target.value })
                    }
                    style={{
                      ...styles.input,
                      ...(focusedInput === "edit-userId" ? styles.inputFocus : {}),
                    }}
                    onFocus={() => setFocusedInput("edit-userId")}
                    onBlur={() => setFocusedInput(null)}
                    placeholder="Optional user ID"
                  />
                </div>

                <div style={styles.modalActions}>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    style={{
                      ...styles.cancelButton,
                      ...(hoveredButton === "cancel" ? styles.cancelButtonHover : {}),
                    }}
                    onMouseEnter={() => setHoveredButton("cancel")}
                    onMouseLeave={() => setHoveredButton(null)}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      ...styles.saveButton,
                      ...(hoveredButton === "save" && !saving ? styles.saveButtonHover : {}),
                      ...(saving ? styles.buttonDisabled : {}),
                    }}
                    onMouseEnter={() => setHoveredButton("save")}
                    onMouseLeave={() => setHoveredButton(null)}
                    disabled={saving}
                  >
                    <Save size={20} />
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Modal */}
        {showAddModal && (
          <div style={styles.modalOverlay} onClick={handleCancelAdd}>
            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>Add New User</h2>
                <button
                  onClick={handleCancelAdd}
                  style={{
                    ...styles.closeButton,
                    ...(hoveredButton === "close-add" ? styles.closeButtonHover : {}),
                  }}
                  onMouseEnter={() => setHoveredButton("close-add")}
                  onMouseLeave={() => setHoveredButton(null)}
                >
                  <X size={24} />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveAdd();
                }}
              >
                <div style={styles.formGroup}>
                  <label style={styles.label}>Username</label>
                  <input
                    type="text"
                    value={addForm.username}
                    onChange={(e) =>
                      setAddForm({ ...addForm, username: e.target.value })
                    }
                    style={{
                      ...styles.input,
                      ...(focusedInput === "add-username" ? styles.inputFocus : {}),
                    }}
                    onFocus={() => setFocusedInput("add-username")}
                    onBlur={() => setFocusedInput(null)}
                    placeholder="Enter username"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>URL *</label>
                  <input
                    type="url"
                    value={addForm.url}
                    onChange={(e) =>
                      setAddForm({ ...addForm, url: e.target.value })
                    }
                    style={{
                      ...styles.input,
                      ...(focusedInput === "add-url" ? styles.inputFocus : {}),
                    }}
                    onFocus={() => setFocusedInput("add-url")}
                    onBlur={() => setFocusedInput(null)}
                    placeholder="https://example.com"
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>User ID</label>
                  <input
                    type="text"
                    value={addForm.userId}
                    onChange={(e) =>
                      setAddForm({ ...addForm, userId: e.target.value })
                    }
                    style={{
                      ...styles.input,
                      ...(focusedInput === "add-userId" ? styles.inputFocus : {}),
                    }}
                    onFocus={() => setFocusedInput("add-userId")}
                    onBlur={() => setFocusedInput(null)}
                    placeholder="Optional user ID"
                  />
                </div>

                <div style={styles.modalActions}>
                  <button
                    type="button"
                    onClick={handleCancelAdd}
                    style={{
                      ...styles.cancelButton,
                      ...(hoveredButton === "cancel-add" ? styles.cancelButtonHover : {}),
                    }}
                    onMouseEnter={() => setHoveredButton("cancel-add")}
                    onMouseLeave={() => setHoveredButton(null)}
                    disabled={adding}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      ...styles.saveButton,
                      ...(hoveredButton === "save-add" && !adding ? styles.saveButtonHover : {}),
                      ...(adding ? styles.buttonDisabled : {}),
                    }}
                    onMouseEnter={() => setHoveredButton("save-add")}
                    onMouseLeave={() => setHoveredButton(null)}
                    disabled={adding}
                  >
                    <Plus size={20} />
                    {adding ? "Adding..." : "Add User"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation */}
        {deletingUser && (
          <div style={styles.confirmOverlay} onClick={handleCancelDelete}>
            <div style={styles.confirmDialog} onClick={(e) => e.stopPropagation()}>
              <h3 style={styles.confirmTitle}>Delete User?</h3>
              <p style={styles.confirmMessage}>
                Are you sure you want to delete this user? This action cannot be undone.
                <br /><br />
                <strong>{deletingUser.username || "Untitled User"}</strong>
                <br />
                <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                  {deletingUser.url}
                </span>
              </p>
              <div style={styles.confirmActions}>
                <button
                  onClick={handleCancelDelete}
                  style={{
                    ...styles.cancelButton,
                    ...(hoveredButton === "cancel-delete" ? styles.cancelButtonHover : {}),
                  }}
                  onMouseEnter={() => setHoveredButton("cancel-delete")}
                  onMouseLeave={() => setHoveredButton(null)}
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  style={{
                    ...styles.confirmButton,
                    ...(hoveredButton === "confirm-delete" && !deleting
                      ? styles.confirmButtonHover
                      : {}),
                    ...(deleting ? styles.buttonDisabled : {}),
                  }}
                  onMouseEnter={() => setHoveredButton("confirm-delete")}
                  onMouseLeave={() => setHoveredButton(null)}
                  disabled={deleting}
                >
                  <Trash2 size={20} />
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mark as Read Confirmation */}
        {markingAsReadUser && (
          <div style={styles.confirmOverlay} onClick={handleCancelMarkAsRead}>
            <div style={styles.confirmDialog} onClick={(e) => e.stopPropagation()}>
              <h3 style={styles.confirmTitle}>Mark as Read?</h3>
              <p style={styles.confirmMessage}>
                Are you sure you want to mark this user as read? It will be removed from your unread list.
                <br /><br />
                <strong>{markingAsReadUser.username || "Untitled User"}</strong>
                <br />
                <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                  {markingAsReadUser.url}
                </span>
              </p>
              <div style={styles.confirmActions}>
                <button
                  onClick={handleCancelMarkAsRead}
                  style={{
                    ...styles.cancelButton,
                    ...(hoveredButton === "cancel-mark" ? styles.cancelButtonHover : {}),
                  }}
                  onMouseEnter={() => setHoveredButton("cancel-mark")}
                  onMouseLeave={() => setHoveredButton(null)}
                  disabled={markingAsRead}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmMarkAsRead}
                  style={{
                    ...styles.saveButton,
                    ...(hoveredButton === "confirm-mark" && !markingAsRead
                      ? styles.saveButtonHover
                      : {}),
                    ...(markingAsRead ? styles.buttonDisabled : {}),
                  }}
                  onMouseEnter={() => setHoveredButton("confirm-mark")}
                  onMouseLeave={() => setHoveredButton(null)}
                  disabled={markingAsRead}
                >
                  <CheckCircle size={20} />
                  {markingAsRead ? "Marking..." : "Mark as Read"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;