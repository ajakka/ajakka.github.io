// Theme and lights functionality
const lightsToggle = document.getElementById("theme-toggle");
const lightsText = document.getElementById("theme-text");
const themeSelector = document.getElementById("theme-selector");

// Available theme families
const themeFamily = {
  default: { dark: "", light: "theme-light" },
  terminal: { dark: "theme-terminal-dark", light: "theme-terminal-light" },
  gnome: { dark: "theme-gnome-dark", light: "theme-gnome-light" },
};

let currentTheme = "default";
let isLightsOn = false;

// Check for saved preferences
const savedTheme = localStorage.getItem("selectedTheme") || "default";
const savedLights = localStorage.getItem("lightsOn") === "true";

currentTheme = savedTheme;
isLightsOn = savedLights;

// Apply theme based on current selection and lights state
function applyCurrentTheme() {
  // Remove all theme classes
  document.body.className = document.body.className
    .replace(/theme-\S+/g, "")
    .trim();

  // Apply theme class based on lights state
  const themeClass = isLightsOn
    ? themeFamily[currentTheme].light
    : themeFamily[currentTheme].dark;
  if (themeClass) {
    document.body.classList.add(themeClass);
  }

  // Update lights text
  lightsText.textContent = isLightsOn ? "Lights: ON" : "Lights: OFF";

  // Update active theme option
  document.querySelectorAll(".theme-option").forEach((option) => {
    option.classList.toggle("active", option.dataset.theme === currentTheme);
  });
}

// Apply initial state
applyCurrentTheme();

// Lights toggle functionality
lightsToggle.addEventListener("click", () => {
  isLightsOn = !isLightsOn;
  applyCurrentTheme();
  localStorage.setItem("lightsOn", isLightsOn);
});

// Theme selection functionality
themeSelector.addEventListener("click", (e) => {
  if (e.target.classList.contains("theme-option")) {
    currentTheme = e.target.dataset.theme;
    applyCurrentTheme();
    localStorage.setItem("selectedTheme", currentTheme);
  }
});
