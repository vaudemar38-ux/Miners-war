let audioStarted = false;
const bgMusic = new Audio("assets/songs/fundo.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.5;

document.addEventListener("click", () => {
  if (!audioStarted) {
    bgMusic.play();
    audioStarted = true;
  }
});

document.getElementById("volume").addEventListener("input", (e) => {
  bgMusic.volume = e.target.value;
});

function toggleOptions() {
  const options = document.getElementById("options");
  options.style.display = options.style.display === "none" ? "block" : "none";
}

function startGame() {
  window.location.href = "game.html";
}
