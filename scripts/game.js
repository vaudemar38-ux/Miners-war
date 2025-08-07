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

const music = new Audio("assets/songs/game.mp3");
music.loop = true;

document.addEventListener("click", () => {
  if (music.paused) music.play();
}, { once: true });

document.addEventListener("keydown", (e) => keys[e.key.toLowerCase()] = true);
document.addEventListener("keyup", (e) => keys[e.key.toLowerCase()] = false);

// 🖼️ CARREGAR TEXTURAS
const textures = {};
const textureTypes = ["grama", "terra", "pedra", "neve", "areia", "grama_escura"];
for (let type of textureTypes) {
  const img = new Image();
  img.src = `assets/textures/${type}.png`;
  textures[type] = img;
}

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
      const overlapX = (player.x + player.width / 2) - (block.x + block.width / 2);
      const overlapY = (player.y + player.height / 2) - (block.y + block.height / 2);
      const halfWidths = (player.width + block.width) / 2;
      const halfHeights = (player.height + block.height) / 2;

      const offsetX = halfWidths - Math.abs(overlapX);
      const offsetY = halfHeights - Math.abs(overlapY);

      if (offsetX < offsetY) {
        player.x += overlapX > 0 ? offsetX : -offsetX;
        player.velocityX = 0;
      } else {
        if (overlapY > 0) {
          player.y += offsetY;
          player.velocityY = 0;
        } else {
          player.y -= offsetY;
          player.velocityY = 0;
          player.onGround = true;
        }
      }
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
  ctx.fillStyle = "#333";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let block of ground) {
    const img = textures[block.type];
    if (img && img.complete) {
      ctx.drawImage(img, block.x - camera.x, block.y - camera.y, block.width, block.height);
    } else {
      // Fallback: bloco preto se textura não estiver carregada
      ctx.fillStyle = "black";
      ctx.fillRect(block.x - camera.x, block.y - camera.y, block.width, block.height);
    }
  }

  // Jogador
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x - camera.x, player.y - camera.y, player.width, player.height);
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// 🎮 MENU DE PAUSA E OPÇÕES
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

function irParaBase() {
  // Salva o inventário atual antes de sair (se quiser)
  // localStorage.setItem("mochila", JSON.stringify(inventario));

  window.location.href = "base.html";
}


// 🌍 GERAÇÃO DE MUNDO COM BIOMAS E CAVERNAS
const seed = 12345;
let rng = { value: seed };

function random(seedRef) {
  const x = Math.sin(seedRef.value++) * 10000;
  return x - Math.floor(x);
}

const ground = [];
const world = [];
const surfaceHeights = [];

let currentHeight = 20 + Math.floor(random(rng) * 5);
for (let x = 0; x < mapWidth; x++) {
  const change = Math.floor(random(rng) * 3) - 1;
  currentHeight += change;
  if (currentHeight < 15) currentHeight = 15;
  if (currentHeight > 30) currentHeight = 30;
  surfaceHeights.push(currentHeight);
}

for (let x = 0; x < mapWidth; x++) {
  world[x] = [];
  const surfaceY = surfaceHeights[x];
  const biomaIndex = Math.floor(x / 100);
  let blocoTopo = "grama";
  let blocoSub = "terra";

  if (biomaIndex === 1) blocoTopo = "neve";
  else if (biomaIndex === 2) blocoTopo = "areia", blocoSub = "areia";
  else if (biomaIndex === 3) blocoTopo = "grama_escura";

  for (let y = 0; y < mapHeight + 10; y++) {
    if (y === surfaceY) world[x][y] = blocoTopo;
    else if (y > surfaceY && y < surfaceY + 10) world[x][y] = blocoSub;
    else if (y >= surfaceY + 10) world[x][y] = "pedra";
    else world[x][y] = "air";
  }
}

// 🕳️ GERAÇÃO DE CAVERNAS
function digCave(startX, startY, maxLength) {
  let x = startX;
  let y = startY;

  for (let i = 0; i < maxLength; i++) {
    const radius = Math.floor(random(rng) * 3) + 2;
    for (let dx = -radius; dx <= radius; dx++) {
      for (let dy = -radius; dy <= radius; dy++) {
        const nx = x + dx;
        const ny = y + dy;
        if (
          nx >= 0 && nx < mapWidth &&
          ny >= 0 && ny < mapHeight + 10 &&
          Math.sqrt(dx * dx + dy * dy) <= radius
        ) {
          world[nx][ny] = "air";
        }
      }
    }

    const dir = Math.floor(random(rng) * 4);
    if (dir === 0 && x < mapWidth - 1) x++;
    else if (dir === 1 && x > 0) x--;
    if (dir === 2 && y < mapHeight + 9) y++;
    else if (dir === 3 && y > 0) y--;
  }
}

// 🕳️ DUAS CAVERNAS INDEPENDENTES
digCave(80, surfaceHeights[80] + 2, 150);
digCave(300, surfaceHeights[300] + 2, 180);

// CONVERTE world[x][y] EM ground[]
for (let x = 0; x < mapWidth; x++) {
  for (let y = 0; y < mapHeight + 10; y++) {
    const type = world[x][y];
    if (type && type !== "air") {
      ground.push({
        x: x * blockSize,
        y: y * blockSize,
        width: blockSize,
        height: blockSize,
        type: type
      });
    }
  }
}

gameLoop();
