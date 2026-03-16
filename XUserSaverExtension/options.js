const DEFAULT_API_URL = 'http://localhost:3001/api';

// Load saved settings
chrome.storage.sync.get(['apiUrl'], (result) => {
  document.getElementById('apiUrl').value = result.apiUrl || DEFAULT_API_URL;
});

// Save settings
document.getElementById('saveBtn').addEventListener('click', () => {
  const apiUrl = document.getElementById('apiUrl').value.trim();
  
  // Remove trailing slash if present
  const cleanedUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
  
  chrome.storage.sync.set({ apiUrl: cleanedUrl }, () => {
    // Show success message
    const messageEl = document.getElementById('message');
    messageEl.classList.remove('hidden');
    
    // Hide after 2 seconds
    setTimeout(() => {
      messageEl.classList.add('hidden');
    }, 2000);
  });
});

// Reset to default
document.getElementById('resetBtn').addEventListener('click', () => {
  document.getElementById('apiUrl').value = DEFAULT_API_URL;
  chrome.storage.sync.set({ apiUrl: DEFAULT_API_URL }, () => {
    // Show success message
    const messageEl = document.getElementById('message');
    messageEl.classList.remove('hidden');
    
    // Hide after 2 seconds
    setTimeout(() => {
      messageEl.classList.add('hidden');
    }, 2000);
  });
});
