import React from 'react';
import { CheckCircle } from 'lucide-react';
import { emptyStateStyles } from '../styles/appStyles';

export default function EmptyState() {
  return (
    <div style={emptyStateStyles.card}>
      <div style={emptyStateStyles.emptyState}>
        <CheckCircle size={64} style={emptyStateStyles.emptyIcon} />
        <h2 style={emptyStateStyles.emptyTitle}>All Caught Up!</h2>
        <p style={emptyStateStyles.emptyText}>
          No unread users. Add new ones using the button above.
        </p>
      </div>
    </div>
  );
}
