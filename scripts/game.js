const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const blockSize = 64;
const mapWidth = 400;
const mapHeight = 50;

let camera = { x: 0, y: 0 };
let keys = {};
let leftKey = 'a';
let rightKey = 'd';
let isPaused = false;

const player = {
  x: 100,
  y: 100,
  width: blockSize,
  height: blockSize,
  color: "blue",
  velocityX: 0,
  velocityY: 0,
  onGround: false
};

const gravity = 0.5;
const jumpForce = -12;
const moveSpeed = 5;

const ground = [];

for (let y = 0; y < mapHeight; y++) {
  for (let x = 0; x < mapWidth; x++) {
    if (y >= mapHeight - 1) {
      ground.push({ x: x * blockSize, y: y * blockSize, width: blockSize, height: blockSize });
    }
  }
}

const music = new Audio("assets/songs/game.mp3");
music.loop = true;

document.addEventListener("click", () => {
  if (music.paused) music.play();
}, { once: true });

document.addEventListener("keydown", (e) => keys[e.key.toLowerCase()] = true);
document.addEventListener("keyup", (e) => keys[e.key.toLowerCase()] = false);

function update() {
  if (isPaused) return;

  player.velocityY += gravity;
  player.x += (keys[leftKey] ? -moveSpeed : 0) + (keys[rightKey] ? moveSpeed : 0);
  player.y += player.velocityY;

  player.onGround = false;
  for (let block of ground) {
    if (
      player.x < block.x + block.width &&
      player.x + player.width > block.x &&
      player.y < block.y + block.height &&
      player.y + player.height > block.y
    ) {
      player.y = block.y - player.height;
      player.velocityY = 0;
      player.onGround = true;
    }
  }

  if (keys[" "] && player.onGround) {
    player.velocityY = jumpForce;
  }

  camera.x = player.x - canvas.width / 2 + player.width / 2;
  camera.y = player.y - canvas.height / 2 + player.height / 2;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // fundo removido
  ctx.fillStyle = "#333";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let block of ground) {
    ctx.fillStyle = "brown";
    ctx.fillRect(block.x - camera.x, block.y - camera.y, block.width, block.height);
  }

  ctx.fillStyle = player.color;
  ctx.fillRect(player.x - camera.x, player.y - camera.y, player.width, player.height);
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

const pauseBtn = document.getElementById("pauseButton");
const pauseMenu = document.getElementById("pauseMenu");
const optionsMenu = document.getElementById("optionsMenu");
const resumeBtn = document.getElementById("resumeButton");
const optionsBtn = document.getElementById("optionsButton");
const exitBtn = document.getElementById("exitButton");
const volumeSlider = document.getElementById("volumeSlider");
const closeOptions = document.getElementById("closeOptions");

pauseBtn.addEventListener("click", () => {
  isPaused = true;
  pauseMenu.style.display = "block";
});

resumeBtn.addEventListener("click", () => {
  isPaused = false;
  pauseMenu.style.display = "none";
});

optionsBtn.addEventListener("click", () => {
  optionsMenu.style.display = "block";
});

exitBtn.addEventListener("click", () => {
  window.location.href = "index.html";
});

closeOptions.addEventListener("click", () => {
  optionsMenu.style.display = "none";
});

volumeSlider.addEventListener("input", () => {
  music.volume = volumeSlider.value;
});

document.getElementById("leftKey").addEventListener("change", (e) => {
  leftKey = e.target.value.toLowerCase();
});
document.getElementById("rightKey").addEventListener("change", (e) => {
  rightKey = e.target.value.toLowerCase();
});

const seed = 12345; // mundo fixo para todos
function seededRandom(seed) {
  let x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}
function random(seedRef) {
  let x = Math.sin(seedRef.value++) * 10000;
  return x - Math.floor(x);
}
let rng = { value: seed };

// Gerar terreno
for (let y = 0; y < mapHeight; y++) {
  for (let x = 0; x < mapWidth; x++) {
    // Apenas preencher linha inferior com blocos
    if (y >= mapHeight - groundHeight) {
      ground.push({
        x: x * blockSize,
        y: y * blockSize,
        width: blockSize,
        height: blockSize,
        type: "terra"
      });
    }
  }
}


gameLoop();
