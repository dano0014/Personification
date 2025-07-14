import { currentUser, saveUserData } from './users.js';
console.log('selfie.js loaded');

const cameraBtn = document.getElementById('open-camera');
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureBtn = document.getElementById('capture');
const nextBtn = document.getElementById('next-button');

let capturedSelfie = null;
let stream = null;

// Open Camera
cameraBtn.addEventListener('click', async () => {
  alert('Opening camera...');
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    alert('Camera access granted');
    video.srcObject = stream;
    video.style.display = 'block';
    video.play();
  } catch (err) {
    alert('Error accessing camera: ' + err.message);
  }
});

// Capture Selfie
captureBtn?.addEventListener('click', () => {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0);
  capturedSelfie = canvas.toDataURL('image/png');

  // Hide video, show canvas
  video.hidden = true;
  canvas.hidden = false;
  captureBtn.hidden = true;

  // Stop camera stream
  stream?.getTracks().forEach(track => track.stop());
});

// Handle Next
nextBtn?.addEventListener('click', async () => {
  const getFileDataURL = async (inputId) => {
    const fileInput = document.getElementById(inputId);
    if (!fileInput || !fileInput.files[0]) return null;
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(fileInput.files[0]);
    });
  };

  const birthCert = await getFileDataURL('birth-certificate');
  const passport = await getFileDataURL('passport');
  const idCard = await getFileDataURL('id-card');

  currentUser.documents = {
    birthCertificate: birthCert,
    passport: passport,
    idCard: idCard,
    selfie: capturedSelfie
  };

  saveUserData(currentUser);
  window.location.href = '../dashboard.html';
});
