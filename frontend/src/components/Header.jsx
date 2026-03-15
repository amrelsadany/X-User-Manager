import React from 'react';
import { Plus } from 'lucide-react';
import { styles } from '../styles/appStyles';

export default function Header({ usersCount, onAddClick, hoveredButton, setHoveredButton }) {
  return (
    <div style={styles.header}>
      <div>
        <h1 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#1f2937", margin: 0 }}>
          Saved Users
        </h1>
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
