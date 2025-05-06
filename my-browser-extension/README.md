# HideFromLLM Browser Extension

## Overview
HideFromLLM is a browser extension designed to help protect sensitive information, such as email addresses and phone numbers, from being unintentionally shared or exposed. When enabled, the extension masks real emails and phone numbers during paste operations and unmasks them during copy operations, providing an extra layer of privacy when interacting with web pages.

## Features
- **Toggle On/Off**: Easily enable or disable the extension from the popup interface.
- **Masking**: Automatically replaces real emails and phone numbers with fake placeholders when pasting content.
- **Unmasking**: Converts fake placeholders back to the original data when copying content.
- **Persistent State**: Remembers your on/off preference and mapping between real and fake data.

## How It Works
- When the extension is ON, it intercepts copy and paste events on web pages.
- On paste, it replaces detected emails and phone numbers with fake values.
- On copy, it restores the original values if fake placeholders are detected.

## Installation
1. Download or clone this repository.
2. Open your browser and go to the extensions page (e.g., `chrome://extensions/` for Chrome).
3. Enable "Developer mode" (usually a toggle in the top right).
4. Click "Load unpacked" and select the `my-browser-extension` folder.
5. The extension should now appear in your browser's extension list.

## Usage
- Click the extension icon to open the popup.
- Use the ON/OFF button to enable or disable masking.
- When ON, copy and paste operations involving emails or phone numbers will be masked/unmasked automatically.

## Files
- `manifest.json`: Extension manifest and configuration.
- `popup.html`, `popup.js`: Popup UI and logic for toggling the extension.
- `background.js`: Handles background tasks and state persistence.
- `content.js`: Main logic for masking/unmasking data on web pages.
- `icon16.png`, `icon48.png`, `icon128.png`: Extension icons.

## License
This project is for portfolio and demonstration purposes. Feel free to use or modify it for personal projects.
