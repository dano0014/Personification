const TAGS = ["Safety", "Privacy", "Citizenship", "Wellbeing"];
const tagRow = document.getElementById("tagRow");
const playlistContainer = document.getElementById("playlistContainer");
const user = JSON.parse(localStorage.getItem("currentUser"));
const child = JSON.parse(localStorage.getItem("presentChild"));

let playlists = [];
let activeTag = null;

// Create tag buttons and add click listeners
function renderTags() {
  tagRow.innerHTML = "";

  // Add an "All" tag for resetting filters
  const allTag = document.createElement("div");
  allTag.className = "tag";
  allTag.textContent = "All";
  allTag.dataset.tag = "";
  if (!activeTag) allTag.classList.add("active");
  allTag.addEventListener("click", () => {
    activeTag = null;
    updateTagSelection();
    renderPlaylists();
  });
  tagRow.appendChild(allTag);

  TAGS.forEach(tag => {
    const tagDiv = document.createElement("div");
    tagDiv.className = "tag";
    tagDiv.textContent = tag;
    tagDiv.dataset.tag = tag;
    if (activeTag === tag) tagDiv.classList.add("active");
    tagDiv.addEventListener("click", () => {
      activeTag = tag;
      updateTagSelection();
      renderPlaylists();
    });
    tagRow.appendChild(tagDiv);
  });
}

// Highlight the active tag
function updateTagSelection() {
  [...tagRow.children].forEach(tagEl => {
    tagEl.classList.toggle("active", tagEl.dataset.tag === (activeTag || ""));
  });
}

// Create playlist cards from filtered playlists
const addedPlaylists = new Set(child.playlists || []);

function renderPlaylists(filteredTag = null) {
  const container = document.querySelector(".auth-card");
  container.innerHTML = ""; // Clear previous playlists

  const filtered = filteredTag
    ? playlists.filter(pl => pl.tag === filteredTag && !addedPlaylists.has(pl.id))
    : playlists.filter(pl => !addedPlaylists.has(pl.id));

  if (filtered.length === 0) {
    container.innerHTML = `<p>No playlists available for this category.</p>`;
    return;
  }

  filtered.forEach(pl => {
    const card = document.createElement("div");
    card.className = "playlist-card";

    const img = document.createElement("img");
    img.src = "https://placehold.co/376x211";
    img.alt = pl.title;

    const title = document.createElement("div");
    title.className = "playlist-title";
    title.textContent = pl.title;

    const desc = document.createElement("div");
    desc.className = "playlist-desc";
    desc.textContent = `Created by ${pl.creator}. Recommended trust level: ${pl.recommendedTrustLevel}`;

    const btn = document.createElement("button");
    btn.className = "button";
    btn.textContent = "Add to Journey";

    btn.addEventListener("click", () => {
      addedPlaylists.add(pl.id);

      if (!child.playlists) {
        child.playlists = [];
      }
      if (!child.playlists.includes(pl.id)) {
        child.playlists.push(pl.id);
      }

      if (user && user.children && Array.isArray(user.children)) {
        const childIndex = user.children.findIndex(c => c.id === child.id);
        if (childIndex !== -1) {
          user.children[childIndex] = child;
        }
      }

      localStorage.setItem("presentChild", JSON.stringify(child));
      localStorage.setItem("currentUser", JSON.stringify(user));

      renderPlaylists(filteredTag); // Re-render to remove added playlist from view
    });

    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(desc);
    card.appendChild(btn);

    container.appendChild(card);
  });
}


// Load playlists.json and initialize
async function init() {
  try {
    const res = await fetch("../data/playlists.json");
    playlists = await res.json();

    renderTags();
    renderPlaylists();
  } catch (error) {
    playlistContainer.textContent = "Failed to load playlists.";
    console.error(error);
  }
}

init();
