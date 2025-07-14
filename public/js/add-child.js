document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("add-child-form");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const childData = {
      id: crypto.randomUUID(),
      firstName: document.getElementById("firstName").value.trim(),
      lastName: document.getElementById("lastName").value.trim(),
      age: document.getElementById("age").value.trim(),
      dob: document.getElementById("dob").value.trim()
    };

    sessionStorage.setItem("pendingChild", JSON.stringify(childData));
    window.location.href = "child-selfie.html";
  });
});
