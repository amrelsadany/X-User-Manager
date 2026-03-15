import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { modalStyles } from '../../styles/appStyles';
import * as api from '../../utils/api';

export default function AddUserModal({
  onClose,
  onSuccess,
  onAuthError,
  hoveredButton,
  setHoveredButton,
}) {
  const [formData, setFormData] = useState({ username: "", url: "", userId: "" });
  const [adding, setAdding] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.url.trim()) {
      alert("URL is required");
      return;
    }

    setAdding(true);

    try {
      const data = await api.createUser(formData);
      onSuccess(data.user);
    } catch (err) {
      if (err.message === 'AUTHENTICATION_REQUIRED') {
        if (onAuthError) onAuthError();
        return;
      }
      
      if (err.message === 'URL_ALREADY_EXISTS') {
        alert(
          `This URL already exists!\n\nExisting user: ${
            err.existingUser.username || "Untitled"
          }\nURL: ${err.existingUser.url}`
        );
      } else {
        alert(err.message || "Failed to create user. Please try again.");
      }
    } finally {
      setAdding(false);
    }
  };

  return (
    <div style={modalStyles.modalOverlay} onClick={onClose}>
      <div style={modalStyles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div style={modalStyles.modalHeader}>
          <h2 style={modalStyles.modalTitle}>Add New User</h2>
          <button
            onClick={onClose}
            style={{
              ...modalStyles.closeButton,
              ...(hoveredButton === "close-add" ? modalStyles.closeButtonHover : {}),
            }}
            onMouseEnter={() => setHoveredButton("close-add")}
            onMouseLeave={() => setHoveredButton(null)}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={modalStyles.formGroup}>
            <label style={modalStyles.label}>Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              style={{
                ...modalStyles.input,
                ...(focusedInput === "add-username" ? modalStyles.inputFocus : {}),
              }}
              onFocus={() => setFocusedInput("add-username")}
              onBlur={() => setFocusedInput(null)}
              placeholder="Enter username"
            />
          </div>

          <div style={modalStyles.formGroup}>
            <label style={modalStyles.label}>URL *</label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              style={{
                ...modalStyles.input,
                ...(focusedInput === "add-url" ? modalStyles.inputFocus : {}),
              }}
              onFocus={() => setFocusedInput("add-url")}
              onBlur={() => setFocusedInput(null)}
              placeholder="https://example.com"
              required
            />
          </div>

          <div style={modalStyles.formGroup}>
            <label style={modalStyles.label}>User ID</label>
            <input
              type="text"
              value={formData.userId}
              onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
              style={{
                ...modalStyles.input,
                ...(focusedInput === "add-userId" ? modalStyles.inputFocus : {}),
              }}
              onFocus={() => setFocusedInput("add-userId")}
              onBlur={() => setFocusedInput(null)}
              placeholder="Optional user ID"
            />
          </div>

          <div style={modalStyles.modalActions}>
            <button
              type="button"
              onClick={onClose}
              style={{
                ...modalStyles.cancelButton,
                ...(hoveredButton === "cancel-add" ? modalStyles.cancelButtonHover : {}),
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
                ...modalStyles.saveButton,
                ...(hoveredButton === "save-add" && !adding ? modalStyles.saveButtonHover : {}),
                ...(adding ? modalStyles.buttonDisabled : {}),
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
  );
}
