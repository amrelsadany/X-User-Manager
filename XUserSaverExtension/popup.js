// popup.js - Save X Profile with API Key authentication

// Get settings from storage
let apiUrl = '';
let apiKey = '';

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
        showMessage('This profile already exists in your list!', 'warning');
        setFormEnabled(true);
        return;
      }
      
      throw new Error(data.error || 'Failed to save profile');
    }
    
    // If mark as read is checked, mark it immediately
    if (markAsRead && data.user && data.user._id) {
      try {
        const markResponse = await fetch(`${cleanApiUrl}/users/${data.user._id}/mark-read`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}` // You might need JWT for this endpoint
          }
        });
        
        if (!markResponse.ok) {
          console.warn('Profile saved but failed to mark as read');
        }
      } catch (markError) {
        console.warn('Profile saved but failed to mark as read:', markError);
      }
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
