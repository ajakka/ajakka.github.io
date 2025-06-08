// Konami Code Easter Egg - ↑↑↓↓←→←→BA
class KonamiCode {
  constructor() {
    this.sequence = [
      "ArrowUp",
      "ArrowUp",
      "ArrowDown",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "ArrowLeft",
      "ArrowRight",
      "KeyB",
      "KeyA",
    ];
    this.userSequence = [];
    this.isActive = false;
    this.effects = [];

    this.init();
  }

  init() {
    document.addEventListener("keydown", (e) => this.handleKeyDown(e));
    this.setupEffects();
  }

  handleKeyDown(e) {
    // Don't interfere with vim navigation or input fields
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
      return;
    }

    // Check if key matches next expected key in sequence
    const expectedKey = this.sequence[this.userSequence.length];

    if (e.code === expectedKey) {
      this.userSequence.push(e.code);

      // If sequence is complete, activate Easter egg
      if (this.userSequence.length === this.sequence.length) {
        this.activateEasterEgg();
        this.userSequence = []; // Reset sequence
      }
    } else {
      // Reset sequence if wrong key is pressed
      this.userSequence = [];
    }
  }

  activateEasterEgg() {
    if (this.isActive) {
      this.deactivateEasterEgg();
      return;
    }

    this.isActive = true;
    this.showKonamiMessage();
    this.activateMatrixRain();
    this.addCRTEffect();
    this.playSound();
  }

  deactivateEasterEgg() {
    this.isActive = false;
    this.effects.forEach((effect) => {
      if (effect.remove) effect.remove();
    });
    this.effects = [];

    // Remove CRT effect
    document.body.classList.remove("konami-crt");

    // Remove matrix canvas
    const matrixCanvas = document.getElementById("matrix-canvas");
    if (matrixCanvas) matrixCanvas.remove();
  }

  showKonamiMessage() {
    const message = document.createElement("div");
    message.className = "konami-message";
    message.innerHTML = `
      <div class="konami-content">
        <h2>🎮 KONAMI CODE ACTIVATED! 🎮</h2>
        <div class="konami-text">
          <p>┌─ SYSTEM BREACHED ─┐</p>
          <p>│ Welcome, hacker!  │</p>
          <p>│ You found the     │</p>
          <p>│ secret entrance   │</p>
          <p>└───────────────────┘</p>
        </div>
        <p style="margin-top: 16px; font-size: 0.9em;">
          Press the Konami Code again to exit the Matrix...
        </p>
      </div>
    `;

    document.body.appendChild(message);
    this.effects.push(message);

    // Auto-hide message after 5 seconds
    setTimeout(() => {
      message.style.opacity = "0";
      setTimeout(() => {
        if (message.parentNode) message.remove();
      }, 500);
    }, 5000);
  }

  activateMatrixRain() {
    const canvas = document.createElement("canvas");
    canvas.id = "matrix-canvas";
    canvas.className = "matrix-canvas";
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Matrix characters
    const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
    const matrixArray = matrix.split("");

    const fontSize = 14;
    const columns = canvas.width / fontSize;

    // Array of drops - one per column
    const drops = [];
    for (let x = 0; x < columns; x++) {
      drops[x] = 1;
    }

    const draw = () => {
      // Black background with slight transparency for trail effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#00ff00"; // Green text
      ctx.font = fontSize + "px monospace";

      // Loop over drops
      for (let i = 0; i < drops.length; i++) {
        // Random character
        const text =
          matrixArray[Math.floor(Math.random() * matrixArray.length)];

        // Draw character
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Reset drop to top randomly
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        // Increment Y coordinate
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 35);

    // Store cleanup function
    canvas.cleanup = () => {
      clearInterval(interval);
      canvas.remove();
    };

    this.effects.push(canvas);

    // Handle window resize
    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  }

  addCRTEffect() {
    document.body.classList.add("konami-crt");
  }

  playSound() {
    // Create a simple beep sound using Web Audio API
    try {
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();

      // Create oscillator for beep sound
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.3
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      // Fallback: no sound if Web Audio API isn't supported
      console.log("🎵 *Konami Code activated sound*");
    }
  }

  setupEffects() {
    // Add CSS for effects if not already present
    if (!document.getElementById("konami-styles")) {
      const style = document.createElement("style");
      style.id = "konami-styles";
      style.textContent = `
        .matrix-canvas {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          pointer-events: none;
          z-index: 9999;
          opacity: 0.7;
        }
        
        .konami-crt {
          animation: crt-flicker 0.15s infinite linear alternate;
        }
        
        .konami-crt::before {
          content: "";
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 255, 0, 0.03) 2px,
            rgba(0, 255, 0, 0.03) 4px
          );
          pointer-events: none;
          z-index: 10000;
        }
        
        @keyframes crt-flicker {
          0% { opacity: 1; }
          98% { opacity: 1; }
          99% { opacity: 0.98; }
          100% { opacity: 1; }
        }
        
        .konami-message {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background-color: rgba(0, 0, 0, 0.9);
          border: 2px solid #00ff00;
          color: #00ff00;
          padding: 24px;
          font-family: "Sometype Mono", monospace;
          text-align: center;
          z-index: 10001;
          border-radius: 8px;
          box-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
          animation: konami-glow 2s ease-in-out infinite alternate;
          transition: opacity 0.5s ease;
        }
        
        .konami-content h2 {
          margin: 0 0 16px 0;
          font-size: 1.4em;
          text-shadow: 0 0 10px #00ff00;
        }
        
        .konami-text {
          font-family: monospace;
          line-height: 1.4;
          margin: 16px 0;
          font-size: 0.9em;
        }
        
        @keyframes konami-glow {
          0% { box-shadow: 0 0 20px rgba(0, 255, 0, 0.5); }
          100% { box-shadow: 0 0 30px rgba(0, 255, 0, 0.8); }
        }
        
        @media (max-width: 480px) {
          .konami-message {
            margin: 20px;
            padding: 16px;
            font-size: 0.9em;
          }
          
          .konami-content h2 {
            font-size: 1.2em;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }
}

// Initialize Konami Code when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  new KonamiCode();
});
