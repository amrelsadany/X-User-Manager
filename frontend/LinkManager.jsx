import React, { useState, useEffect } from 'react';
import { ExternalLink, CheckCircle, RefreshCw, Edit2, X, Save, Plus, Trash2 } from 'lucide-react';

// Environment-aware API configuration
const getApiBaseUrl = () => {
  const isDevelopment = window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1';
  
  if (isDevelopment) {
    // Local Express server
    return 'http://localhost:3001/api';
  } else {
    // Serverless backend on Vercel - UPDATE THIS WITH YOUR VERCEL URL
    return 'https://your-project.vercel.app/api';
  }
};

const API_BASE_URL = getApiBaseUrl();

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom right, #eff6ff, #e0e7ff)',
    padding: '2rem 1rem',
  },
  maxWidth: {
    maxWidth: '56rem',
    margin: '0 auto',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    padding: '1.5rem',
    marginBottom: '1.5rem',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  title: {
    fontSize: '1.875rem',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '0.5rem',
  },
  subtitle: {
    color: '#4b5563',
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.2s',
  },
  buttonHover: {
    backgroundColor: '#4338ca',
  },
  buttonDisabled: {
    backgroundColor: '#9ca3af',
    cursor: 'not-allowed',
  },
  addButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.2s',
  },
  addButtonHover: {
    backgroundColor: '#059669',
  },
  errorBox: {
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#991b1b',
    padding: '1rem',
    borderRadius: '0.5rem',
    marginBottom: '1.5rem',
  },
  emptyState: {
    textAlign: 'center',
    padding: '3rem',
  },
  emptyIcon: {
    margin: '0 auto 1rem',
    color: '#10b981',
  },
  emptyTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '0.5rem',
  },
  emptyText: {
    color: '#4b5563',
  },
  linkCard: {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    marginBottom: '1rem',
    transition: 'all 0.3s',
  },
  linkCardHover: {
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  },
  linkCardProcessing: {
    opacity: 0.5,
    transform: 'scale(0.95)',
  },
  linkContent: {
    padding: '1.5rem',
  },
  linkFlex: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  linkInfo: {
    flex: 1,
    minWidth: 0,
  },
  linkTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.5rem',
  },
  linkIcon: {
    color: '#4f46e5',
    flexShrink: 0,
  },
  linkTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#1f2937',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  linkUrl: {
    color: '#4f46e5',
    textDecoration: 'none',
    fontSize: '0.875rem',
    wordBreak: 'break-all',
  },
  linkUrlHover: {
    color: '#4338ca',
    textDecoration: 'underline',
  },
  userId: {
    color: '#6b7280',
    marginTop: '0.25rem',
    fontSize: '0.75rem',
  },
  description: {
    color: '#4b5563',
    marginTop: '0.5rem',
    fontSize: '0.875rem',
  },
  markButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#16a34a',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.2s',
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  markButtonHover: {
    backgroundColor: '#15803d',
  },
  loadingContainer: {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom right, #eff6ff, #e0e7ff)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContent: {
    textAlign: 'center',
  },
  loadingText: {
    color: '#4b5563',
    fontSize: '1.125rem',
  },
  spin: {
    animation: 'spin 1s linear infinite',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1rem',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    padding: '2rem',
    maxWidth: '500px',
    width: '100%',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1.5rem',
  },
  modalTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#1f2937',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0.5rem',
    color: '#6b7280',
    borderRadius: '0.25rem',
    transition: 'all 0.2s',
  },
  closeButtonHover: {
    backgroundColor: '#f3f4f6',
    color: '#1f2937',
  },
  formGroup: {
    marginBottom: '1rem',
  },
  label: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '0.5rem',
  },
  input: {
    width: '100%',
    padding: '0.5rem 0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    fontSize: '1rem',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  },
  inputFocus: {
    outline: 'none',
    borderColor: '#4f46e5',
    boxShadow: '0 0 0 3px rgba(79, 70, 229, 0.1)',
  },
  modalActions: {
    display: 'flex',
    gap: '0.75rem',
    justifyContent: 'flex-end',
    marginTop: '1.5rem',
  },
  cancelButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: 'none',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '500',
    transition: 'background-color 0.2s',
  },
  cancelButtonHover: {
    backgroundColor: '#e5e7eb',
  },
  saveButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '500',
    transition: 'background-color 0.2s',
  },
  saveButtonHover: {
    backgroundColor: '#4338ca',
  },
  editButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#f59e0b',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.2s',
    flexShrink: 0,
    whiteSpace: 'nowrap',
    marginRight: '0.5rem',
  },
  editButtonHover: {
    backgroundColor: '#d97706',
  },
  deleteButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.2s',
    flexShrink: 0,
    whiteSpace: 'nowrap',
    marginRight: '0.5rem',
  },
  deleteButtonHover: {
    backgroundColor: '#dc2626',
  },
  confirmOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1100,
    padding: '1rem',
  },
  confirmDialog: {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    padding: '1.5rem',
    maxWidth: '400px',
    width: '100%',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  confirmTitle: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '0.75rem',
  },
  confirmMessage: {
    color: '#4b5563',
    marginBottom: '1.5rem',
    lineHeight: '1.5',
  },
  confirmActions: {
    display: 'flex',
    gap: '0.75rem',
    justifyContent: 'flex-end',
  },
  confirmButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '500',
    transition: 'background-color 0.2s',
  },
  confirmButtonHover: {
    backgroundColor: '#dc2626',
  },
};

export default function LinkManager() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  
  // Edit modal state
  const [editingLink, setEditingLink] = useState(null);
  const [editForm, setEditForm] = useState({ username: '', url: '', userId: '' });
  const [saving, setSaving] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  
  // Add new link modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ username: '', url: '', userId: '' });
  const [adding, setAdding] = useState(false);
  
  // Delete confirmation state
  const [deletingLink, setDeletingLink] = useState(null);
  const [deleting, setDeleting] = useState(false);
  
  // Mark as read confirmation state
  const [markingAsReadLink, setMarkingAsReadLink] = useState(null);
  const [markingAsRead, setMarkingAsRead] = useState(false);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/links`);
      if (!response.ok) throw new Error('Failed to fetch links');
      const data = await response.json();
      setLinks(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching links:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsOpenedClick = (link) => {
    setMarkingAsReadLink(link);
  };

  const handleCancelMarkAsRead = () => {
    setMarkingAsReadLink(null);
  };

  const handleConfirmMarkAsRead = async () => {
    if (!markingAsReadLink) return;

    const linkId = markingAsReadLink._id;
    setMarkingAsRead(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/links/${linkId}/mark-opened`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Failed to mark link as opened');
      
      // Remove the link from the list
      setLinks(prevLinks => prevLinks.filter(link => link._id !== linkId));
      
      handleCancelMarkAsRead();
      
    } catch (err) {
      console.error('Error marking link as opened:', err);
      alert('Failed to mark link as opened. Please try again.');
    } finally {
      setMarkingAsRead(false);
    }
  };

  const handleEditClick = (link) => {
    setEditingLink(link);
    setEditForm({
      username: link.username || '',
      url: link.url || '',
      userId: link.userId || ''
    });
  };

  const handleCancelEdit = () => {
    setEditingLink(null);
    setEditForm({ username: '', url: '', userId: '' });
  };

  const handleSaveEdit = async () => {
    if (!editForm.url.trim()) {
      alert('URL is required');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/links/${editingLink._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: editForm.username,
          url: editForm.url,
          userId: editForm.userId || null
        })
      });

      if (!response.ok) throw new Error('Failed to update link');

      const data = await response.json();
      
      // Update the link in the local state
      setLinks(prevLinks => 
        prevLinks.map(link => 
          link._id === editingLink._id ? data.link : link
        )
      );

      handleCancelEdit();
    } catch (err) {
      console.error('Error updating link:', err);
      alert('Failed to update link. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddClick = () => {
    setShowAddModal(true);
    setAddForm({ username: '', url: '', userId: '' });
  };

  const handleCancelAdd = () => {
    setShowAddModal(false);
    setAddForm({ username: '', url: '', userId: '' });
  };

  const handleSaveAdd = async () => {
    if (!addForm.url.trim()) {
      alert('URL is required');
      return;
    }

    setAdding(true);
    try {
      const response = await fetch(`${API_BASE_URL}/links`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: addForm.username,
          url: addForm.url,
          userId: addForm.userId || null
        })
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          // Duplicate URL error
          alert(`This URL already exists!\n\nExisting link: ${data.existingLink.username || 'Untitled'}\nURL: ${data.existingLink.url}`);
        } else {
          throw new Error(data.error || 'Failed to create link');
        }
        return;
      }
      
      // Add the new link to the local state
      setLinks(prevLinks => [data.link, ...prevLinks]);

      handleCancelAdd();
    } catch (err) {
      console.error('Error creating link:', err);
      alert('Failed to create link. Please try again.');
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteClick = (link) => {
    setDeletingLink(link);
  };

  const handleCancelDelete = () => {
    setDeletingLink(null);
  };

  const handleConfirmDelete = async () => {
    if (!deletingLink) return;

    setDeleting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/links/${deletingLink._id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete link');

      // Remove the link from the local state
      setLinks(prevLinks => prevLinks.filter(link => link._id !== deletingLink._id));

      handleCancelDelete();
    } catch (err) {
      console.error('Error deleting link:', err);
      alert('Failed to delete link. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
        <div style={styles.loadingContent}>
          <div style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>
            <RefreshCw size={48} color="#4f46e5" />
          </div>
          <p style={styles.loadingText}>Loading your links...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      <div style={styles.maxWidth}>
        <div style={styles.card}>
          <div style={styles.header}>
            <div>
              <h1 style={styles.title}>Link Manager</h1>
              <p style={styles.subtitle}>
                {links.length} unread {links.length === 1 ? 'link' : 'links'}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                onClick={handleAddClick}
                style={{
                  ...styles.addButton,
                  ...(hoveredButton === 'add' ? styles.addButtonHover : {})
                }}
                onMouseEnter={() => setHoveredButton('add')}
                onMouseLeave={() => setHoveredButton(null)}
              >
                <Plus size={20} />
                Add New Link
              </button>
              <button
                onClick={fetchLinks}
                disabled={loading}
                style={{
                  ...styles.button,
                  ...(loading ? styles.buttonDisabled : {}),
                  ...(hoveredButton === 'refresh' && !loading ? styles.buttonHover : {})
                }}
                onMouseEnter={() => setHoveredButton('refresh')}
                onMouseLeave={() => setHoveredButton(null)}
              >
                <RefreshCw size={20} style={loading ? { animation: 'spin 1s linear infinite' } : {}} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div style={styles.errorBox}>
            <p style={{ fontWeight: '500', margin: 0 }}>Error: {error}</p>
          </div>
        )}

        {links.length === 0 ? (
          <div style={{ ...styles.card, ...styles.emptyState }}>
            <CheckCircle size={64} style={styles.emptyIcon} />
            <h2 style={styles.emptyTitle}>All caught up!</h2>
            <p style={styles.emptyText}>You have no unread links.</p>
          </div>
        ) : (
          <div>
            {links.map((link) => {
              return (
                <div
                  key={link._id}
                  style={{
                    ...styles.linkCard,
                    ...(hoveredCard === link._id ? styles.linkCardHover : {})
                  }}
                  onMouseEnter={() => setHoveredCard(link._id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div style={styles.linkContent}>
                    <div style={styles.linkFlex}>
                      <div style={styles.linkInfo}>
                        <div style={styles.linkTitleRow}>
                          <ExternalLink size={20} style={styles.linkIcon} />
                          <h3 style={styles.linkTitle}>
                            {link.username || link.title || 'Untitled Link'}
                          </h3>
                        </div>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={styles.linkUrl}
                        >
                          {link.url}
                        </a>
                        {link.userId && (
                          <p style={styles.userId}>User ID: {link.userId}</p>
                        )}
                        {link.description && (
                          <p style={styles.description}>{link.description}</p>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => handleDeleteClick(link)}
                          style={{
                            ...styles.deleteButton,
                            ...(hoveredButton === `delete-${link._id}` ? styles.deleteButtonHover : {})
                          }}
                          onMouseEnter={() => setHoveredButton(`delete-${link._id}`)}
                          onMouseLeave={() => setHoveredButton(null)}
                        >
                          <Trash2 size={20} />
                          Delete
                        </button>
                        <button
                          onClick={() => handleEditClick(link)}
                          style={{
                            ...styles.editButton,
                            ...(hoveredButton === `edit-${link._id}` ? styles.editButtonHover : {})
                          }}
                          onMouseEnter={() => setHoveredButton(`edit-${link._id}`)}
                          onMouseLeave={() => setHoveredButton(null)}
                        >
                          <Edit2 size={20} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleMarkAsOpenedClick(link)}
                          style={{
                            ...styles.markButton,
                            ...(hoveredButton === `mark-${link._id}` ? styles.markButtonHover : {})
                          }}
                          onMouseEnter={() => setHoveredButton(`mark-${link._id}`)}
                          onMouseLeave={() => setHoveredButton(null)}
                        >
                          <CheckCircle size={20} />
                          Mark as Read
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingLink && (
        <div style={styles.modalOverlay} onClick={handleCancelEdit}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Edit Link</h2>
              <button
                onClick={handleCancelEdit}
                style={{
                  ...styles.closeButton,
                  ...(hoveredButton === 'close' ? styles.closeButtonHover : {})
                }}
                onMouseEnter={() => setHoveredButton('close')}
                onMouseLeave={() => setHoveredButton(null)}
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Username</label>
                <input
                  type="text"
                  value={editForm.username}
                  onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                  style={{
                    ...styles.input,
                    ...(focusedInput === 'username' ? styles.inputFocus : {})
                  }}
                  onFocus={() => setFocusedInput('username')}
                  onBlur={() => setFocusedInput(null)}
                  placeholder="Enter username"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>URL *</label>
                <input
                  type="url"
                  value={editForm.url}
                  onChange={(e) => setEditForm({ ...editForm, url: e.target.value })}
                  style={{
                    ...styles.input,
                    ...(focusedInput === 'url' ? styles.inputFocus : {})
                  }}
                  onFocus={() => setFocusedInput('url')}
                  onBlur={() => setFocusedInput(null)}
                  placeholder="https://example.com"
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>User ID</label>
                <input
                  type="text"
                  value={editForm.userId}
                  onChange={(e) => setEditForm({ ...editForm, userId: e.target.value })}
                  style={{
                    ...styles.input,
                    ...(focusedInput === 'userId' ? styles.inputFocus : {})
                  }}
                  onFocus={() => setFocusedInput('userId')}
                  onBlur={() => setFocusedInput(null)}
                  placeholder="Optional user ID"
                />
              </div>

              <div style={styles.modalActions}>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  style={{
                    ...styles.cancelButton,
                    ...(hoveredButton === 'cancel' ? styles.cancelButtonHover : {})
                  }}
                  onMouseEnter={() => setHoveredButton('cancel')}
                  onMouseLeave={() => setHoveredButton(null)}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    ...styles.saveButton,
                    ...(hoveredButton === 'save' && !saving ? styles.saveButtonHover : {}),
                    ...(saving ? styles.buttonDisabled : {})
                  }}
                  onMouseEnter={() => setHoveredButton('save')}
                  onMouseLeave={() => setHoveredButton(null)}
                  disabled={saving}
                >
                  <Save size={20} />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Link Modal */}
      {showAddModal && (
        <div style={styles.modalOverlay} onClick={handleCancelAdd}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Add New Link</h2>
              <button
                onClick={handleCancelAdd}
                style={{
                  ...styles.closeButton,
                  ...(hoveredButton === 'close-add' ? styles.closeButtonHover : {})
                }}
                onMouseEnter={() => setHoveredButton('close-add')}
                onMouseLeave={() => setHoveredButton(null)}
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSaveAdd(); }}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Username</label>
                <input
                  type="text"
                  value={addForm.username}
                  onChange={(e) => setAddForm({ ...addForm, username: e.target.value })}
                  style={{
                    ...styles.input,
                    ...(focusedInput === 'add-username' ? styles.inputFocus : {})
                  }}
                  onFocus={() => setFocusedInput('add-username')}
                  onBlur={() => setFocusedInput(null)}
                  placeholder="Enter username"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>URL *</label>
                <input
                  type="url"
                  value={addForm.url}
                  onChange={(e) => setAddForm({ ...addForm, url: e.target.value })}
                  style={{
                    ...styles.input,
                    ...(focusedInput === 'add-url' ? styles.inputFocus : {})
                  }}
                  onFocus={() => setFocusedInput('add-url')}
                  onBlur={() => setFocusedInput(null)}
                  placeholder="https://example.com"
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>User ID</label>
                <input
                  type="text"
                  value={addForm.userId}
                  onChange={(e) => setAddForm({ ...addForm, userId: e.target.value })}
                  style={{
                    ...styles.input,
                    ...(focusedInput === 'add-userId' ? styles.inputFocus : {})
                  }}
                  onFocus={() => setFocusedInput('add-userId')}
                  onBlur={() => setFocusedInput(null)}
                  placeholder="Optional user ID"
                />
              </div>

              <div style={styles.modalActions}>
                <button
                  type="button"
                  onClick={handleCancelAdd}
                  style={{
                    ...styles.cancelButton,
                    ...(hoveredButton === 'cancel-add' ? styles.cancelButtonHover : {})
                  }}
                  onMouseEnter={() => setHoveredButton('cancel-add')}
                  onMouseLeave={() => setHoveredButton(null)}
                  disabled={adding}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    ...styles.saveButton,
                    ...(hoveredButton === 'save-add' && !adding ? styles.saveButtonHover : {}),
                    ...(adding ? styles.buttonDisabled : {})
                  }}
                  onMouseEnter={() => setHoveredButton('save-add')}
                  onMouseLeave={() => setHoveredButton(null)}
                  disabled={adding}
                >
                  <Plus size={20} />
                  {adding ? 'Adding...' : 'Add Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deletingLink && (
        <div style={styles.confirmOverlay} onClick={handleCancelDelete}>
          <div style={styles.confirmDialog} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.confirmTitle}>Delete Link?</h3>
            <p style={styles.confirmMessage}>
              Are you sure you want to delete this link? This action cannot be undone.
              <br /><br />
              <strong>{deletingLink.username || 'Untitled Link'}</strong>
              <br />
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{deletingLink.url}</span>
            </p>
            <div style={styles.confirmActions}>
              <button
                onClick={handleCancelDelete}
                style={{
                  ...styles.cancelButton,
                  ...(hoveredButton === 'cancel-delete' ? styles.cancelButtonHover : {})
                }}
                onMouseEnter={() => setHoveredButton('cancel-delete')}
                onMouseLeave={() => setHoveredButton(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                style={{
                  ...styles.confirmButton,
                  ...(hoveredButton === 'confirm-delete' && !deleting ? styles.confirmButtonHover : {}),
                  ...(deleting ? styles.buttonDisabled : {})
                }}
                onMouseEnter={() => setHoveredButton('confirm-delete')}
                onMouseLeave={() => setHoveredButton(null)}
                disabled={deleting}
              >
                <Trash2 size={20} />
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mark as Read Confirmation Dialog */}
      {markingAsReadLink && (
        <div style={styles.confirmOverlay} onClick={handleCancelMarkAsRead}>
          <div style={styles.confirmDialog} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.confirmTitle}>Mark as Read?</h3>
            <p style={styles.confirmMessage}>
              Are you sure you want to mark this link as read? It will be removed from your unread list.
              <br /><br />
              <strong>{markingAsReadLink.username || 'Untitled Link'}</strong>
              <br />
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{markingAsReadLink.url}</span>
            </p>
            <div style={styles.confirmActions}>
              <button
                onClick={handleCancelMarkAsRead}
                style={{
                  ...styles.cancelButton,
                  ...(hoveredButton === 'cancel-mark' ? styles.cancelButtonHover : {})
                }}
                onMouseEnter={() => setHoveredButton('cancel-mark')}
                onMouseLeave={() => setHoveredButton(null)}
                disabled={markingAsRead}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmMarkAsRead}
                style={{
                  ...styles.saveButton,
                  ...(hoveredButton === 'confirm-mark' && !markingAsRead ? styles.saveButtonHover : {}),
                  ...(markingAsRead ? styles.buttonDisabled : {})
                }}
                onMouseEnter={() => setHoveredButton('confirm-mark')}
                onMouseLeave={() => setHoveredButton(null)}
                disabled={markingAsRead}
              >
                <CheckCircle size={20} />
                {markingAsRead ? 'Marking...' : 'Mark as Read'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
