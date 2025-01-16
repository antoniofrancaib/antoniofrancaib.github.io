// dark_mode.js (or theme.js)
document.addEventListener('DOMContentLoaded', function() {
    const modeToggle = document.getElementById("light-toggle");
    // on page load, update icons
    updateToggleIcons(localStorage.getItem("theme"));

    modeToggle.addEventListener("click", function() {
        const currentTheme = localStorage.getItem("theme");
        toggleTheme(currentTheme);
        updateToggleIcons(localStorage.getItem("theme"));
    });
});

function toggleTheme(theme) {
  // if theme is dark, set to light; else set to dark
  if (theme === "dark") {
    setTheme("light");
  } else {
    setTheme("dark");
  }
}

function setTheme(theme) {
  // apply data-theme to <html>
  if (theme === "dark") {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme'); // or set 'light'
  }
  localStorage.setItem("theme", theme);
}

// Hide/show icons
function updateToggleIcons(theme) {
  const moonIcon = document.querySelector('#light-toggle .fa-moon');
  const sunIcon  = document.querySelector('#light-toggle .fa-sun');
  if (!moonIcon || !sunIcon) return;

  if (theme === 'dark') {
    // show sun, hide moon
    sunIcon.style.display  = 'inline-block';
    moonIcon.style.display = 'none';
  } else {
    // show moon, hide sun
    sunIcon.style.display  = 'none';
    moonIcon.style.display = 'inline-block';
  }
}
