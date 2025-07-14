document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("playlist-container");
  const child = JSON.parse(sessionStorage.getItem("presentChild"));
  const playlists = await fetch("data/playlists.json").then(res => res.json());

  if (!child || !Array.isArray(child.playlists)) {
    container.innerHTML = "<p>No playlists assigned.</p>";
    return;
  }

  // Filter and render each playlist
  child.playlists.forEach(playlistId => {
    const item = playlists.find(p => p.id === playlistId);
    if (!item) return;

    const article = document.createElement("article");
    article.className = "playlist-item completed";
    article.tabIndex = 0;

    article.innerHTML = `
      <div class="playlist-icon"></div>
      <div class="playlist-info">
        <h2>${item.title}</h2>
        <p class="creator">By: ${item.creator}</p>
        <p class="video-count">${item.videos.length} video(s)</p>
      </div>
      <div class="completion-indicator">
        <div></div>
      </div>
    `;

    container.appendChild(article);
  });
});
