import { getCurrentUser, getAllUsers } from './users.js';
document.addEventListener("DOMContentLoaded", async () => {
  const levelsContainer = document.getElementById("level-options-container");
  const currentLevelContainer = document.getElementById("current-level-container");
  const confirmButton = document.getElementById("confirm-button");
  const header = document.getElementById("child-name-header");

  // Fetch child and level info
  const user = getCurrentUser();
  const presentChild = JSON.parse(sessionStorage.getItem("presentChild")) || { name: "Unnamed", trustLevel: 1 };
  const levels = await fetch("data/trust-levels.json").then(res => res.json());

  let selectedLevel = null;

  // Update header
  header.textContent = `Manage ${presentChild.name}'s Trust Level`;

  // Get current level info
  const currentLevelInfo = levels.find(l => l.id === presentChild.trustLevel);

  // Inject current level card
  currentLevelContainer.innerHTML = `
    <div class="current-level-card">
      <div class="level-icon"></div>
      <div>
        <div class="level-title">${currentLevelInfo.title}</div>
        <div class="level-subtitle">${currentLevelInfo.name}</div>
      </div>
    </div>
    <p class="level-description">${currentLevelInfo.description}</p>
  `;

  // Inject selectable level options
  levels.forEach(level => {
    const levelDiv = document.createElement("div");
    levelDiv.className = "level-option";
    if (level.id === currentLevelInfo.id) levelDiv.classList.add("selected"); // Default selected

    levelDiv.innerHTML = `
      <div class="radio ${level.id === currentLevelInfo.id ? "filled" : ""}"></div>
      <div>
        <div class="level-name">${level.name}</div>
        <div class="level-info">${level.description}</div>
      </div>
    `;

    levelDiv.addEventListener("click", () => {
      // Unselect all options
      document.querySelectorAll(".level-option").forEach(el => el.classList.remove("selected"));
      document.querySelectorAll(".radio").forEach(el => el.classList.remove("filled"));

      // Select this one
      levelDiv.classList.add("selected");
      levelDiv.querySelector(".radio").classList.add("filled");
      selectedLevel = level.id;

      confirmButton.disabled = selectedLevel === presentChild.trustLevel;
    });

    levelsContainer.appendChild(levelDiv);
  });

  // Handle confirm button
  confirmButton.addEventListener("click", () => {
    if (selectedLevel && selectedLevel !== presentChild.trustLevel) {
      // Update trust level
      presentChild.trustLevel = selectedLevel;
      sessionStorage.setItem("presentChild", JSON.stringify(presentChild));
    
      if (user && user.role === "Parent") {
        const childIndex = user.children.findIndex(child => child.id === presentChild.id);
      
        if (childIndex !== -1) {
          // Child found — update
          user.children[childIndex] = presentChild;
        } else {
          // Child not found — add
          user.children.push(presentChild);
        }
      
        sessionStorage.setItem("currentUser", JSON.stringify(user));
      }
    
      // Redirect
      window.location.href = "../dashboard.html";
    }
  });



  document.getElementById("back-button").addEventListener("click", () => {
  window.location.href = "../dashboard.html";
  });

});
