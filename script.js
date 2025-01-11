const videoPlayer = document.getElementById("video-player");
const playBtn = document.getElementById("play-btn");
const muteBtn = document.getElementById("mute-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const fullscreenBtn = document.getElementById("fullscreen-btn");
const videoProgressBar = document.getElementById("video-progress-bar");
const playlist = document.getElementById("playlist");
const playlistItems = document.querySelectorAll("#playlist li");
const toggleAudioBar = document.getElementById("toggle-audio-bar");
const audioBarContainer = document.getElementById("audio-bar-container");
const audioBar = document.getElementById("audio-bar");
const screenshotBtn = document.getElementById("screenshot-btn");

let currentVideoIndex = 0;

toggleAudioBar.addEventListener("click", () => {
  audioBarContainer.classList.toggle("hidden");
});

audioBar.addEventListener("input", () => {
  videoPlayer.volume = audioBar.value / 100;
});

playBtn.addEventListener("click", () => {
  if (videoPlayer.paused) {
    videoPlayer.play();
    playBtn.textContent = "⏸️";
  } else {
    videoPlayer.pause();
    playBtn.textContent = "▶️";
  }
});

muteBtn.addEventListener("click", () => {
  videoPlayer.muted = !videoPlayer.muted;
  muteBtn.textContent = videoPlayer.muted ? "🔊" : "🔇";
});

nextBtn.addEventListener("click", () => loadVideo(currentVideoIndex + 1));
prevBtn.addEventListener("click", () => loadVideo(currentVideoIndex - 1));

fullscreenBtn.addEventListener("click", () => {
  if (videoPlayer.requestFullscreen) {
    videoPlayer.requestFullscreen();
  }
});

videoPlayer.addEventListener("timeupdate", () => {
  videoProgressBar.value =
    (videoPlayer.currentTime / videoPlayer.duration) * 100;
});

videoProgressBar.addEventListener("input", () => {
  videoPlayer.currentTime =
    (videoProgressBar.value / 100) * videoPlayer.duration;
});

playlistItems.forEach((item, index) => {
  item.addEventListener("click", () => loadVideo(index));
});

function loadVideo(index) {
  if (index < 0 || index >= playlistItems.length) return;
  playlistItems[currentVideoIndex].classList.remove("active");
  currentVideoIndex = index;
  const videoSrc = playlistItems[index].getAttribute("data-video");
  videoPlayer.src = videoSrc;
  videoPlayer.play();
  playBtn.textContent = "⏸️";
  playlistItems[index].classList.add("active");
}

videoPlayer.addEventListener("ended", () => {
  if (currentVideoIndex < playlistItems.length - 1) {
    loadVideo(currentVideoIndex + 1);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  loadVideo(0);
});

screenshotBtn.addEventListener("click", () => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  canvas.width = videoPlayer.videoWidth;
  canvas.height = videoPlayer.videoHeight;

  context.drawImage(videoPlayer, 0, 0, canvas.width, canvas.height);

  const screenshotURL = canvas.toDataURL("image/png");

  const downloadLink = document.createElement("a");
  downloadLink.href = screenshotURL;
  downloadLink.download = "screenshot.png";
  downloadLink.click();
});
