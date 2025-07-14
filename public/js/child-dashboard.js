document.addEventListener('DOMContentLoaded', async () => {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const child = JSON.parse(localStorage.getItem("presentChild"));
  const playlists = await fetch("data/playlists.json").then(res => res.json());
  const levels = await fetch("data/trust-levels.json").then(res => res.json());
  const appsGrid = document.getElementById("apps-grid");

  if (!child) {
    document.body.innerHTML = "<p>No child data found.</p>";
    return;
  }

  // Welcome message
  document.getElementById("child-welcome").textContent = `Welcome back, ${child.name}!`;

  // Load allowed apps
  appsGrid.innerHTML = "";
  if (Array.isArray(child.allowedApps)) {
    child.allowedApps.forEach(appName => {
      const appCard = document.createElement("div");
      appCard.className = "app-card";
      appCard.innerHTML = `
        <img src="https://placehold.co/160x160?text=${encodeURIComponent(appName)}" class="app-image" />
        <div class="app-name">${appName}</div>
      `;
      appsGrid.appendChild(appCard);
    });
  }

  // Load trust level info
  const level = levels.find(l => l.id === child.trustLevel);
  if (level) {
    document.getElementById("trust-banner").innerHTML = `
      <div class="level-label">Level ${level.id}: ${level.title}</div>
      <div class="level-icon"></div>
    `;
  }

  // Navigation buttons
  document.getElementById('learning').addEventListener('click', () => {
    if (user.role === "Child") {
      // Child is logged in
      window.location.href = 'learning-journey.html';
    } else if (user.role === "Parent") {
      // Parent is logged in
      window.location.href = 'parent-learning-view.html';
    } else {
      alert("No user is currently logged in.");
    }
  });

  document.getElementById('request-app').addEventListener('click', () => {
    window.location.href = 'request-app.html';
  });
});
