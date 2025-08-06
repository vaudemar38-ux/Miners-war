const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const tileSize = 32;
const mapWidth = 400;
const mapHeight = 50;

// Gera o mapa com blocos de terra no chão (linha inferior)
let map = Array.from({ length: mapHeight }, (_, y) =>
  Array.from({ length: mapWidth }, (_, x) => (y === mapHeight - 1 ? 1 : 0))
);

// Player
let player = {
  x: 5,
  y: mapHeight - 2,
  width: 1,
  height: 1,
  color: "blue",
  vx: 0,
  vy: 0,
  grounded: false,
};

// Física
const gravity = 0.3;
const jumpPower = -8;
const moveSpeed = 0.5;

// Input
let keys = {};

window.addEventListener("keydown", (e) => keys[e.key] = true);
window.addEventListener("keyup", (e) => keys[e.key] = false);

function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

function update() {
  player.vx = 0;

  if (keys["a"] || keys["ArrowLeft"]) player.vx = -moveSpeed;
  if (keys["d"] || keys["ArrowRight"]) player.vx = moveSpeed;
  if ((keys["w"] || keys["ArrowUp"] || keys[" "]) && player.grounded) {
    player.vy = jumpPower;
    player.grounded = false;
  }

  player.vy += gravity;

  let nextX = player.x + player.vx;
  let nextY = player.y + player.vy;

  // Colisão vertical
  if (map[Math.floor(nextY + player.height)]?.[Math.floor(player.x)] === 1) {
    player.vy = 0;
    player.grounded = true;
    nextY = Math.floor(nextY);
  }

  player.x = nextX;
  player.y = nextY;
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const camX = player.x * tileSize - canvas.width / 2 + tileSize / 2;
  const camY = player.y * tileSize - canvas.height / 2 + tileSize / 2;

  // Desenha mapa
  for (let y = 0; y < mapHeight; y++) {
    for (let x = 0; x < mapWidth; x++) {
      if (map[y][x] === 1) {
        ctx.fillStyle = "brown";
        ctx.fillRect(x * tileSize - camX, y * tileSize - camY, tileSize, tileSize);
      }
    }
  }

  // Desenha jogador
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x * tileSize - camX, player.y * tileSize - camY, tileSize, tileSize);
}

gameLoop();
