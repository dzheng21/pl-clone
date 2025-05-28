class PhoneLinkEmulator {
  constructor() {
    this.isConnected = true;
    this.phoneName = "Galaxy S23";
    this.batteryLevel = 75;
    this.currentView = "dashboard";
    this.selectedConversation = null;
    this.clipboardData = null;
    this.deviceType = "android"; // android or ios
    this.permissions = {
      notifications: true,
      messages: true,
      photos: true,
      apps: true,
      calls: false,
      clipboard: true,
      hotspot: true,
    };

    this.loadMockData();
    this.init();
    this.setupEventListeners();
    this.updateTime();
    this.loadSettings();
  }

  init() {
    // Initialize theme
    this.setTheme(localStorage.getItem("phonelink-theme") || "system");

    // Update phone status in all locations
    this.updatePhoneStatus();

    // Populate initial data
    this.populateRecentPhotos();
    this.populateRecentMessages();
    this.populateNotifications();
    this.populateConversations();
    this.populatePhotos();
    this.populateApps();
    this.populateCallHistory();

    // Setup drag and drop
    this.setupDragAndDrop();

    // Setup cross-device clipboard simulation
    this.setupClipboard();
  }

  loadMockData() {
    // Mock conversations
    this.conversations = [
      {
        id: 1,
        name: "John Doe",
        preview: "Hey, are we still on for lunch today?",
        time: "2:30 PM",
        avatar: "JD",
        messages: [
          { id: 1, text: "Hey there!", sent: false, time: "2:15 PM" },
          { id: 2, text: "Hi John! How are you?", sent: true, time: "2:16 PM" },
          {
            id: 3,
            text: "I'm doing great! Are we still on for lunch today?",
            sent: false,
            time: "2:30 PM",
          },
        ],
      },
      {
        id: 2,
        name: "Sarah Wilson",
        preview: "Thanks for the help with the project!",
        time: "1:45 PM",
        avatar: "SW",
        messages: [
          {
            id: 1,
            text: "Thanks for the help with the project!",
            sent: false,
            time: "1:45 PM",
          },
          {
            id: 2,
            text: "No problem! Glad I could help.",
            sent: true,
            time: "1:46 PM",
          },
        ],
      },
      {
        id: 3,
        name: "Mom",
        preview: "Don't forget dinner tomorrow at 6",
        time: "12:20 PM",
        avatar: "M",
        messages: [
          {
            id: 1,
            text: "Don't forget dinner tomorrow at 6",
            sent: false,
            time: "12:20 PM",
          },
          {
            id: 2,
            text: "I won't forget! See you then ❤️",
            sent: true,
            time: "12:21 PM",
          },
        ],
      },
    ];

    // Mock notifications
    this.notifications = [
      {
        id: 1,
        app: "WhatsApp",
        icon: "fab fa-whatsapp",
        title: "New message from Sarah",
        content: "Thanks for the help with the project!",
        time: "2 min ago",
      },
      {
        id: 2,
        app: "Gmail",
        icon: "fas fa-envelope",
        title: "New email",
        content: "Weekly report is ready for review",
        time: "15 min ago",
      },
      {
        id: 3,
        app: "Calendar",
        icon: "fas fa-calendar",
        title: "Meeting reminder",
        content: "Team standup in 30 minutes",
        time: "30 min ago",
      },
      {
        id: 4,
        app: "Spotify",
        icon: "fab fa-spotify",
        title: "Now playing",
        content: "Your Daily Mix 1 is ready",
        time: "1 hour ago",
      },
    ];

    // Mock photos
    this.photos = [];
    for (let i = 1; i <= 20; i++) {
      this.photos.push({
        id: i,
        url: `https://picsum.photos/400/400?random=${i}`,
        thumbnail: `https://picsum.photos/200/200?random=${i}`,
        date: new Date(
          Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
        ).toLocaleDateString(),
      });
    }

    // Mock apps (Android only)
    this.apps =
      this.deviceType === "android"
        ? [
            {
              id: 1,
              name: "WhatsApp",
              icon: "fab fa-whatsapp",
              color: "#25d366",
            },
            {
              id: 2,
              name: "Instagram",
              icon: "fab fa-instagram",
              color: "#e4405f",
            },
            {
              id: 3,
              name: "Twitter",
              icon: "fab fa-twitter",
              color: "#1da1f2",
            },
            {
              id: 4,
              name: "Spotify",
              icon: "fab fa-spotify",
              color: "#1db954",
            },
            {
              id: 5,
              name: "YouTube",
              icon: "fab fa-youtube",
              color: "#ff0000",
            },
            { id: 6, name: "Gmail", icon: "fas fa-envelope", color: "#ea4335" },
            {
              id: 7,
              name: "Maps",
              icon: "fas fa-map-marker-alt",
              color: "#4285f4",
            },
            { id: 8, name: "Camera", icon: "fas fa-camera", color: "#34a853" },
          ]
        : [];

    // Mock call history
    this.callHistory = [
      {
        id: 1,
        contact: "John Doe",
        number: "+1 (555) 123-4567",
        type: "outgoing",
        duration: "5:23",
        time: "2:30 PM",
        date: "Today",
      },
      {
        id: 2,
        contact: "Sarah Wilson",
        number: "+1 (555) 987-6543",
        type: "incoming",
        duration: "2:15",
        time: "1:45 PM",
        date: "Today",
      },
      {
        id: 3,
        contact: "Unknown",
        number: "+1 (555) 111-2222",
        type: "missed",
        duration: "",
        time: "11:30 AM",
        date: "Today",
      },
      {
        id: 4,
        contact: "Mom",
        number: "+1 (555) 555-5555",
        type: "incoming",
        duration: "12:45",
        time: "8:20 PM",
        date: "Yesterday",
      },
    ];
  }

  setupEventListeners() {
    // Start menu toggle
    document.getElementById("start-btn").addEventListener("click", () => {
      this.toggleStartMenu();
    });

    // Phone Link panel toggle
    document
      .getElementById("collapse-phone-panel")
      .addEventListener("click", () => {
        this.togglePhoneLinkPanel();
      });

    // Start menu quick actions
    document
      .getElementById("phone-status-start")
      .addEventListener("click", () => {
        this.openPhoneLinkApp();
      });

    document
      .getElementById("send-files-start")
      .addEventListener("click", () => {
        this.openPhoneLinkApp("apps");
        this.triggerFileSelector();
      });

    document
      .getElementById("open-phone-link-start")
      .addEventListener("click", () => {
        this.openPhoneLinkApp();
      });

    document
      .getElementById("phone-link-settings-start")
      .addEventListener("click", () => {
        this.openPhoneLinkApp("settings");
      });

    // Taskbar Phone Link
    document
      .getElementById("phone-link-taskbar")
      .addEventListener("click", () => {
        this.togglePhoneLinkApp();
      });

    // App window controls
    document.getElementById("close-app").addEventListener("click", () => {
      this.closePhoneLinkApp();
    });

    // Navigation
    document.querySelectorAll(".nav-item").forEach((item) => {
      item.addEventListener("click", (e) => {
        const view = e.currentTarget.dataset.view;
        this.switchView(view);
      });
    });

    document.querySelector(".settings-btn").addEventListener("click", () => {
      this.switchView("settings");
    });

    // Quick links in dashboard
    document.querySelectorAll(".quick-link-card").forEach((card) => {
      card.addEventListener("click", (e) => {
        const view = e.currentTarget.dataset.view;
        this.switchView(view);
      });
    });

    // Messages functionality
    this.setupMessagesEvents();

    // Photos functionality
    this.setupPhotosEvents();

    // Apps functionality
    this.setupAppsEvents();

    // Calls functionality
    this.setupCallsEvents();

    // Notifications functionality
    this.setupNotificationsEvents();

    // Settings functionality
    this.setupSettingsEvents();

    // Recent photos and messages in start menu
    this.setupStartMenuEvents();

    // Media controls
    this.setupMediaControls();

    // Click outside to close start menu
    document.addEventListener("click", (e) => {
      const startMenu = document.getElementById("start-menu");
      const startBtn = document.getElementById("start-btn");

      if (!startMenu.contains(e.target) && !startBtn.contains(e.target)) {
        startMenu.classList.add("hidden");
      }
    });

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "c":
            if (this.permissions.clipboard) {
              this.copyToClipboard();
            }
            break;
          case "v":
            if (this.permissions.clipboard) {
              this.pasteFromClipboard();
            }
            break;
        }
      }
    });
  }

  setupMessagesEvents() {
    // Conversation selection
    document.addEventListener("click", (e) => {
      if (e.target.closest(".conversation-item")) {
        const conversationId = parseInt(
          e.target.closest(".conversation-item").dataset.conversationId
        );
        this.selectConversation(conversationId);
      }
    });

    // Send message
    const sendMessage = () => {
      const input = document.getElementById("message-input");
      const text = input.value.trim();
      if (text && this.selectedConversation) {
        this.sendMessage(text);
        input.value = "";
      }
    };

    document.querySelector(".send-btn").addEventListener("click", sendMessage);
    document
      .getElementById("message-input")
      .addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          sendMessage();
        }
      });

    // Attachment button
    document.querySelector(".attachment-btn").addEventListener("click", () => {
      document.getElementById("file-input").click();
    });

    // File input change
    document.getElementById("file-input").addEventListener("change", (e) => {
      if (e.target.files.length > 0) {
        this.handleFileAttachment(e.target.files[0]);
      }
    });

    // Emoji button
    document.querySelector(".emoji-btn").addEventListener("click", () => {
      // Simulate emoji picker
      const emojis = ["😀", "😂", "❤️", "👍", "🔥", "💯", "😊", "🤔"];
      const emoji = emojis[Math.floor(Math.random() * emojis.length)];
      const input = document.getElementById("message-input");
      input.value += emoji;
      input.focus();
    });
  }

  setupPhotosEvents() {
    // Photo click to open viewer
    document.addEventListener("click", (e) => {
      if (
        e.target.closest(".photo-item") ||
        e.target.closest(".photo-thumbnail")
      ) {
        const photoElement =
          e.target.closest(".photo-item") ||
          e.target.closest(".photo-thumbnail");
        const photoUrl =
          photoElement.querySelector("img")?.src ||
          photoElement.dataset.photoUrl;
        if (photoUrl) {
          this.openPhotoViewer(photoUrl);
        }
      }
    });

    // Photo viewer controls
    document
      .getElementById("close-photo-viewer")
      .addEventListener("click", () => {
        this.closePhotoViewer();
      });

    document.getElementById("download-photo").addEventListener("click", () => {
      this.downloadPhoto();
    });

    document.getElementById("open-on-phone").addEventListener("click", () => {
      this.showToast("Photo opened on phone");
    });

    document.getElementById("share-photo").addEventListener("click", () => {
      this.sharePhoto();
    });

    // Send photos button
    document.querySelector(".send-photos-btn").addEventListener("click", () => {
      this.triggerFileSelector();
    });
  }

  setupAppsEvents() {
    // App launch
    document.addEventListener("click", (e) => {
      if (e.target.closest(".app-item")) {
        const appName = e.target
          .closest(".app-item")
          .querySelector(".app-name").textContent;
        this.launchApp(appName);
      }
    });

    // Open phone screen
    document
      .querySelector(".open-phone-screen-btn")
      .addEventListener("click", () => {
        this.openPhoneScreen();
      });

    // Mirror window controls
    document.getElementById("close-mirror").addEventListener("click", () => {
      this.closeMirrorWindow();
    });
  }

  setupCallsEvents() {
    // Dial pad
    document.querySelectorAll(".dial-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const digit = e.currentTarget.dataset.digit;
        this.addDialDigit(digit);
      });
    });

    // Make call
    document.getElementById("make-call-btn").addEventListener("click", () => {
      const number = document.getElementById("dial-input").value;
      if (number) {
        this.makeCall(number);
      }
    });

    // Call history item click
    document.addEventListener("click", (e) => {
      if (e.target.closest(".call-history-item")) {
        const number = e.target.closest(".call-history-item").dataset.number;
        this.makeCall(number);
      }
    });

    // Contact search
    document.getElementById("contact-search").addEventListener("input", (e) => {
      this.filterCallHistory(e.target.value);
    });
  }

  setupNotificationsEvents() {
    // Clear all notifications
    document.querySelector(".clear-all-btn").addEventListener("click", () => {
      this.clearAllNotifications();
    });

    // Dismiss individual notification
    document.addEventListener("click", (e) => {
      if (e.target.closest(".notification-dismiss")) {
        e.stopPropagation();
        const notificationId = parseInt(
          e.target.closest(".notification-item").dataset.notificationId
        );
        this.dismissNotification(notificationId);
      }
    });

    // Notification click
    document.addEventListener("click", (e) => {
      if (e.target.closest(".notification-item")) {
        const notificationId = parseInt(
          e.target.closest(".notification-item").dataset.notificationId
        );
        this.handleNotificationClick(notificationId);
      }
    });
  }

  setupSettingsEvents() {
    // Settings tabs
    document.querySelectorAll(".settings-tab").forEach((tab) => {
      tab.addEventListener("click", (e) => {
        const tabName = e.currentTarget.dataset.tab;
        this.switchSettingsTab(tabName);
      });
    });

    // Theme selector
    document
      .getElementById("theme-selector")
      .addEventListener("change", (e) => {
        this.setTheme(e.target.value);
      });

    // Toggle switches
    document.querySelectorAll(".toggle-switch input").forEach((toggle) => {
      toggle.addEventListener("change", (e) => {
        const feature = e.currentTarget
          .closest(".setting-item")
          .querySelector("label").textContent;
        this.toggleFeature(feature, e.currentTarget.checked);
      });
    });

    // Browse button
    document.querySelector(".browse-btn").addEventListener("click", () => {
      this.browseFolderPath();
    });
  }

  setupStartMenuEvents() {
    // Recent photos click
    document.addEventListener("click", (e) => {
      if (e.target.closest("#recent-photos-start .photo-thumbnail")) {
        const photoUrl = e.target.closest(".photo-thumbnail").dataset.photoUrl;
        this.openPhoneLinkApp("photos");
        setTimeout(() => this.openPhotoViewer(photoUrl), 300);
      }
    });

    // Recent messages click
    document.addEventListener("click", (e) => {
      if (e.target.closest("#recent-messages-start .message-item")) {
        const conversationId = parseInt(
          e.target.closest(".message-item").dataset.conversationId
        );
        this.openPhoneLinkApp("messages");
        setTimeout(() => this.selectConversation(conversationId), 300);
      }
    });
  }

  setupMediaControls() {
    document
      .querySelector(".media-controls .play-pause")
      .addEventListener("click", () => {
        this.toggleMediaPlayback();
      });

    document
      .querySelectorAll(".media-controls .media-btn")
      .forEach((btn, index) => {
        if (!btn.classList.contains("play-pause")) {
          btn.addEventListener("click", () => {
            if (index === 0) this.previousTrack();
            if (index === 2) this.nextTrack();
          });
        }
      });
  }

  setupDragAndDrop() {
    const dropZone = document.getElementById("drop-zone");
    const photosContent = document.querySelector(
      "#photos-view .photos-content"
    );

    ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
      photosContent.addEventListener(eventName, this.preventDefaults, false);
    });

    ["dragenter", "dragover"].forEach((eventName) => {
      photosContent.addEventListener(
        eventName,
        () => {
          if (this.currentView === "photos") {
            dropZone.classList.add("active");
          }
        },
        false
      );
    });

    ["dragleave", "drop"].forEach((eventName) => {
      photosContent.addEventListener(
        eventName,
        () => {
          dropZone.classList.remove("active");
        },
        false
      );
    });

    photosContent.addEventListener(
      "drop",
      (e) => {
        if (this.currentView === "photos") {
          const files = e.dataTransfer.files;
          this.handleDroppedFiles(files);
        }
      },
      false
    );
  }

  setupClipboard() {
    // Simulate cross-device clipboard
    document.addEventListener("copy", (e) => {
      if (this.permissions.clipboard) {
        this.clipboardData = window.getSelection().toString();
        this.showToast("Copied to cross-device clipboard");
      }
    });

    document.addEventListener("paste", (e) => {
      if (this.permissions.clipboard && this.clipboardData) {
        // Simulate pasting from phone clipboard
        setTimeout(() => {
          this.showToast("Pasted from phone clipboard");
        }, 100);
      }
    });
  }

  // UI State Management
  toggleStartMenu() {
    const startMenu = document.getElementById("start-menu");
    startMenu.classList.toggle("hidden");

    if (!startMenu.classList.contains("hidden")) {
      startMenu.classList.add("fade-in");
    }
  }

  togglePhoneLinkPanel() {
    const panel = document.getElementById("phone-link-panel");
    panel.classList.toggle("hidden");
  }

  openPhoneLinkApp(view = "dashboard") {
    document.getElementById("start-menu").classList.add("hidden");
    document.getElementById("phone-link-app").classList.remove("hidden");
    document.getElementById("phone-link-app").classList.add("fade-in");

    if (view !== "dashboard") {
      this.switchView(view);
    }
  }

  closePhoneLinkApp() {
    document.getElementById("phone-link-app").classList.add("hidden");
  }

  togglePhoneLinkApp() {
    const app = document.getElementById("phone-link-app");
    if (app.classList.contains("hidden")) {
      this.openPhoneLinkApp();
    } else {
      this.closePhoneLinkApp();
    }
  }

  switchView(viewName) {
    // Update navigation
    document.querySelectorAll(".nav-item").forEach((item) => {
      item.classList.remove("active");
    });
    document
      .querySelector(`.nav-item[data-view="${viewName}"]`)
      ?.classList.add("active");

    if (viewName === "settings") {
      document.querySelector(".settings-btn").style.background =
        "var(--primary-color)";
      document.querySelector(".settings-btn").style.color = "white";
    } else {
      document.querySelector(".settings-btn").style.background = "transparent";
      document.querySelector(".settings-btn").style.color =
        "var(--text-secondary)";
    }

    // Update views
    document.querySelectorAll(".view").forEach((view) => {
      view.classList.remove("active");
    });
    document.getElementById(`${viewName}-view`).classList.add("active");

    this.currentView = viewName;

    // Special handling for certain views
    if (viewName === "photos") {
      this.checkPhotosEmpty();
    } else if (viewName === "apps") {
      this.checkAppsEmpty();
    }
  }

  switchSettingsTab(tabName) {
    // Update tabs
    document.querySelectorAll(".settings-tab").forEach((tab) => {
      tab.classList.remove("active");
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add("active");

    // Update panels
    document.querySelectorAll(".settings-panel").forEach((panel) => {
      panel.classList.remove("active");
    });
    document.getElementById(`${tabName}-settings`).classList.add("active");
  }

  updatePhoneStatus() {
    const statusText = this.isConnected
      ? `Connected • ${this.batteryLevel}%`
      : "Disconnected";

    document.querySelectorAll(".phone-name").forEach((el) => {
      el.textContent = this.phoneName;
    });

    document.querySelectorAll(".phone-status").forEach((el) => {
      el.textContent = statusText;
    });

    document.getElementById("connection-status").textContent = statusText;
  }

  // Data Population Methods
  populateRecentPhotos() {
    const container = document.getElementById("recent-photos-start");
    container.innerHTML = "";

    this.photos.slice(0, 4).forEach((photo) => {
      const thumbnail = document.createElement("div");
      thumbnail.className = "photo-thumbnail";
      thumbnail.dataset.photoUrl = photo.url;
      thumbnail.innerHTML = `<img src="${photo.thumbnail}" alt="Photo">`;
      container.appendChild(thumbnail);
    });
  }

  populateRecentMessages() {
    const container = document.getElementById("recent-messages-start");
    container.innerHTML = "";

    this.conversations.slice(0, 3).forEach((conv) => {
      const messageItem = document.createElement("div");
      messageItem.className = "message-item";
      messageItem.dataset.conversationId = conv.id;
      messageItem.innerHTML = `
                <div class="message-avatar">${conv.avatar}</div>
                <div class="message-content">
                    <div class="message-sender">${conv.name}</div>
                    <div class="message-preview">${conv.preview}</div>
                </div>
            `;
      container.appendChild(messageItem);
    });
  }

  populateNotifications() {
    const container = document.getElementById("notifications-list");
    container.innerHTML = "";

    this.notifications.forEach((notification) => {
      const notificationItem = document.createElement("div");
      notificationItem.className = "notification-item";
      notificationItem.dataset.notificationId = notification.id;
      notificationItem.innerHTML = `
                <div class="notification-icon">
                    <i class="${notification.icon}"></i>
                </div>
                <div class="notification-content">
                    <div class="notification-app">${notification.app}</div>
                    <div class="notification-title">${notification.title}</div>
                    <div class="notification-text">${notification.content}</div>
                </div>
                <button class="notification-dismiss">
                    <i class="fas fa-times"></i>
                </button>
            `;
      container.appendChild(notificationItem);
    });
  }

  populateConversations() {
    const container = document.getElementById("conversations-list");
    container.innerHTML = "";

    this.conversations.forEach((conv) => {
      const conversationItem = document.createElement("div");
      conversationItem.className = "conversation-item";
      conversationItem.dataset.conversationId = conv.id;
      conversationItem.innerHTML = `
                <div class="conversation-avatar">${conv.avatar}</div>
                <div class="conversation-info">
                    <div class="conversation-name">${conv.name}</div>
                    <div class="conversation-preview">${conv.preview}</div>
                </div>
                <div class="conversation-time">${conv.time}</div>
            `;
      container.appendChild(conversationItem);
    });
  }

  populatePhotos() {
    const container = document.getElementById("photos-grid");
    container.innerHTML = "";

    this.photos.forEach((photo) => {
      const photoItem = document.createElement("div");
      photoItem.className = "photo-item";
      photoItem.innerHTML = `
                <img src="${photo.thumbnail}" alt="Photo" loading="lazy">
                <div class="photo-overlay">
                    <i class="fas fa-eye"></i>
                </div>
            `;
      photoItem.addEventListener("click", () => {
        this.openPhotoViewer(photo.url);
      });
      container.appendChild(photoItem);
    });
  }

  populateApps() {
    const container = document.getElementById("apps-grid");
    const emptyState = document.getElementById("apps-empty-state");

    if (this.deviceType === "ios" || this.apps.length === 0) {
      container.style.display = "none";
      emptyState.style.display = "flex";
      return;
    }

    container.style.display = "grid";
    emptyState.style.display = "none";
    container.innerHTML = "";

    this.apps.forEach((app) => {
      const appItem = document.createElement("div");
      appItem.className = "app-item";
      appItem.innerHTML = `
                <div class="app-icon" style="background-color: ${app.color}">
                    <i class="${app.icon}"></i>
                </div>
                <div class="app-name">${app.name}</div>
            `;
      container.appendChild(appItem);
    });
  }

  populateCallHistory() {
    const container = document.getElementById("call-history-list");
    container.innerHTML = "";

    this.callHistory.forEach((call) => {
      const callItem = document.createElement("div");
      callItem.className = "call-history-item";
      callItem.dataset.number = call.number;

      const iconClass =
        call.type === "incoming"
          ? "fa-phone"
          : call.type === "outgoing"
          ? "fa-phone"
          : "fa-phone-slash";

      callItem.innerHTML = `
                <div class="call-type-icon ${call.type}">
                    <i class="fas ${iconClass}"></i>
                </div>
                <div class="call-info">
                    <div class="call-contact">${call.contact}</div>
                    <div class="call-details">${call.number} • ${
        call.duration || "Missed"
      }</div>
                </div>
                <div class="call-time">${call.time}</div>
            `;
      container.appendChild(callItem);
    });
  }

  // Messages Functionality
  selectConversation(conversationId) {
    this.selectedConversation = this.conversations.find(
      (c) => c.id === conversationId
    );

    // Update UI
    document.querySelectorAll(".conversation-item").forEach((item) => {
      item.classList.remove("active");
    });
    document
      .querySelector(`[data-conversation-id="${conversationId}"]`)
      .classList.add("active");

    // Update conversation header
    const header = document.getElementById("conversation-header");
    header.querySelector(".contact-name").textContent =
      this.selectedConversation.name;
    header.querySelector(".contact-avatar").textContent =
      this.selectedConversation.avatar;

    // Load messages
    this.loadMessages();

    // Show input container
    document.getElementById("message-input-container").style.display = "block";
  }

  loadMessages() {
    const container = document.getElementById("messages-container");
    container.innerHTML = "";

    this.selectedConversation.messages.forEach((message) => {
      const messageDiv = document.createElement("div");
      messageDiv.className = `message-bubble ${
        message.sent ? "sent" : "received"
      }`;
      messageDiv.innerHTML = `
                ${message.text}
                <div class="message-time">${message.time}</div>
            `;
      container.appendChild(messageDiv);
    });

    container.scrollTop = container.scrollHeight;
  }

  sendMessage(text) {
    const newMessage = {
      id: Date.now(),
      text: text,
      sent: true,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    this.selectedConversation.messages.push(newMessage);
    this.loadMessages();

    // Update conversation preview
    this.selectedConversation.preview = text;
    this.selectedConversation.time = "Now";
    this.populateConversations();
    this.populateRecentMessages();

    // Re-select the conversation
    document
      .querySelector(`[data-conversation-id="${this.selectedConversation.id}"]`)
      .classList.add("active");

    // Simulate response (optional)
    setTimeout(() => {
      this.simulateIncomingMessage();
    }, 2000 + Math.random() * 3000);
  }

  simulateIncomingMessage() {
    if (!this.selectedConversation) return;

    const responses = [
      "Thanks for your message!",
      "Got it 👍",
      "I'll get back to you soon",
      "Sounds good!",
      "Perfect timing!",
      "Absolutely!",
      "No problem at all",
      "Will do!",
    ];

    const response = responses[Math.floor(Math.random() * responses.length)];
    const newMessage = {
      id: Date.now(),
      text: response,
      sent: false,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    this.selectedConversation.messages.push(newMessage);
    this.loadMessages();

    // Update conversation preview
    this.selectedConversation.preview = response;
    this.selectedConversation.time = "Now";
    this.populateConversations();
    this.populateRecentMessages();

    // Re-select the conversation
    document
      .querySelector(`[data-conversation-id="${this.selectedConversation.id}"]`)
      .classList.add("active");

    // Show notification
    this.showIncomingMessageNotification(
      this.selectedConversation.name,
      response
    );
  }

  handleFileAttachment(file) {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.sendMessage(`📷 Image: ${file.name}`);
        this.showToast("Image sent to phone");
      };
      reader.readAsDataURL(file);
    } else {
      this.sendMessage(`📎 File: ${file.name}`);
      this.showToast("File sent to phone");
    }
  }

  // Photos Functionality
  openPhotoViewer(photoUrl) {
    document.getElementById("photo-viewer").classList.remove("hidden");
    document.getElementById("photo-viewer-image").src = photoUrl;
  }

  closePhotoViewer() {
    document.getElementById("photo-viewer").classList.add("hidden");
  }

  downloadPhoto() {
    const photoUrl = document.getElementById("photo-viewer-image").src;
    const link = document.createElement("a");
    link.href = photoUrl;
    link.download = `photo-${Date.now()}.jpg`;
    link.click();
    this.showToast("Photo downloaded");
  }

  sharePhoto() {
    if (navigator.share) {
      navigator.share({
        title: "Photo from Phone Link",
        text: "Check out this photo from my phone!",
        url: document.getElementById("photo-viewer-image").src,
      });
    } else {
      this.copyToClipboard(document.getElementById("photo-viewer-image").src);
      this.showToast("Photo URL copied to clipboard");
    }
  }

  handleDroppedFiles(files) {
    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        // Simulate sending to phone
        this.showToast(`Sending ${file.name} to phone...`);

        setTimeout(() => {
          // Add to photos
          const reader = new FileReader();
          reader.onload = (e) => {
            const newPhoto = {
              id: Date.now(),
              url: e.target.result,
              thumbnail: e.target.result,
              date: new Date().toLocaleDateString(),
            };
            this.photos.unshift(newPhoto);
            this.populatePhotos();
            this.populateRecentPhotos();
            this.showToast("Photo sent successfully");
          };
          reader.readAsDataURL(file);
        }, 1000);
      }
    });
  }

  triggerFileSelector() {
    document.getElementById("file-input").click();
  }

  checkPhotosEmpty() {
    const grid = document.getElementById("photos-grid");
    const emptyState = document.getElementById("photos-empty-state");

    if (this.photos.length === 0) {
      grid.style.display = "none";
      emptyState.style.display = "flex";
    } else {
      grid.style.display = "grid";
      emptyState.style.display = "none";
    }
  }

  // Apps Functionality
  launchApp(appName) {
    if (this.deviceType === "ios") {
      this.showToast("App mirroring not available on iOS");
      return;
    }

    this.openMirrorWindow(appName);
  }

  openPhoneScreen() {
    if (this.deviceType === "ios") {
      this.showToast("Screen mirroring not available on iOS");
      return;
    }

    this.openMirrorWindow("Phone Screen");
  }

  openMirrorWindow(appName) {
    const mirror = document.getElementById("app-mirror");
    document.getElementById("mirrored-app-name").textContent = appName;
    document.getElementById("mirrored-app-content").innerHTML = `
            <div style="text-align: center; color: #666; padding: 40px;">
                <i class="fas fa-mobile-alt" style="font-size: 48px; margin-bottom: 16px;"></i>
                <h3 style="margin-bottom: 8px;">${appName}</h3>
                <p>Click and drag to interact with the app</p>
                <p style="font-size: 12px; margin-top: 16px;">Simulated app interface</p>
            </div>
        `;
    mirror.classList.remove("hidden");
    mirror.classList.add("fade-in");
  }

  closeMirrorWindow() {
    document.getElementById("app-mirror").classList.add("hidden");
  }

  checkAppsEmpty() {
    const grid = document.getElementById("apps-grid");
    const emptyState = document.getElementById("apps-empty-state");

    if (this.deviceType === "ios" || this.apps.length === 0) {
      grid.style.display = "none";
      emptyState.style.display = "flex";
    } else {
      grid.style.display = "grid";
      emptyState.style.display = "none";
    }
  }

  // Calls Functionality
  addDialDigit(digit) {
    const input = document.getElementById("dial-input");
    input.value += digit;
  }

  makeCall(number) {
    if (!this.permissions.calls) {
      this.showToast(
        "Bluetooth is required for calls. Please enable Bluetooth."
      );
      return;
    }

    this.showToast(`Calling ${number}...`);

    // Add to call history
    const newCall = {
      id: Date.now(),
      contact: "Unknown",
      number: number,
      type: "outgoing",
      duration: "0:00",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: "Today",
    };

    this.callHistory.unshift(newCall);
    this.populateCallHistory();

    // Clear dial input
    document.getElementById("dial-input").value = "";

    // Simulate call duration
    setTimeout(() => {
      this.showToast("Call ended");
      // Update duration
      newCall.duration = `${Math.floor(Math.random() * 10)}:${String(
        Math.floor(Math.random() * 60)
      ).padStart(2, "0")}`;
      this.populateCallHistory();
    }, 3000 + Math.random() * 7000);
  }

  filterCallHistory(query) {
    const items = document.querySelectorAll(".call-history-item");
    items.forEach((item) => {
      const text = item.textContent.toLowerCase();
      const matches = text.includes(query.toLowerCase());
      item.style.display = matches ? "flex" : "none";
    });
  }

  // Notifications Functionality
  clearAllNotifications() {
    this.notifications = [];
    document.getElementById("notifications-list").innerHTML = "";
    this.showToast("All notifications cleared");
  }

  dismissNotification(notificationId) {
    this.notifications = this.notifications.filter(
      (n) => n.id !== notificationId
    );
    document
      .querySelector(`[data-notification-id="${notificationId}"]`)
      .remove();
    this.showToast("Notification dismissed");
  }

  handleNotificationClick(notificationId) {
    const notification = this.notifications.find(
      (n) => n.id === notificationId
    );
    if (notification) {
      if (notification.app === "WhatsApp") {
        this.switchView("messages");
      } else if (notification.app === "Spotify") {
        this.showToast(`Opening ${notification.app} on phone`);
      } else {
        this.showToast(`Launching ${notification.app} on phone`);
      }
    }
  }

  showIncomingMessageNotification(sender, message) {
    // Add to notifications
    const newNotification = {
      id: Date.now(),
      app: "Messages",
      icon: "fas fa-comment",
      title: `New message from ${sender}`,
      content: message,
      time: "Now",
    };

    this.notifications.unshift(newNotification);
    this.populateNotifications();
  }

  // Media Controls
  toggleMediaPlayback() {
    const playBtn = document.querySelector(".play-pause i");
    const isPlaying = playBtn.classList.contains("fa-pause");

    if (isPlaying) {
      playBtn.className = "fas fa-play";
      this.showToast("Music paused");
    } else {
      playBtn.className = "fas fa-pause";
      this.showToast("Music playing");
    }
  }

  previousTrack() {
    this.showToast("Previous track");
    this.updateTrackInfo("Previous Song", "Artist Name");
  }

  nextTrack() {
    this.showToast("Next track");
    this.updateTrackInfo("Next Song", "Artist Name");
  }

  updateTrackInfo(title, artist) {
    document.querySelector(".track-title").textContent = title;
    document.querySelector(".track-artist").textContent = artist;
  }

  // Settings Functionality
  setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("phonelink-theme", theme);

    if (theme === "system") {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      document.documentElement.setAttribute(
        "data-theme",
        prefersDark ? "dark" : "light"
      );
    }
  }

  toggleFeature(feature, enabled) {
    const featureName = feature.toLowerCase().replace(/\s+/g, "");

    switch (featureName) {
      case "notifications":
        this.permissions.notifications = enabled;
        break;
      case "messages":
        this.permissions.messages = enabled;
        break;
      case "photos":
        this.permissions.photos = enabled;
        break;
      case "apps":
        this.permissions.apps = enabled;
        break;
      case "calls":
        this.permissions.calls = enabled;
        break;
      case "cross-devicecopyandpaste":
        this.permissions.clipboard = enabled;
        break;
      case "instanthotspot":
        this.permissions.hotspot = enabled;
        break;
    }

    this.saveSettings();
    this.showToast(`${feature} ${enabled ? "enabled" : "disabled"}`);
  }

  browseFolderPath() {
    this.showToast("Folder browser opened");
    // In a real implementation, this would open a folder selection dialog
  }

  loadSettings() {
    const settings = localStorage.getItem("phonelink-settings");
    if (settings) {
      this.permissions = { ...this.permissions, ...JSON.parse(settings) };
    }
  }

  saveSettings() {
    localStorage.setItem(
      "phonelink-settings",
      JSON.stringify(this.permissions)
    );
  }

  // Utility Methods
  updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const dateString = now.toLocaleDateString();

    document.getElementById("taskbar-time").textContent = timeString;
    document.getElementById("taskbar-date").textContent = dateString;

    // Update status bar time in mirror
    document.querySelectorAll(".status-bar .time").forEach((el) => {
      el.textContent = timeString.replace(/:\d{2}\s/, " ");
    });

    setTimeout(() => this.updateTime(), 60000); // Update every minute
  }

  showToast(message) {
    // Create toast notification
    const toast = document.createElement("div");
    toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--background-primary);
            color: var(--text-primary);
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            border: 1px solid var(--border-color);
            z-index: 10000;
            font-size: 14px;
            max-width: 300px;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
    toast.textContent = message;
    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => {
      toast.style.transform = "translateX(0)";
    }, 10);

    // Remove after 3 seconds
    setTimeout(() => {
      toast.style.transform = "translateX(100%)";
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  }

  copyToClipboard(text = null) {
    const textToCopy = text || window.getSelection().toString();
    if (textToCopy && this.permissions.clipboard) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        this.clipboardData = textToCopy;
        this.showToast("Copied to cross-device clipboard");
      });
    }
  }

  pasteFromClipboard() {
    if (this.clipboardData && this.permissions.clipboard) {
      // Simulate pasting cross-device content
      const activeElement = document.activeElement;
      if (
        activeElement &&
        (activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA")
      ) {
        activeElement.value += this.clipboardData;
        this.showToast("Pasted from phone clipboard");
      }
    }
  }

  preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }
}

// Initialize the emulator when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.phoneLinkEmulator = new PhoneLinkEmulator();
});

// Handle system theme changes
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (e) => {
    const currentTheme = localStorage.getItem("phonelink-theme");
    if (!currentTheme || currentTheme === "system") {
      document.documentElement.setAttribute(
        "data-theme",
        e.matches ? "dark" : "light"
      );
    }
  });

// Handle window resize for responsive behavior
window.addEventListener("resize", () => {
  const app = document.getElementById("phone-link-app");
  const startMenu = document.getElementById("start-menu");

  if (window.innerWidth < 1024) {
    app.style.width = "100vw";
    app.style.height = "100vh";
    app.style.top = "0";
    app.style.left = "0";
    app.style.borderRadius = "0";

    startMenu.style.width = "90vw";
    startMenu.style.height = "80vh";
  } else {
    app.style.width = "1200px";
    app.style.height = "800px";
    app.style.top = "50px";
    app.style.left = "50px";
    app.style.borderRadius = "var(--radius-large)";

    startMenu.style.width = "600px";
    startMenu.style.height = "700px";
  }
});
