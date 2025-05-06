// filepath: /home/carlos/BrowserExtensions/HideFromLLM/my-browser-extension/background.js
console.log("Background script loaded."); // Good for checking if it's running

// Listen for messages from other parts of the extension (like popup.js)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Background: Message received:", message);
  console.log("Background: Sender:", sender); // Info about where the message came from

  if (message.greeting === "Hello from popup!") {
    console.log("Background: Replying...");
    // Send a response back to the sender (popup.js)
    sendResponse({ reply: "Hello back from background!" });
  } else if (message.newState !== undefined) { // Check if the message contains the new state
    console.log("Background: Extension state changed to:", message.newState ? "ON" : "OFF");
    // Optionally send a response back if needed
    // sendResponse({ status: "State received" });
  }
  if (message.action === 'saveMapping') {
    chrome.storage.local.set({ mapping: message.mapping }, () => {
        console.log('Background: mapping saved', message.mapping);
    });
  }

  // Return true if you intend to send a response asynchronously.
  // In this simple case, it's synchronous, but it's good practice
  // if you might do async work before responding later.
  // return true;
});

// Example: Log when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed/updated.");
});