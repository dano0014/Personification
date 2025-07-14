import { saveUserData } from './users.js';

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
      const response = await fetch('../data/users.json');
      const users = await response.json();

      let user = users.find(u => u.email === email && u.password === password);
      // If not found, look inside children arrays
      if (!user) {
        for (const parent of users) {
          if (parent.children && Array.isArray(parent.children)) {
            const child = parent.children.find(c => c.email === email && c.password === password);
            if (child) {
              // Add a "role" field to the child if missing
              child.role = 'Child';

              user = child;
              break;
            }
          }
        }
      }

      if (user) {
        saveUserData(user);
        alert("Signed in successfully!");
        if (user.role === 'Parent') {
          window.location.href = '../dashboard.html';
        } else if (user.role === 'Child') {
          window.location.href = '../child-dashboard.html';
        } else {
          alert('Unknown role. Please contact support.');
        }
      } else {
        alert("Invalid email or password.");
      }
    } catch (err) {
      console.error('Error loading users.json:', err);
      alert('Something went wrong. Please try again.');
    }
  });
});
