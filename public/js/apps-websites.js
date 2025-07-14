async function fetchApps() {
  try {
    const res = await fetch('../data/apps.json');
    if (!res.ok) throw new Error('Failed to fetch apps');
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

function createAppElement(app, index) {
  const appItem = document.createElement('div');
  appItem.classList.add('app-item');
  appItem.dataset.appId = `app-${index}`;

  appItem.innerHTML = `
    <img src="${app.icon}" alt="${app.name}" class="app-icon">
    <div class="app-name">${app.name}</div>
    <div class="app-actions">
      <button class="approve-button">Approve</button>
      <button class="deny-button">Deny</button>
    </div>
  `;

  return appItem;
}

document.addEventListener('DOMContentLoaded', async () => {
  const appList = document.getElementById('apps-list');
  const nextButton = document.getElementById('next-button');
  const approvals = {};

  const apps = await fetchApps();

  apps.forEach((app, index) => {
    const appElement = createAppElement(app, index);
    appList.appendChild(appElement);
  });

  appList.addEventListener('click', (e) => {
    const button = e.target;
    const appItem = button.closest('.app-item');

    if (!appItem) return;

    const appId = appItem.dataset.appId;

    if (button.classList.contains('approve-button')) {
      approvals[appId] = 'approved';
      appItem.querySelector('.app-actions')?.remove();
    } else if (button.classList.contains('deny-button')) {
      approvals[appId] = 'denied';
      appItem.remove();
    }
  });

  nextButton.addEventListener('click', () => {
    const presentChild = JSON.parse(sessionStorage.getItem('presentChild'));
    if (!presentChild) {
      alert("No child selected.");
      return;
    }

    // Store approved apps as array
    const allowedApps = Object.entries(approvals)
      .filter(([, status]) => status === 'approved')
      .map(([appId]) => appId);

    presentChild.allowedApps = allowedApps;
    localStorage.setItem('presentChild', JSON.stringify(presentChild));

    // Also update the parentAccount children list
    const parentAccount = JSON.parse(localStorage.getItem('parentAccount'));
    if (parentAccount && Array.isArray(parentAccount.children)) {
      parentAccount.children = parentAccount.children.map(child =>
        child.id === presentChild.id ? presentChild : child
      );
      localStorage.setItem('parentAccount', JSON.stringify(parentAccount));
    }

    window.location.href = 'manage-trust.html';
  });
});
