import React from 'react';
import { tableStyles } from '../../styles/appStyles';
import UserTableRow from './UserTableRow';

export default function UserTable({
  users,
  hoveredRow,
  setHoveredRow,
  hoveredButton,
  setHoveredButton,
  hoveredUrl,
  setHoveredUrl,
  onMarkAsRead,
  onEdit,
  onDelete,
}) {
  return (
    <div style={tableStyles.tableContainer}>
      <table style={tableStyles.table}>
        <thead style={tableStyles.thead}>
          <tr>
            <th style={tableStyles.th}>Username</th>
            <th style={tableStyles.th}>Url</th>
            <th style={{ ...tableStyles.th, textAlign: 'center' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <UserTableRow
              key={user._id}
              user={user}
              isHovered={hoveredRow === user._id}
              onMouseEnter={() => setHoveredRow(user._id)}
              onMouseLeave={() => setHoveredRow(null)}
              hoveredButton={hoveredButton}
              setHoveredButton={setHoveredButton}
              hoveredUrl={hoveredUrl}
              setHoveredUrl={setHoveredUrl}
              onMarkAsRead={onMarkAsRead}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
