// content.js - Extract X profile data from page

// This script runs on X.com pages to help extract profile information
// It's injected by the manifest and helps the popup get data

(function() {
  'use strict';

  // Add a listener for messages from the extension
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getProfileData') {
      const profileData = extractProfileData();
      sendResponse(profileData);
    }
    return true;
  });

  // Extract profile data from the current page
  function extractProfileData() {
    try {
      // Get username from URL
      const urlMatch = window.location.pathname.match(/^\/([^\/]+)/);
      if (!urlMatch) return null;

      const username = urlMatch[1];
      
      // Skip non-profile pages
      const skipPages = [
        'home', 'explore', 'notifications', 'messages', 
        'settings', 'compose', 'i', 'search'
      ];
      
      if (skipPages.includes(username.toLowerCase())) {
        return null;
      }

      // Get user ID from page
      let userId = null;
      
      // Method 1: Try to extract from inline scripts
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

      // Method 2: Try to get from window object
      if (!userId && window.__INITIAL_STATE__) {
        try {
          const state = window.__INITIAL_STATE__;
          // Try to find user ID in the state object
          const userIdMatch = JSON.stringify(state).match(/"rest_id":"(\d+)"/);
          if (userIdMatch) {
            userId = userIdMatch[1];
          }
        } catch (e) {
          console.log('Could not extract from window state');
        }
      }

      return {
        username: username,
        userId: userId,
        url: window.location.href,
        title: `@${username}`
      };
    } catch (error) {
      console.error('Error extracting profile data:', error);
      return null;
    }
  }

  // Optional: Add visual indicator when extension is active
  function addIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'user-manager-indicator';
    indicator.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      z-index: 10000;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      cursor: pointer;
      transition: transform 0.2s;
    `;
    indicator.textContent = '📋 User Manager Active';
    
    indicator.addEventListener('mouseenter', () => {
      indicator.style.transform = 'scale(1.05)';
    });
    
    indicator.addEventListener('mouseleave', () => {
      indicator.style.transform = 'scale(1)';
    });
    
    indicator.addEventListener('click', () => {
      chrome.runtime.sendMessage({ action: 'openPopup' });
    });

    document.body.appendChild(indicator);

    // Auto-hide after 3 seconds
    setTimeout(() => {
      indicator.style.opacity = '0';
      indicator.style.transition = 'opacity 0.5s';
      setTimeout(() => indicator.remove(), 500);
    }, 3000);
  }

  // Only add indicator on profile pages
  if (window.location.pathname.match(/^\/[^\/]+$/)) {
    // Wait for page to load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', addIndicator);
    } else {
      addIndicator();
    }
  }
})();
