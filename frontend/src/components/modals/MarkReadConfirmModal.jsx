import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { confirmStyles, modalStyles } from '../../styles/appStyles';

export default function MarkReadConfirmModal({
  user,
  onClose,
  onConfirm,
  onAuthError,
  hoveredButton,
  setHoveredButton,
}) {
  const [marking, setMarking] = useState(false);

  const handleConfirm = async () => {
    setMarking(true);
    try {
      await onConfirm();
    } catch (err) {
      if (err.message === 'AUTHENTICATION_REQUIRED') {
        if (onAuthError) onAuthError();
        return;
      }
      alert(err.message || "Failed to mark user as read. Please try again.");
    } finally {
      setMarking(false);
    }
  };

  return (
    <div style={confirmStyles.confirmOverlay} onClick={onClose}>
      <div style={confirmStyles.confirmDialog} onClick={(e) => e.stopPropagation()}>
        <h3 style={confirmStyles.confirmTitle}>Mark as Read?</h3>
        <p style={confirmStyles.confirmMessage}>
          Are you sure you want to mark this user as read? It will be removed from your unread list.
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
              ...(hoveredButton === "cancel-mark" ? modalStyles.cancelButtonHover : {}),
            }}
            onMouseEnter={() => setHoveredButton("cancel-mark")}
            onMouseLeave={() => setHoveredButton(null)}
            disabled={marking}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            style={{
              ...modalStyles.saveButton,
              ...(hoveredButton === "confirm-mark" && !marking
                ? modalStyles.saveButtonHover
                : {}),
              ...(marking ? modalStyles.buttonDisabled : {}),
            }}
            onMouseEnter={() => setHoveredButton("confirm-mark")}
            onMouseLeave={() => setHoveredButton(null)}
            disabled={marking}
          >
            <CheckCircle size={20} />
            {marking ? "Marking..." : "Mark as Read"}
          </button>
        </div>
      </div>
    </div>
  );
}
