/* dark_mode.js (or theme.js) */
document.addEventListener('DOMContentLoaded', function() {
    const mode_toggle = document.getElementById("light-toggle");

    // On page load, set correct icon
    setCorrectIcon(localStorage.getItem("theme"));

    mode_toggle.addEventListener("click", function() {
        toggleTheme(localStorage.getItem("theme"));
        setCorrectIcon(localStorage.getItem("theme"));
    });
});

function setCorrectIcon(theme) {
    // If theme is 'dark', show sun icon so user can go to 'light'; else show moon
    let sunIcon = document.querySelector('#light-toggle .fa-sun');
    let moonIcon = document.querySelector('#light-toggle .fa-moon');

    if (!sunIcon || !moonIcon) return; // safety check

    if (theme === 'dark') {
        sunIcon.style.display = "inline-block";
        moonIcon.style.display = "none";
    } else {
        sunIcon.style.display = "none";
        moonIcon.style.display = "inline-block";
    }
}

// existing toggleTheme function from theme.js or wherever:
function toggleTheme(theme) {
  if (theme == "dark") {
    setTheme("light");
  } else {
    setTheme("dark");
  }
}

function setTheme(theme) {
  // your existing code that sets data-theme, etc.
  // ...
  localStorage.setItem("theme", theme);
}
