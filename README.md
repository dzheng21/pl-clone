# Phone Link Emulator

A comprehensive web-based emulator that replicates Microsoft Phone Link (Windows 11 version) functionality and user experience. This emulator includes Windows 11 Start Menu integration, main Phone Link application window, and core features like notifications, messages, photos, apps, and calls with proper UI/UX following Fluent Design principles.

## Features

- **Windows 11 Start Menu** with collapsible Phone Link panel
- **Main Phone Link Application** with sidebar navigation
- **Dashboard** with quick access to all features
- **Notifications** management and interaction
- **Messages** with conversation handling and real-time chat
- **Photos** viewer with drag-and-drop file transfers
- **Apps** mirroring (Android simulation)
- **Calls** functionality with dial pad and call history
- **Settings** panel with theme switching and permissions
- **Cross-device clipboard** simulation
- **Responsive design** for mobile/tablet compatibility
- **Dark/Light theme** support with system theme detection

## How to Run Locally

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Python 3 (for local server) or any other local web server

### Method 1: Using Python (Recommended)

1. **Clone or download** this repository to your local machine

2. **Open a terminal/command prompt** and navigate to the project directory:

   ```bash
   cd /path/to/pl-clone
   ```

3. **Start a local web server** using Python:

   ```bash
   # For Python 3
   python3 -m http.server 8000

   # For Python 2 (if Python 3 is not available)
   python -m SimpleHTTPServer 8000
   ```

4. **Open your web browser** and navigate to:
   ```
   http://localhost:8000
   ```

### Method 2: Using Node.js

If you have Node.js installed, you can use `npx` to serve the files:

```bash
# Navigate to the project directory
cd /path/to/pl-clone

# Start a local server
npx serve .
```

Then open the URL provided in the terminal (usually `http://localhost:3000` or `http://localhost:5000`).

### Method 3: Using VS Code Live Server

If you're using Visual Studio Code:

1. Install the "Live Server" extension
2. Right-click on `index.html`
3. Select "Open with Live Server"

### Method 4: Direct File Opening (Not Recommended)

While you can open `index.html` directly in your browser, this may cause CORS issues with some features. Using a local server is recommended for the best experience.

## Usage

1. **Click the Windows button** (⊞) in the taskbar to open the Start Menu
2. **Explore the Phone Link panel** in the Start Menu for quick actions
3. **Click the Phone Link icon** in the taskbar to open the main application
4. **Navigate between features** using the sidebar menu
5. **Test interactions** like sending messages, viewing photos, and making calls
6. **Try drag-and-drop** file transfers in the Photos section
7. **Customize settings** including theme preferences and feature permissions

## Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## Notes

- This is a **simulation/emulator** - no actual phone connection is made
- All data is **mock data** for demonstration purposes
- Features like app mirroring and calls are **simulated**
- Cross-device clipboard is **simulated locally**
- External image URLs may take time to load or may not work in some environments

## Project Structure

```
pl-clone/
├── index.html          # Main HTML structure
├── styles.css          # CSS styling with Fluent Design
├── script.js           # JavaScript functionality
└── README.md           # This file
```
