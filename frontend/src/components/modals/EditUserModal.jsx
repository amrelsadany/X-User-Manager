import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { modalStyles } from '../../styles/appStyles';
import * as api from '../../utils/api';

export default function EditUserModal({
  user,
  onClose,
  onSuccess,
  onAuthError,
  hoveredButton,
  setHoveredButton,
}) {
  const [formData, setFormData] = useState({
    username: user.username || "",
    url: user.url || "",
    userId: user.userId || "",
  });
  const [saving, setSaving] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.url.trim()) {
      alert("URL is required");
      return;
    }

    setSaving(true);

    try {
      const data = await api.updateUser(user._id, formData);
      onSuccess(data.user);
    } catch (err) {
      if (err.message === 'AUTHENTICATION_REQUIRED') {
        if (onAuthError) onAuthError();
        return;
      }
      alert(err.message || "Failed to update user. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={modalStyles.modalOverlay} onClick={onClose}>
      <div style={modalStyles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div style={modalStyles.modalHeader}>
          <h2 style={modalStyles.modalTitle}>Edit User</h2>
          <button
            onClick={onClose}
            style={{
              ...modalStyles.closeButton,
              ...(hoveredButton === "close-edit" ? modalStyles.closeButtonHover : {}),
            }}
            onMouseEnter={() => setHoveredButton("close-edit")}
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
                ...(focusedInput === "edit-username" ? modalStyles.inputFocus : {}),
              }}
              onFocus={() => setFocusedInput("edit-username")}
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
                ...(focusedInput === "edit-url" ? modalStyles.inputFocus : {}),
              }}
              onFocus={() => setFocusedInput("edit-url")}
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
                ...(focusedInput === "edit-userId" ? modalStyles.inputFocus : {}),
              }}
              onFocus={() => setFocusedInput("edit-userId")}
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
                ...(hoveredButton === "cancel-edit" ? modalStyles.cancelButtonHover : {}),
              }}
              onMouseEnter={() => setHoveredButton("cancel-edit")}
              onMouseLeave={() => setHoveredButton(null)}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                ...modalStyles.saveButton,
                ...(hoveredButton === "save-edit" && !saving ? modalStyles.saveButtonHover : {}),
                ...(saving ? modalStyles.buttonDisabled : {}),
              }}
              onMouseEnter={() => setHoveredButton("save-edit")}
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
  );
}
