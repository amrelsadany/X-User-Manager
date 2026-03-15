import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { confirmStyles, modalStyles } from '../../styles/appStyles';

export default function DeleteConfirmModal({
  user,
  onClose,
  onConfirm,
  onAuthError,
  hoveredButton,
  setHoveredButton,
}) {
  const [deleting, setDeleting] = useState(false);

  const handleConfirm = async () => {
    setDeleting(true);
    try {
      await onConfirm();
    } catch (err) {
      if (err.message === 'AUTHENTICATION_REQUIRED') {
        if (onAuthError) onAuthError();
        return;
      }
      alert(err.message || "Failed to delete user. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div style={confirmStyles.confirmOverlay} onClick={onClose}>
      <div style={confirmStyles.confirmDialog} onClick={(e) => e.stopPropagation()}>
        <h3 style={confirmStyles.confirmTitle}>Delete User?</h3>
        <p style={confirmStyles.confirmMessage}>
          Are you sure you want to delete this user? This action cannot be undone.
          <br /><br />
          <strong>{user.username || "Untitled User"}</strong>
          <br />
          <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>
            {user.url}
          </span>
        </p>
        <div style={confirmStyles.confirmActions}>
          <button
            onClick={onClose}
            style={{
              ...modalStyles.cancelButton,
              ...(hoveredButton === "cancel-delete" ? modalStyles.cancelButtonHover : {}),
            }}
            onMouseEnter={() => setHoveredButton("cancel-delete")}
            onMouseLeave={() => setHoveredButton(null)}
            disabled={deleting}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            style={{
              ...confirmStyles.confirmButton,
              ...(hoveredButton === "confirm-delete" && !deleting
                ? confirmStyles.confirmButtonHover
                : {}),
              ...(deleting ? modalStyles.buttonDisabled : {}),
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
  );
}
