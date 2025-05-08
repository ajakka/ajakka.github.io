// ASCII Art for the name "Abderrahim"
document.addEventListener("DOMContentLoaded", function () {
  const asciiArt = [
    "&nbsp;&nbsp;&nbsp;&nbsp;_&nbsp;&nbsp;&nbsp;&nbsp;_&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;",
    "&nbsp;&nbsp;&nbsp;/&nbsp;\\&nbsp;&nbsp;|&nbsp;|__&nbsp;&nbsp;&nbsp;__|&nbsp;|&nbsp;___&nbsp;_&nbsp;__&nbsp;_&nbsp;__&nbsp;__&nbsp;_|&nbsp;|__&nbsp;(_)_&nbsp;__&nbsp;___&nbsp;&nbsp;",
    "&nbsp;&nbsp;/&nbsp;_&nbsp;\\&nbsp;|&nbsp;'_&nbsp;\\&nbsp;/&nbsp;_`&nbsp;|/&nbsp;_&nbsp;\\&nbsp;'__|&nbsp;'__/&nbsp;_`&nbsp;|&nbsp;'_&nbsp;\\|&nbsp;|&nbsp;'_&nbsp;`&nbsp;_&nbsp;\\&nbsp;",
    "&nbsp;/&nbsp;___&nbsp;\\|&nbsp;|_)&nbsp;|&nbsp;(_|&nbsp;|&nbsp;&nbsp;__/&nbsp;|&nbsp;&nbsp;|&nbsp;|&nbsp;|&nbsp;(_|&nbsp;|&nbsp;|&nbsp;|&nbsp;|&nbsp;|&nbsp;|&nbsp;|&nbsp;|&nbsp;|&nbsp;|",
    "/_/&nbsp;&nbsp;&nbsp;\\_\\_.__/&nbsp;\\__,_|\\___|_|&nbsp;&nbsp;|_|&nbsp;&nbsp;\\__,_|_|&nbsp;|_|_|_|&nbsp;|_|&nbsp;|_|",
  ];

  const asciiArtElement = document.getElementById("ascii-art");

  // Inject the ASCII art
  asciiArtElement.innerHTML = asciiArt.join("<br>");
});
