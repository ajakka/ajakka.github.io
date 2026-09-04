// Theme toggling — loaded on every page, so it must survive pages that don't
// render a toggle.
(function () {
  const applyTheme = (isLight) => {
    document.body.classList.toggle("light-mode", isLight);
    const themeText = document.getElementById("theme-text");
    if (themeText) {
      themeText.textContent = isLight ? "Lights: ON" : "Lights: OFF";
    }
  };

  applyTheme(localStorage.getItem("theme") === "light");

  const themeToggle = document.getElementById("theme-toggle");
  if (!themeToggle) return;

  themeToggle.addEventListener("click", () => {
    const isLight = !document.body.classList.contains("light-mode");
    applyTheme(isLight);
    localStorage.setItem("theme", isLight ? "light" : "dark");
  });
})();
