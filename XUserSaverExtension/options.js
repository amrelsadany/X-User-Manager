// options.js - Settings page logic

const DEFAULT_API_URL = '';

// Load saved settings
function loadSettings() {
  chrome.storage.sync.get(['apiUrl', 'apiKey'], (result) => {
    document.getElementById('apiUrl').value = result.apiUrl || '';
    document.getElementById('apiKey').value = result.apiKey || '';
    console.log('Settings loaded');
  });
}

// Save settings
document.getElementById('saveBtn').addEventListener('click', () => {
  const apiUrl = document.getElementById('apiUrl').value.trim();
  const apiKey = document.getElementById('apiKey').value.trim();
  
  if (!apiUrl) {
    showMessage('Please enter an API URL', 'error');
    return;
  }

  if (!apiKey) {
    showMessage('Please enter an API Key', 'error');
    return;
  }
  
  // Save to Chrome storage
  chrome.storage.sync.set(
    {
      apiUrl: apiUrl,
      apiKey: apiKey
    },
    () => {
      console.log('Settings saved:', { apiUrl, hasKey: !!apiKey });
      showMessage('Settings saved successfully!', 'success');
      
      // Hide message after 3 seconds
      setTimeout(() => {
        hideMessage();
      }, 3000);
    }
  );
});

// Reset to defaults
document.getElementById('resetBtn').addEventListener('click', () => {
  if (confirm('Are you sure you want to clear all settings?')) {
    chrome.storage.sync.clear(() => {
      document.getElementById('apiUrl').value = '';
      document.getElementById('apiKey').value = '';
      showMessage('Settings cleared', 'success');
      
      setTimeout(() => {
        hideMessage();
      }, 2000);
    });
  }
});

// Helper functions
function showMessage(text, type) {
  const messageEl = document.getElementById('message');
  messageEl.textContent = text;
  messageEl.className = `message ${type}`;
  messageEl.classList.remove('hidden');
}

function hideMessage() {
  const messageEl = document.getElementById('message');
  messageEl.classList.add('hidden');
}

// Load settings on page load
loadSettings();
