document.addEventListener('DOMContentLoaded', async () => {
  const user = JSON.parse(sessionStorage.getItem("currentUser"));
  const child = JSON.parse(sessionStorage.getItem("presentChild"));
  const playlists = await fetch("data/playlists.json").then(res => res.json());
  const levels = await fetch("data/trust-levels.json").then(res => res.json());
  const appsList = document.getElementById("apps-list");

  if (!child) {
    document.body.innerHTML = "<p>No child data found.</p>";
    return;
  }

  // Welcome message
  document.getElementById("child-welcome").textContent = `Welcome back, ${child.name}!`;

  // Clear existing apps
  appsList.innerHTML = "";
  
  // Load apps.json
  fetch("../data/apps.json")
    .then(res => res.json())
    .then(allApps => {
      if (Array.isArray(child.allowedApps)) {
        child.allowedApps.forEach(appName => {
          // Find the app object in apps.json with matching name
          const appData = allApps.find(app => app.name === appName);
  
          if (appData) {
            // If found, use its real data
            const appCard = document.createElement("div");
            appCard.className = "app-card";
            appCard.innerHTML = `
              <img src="${appData.icon}" alt="${appData.name}" class="app-icon" />
              <div class="app-name">${appData.name}</div>
            `;
            appsList.appendChild(appCard);
          } else {
            // Fallback if app not found in apps.json
            const appCard = document.createElement("div");
            appCard.className = "app-card";
            appCard.innerHTML = `
              <img src="https://placehold.co/160x160?text=${encodeURIComponent(appName)}" class="app-image" />
              <div class="app-name">${appName}</div>
            `;
            appsList.appendChild(appCard);
          }
        });
      }
    })
    .catch(err => {
      console.error("Error loading apps.json:", err);
    });


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
