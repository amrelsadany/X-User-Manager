// popup.js - Save X Profile with API Key authentication

// Get settings from storage
let apiUrl = '';
let apiKey = '';
let existingUserId = null; // Store ID of existing user

// Load settings
async function loadSettings() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['apiUrl', 'apiKey'], (result) => {
      apiUrl = result.apiUrl || '';
      apiKey = result.apiKey || '';
      console.log('Settings loaded:', { hasUrl: !!apiUrl, hasKey: !!apiKey });
      resolve();
    });
  });
}

// Initialize
async function init() {
  await loadSettings();

  // Check if settings are configured
  if (!apiUrl || !apiKey) {
    showMessage('Please configure API URL and API Key in settings', 'warning');
    document.getElementById('saveBtn').disabled = true;
    return;
  }

  // Get current tab
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    const currentTab = tabs[0];
    
    if (!currentTab || !currentTab.url) {
      showNotXPage();
      return;
    }

    // Check if on X/Twitter
    const isXPage = currentTab.url.includes('x.com') || currentTab.url.includes('twitter.com');
    
    if (!isXPage) {
      showNotXPage();
      return;
    }

    // Extract username from URL
    const urlMatch = currentTab.url.match(/(?:x\.com|twitter\.com)\/([^\/\?]+)/);
    
    if (!urlMatch) {
      showNotXPage();
      return;
    }

    const username = urlMatch[1];
    
    // Skip non-profile pages
    const skipPages = ['home', 'explore', 'notifications', 'messages', 'settings', 'compose', 'i', 'search', 'intent'];
    if (skipPages.includes(username.toLowerCase())) {
      showNotXPage();
      return;
    }

    // Set form values
    document.getElementById('username').value = username;
    document.getElementById('url').value = currentTab.url;
    document.getElementById('userId').value = 'Auto-detected';
    
    // Enable save button
    document.getElementById('saveBtn').disabled = false;
  });
}

// Show not X page message
function showNotXPage() {
  document.getElementById('form').classList.add('hidden');
  document.getElementById('notXPage').classList.remove('hidden');
}

// Save button click handler
document.getElementById('saveBtn').addEventListener('click', async () => {
  const username = document.getElementById('username').value.trim();
  const url = document.getElementById('url').value.trim();
  const markAsRead = document.getElementById('markAsRead').checked;
  
  if (!url) {
    showMessage('URL is required', 'error');
    return;
  }

  if (!apiUrl || !apiKey) {
    showMessage('Please configure settings first', 'warning');
    return;
  }
  
  // Disable form while saving
  setFormEnabled(false);
  
  try {
    // Remove trailing slash from API URL
    const cleanApiUrl = apiUrl.replace(/\/$/, '');
    
    console.log('Sending request to:', `${cleanApiUrl}/shortcut/add-user`);
    
    const response = await fetch(`${cleanApiUrl}/shortcut/add-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey
      },
      body: JSON.stringify({
        url: url,
        username: username,
        title: `@${username}`,
        userId: null
      })
    });
    
    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);
    
    if (!response.ok) {
      if (response.status === 403) {
        showMessage('Invalid API Key - Check settings', 'error');
        setFormEnabled(true);
        return;
      }
      
      if (response.status === 409) {
        // User already exists - offer to mark as read
        existingUserId = data.existingUser?._id;
        console.log('User exists with ID:', existingUserId);
        
        if (markAsRead && existingUserId) {
          // User wants to mark as read, do it now
          await markUserAsRead(existingUserId, cleanApiUrl);
        } else {
          // Show message with option to mark as read
          showExistingUserMessage(data.existingUser);
          setFormEnabled(true);
        }
        return;
      }
      
      throw new Error(data.error || 'Failed to save profile');
    }
    
    // New user created successfully
    const newUserId = data.user?._id;
    
    // If mark as read is checked, mark it immediately
    if (markAsRead && newUserId) {
      await markUserAsRead(newUserId, cleanApiUrl);
    }
    
    // Success
    const message = markAsRead 
      ? '✅ Profile saved and marked as read!' 
      : '✅ Profile saved successfully!';
    showMessage(message, 'success');
    
    // Close popup after 1.5 seconds
    setTimeout(() => {
      window.close();
    }, 1500);
    
  } catch (error) {
    console.error('Error saving profile:', error);
    showMessage(`Error: ${error.message}. Check your API URL and connection.`, 'error');
    setFormEnabled(true);
  }
});

// Mark user as read
async function markUserAsRead(userId, cleanApiUrl) {
  try {
    console.log('Marking user as read:', userId);
    
    const markResponse = await fetch(`${cleanApiUrl}/users/${userId}/mark-read`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey // Try API key first
      }
    });
    
    if (markResponse.ok) {
      console.log('Successfully marked as read');
      showMessage('✅ Profile marked as read!', 'success');
      
      setTimeout(() => {
        window.close();
      }, 1500);
      return true;
    } else {
      console.warn('Failed to mark as read:', markResponse.status);
      showMessage('Profile exists but could not mark as read (may need JWT auth)', 'warning');
      setFormEnabled(true);
      return false;
    }
  } catch (error) {
    console.error('Error marking as read:', error);
    showMessage('Profile exists but could not mark as read', 'warning');
    setFormEnabled(true);
    return false;
  }
}

// Show message for existing user with mark-as-read option
function showExistingUserMessage(existingUser) {
  const messageEl = document.getElementById('message');
  
  // Create message with mark-as-read button
  messageEl.innerHTML = `
    <div style="margin-bottom: 8px;">
      ⚠️ Profile already exists: <strong>@${existingUser.username || 'Unknown'}</strong>
    </div>
    <button id="markExistingBtn" style="
      padding: 6px 12px;
      background: #4f46e5;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 13px;
      cursor: pointer;
      font-weight: 500;
    ">
      Mark as Read
    </button>
  `;
  
  messageEl.className = 'message warning';
  messageEl.classList.remove('hidden');
  
  // Add click handler for mark as read button
  document.getElementById('markExistingBtn').addEventListener('click', async () => {
    if (existingUserId) {
      setFormEnabled(false);
      const cleanApiUrl = apiUrl.replace(/\/$/, '');
      await markUserAsRead(existingUserId, cleanApiUrl);
    }
  });
}

// Cancel button click handler
document.getElementById('cancelBtn').addEventListener('click', () => {
  window.close();
});

// Settings link click handlers
document.getElementById('settingsLink')?.addEventListener('click', (e) => {
  e.preventDefault();
  chrome.runtime.openOptionsPage();
});

document.getElementById('openSettings')?.addEventListener('click', (e) => {
  e.preventDefault();
  chrome.runtime.openOptionsPage();
});

// Helper functions
function showMessage(text, type) {
  const messageEl = document.getElementById('message');
  messageEl.textContent = text;
  messageEl.className = `message ${type}`;
  messageEl.classList.remove('hidden');
}

function setFormEnabled(enabled) {
  document.getElementById('saveBtn').disabled = !enabled;
  document.getElementById('cancelBtn').disabled = !enabled;
  document.getElementById('markAsRead').disabled = !enabled;
  
  if (enabled) {
    document.getElementById('saveBtn').textContent = 'Save Profile';
  } else {
    document.getElementById('saveBtn').textContent = 'Saving...';
  }
}

// Initialize on load
console.log('Popup loaded');
init();
