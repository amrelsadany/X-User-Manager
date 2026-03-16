// popup.js - Chrome Extension popup logic with API Key authentication

// DOM Elements
const settingsSection = document.getElementById('settingsSection');
const mainContent = document.getElementById('mainContent');
const loadingState = document.getElementById('loadingState');
const notXPage = document.getElementById('notXPage');
const profileSection = document.getElementById('profileSection');
const statusMessage = document.getElementById('statusMessage');

const apiUrlInput = document.getElementById('apiUrl');
const apiKeyInput = document.getElementById('apiKey');
const saveSettingsBtn = document.getElementById('saveSettings');
const addUserBtn = document.getElementById('addUserBtn');

const usernameEl = document.getElementById('username');
const userIdEl = document.getElementById('userId');
const urlEl = document.getElementById('url');
const connectionStatusEl = document.getElementById('connectionStatus');

// State
let currentProfile = null;
let settings = {
  apiUrl: '',
  apiKey: ''
};

// Initialize
async function init() {
  await loadSettings();
  await checkCurrentTab();
}

// Load settings from Chrome storage
async function loadSettings() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['apiUrl', 'apiKey'], (result) => {
      settings.apiUrl = result.apiUrl || '';
      settings.apiKey = result.apiKey || '';
      
      apiUrlInput.value = settings.apiUrl;
      apiKeyInput.value = settings.apiKey;
      
      resolve();
    });
  });
}

// Save settings to Chrome storage
saveSettingsBtn.addEventListener('click', async () => {
  const apiUrl = apiUrlInput.value.trim();
  const apiKey = apiKeyInput.value.trim();

  if (!apiUrl) {
    showStatus('Please enter API URL', 'error');
    return;
  }

  if (!apiKey) {
    showStatus('Please enter API Key', 'error');
    return;
  }

  // Save to Chrome storage
  chrome.storage.sync.set({ apiUrl, apiKey }, () => {
    settings.apiUrl = apiUrl;
    settings.apiKey = apiKey;
    showStatus('Settings saved successfully!', 'success');
    
    // Reload profile data if on X page
    setTimeout(() => {
      checkCurrentTab();
    }, 1000);
  });
});

// Check current tab
async function checkCurrentTab() {
  showLoading(true);

  // Check if settings are configured
  if (!settings.apiUrl || !settings.apiKey) {
    showLoading(false);
    showStatus('Please configure API URL and API Key first', 'warning');
    updateConnectionStatus(false);
    return;
  }

  // Get current tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab || !tab.url) {
    showLoading(false);
    showNotXPage();
    return;
  }

  // Check if on X/Twitter
  const isXPage = tab.url.includes('x.com') || tab.url.includes('twitter.com');

  if (!isXPage) {
    showLoading(false);
    showNotXPage();
    return;
  }

  // Extract profile data from page
  try {
    const [result] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: extractProfileData
    });

    if (result && result.result) {
      currentProfile = result.result;
      showProfile(currentProfile);
      updateConnectionStatus(true);
    } else {
      showLoading(false);
      showNotXPage();
    }
  } catch (error) {
    console.error('Error extracting profile:', error);
    showLoading(false);
    showStatus('Error extracting profile data', 'error');
  }
}

// Extract profile data from X page
function extractProfileData() {
  try {
    // Get username from URL
    const urlMatch = window.location.pathname.match(/^\/([^\/]+)/);
    if (!urlMatch) return null;

    const username = urlMatch[1];
    
    // Skip non-profile pages
    if (['home', 'explore', 'notifications', 'messages', 'settings', 'compose'].includes(username.toLowerCase())) {
      return null;
    }

    // Get user ID from page data
    let userId = null;
    
    // Try to extract from page scripts
    const scripts = document.querySelectorAll('script');
    for (const script of scripts) {
      const content = script.textContent;
      if (content && content.includes('rest_id')) {
        const match = content.match(/"rest_id":"(\d+)"/);
        if (match) {
          userId = match[1];
          break;
        }
      }
    }

    return {
      username: username,
      userId: userId,
      url: window.location.href,
      title: `@${username}`
    };
  } catch (error) {
    console.error('Error in extractProfileData:', error);
    return null;
  }
}

// Show profile data
function showProfile(profile) {
  showLoading(false);
  notXPage.style.display = 'none';
  profileSection.style.display = 'block';

  usernameEl.textContent = profile.username || '-';
  userIdEl.textContent = profile.userId || 'Not found';
  urlEl.textContent = profile.url ? new URL(profile.url).pathname : '-';
}

// Show not X page message
function showNotXPage() {
  showLoading(false);
  profileSection.style.display = 'none';
  notXPage.style.display = 'block';
  updateConnectionStatus(false);
}

// Show loading state
function showLoading(show) {
  loadingState.style.display = show ? 'block' : 'none';
  if (show) {
    notXPage.style.display = 'none';
    profileSection.style.display = 'none';
  }
}

// Show status message
function showStatus(message, type = 'success') {
  statusMessage.textContent = message;
  statusMessage.className = `status-message status-${type}`;
  statusMessage.style.display = 'block';

  setTimeout(() => {
    statusMessage.style.display = 'none';
  }, 3000);
}

// Update connection status
function updateConnectionStatus(connected) {
  if (connected) {
    connectionStatusEl.innerHTML = '<span class="status-indicator status-connected"></span>Connected';
  } else {
    connectionStatusEl.innerHTML = '<span class="status-indicator status-disconnected"></span>Not configured';
  }
}

// Add user to User Manager
addUserBtn.addEventListener('click', async () => {
  if (!currentProfile) {
    showStatus('No profile data found', 'error');
    return;
  }

  if (!settings.apiUrl || !settings.apiKey) {
    showStatus('Please configure API URL and API Key', 'warning');
    return;
  }

  addUserBtn.disabled = true;
  addUserBtn.textContent = 'Adding...';

  try {
    const response = await fetch(`${settings.apiUrl}/shortcut/add-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': settings.apiKey
      },
      body: JSON.stringify({
        url: currentProfile.url,
        username: currentProfile.username,
        title: currentProfile.title,
        userId: currentProfile.userId
      })
    });

    const data = await response.json();

    if (response.ok) {
      showStatus('✅ Added to User Manager!', 'success');
    } else if (response.status === 403) {
      showStatus('❌ Invalid API Key', 'error');
    } else if (response.status === 409) {
      showStatus('⚠️ User already exists', 'warning');
    } else {
      showStatus(`❌ ${data.error || 'Failed to add user'}`, 'error');
    }
  } catch (error) {
    console.error('Error adding user:', error);
    showStatus('❌ Connection error. Check your API URL', 'error');
  } finally {
    addUserBtn.disabled = false;
    addUserBtn.innerHTML = '<span>➕</span> Add to User Manager';
  }
});

// Initialize on load
init();
