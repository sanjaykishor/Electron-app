// Get DOM elements
const fileUploadPage = document.getElementById("file-upload-page");
const progressPage = document.getElementById("progress-page");
const flashingPage = document.getElementById("flashing-steps");
const loginPage = document.getElementById("login-page");

// Get progress elements
const progressBar = document.getElementById("progress-bar");
const progressText = document.getElementById("progress-text");

// get flashing elements
const reFlashButton = document.getElementById("start-newFlash");
const newFlashButton = document.getElementById("start-flashing");

// error message element
const flashMessage = document.getElementById("flash-message");
const loginErrorMessage = document.getElementById("login-error-message");
const fileUploadErrorMessage = document.getElementById("file-upload-error-message");

// file handling
const fileInput = document.getElementById("file-input");
const uploadFrom = document.getElementById("upload-form");

const loginBtn = document.getElementById("login-btn");

// Hide progress page initially
progressPage.classList.add("hide");
flashingPage.classList.add("hide");
reFlashButton.classList.add("hide");
fileUploadPage.classList.add("hide");

// Login
loginBtn.addEventListener("click", () => {
  const username = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  window.electronAPI.login(username, password);
});

window.electronAPI.loginError((message) => {
  loginErrorMessage.innerText = message;
});

window.electronAPI.loginSuccess(() => {
  loginErrorMessage.innerText = "";
  loginPage.classList.add("hide");
  fileUploadPage.classList.remove("hide");
});

// Upload file
uploadFrom.addEventListener("submit", (event) => {
  event.preventDefault();

  const files = fileInput.files;
  if (files.length === 0) {
    console.log("No file selected");
    fileUploadErrorMessage.innerText = "Please select a file to upload.";
    return;
  }

  const file = files[0];
  if (!file.name.endsWith(".tar.gz")) {
    console.log("Invalid file type");
    fileUploadErrorMessage.innerText = "Please upload a .tar.gz file.";
    return;
  }

  fileInput.innerText = file.name;

  window.electronAPI.fileUpload(file.path);
});

window.electronAPI.uploadError((message) => {
  console.log("upload error", message);
  fileUploadErrorMessage.innerText = message;
});

window.electronAPI.uploadSuccess(() => {
  fileUploadPage.classList.add("hide");
  flashingPage.classList.remove("hide");
});

fileInput.addEventListener("change", (event) => {
  fileInput.innerText = event.target.files[0].name;
});

// Flashing
newFlashButton.addEventListener("click", () => {
  window.electronAPI.startFlashing();
});

reFlashButton.addEventListener("click", () => {
  fileUploadPage.classList.remove("hide");
  progressPage.classList.add("hide");
  flashingPage.classList.add("hide");
  flashMessage.innerText = "";
  fileUploadErrorMessage.innerText = "";
  reFlashButton.classList.add("hide");
});

window.electronAPI.flashingError((message) => {
  flashMessage.innerText = message;
});

window.electronAPI.flashingSuccess(() => {
  flashMessage.innerText = "Flashing successful!";
  reFlashButton.classList.remove("hide");
});

window.electronAPI.progressUpdate((progress) => {
  if (progress === 0) {
    progressPage.classList.remove("hide");
    flashingPage.classList.add("hide");
  }

  // Update progress bar
  const circumference = 2 * Math.PI * progressBar.getAttribute("r");
  const offset = circumference * (1 - progress);
  progressBar.style.strokeDasharray = `${circumference}, ${circumference}`;
  progressBar.style.strokeDashoffset = offset;

  // Update progress text
  const percentage = Math.round(progress * 100);
  progressText.innerText = `${percentage}%`;
});




