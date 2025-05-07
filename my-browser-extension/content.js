// content.js

// Regex patterns for emails and phone numbers
const emailRegex = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
const phoneRegex = /\b(\+?\d[\d\-\s]{5,}\d)\b/g;
const fakeEmailTemplate = (n) => `email${n}@example.com`;
const fakePhoneTemplate = (n) => `number${n}`;

// Mapping structure
let mapping = { emails: {}, numbers: {}, emailCount: 0, phoneCount: 0 };

// Extension on/off state
let isOn = false;
chrome.storage.local.get('isOn', (result) => {
  if (typeof result.isOn === 'boolean') {
    isOn = result.isOn;
  }
  console.log('Content: initial state is', isOn ? 'ON' : 'OFF');
});

// Listen for state change messages
chrome.runtime.onMessage.addListener((message) => {
  if (message.newState !== undefined) {
    isOn = message.newState;
    console.log('Content: state updated to', isOn ? 'ON' : 'OFF');
  }
});

// Load existing mapping from storage
chrome.storage.local.get('mapping', (result) => {
  if (result.mapping) {
    mapping = result.mapping;
    console.log('Mapping loaded:', mapping);
  }
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.newState !== undefined) {
    isOn = message.newState;
    console.log('Content: state updated to', isOn ? 'ON' : 'OFF');
  }
  if (message.action === 'resetMapping') {
    mapping = { emails: {}, numbers: {}, emailCount: 0, phoneCount: 0 };
    saveMapping();
    console.log('Content: mapping has been reset');
  }
});



// Save mapping to storage
function saveMapping() {
  chrome.storage.local.set({ mapping }, () => {
      if (chrome.runtime.lastError) {
          console.error('Content: error saving mapping', chrome.runtime.lastError);
      } else {
          console.log('Content: mapping saved', mapping);
      }
  });
}

// Handle paste event: mask real data
function handlePaste(event) {
  if (!isOn) return;  // Do nothing when off

  const pastedText = (event.clipboardData || window.clipboardData).getData('text');
  console.log('Paste detected:', pastedText);

  let transformed = pastedText.replace(emailRegex, (match) => {
    if (!mapping.emails[match]) {
      mapping.emailCount += 1;
      mapping.emails[match] = fakeEmailTemplate(mapping.emailCount);
      console.log(`New email mapping: ${match} -> ${mapping.emails[match]}`);
    }
    return mapping.emails[match];
  });

  transformed = transformed.replace(phoneRegex, (match) => {
    if (!mapping.numbers[match]) {
      mapping.phoneCount += 1;
      mapping.numbers[match] = fakePhoneTemplate(mapping.phoneCount);
      console.log(`New phone mapping: ${match} -> ${mapping.numbers[match]}`);
    }
    return mapping.numbers[match];
  });

  if (transformed !== pastedText) {
    event.preventDefault();
    console.log('Masked paste:', transformed);
    saveMapping();
  
    const activeElement = document.activeElement;
    if (
      activeElement &&
      (activeElement.tagName === 'TEXTAREA' ||
        (activeElement.tagName === 'INPUT' && activeElement.type === 'text'))
    ) {
      // Insert at cursor or replace selection
      const start = activeElement.selectionStart;
      const end = activeElement.selectionEnd;
      const value = activeElement.value;
      // Insert transformed text at the cursor, preserving text before and after
      const newValue = value.slice(0, start) + transformed + value.slice(end);
      activeElement.value = newValue;
      // Move cursor to just after the inserted text
      const newCursor = start + transformed.length;
      activeElement.selectionStart = activeElement.selectionEnd = newCursor;
      // Trigger input event for frameworks to notice the change
      activeElement.dispatchEvent(new Event('input', { bubbles: true }));
    } else if (
      activeElement && activeElement.isContentEditable
    ) {
      // For contenteditable elements, use execCommand as fallback
      document.execCommand('insertText', false, transformed);
    }
  }
}

// Handle copy event: unmask fake IDs back to real data
function handleCopy(event) {
  if (!isOn) return;  // Do nothing when off

  const selectedText = window.getSelection().toString();
  console.log('Copy detected:', selectedText);

  let transformed = selectedText.replace(/email\d+@example\.com/g, (match) => {
    const orig = Object.keys(mapping.emails).find(key => mapping.emails[key] === match);
    return orig || match;
  });

  transformed = transformed.replace(/number\d+/g, (match) => {
    const orig = Object.keys(mapping.numbers).find(key => mapping.numbers[key] === match);
    return orig || match;
  });

  if (transformed !== selectedText) {
    event.preventDefault();
    event.clipboardData.setData('text/plain', transformed);
    console.log('Unmasked copy:', transformed);
  }
}

// Register event listeners
window.addEventListener('paste', handlePaste, true);
window.addEventListener('copy', handleCopy, true);

