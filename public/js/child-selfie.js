const openCameraBtn = document.getElementById("open-camera");
const captureBtn = document.getElementById("capture");
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");

let stream;
let selfieDataUrl = "";

openCameraBtn.addEventListener("click", async () => {
  stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;
  captureBtn.hidden = false;
});

captureBtn.addEventListener("click", () => {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d").drawImage(video, 0, 0);
  selfieDataUrl = canvas.toDataURL("image/png");
  canvas.hidden = false;
  captureBtn.textContent = "Captured";
  stream.getTracks().forEach(track => track.stop());
});

document.getElementById("next-button").addEventListener("click", async () => {
  const pending = JSON.parse(sessionStorage.getItem("pendingChild"));
  if (!pending) {
    alert("No child info found. Please go back and fill the form.");
    return;
  }

  const birth = document.getElementById("birth-certificate").files[0];
  const passport = document.getElementById("passport").files[0];
  const id = document.getElementById("id-drivers-license").files[0];

  let identification = null;
  if (birth) identification = "Birth Certificate";
  else if (passport) identification = "Passport";
  else if (id) identification = "ID/Drivers License";

  if (!selfieDataUrl || !identification) {
    alert("Please capture a selfie and upload one ID document.");
    return;
  }

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser || currentUser.role !== "Parent") {
    alert("Only a logged-in parent can add children.");
    return;
  }
  
  const newChild = {
    name: `${pending.firstName} ${pending.lastName}`,
    email: `${pending.firstName.toLowerCase()}@child.local`,
    password: pending.dob.replaceAll("/", ""),
    selfie: selfieDataUrl,
    identification,
    role: "Child",
    trustLevel: 1,
    allowedApps: [],
    playlists: [],
    parentEmail: currentUser.email
  };

  sessionStorage.setItem("presentChild", JSON.stringify(newChild));

  window.location.href = "child-apps-websites.html";
});
