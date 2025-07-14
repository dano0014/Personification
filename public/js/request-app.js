document.addEventListener("DOMContentLoaded", () => {
  const requestButton = document.querySelector(".primary-button");
  const appNameInput = document.getElementById("app-name");
  const reasonOptions = document.querySelectorAll(".level-option");
  const checklistInputs = document.querySelectorAll(".level-option input[type='checkbox']");

  let selectedReason = "";

  // Reason selection logic
  reasonOptions.forEach(option => {
    option.addEventListener("click", () => {
      reasonOptions.forEach(o => o.classList.remove("selected"));
      option.classList.add("selected");
      selectedReason = option.textContent.trim();
    });
  });

  requestButton.addEventListener("click", () => {
    const appName = appNameInput.value.trim();

    if (!appName || !selectedReason) {
      alert("Please enter an app name and select a reason.");
      return;
    }

    const checklist = Array.from(checklistInputs).map((input, i) => ({
      text: input.parentElement.textContent.trim(),
      checked: input.checked
    }));

    const child = JSON.parse(sessionStorage.getItem("presentChild"));
    const activities = JSON.parse(sessionStorage.getItem("activities")) || [];

    const newRequest = {
      type: "app-request",
      childId: child?.id || "unknown",
      appName,
      reason: selectedReason,
      checklist,
      date: new Date().toISOString(),
      status: "pending"
    };

    activities.push(newRequest);
    sessionStorage.setItem("activities", JSON.stringify(activities));

    alert("Your request has been submitted!");
    appNameInput.value = "";
    checklistInputs.forEach(i => (i.checked = false));
    reasonOptions.forEach(o => o.classList.remove("selected"));
    selectedReason = "";
  });
});
