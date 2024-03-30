// Get DOM elements
const fileUploadPage = document.getElementById("file-upload-page");
const progressPage = document.getElementById("progress-page");
const flashingPage = document.getElementById("flashing-steps");

// Get progress elements
const progressBar = document.getElementById("progress-bar");
const progressText = document.getElementById("progress-text");

// get flashing elements
const reFlashButton = document.getElementById("start-newFlash");
const flashMessage = document.getElementById("flash-message");
const newFlashButton = document.getElementById("start-flashing");

// error message element
const errorMessage = document.getElementById("error-message");

// file handling
const fileInput = document.getElementById("file-input");
const uploadFrom = document.getElementById("upload-form");

// Hide progress page initially
progressPage.classList.add("hide");
flashingPage.classList.add("hide");
reFlashButton.classList.add("hide");

// Show progress page
fileInput.addEventListener("change", (event) => {
  fileInput.innerText = event.target.files[0].name;
});

uploadFrom.addEventListener("submit", (event) => {
  event.preventDefault();

  const files = fileInput.files;
  if (files.length === 0) {
    errorMessage.innerText = "Please select a file to upload.";
    return;
  }

  const file = files[0];
  if (!file.name.endsWith(".tar.gz")) {
    errorMessage.innerText = "Please upload a .tar.gz file.";
    return;
  }

  fileInput.innerText = file.name;

  window.electronAPI.fileUpload(file.path);
});

newFlashButton.addEventListener("click", () => {
  window.electronAPI.startFlashing();
});

reFlashButton.addEventListener("click", () => {
  fileUploadPage.classList.remove("hide");
  progressPage.classList.add("hide");
  flashingPage.classList.add("hide");
  flashMessage.innerText = "";
  errorMessage.innerText = "";
  reFlashButton.classList.add("hide");
});

window.electronAPI.uploadError((message) => {
  errorMessage.innerText = message;
});

window.electronAPI.uploadSuccess(() => {
  // enable the progress page
  fileUploadPage.classList.add("hide");
  //   progressPage.classList.remove("hide");

  flashingPage.classList.remove("hide");
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
