import React, { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";

// Components
import Header from "./components/Header";
import EmptyState from "./components/EmptyState";
import UserTable from "./components/user-table/UserTable";
import Pagination from "./components/user-table/Pagination";
import AddUserModal from "./components/modals/AddUserModal";
import EditUserModal from "./components/modals/EditUserModal";
import DeleteConfirmModal from "./components/modals/DeleteConfirmModal";
import MarkReadConfirmModal from "./components/modals/MarkReadConfirmModal";

// Styles
import { styles } from "./styles/appStyles";

// API
import * as api from "./utils/api";

function App({ onAuthError }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [hoveredUrl, setHoveredUrl] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);

  // Modals
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [markingAsReadUser, setMarkingAsReadUser] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Set body styles on mount
  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.background =
      "linear-gradient(to bottom right, #eff6ff, #e0e7ff)";
    document.body.style.minHeight = "100vh";

    return () => {
      document.body.style.background = "";
      document.body.style.minHeight = "";
    };
  }, []);

  // Load users on mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.fetchUsers();
      setUsers(data);
    } catch (err) {
      if (err.message === "AUTHENTICATION_REQUIRED") {
        if (onAuthError) onAuthError();
        return;
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(users.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Loading state
  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={{ textAlign: "center" }}>
          <RefreshCw
            size={48}
            color="#4f46e5"
            style={{ margin: "0 auto 1rem" }}
          />
          <p style={styles.loadingText}>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.maxWidth}>
        {/* Header */}
        <Header
          usersCount={users.length}
          onAddClick={() => setShowAddModal(true)}
          hoveredButton={hoveredButton}
          setHoveredButton={setHoveredButton}
        />

        {/* Error message */}
        {error && <div style={styles.errorBox}>{error}</div>}

        {/* Empty state or table */}
        {users.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <UserTable
              users={currentUsers}
              hoveredRow={hoveredRow}
              setHoveredRow={setHoveredRow}
              hoveredButton={hoveredButton}
              setHoveredButton={setHoveredButton}
              hoveredUrl={hoveredUrl}
              setHoveredUrl={setHoveredUrl}
              onMarkAsRead={(user) => setMarkingAsReadUser(user)}
              onEdit={(user) => setEditingUser(user)}
              onDelete={(user) => setDeletingUser(user)}
            />

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                totalItems={users.length}
                onPageChange={handlePageChange}
                hoveredButton={hoveredButton}
                setHoveredButton={setHoveredButton}
                hoveredUrl={hoveredUrl}
                setHoveredUrl={setHoveredUrl}
              />
            )}
          </>
        )}

        {/* Add User Modal */}
        {showAddModal && (
          <AddUserModal
            onClose={() => setShowAddModal(false)}
            onSuccess={(newUser) => {
              setUsers([newUser, ...users]);
              setCurrentPage(1);
              setShowAddModal(false);
            }}
            onAuthError={onAuthError}
            hoveredButton={hoveredButton}
            setHoveredButton={setHoveredButton}
          />
        )}

        {/* Edit User Modal */}
        {editingUser && (
          <EditUserModal
            user={editingUser}
            onClose={() => setEditingUser(null)}
            onSuccess={(updatedUser) => {
              setUsers(
                users.map((u) => (u._id === updatedUser._id ? updatedUser : u)),
              );
              setEditingUser(null);
            }}
            onAuthError={onAuthError}
            hoveredButton={hoveredButton}
            setHoveredButton={setHoveredButton}
          />
        )}

        {/* Delete Confirmation */}
        {deletingUser && (
          <DeleteConfirmModal
            user={deletingUser}
            onClose={() => setDeletingUser(null)}
            onConfirm={async () => {
              await api.deleteUser(deletingUser._id);
              setUsers(users.filter((u) => u._id !== deletingUser._id));
              if (currentUsers.length === 1 && currentPage > 1) {
                setCurrentPage(currentPage - 1);
              }
              setDeletingUser(null);
            }}
            onAuthError={onAuthError}
            hoveredButton={hoveredButton}
            setHoveredButton={setHoveredButton}
          />
        )}

        {/* Mark as Read Confirmation */}
        {markingAsReadUser && (
          <MarkReadConfirmModal
            user={markingAsReadUser}
            onClose={() => setMarkingAsReadUser(null)}
            onConfirm={async () => {
              await api.markUserAsRead(markingAsReadUser._id);
              setUsers(users.filter((u) => u._id !== markingAsReadUser._id));
              if (currentUsers.length === 1 && currentPage > 1) {
                setCurrentPage(currentPage - 1);
              }
              setMarkingAsReadUser(null);
            }}
            onAuthError={onAuthError}
            hoveredButton={hoveredButton}
            setHoveredButton={setHoveredButton}
          />
        )}
      </div>
    </div>
  );
}

export default App;
