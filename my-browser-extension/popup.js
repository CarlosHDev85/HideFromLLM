// filepath: /home/carlos/BrowserExtensions/HideFromLLM/my-browser-extension/popup.js

// Initial state variable (defaults to off)
let isOn = false;
const toggleButton = document.getElementById('toggleButton');

// Function to update button appearance based on state
function updateButtonAppearance() {
    if (isOn) {
        toggleButton.textContent = 'ON';
        toggleButton.classList.remove('off');
        toggleButton.classList.add('on');
    } else {
        toggleButton.textContent = 'OFF';
        toggleButton.classList.remove('on');
        toggleButton.classList.add('off');
    }
}

// Load saved state when popup loads
chrome.storage.local.get('isOn', (result) => {
    if (typeof result.isOn === 'boolean') {
        isOn = result.isOn;
    }
    updateButtonAppearance();
});

// Add click listener to the button
toggleButton.addEventListener('click', () => {
    // Toggle the state
    isOn = !isOn;

    // Update the button's text and class
    updateButtonAppearance();

    // Log the new state (optional)
    console.log("Extension state toggled to:", isOn ? "ON" : "OFF");

    // Persist state
    chrome.storage.local.set({ isOn }, () => {
        console.log('Saved state:', isOn);
    });

    // Send a message to the background script with the new state
    chrome.runtime.sendMessage({ newState: isOn });
});

document.getElementById('reset-mapping-btn').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'resetMapping' });
    });
    console.log('Reset mapping button clicked');
});