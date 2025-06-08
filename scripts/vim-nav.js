// Vim-style navigation for true Linux wizards
class VimNavigator {
  constructor() {
    this.focusableElements = [];
    this.currentIndex = -1;
    this.mode = "normal"; // normal, command
    this.commandBuffer = "";
    this.isInitialized = false;

    this.init();
  }

  init() {
    if (this.isInitialized) return;
    this.isInitialized = true;

    this.updateFocusableElements();
    this.setupEventListeners();
    this.createStatusBar();
    this.showVimHint();
  }

  updateFocusableElements() {
    // Get all focusable elements in vim-friendly order
    this.focusableElements = Array.from(
      document.querySelectorAll(
        'a, .theme-option, .theme-toggle, button, [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => {
      return (
        el.offsetWidth > 0 && el.offsetHeight > 0 && !el.disabled && !el.hidden
      );
    });
  }

  setupEventListeners() {
    document.addEventListener("keydown", (e) => this.handleKeyDown(e));

    // Update focusable elements when DOM changes
    const observer = new MutationObserver(() => {
      this.updateFocusableElements();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  createStatusBar() {
    const statusBar = document.createElement("div");
    statusBar.id = "vim-status";
    statusBar.className = "vim-status";
    statusBar.innerHTML =
      '<span id="vim-mode">-- NORMAL --</span> <span id="vim-command"></span>';
    document.body.appendChild(statusBar);
  }

  showVimHint() {
    // Show neovim keybindings hint for a few seconds
    const hint = document.createElement("div");
    hint.className = "vim-hint";
    hint.innerHTML = `
      <div style="margin-bottom: 8px;"><strong>🚀 Neovim Navigation Active!</strong></div>
      <div><kbd>j</kbd>/<kbd>k</kbd>: ↓/↑ navigate | <kbd>Enter</kbd>: activate | <kbd>/</kbd>: search</div>
      <div><kbd>gg</kbd>: top | <kbd>G</kbd>: bottom | <kbd>Esc</kbd>: clear | <kbd>?</kbd>: help</div>
      <div><kbd>:</kbd>: command mode | <kbd>1-9</kbd>: jump to element</div>
    `;
    document.body.appendChild(hint);

    setTimeout(() => {
      hint.style.opacity = "0";
      setTimeout(() => hint.remove(), 300);
    }, 5000);
  }

  handleKeyDown(e) {
    // Don't interfere with input fields
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
      return;
    }

    if (this.mode === "command") {
      this.handleCommandMode(e);
      return;
    }

    // Normal mode vim bindings
    switch (e.key.toLowerCase()) {
      case "j":
        e.preventDefault();
        this.navigateDown();
        break;
      case "k":
        e.preventDefault();
        this.navigateUp();
        break;
      case "h":
        e.preventDefault();
        this.navigateLeft();
        break;
      case "l":
        e.preventDefault();
        this.navigateRight();
        break;
      case "Enter":
        e.preventDefault();
        this.activateCurrentElement();
        break;
      case "Escape":
        e.preventDefault();
        this.clearFocus();
        break;
      case "/":
        e.preventDefault();
        this.startSearch();
        break;
      case ":":
        e.preventDefault();
        this.startCommand();
        break;
      case "g":
        if (this.commandBuffer === "g") {
          e.preventDefault();
          this.goToTop();
          this.commandBuffer = "";
        } else {
          this.commandBuffer = "g";
          setTimeout(() => (this.commandBuffer = ""), 1000);
        }
        break;
      case "G":
        e.preventDefault();
        this.goToBottom();
        break;
      case "?":
        e.preventDefault();
        this.showHelp();
        break;
      case "0":
        e.preventDefault();
        this.goToFirst();
        break;
      case "$":
        e.preventDefault();
        this.goToLast();
        break;
      case " ":
        e.preventDefault();
        this.activateCurrentElement();
        break;
      case "w":
        e.preventDefault();
        this.wordForward();
        break;
      case "b":
        e.preventDefault();
        this.wordBackward();
        break;
      default:
        // Handle number keys for direct navigation
        if (e.key >= "1" && e.key <= "9") {
          e.preventDefault();
          const index = parseInt(e.key) - 1;
          if (index < this.focusableElements.length) {
            this.focusElement(index);
          }
        }
        break;
    }
  }

  handleCommandMode(e) {
    const commandSpan = document.getElementById("vim-command");

    if (e.key === "Escape") {
      e.preventDefault();
      this.exitCommandMode();
    } else if (e.key === "Enter") {
      e.preventDefault();
      this.executeCommand();
    } else if (e.key === "Backspace") {
      e.preventDefault();
      this.commandBuffer = this.commandBuffer.slice(0, -1);
      if (commandSpan) commandSpan.textContent = ":" + this.commandBuffer;
    } else if (e.key.length === 1) {
      e.preventDefault();
      this.commandBuffer += e.key;
      if (commandSpan) commandSpan.textContent = ":" + this.commandBuffer;
    }
  }

  navigateDown() {
    if (this.focusableElements.length === 0) return;
    this.currentIndex = (this.currentIndex + 1) % this.focusableElements.length;
    this.focusElement(this.currentIndex);
  }

  navigateUp() {
    if (this.focusableElements.length === 0) return;
    this.currentIndex =
      this.currentIndex <= 0
        ? this.focusableElements.length - 1
        : this.currentIndex - 1;
    this.focusElement(this.currentIndex);
  }

  navigateLeft() {
    // For horizontal navigation within the same row
    this.navigateUp();
  }

  navigateRight() {
    // For horizontal navigation within the same row
    this.navigateDown();
  }

  focusElement(index) {
    // Clear previous focus
    this.clearFocus();

    if (index >= 0 && index < this.focusableElements.length) {
      this.currentIndex = index;
      const element = this.focusableElements[index];
      element.classList.add("vim-focused");
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  clearFocus() {
    document.querySelectorAll(".vim-focused").forEach((el) => {
      el.classList.remove("vim-focused");
    });
    this.currentIndex = -1;
  }

  activateCurrentElement() {
    if (
      this.currentIndex >= 0 &&
      this.currentIndex < this.focusableElements.length
    ) {
      const element = this.focusableElements[this.currentIndex];

      if (element.tagName === "A") {
        // Navigate to link
        if (element.target === "_blank") {
          window.open(element.href, "_blank");
        } else {
          window.location.href = element.href;
        }
      } else {
        // Trigger click event
        element.click();
      }
    }
  }

  goToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (this.focusableElements.length > 0) {
      this.focusElement(0);
    }
  }

  goToBottom() {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    if (this.focusableElements.length > 0) {
      this.focusElement(this.focusableElements.length - 1);
    }
  }

  goToFirst() {
    if (this.focusableElements.length > 0) {
      this.focusElement(0);
    }
  }

  goToLast() {
    if (this.focusableElements.length > 0) {
      this.focusElement(this.focusableElements.length - 1);
    }
  }

  wordForward() {
    // Jump forward by 3 elements (like word movement)
    if (this.focusableElements.length === 0) return;
    const newIndex = Math.min(
      this.currentIndex + 3,
      this.focusableElements.length - 1
    );
    this.focusElement(newIndex);
  }

  wordBackward() {
    // Jump backward by 3 elements (like word movement)
    if (this.focusableElements.length === 0) return;
    const newIndex = Math.max(this.currentIndex - 3, 0);
    this.focusElement(newIndex);
  }

  startSearch() {
    // Simple search implementation
    const searchTerm = prompt("Search for:");
    if (searchTerm) {
      this.searchAndHighlight(searchTerm);
    }
  }

  startCommand() {
    this.mode = "command";
    this.commandBuffer = "";
    const modeElement = document.getElementById("vim-mode");
    const commandElement = document.getElementById("vim-command");
    if (modeElement) modeElement.textContent = "-- COMMAND --";
    if (commandElement) commandElement.textContent = ":";
  }

  exitCommandMode() {
    this.mode = "normal";
    this.commandBuffer = "";
    const modeElement = document.getElementById("vim-mode");
    const commandElement = document.getElementById("vim-command");
    if (modeElement) modeElement.textContent = "-- NORMAL --";
    if (commandElement) commandElement.textContent = "";
  }

  executeCommand() {
    const cmd = this.commandBuffer.trim();

    switch (cmd) {
      case "q":
      case "quit":
        window.close();
        break;
      case "home":
      case "h":
        window.location.href = "/";
        break;
      case "about":
      case "a":
        window.location.href = "/about";
        break;
      case "blog":
      case "b":
        window.location.href = "/blog";
        break;
      case "help":
        this.showHelp();
        break;
      case "theme":
      case "t":
        // Focus on first theme option
        const themeOption = document.querySelector(".theme-option");
        if (themeOption) {
          const index = this.focusableElements.indexOf(themeOption);
          if (index >= 0) this.focusElement(index);
        }
        break;
      default:
        // Check if it's a number for direct navigation
        const num = parseInt(cmd);
        if (!isNaN(num) && num > 0 && num <= this.focusableElements.length) {
          this.focusElement(num - 1);
        }
        break;
    }

    this.exitCommandMode();
  }

  searchAndHighlight(term) {
    // Simple text search and focus on matching element
    const searchTerm = term.toLowerCase();
    for (let i = 0; i < this.focusableElements.length; i++) {
      const element = this.focusableElements[i];
      const text = element.textContent.toLowerCase();
      if (text.includes(searchTerm)) {
        this.focusElement(i);
        break;
      }
    }
  }

  showHelp() {
    const helpModal = document.createElement("div");
    helpModal.className = "vim-help-modal";
    helpModal.innerHTML = `
      <div class="vim-help-content">
        <h3>🚀 Neovim Navigation Help</h3>
        <div class="help-section">
          <h4>Basic Movement:</h4>
          <p><kbd>j</kbd> - Navigate down</p>
          <p><kbd>k</kbd> - Navigate up</p>
          <p><kbd>h</kbd>/<kbd>l</kbd> - Navigate left/right</p>
          <p><kbd>1-9</kbd> - Jump to element by number</p>
        </div>
        <div class="help-section">
          <h4>Advanced Movement:</h4>
          <p><kbd>gg</kbd> - Go to top</p>
          <p><kbd>G</kbd> - Go to bottom</p>
          <p><kbd>0</kbd> - Go to first element</p>
          <p><kbd>$</kbd> - Go to last element</p>
          <p><kbd>w</kbd> - Word forward (jump 3 elements)</p>
          <p><kbd>b</kbd> - Word backward (jump 3 elements)</p>
        </div>
        <div class="help-section">
          <h4>Actions:</h4>
          <p><kbd>Enter</kbd>/<kbd>Space</kbd> - Activate focused element</p>
          <p><kbd>Esc</kbd> - Clear focus</p>
          <p><kbd>/</kbd> - Search</p>
        </div>
        <div class="help-section">
          <h4>Command Mode:</h4>
          <p><kbd>:q</kbd> - Quit (close tab)</p>
          <p><kbd>:home</kbd> - Go to homepage</p>
          <p><kbd>:about</kbd> - Go to about page</p>
          <p><kbd>:blog</kbd> - Go to blog</p>
          <p><kbd>:theme</kbd> - Focus theme selector</p>
        </div>
        <p style="margin-top: 16px; text-align: center;">Press <kbd>Esc</kbd> to close</p>
      </div>
    `;

    document.body.appendChild(helpModal);

    const closeHelp = (e) => {
      if (e.key === "Escape" || e.target === helpModal) {
        helpModal.remove();
        document.removeEventListener("keydown", closeHelp);
      }
    };

    document.addEventListener("keydown", closeHelp);
    helpModal.addEventListener("click", closeHelp);
  }
}

// Initialize neovim navigation when DOM is ready
function initVimNav() {
  // Wait a bit to ensure all other scripts have loaded
  setTimeout(() => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => new VimNavigator());
    } else {
      new VimNavigator();
    }
  }, 100);
}

// Initialize immediately if DOM is already loaded, otherwise wait
initVimNav();
