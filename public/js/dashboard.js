import { getCurrentUser, getAllUsers } from './users.js';

document.addEventListener('DOMContentLoaded', () => {
  const user = getCurrentUser();
  const allUsers = getAllUsers();
  const container = document.getElementById('children-container');

  if (!user || user.role !== 'Parent') {
    alert("You must be a parent to view this page.");
    window.location.href = '../index.html';
    return;
  }

  const children = user.children || [];
  container.innerHTML = '';

  // Render each child's card
  children.forEach(child => {
    const card = document.createElement('div');
    card.className = 'dashboard-card';

    card.innerHTML = `
      <div class="card-info">
        <div class="card-role">Child</div>
        <div class="card-name">${child.name}</div>
        <div class="card-trust">Trust Level: ${child.trustLevel || 'N/A'}</div>
        <button class="manage-button">Manage</button>
      </div>
      <img src="${child.selfie || 'https://placehold.co/320x171'}" alt="${child.name}" class="card-image"/>
    `;

    card.addEventListener('click', (e) => {
      if (!e.target.classList.contains('manage-button')) {
        window.location.href = 'child-dashboard.html';
      }
    });

    const manageBtn = card.querySelector('.manage-button');
    manageBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      localStorage.setItem("presentChild", JSON.stringify(child));
      window.location.href = 'manage-trust.html';
    });

    container.appendChild(card);
  });

  // Add Child Card
  const addCard = document.createElement('div');
  addCard.className = 'dashboard-card add-child-card';
  addCard.innerHTML = `
    <div class="card-info">
      <div class="card-role">+</div>
      <div class="card-name">Add Child</div>
      <div class="card-trust">Click to create new profile</div>
      <button class="manage-button">Add</button>
    </div>
    <img src="https://placehold.co/320x171?text=New+Child" alt="Add Child" class="card-image"/>
  `;

  addCard.addEventListener('click', () => {
    window.location.href = 'add-child.html';
  });

  container.appendChild(addCard);

  // ✅ Render Recent Activity
  renderRecentActivity(children);

  // Grab modal elements
  const modal = document.getElementById('activity-modal');
  const modalDetails = document.getElementById('modal-details');
  const approveBtn = document.getElementById('approve-btn');
  const denyBtn = document.getElementById('deny-btn');
  const closeBtn = document.getElementById('close-btn');
  
  let currentActivityId = null;
  
  // Add click listeners to activity table rows after rendering
  function addRowClickHandlers() {
    const rows = document.querySelectorAll('#activity-table tbody tr');
    rows.forEach(row => {
      row.addEventListener('click', () => {
        const index = row.getAttribute('data-index');
        openModal(index);
      });
    });
  }
  
  function openModal(activityIndex) {
    const activities = JSON.parse(localStorage.getItem("activities")) || [];
    const activity = activities[activityIndex];
    if (!activity) return;
  
    currentActivityId = activityIndex;
  
    modalDetails.innerHTML = `
      <p><strong>Child:</strong> ${getChildNameById(children, activity.childId)}</p>
      <p><strong>Type:</strong> ${activity.type}</p>
      <p><strong>App Name:</strong> ${activity.appName || '-'}</p>
      <p><strong>Reason:</strong> ${activity.reason || '-'}</p>
      <p><strong>Status:</strong> ${activity.status || 'pending'}</p>
      <p><strong>Date:</strong> ${new Date(activity.date).toLocaleString()}</p>
    `;
  
    modal.classList.remove('hidden');
  }
  
  approveBtn.addEventListener('click', () => {
    updateActivityStatus('approved');
  });
  
  denyBtn.addEventListener('click', () => {
    updateActivityStatus('denied');
  });
  
  closeBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
  });
  
  function updateActivityStatus(status) {
    const activities = JSON.parse(localStorage.getItem("activities")) || [];
    if (currentActivityId === null || !activities[currentActivityId]) return;
  
    // Update status and remove from activities list
    activities[currentActivityId].status = status;
  
    // Option 1: Remove activity from list after action
    activities.splice(currentActivityId, 1);
  
    // Save back
    localStorage.setItem("activities", JSON.stringify(activities));
  
    modal.classList.add('hidden');
    currentActivityId = null;
  
    // Re-render activity table
    renderRecentActivity(children);
    // Re-add click handlers for new rows
    addRowClickHandlers();
  }
  
  // After rendering recent activity, add click listeners
  function renderRecentActivity(childObjs) {
    const activities = JSON.parse(localStorage.getItem("activities")) || [];
    const childIds = childObjs.map(c => c.id);
    const filtered = activities.filter(act => childIds.includes(act.childId));
  
    const table = document.getElementById('activity-table');
    if (!table) return;
  
    if (filtered.length === 0) {
      table.innerHTML = `<tr><td colspan="6" style="text-align:center;">No activity found.</td></tr>`;
      return;
    }
  
    table.innerHTML = `
      <thead>
        <tr>
          <th>Child</th>
          <th>Type</th>
          <th>App Name</th>
          <th>Reason</th>
          <th>Status</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        ${filtered.map((act, idx) => `
          <tr data-index="${activities.indexOf(act)}" style="cursor:pointer;">
            <td>${getChildNameById(childObjs, act.childId)}</td>
            <td>${act.type}</td>
            <td>${act.appName || '-'}</td>
            <td>${act.reason || '-'}</td>
            <td>${act.status || 'pending'}</td>
            <td>${new Date(act.date).toLocaleDateString()}</td>
          </tr>
        `).join('')}
      </tbody>
    `;
        
    addRowClickHandlers();
  }

});

// Updated to receive actual child objects
function renderRecentActivity(childObjs) {
  const activities = JSON.parse(localStorage.getItem("activities")) || [];
  const childIds = childObjs.map(c => c.id);
  const filtered = activities.filter(act => childIds.includes(act.childId));

  const table = document.getElementById('activity-table');
  if (!table) return;

  if (filtered.length === 0) {
    table.innerHTML = `<tr><td colspan="6" style="text-align:center;">No activity found.</td></tr>`;
    return;
  }

  table.innerHTML = `
    <thead>
      <tr>
        <th>Child</th>
        <th>Type</th>
        <th>App Name</th>
        <th>Reason</th>
        <th>Status</th>
        <th>Date</th>
      </tr>
    </thead>
    <tbody>
      ${filtered.map(act => `
        <tr>
          <td>${getChildNameById(childObjs, act.childId)}</td>
          <td>${act.type}</td>
          <td>${act.appName || '-'}</td>
          <td>${act.reason || '-'}</td>
          <td>${act.status || 'pending'}</td>
          <td>${new Date(act.date).toLocaleDateString()}</td>
        </tr>
      `).join('')}
    </tbody>
  `;
}

function getChildNameById(childObjs, id) {
  const match = childObjs.find(c => c.id === id);
  return match ? match.name : 'Unknown';
}
