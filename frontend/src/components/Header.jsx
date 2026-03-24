import React from 'react';
import { Plus } from 'lucide-react';
import { styles } from '../styles/appStyles';

export default function Header({ usersCount, viewMode, onViewModeChange, onAddClick, hoveredButton, setHoveredButton }) {
  return (
    <div style={styles.header}>
      <div>
        <h1 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#1f2937", margin: 0 }}>
          Users
        </h1>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
          <button
            onClick={() => onViewModeChange('unread')}
            style={{
              padding: '0.4rem 0.75rem',
              borderRadius: '0.35rem',
              border: viewMode === 'unread' ? '1px solid #4f46e5' : '1px solid #d1d5db',
              backgroundColor: viewMode === 'unread' ? '#eef2ff' : 'white',
              cursor: 'pointer',
            }}
          >
            Unread
          </button>
          <button
            onClick={() => onViewModeChange('read')}
            style={{
              padding: '0.4rem 0.75rem',
              borderRadius: '0.35rem',
              border: viewMode === 'read' ? '1px solid #4f46e5' : '1px solid #d1d5db',
              backgroundColor: viewMode === 'read' ? '#eef2ff' : 'white',
              cursor: 'pointer',
            }}
          >
            Read
          </button>
        </div>
        <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: "0.25rem 0 0 0" }}>
          {usersCount} total user{usersCount !== 1 ? 's' : ''}
        </p>
      </div>
      <button
        onClick={onAddClick}
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
  );
}
