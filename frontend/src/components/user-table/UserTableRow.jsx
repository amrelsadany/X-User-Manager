import React from 'react';
import { CheckCircle, Edit2, Trash2 } from 'lucide-react';
import { tableStyles } from '../../styles/appStyles';

export default function UserTableRow({
  user,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  hoveredButton,
  setHoveredButton,
  hoveredUrl,
  setHoveredUrl,
  onMarkAsRead,
  onEdit,
  onDelete,
}) {
  return (
    <tr
      style={{
        ...tableStyles.tr,
        ...(isHovered ? tableStyles.trHover : {}),
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <td style={tableStyles.td}>
        <div style={tableStyles.username}>
          {user.username || user.title || "Untitled"}
        </div>
      </td>
      <td style={tableStyles.td}>
        <a
          href={user.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{...tableStyles.url, ...(hoveredUrl === `url-${user._id}` ? tableStyles.urlHover : {})}}
          title={user.url}
          onMouseEnter={() => setHoveredUrl(`url-${user._id}`)}
            onMouseLeave={() => setHoveredUrl(null)}
        >
          {user.url}
        </a>
      </td>
      <td style={{ ...tableStyles.td, textAlign: 'center' }}>
        <div style={tableStyles.actionButtons}>
          {onMarkAsRead && (
            <button
              onClick={() => onMarkAsRead(user)}
              style={{
                ...tableStyles.iconButton,
                ...tableStyles.markButton,
                ...(hoveredButton === `mark-${user._id}` ? tableStyles.markButtonHover : {}),
              }}
              onMouseEnter={() => setHoveredButton(`mark-${user._id}`)}
              onMouseLeave={() => setHoveredButton(null)}
              title="Mark as read"
            >
              <CheckCircle size={18} />
              Mark as Read
            </button>
          )}
          <button
            onClick={() => onEdit(user)}
            style={{
              ...tableStyles.iconButton,
              ...tableStyles.editButton,
              ...(hoveredButton === `edit-${user._id}` ? tableStyles.editButtonHover : {}),
            }}
            onMouseEnter={() => setHoveredButton(`edit-${user._id}`)}
            onMouseLeave={() => setHoveredButton(null)}
            title="Edit"
          >
            <Edit2 size={18} />
            Edit User
          </button>
          <button
            onClick={() => onDelete(user)}
            style={{
              ...tableStyles.iconButton,
              ...tableStyles.deleteButton,
              ...(hoveredButton === `delete-${user._id}` ? tableStyles.deleteButtonHover : {}),
            }}
            onMouseEnter={() => setHoveredButton(`delete-${user._id}`)}
            onMouseLeave={() => setHoveredButton(null)}
            title="Delete"
          >
            <Trash2 size={18} />
            Delete User
          </button>
        </div>
      </td>
    </tr>
  );
}
