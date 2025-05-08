// Theme toggling functionality
const themeToggle = document.getElementById("theme-toggle");
const themeText = document.getElementById("theme-text");

// Check for saved theme preference
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
  document.body.classList.add("light-mode");
  themeText.textContent = "Lights: ON";
}

// Toggle theme on click
themeToggle.addEventListener("click", () => {
  const isLightMode = document.body.classList.toggle("light-mode");
  themeText.textContent = isLightMode ? "Lights: ON" : "Lights: OFF";

  // Save preference to localStorage
  localStorage.setItem("theme", isLightMode ? "light" : "dark");
});
