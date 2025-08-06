const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const tileSize = 32;
const worldWidth = 400;
const worldHeight = 50;

const player = {
  x: 100,
  y: 100,
  width: tileSize,
  height: tileSize,
  color: "blue",
  dx: 0,
  dy: 0,
  speed: 4,
  jumping: false,
  gravity: 0.5,
  jumpPower: -10,
  grounded: false,
};

let keys = {};

const world = [];
for (let y = 0; y < worldHeight; y++) {
  const row = [];
  for (let x = 0; x < worldWidth; x++) {
    if (y >= worldHeight - 3) {
      row.push(1); // chão
    } else {
      row.push(0);
    }
  }
  world.push(row);
}

function drawWorld(offsetX, offsetY) {
  for (let y = 0; y < worldHeight; y++) {
    for (let x = 0; x < worldWidth; x++) {
      if (world[y][x] === 1) {
        ctx.fillStyle = "brown";
        ctx.fillRect(
          x * tileSize - offsetX,
          y * tileSize - offsetY,
          tileSize,
          tileSize
        );
      }
    }
  }
}

function checkCollision(px, py) {
  const leftTile = Math.floor(px / tileSize);
  const rightTile = Math.floor((px + player.width - 1) / tileSize);
  const topTile = Math.floor(py / tileSize);
  const bottomTile = Math.floor((py + player.height - 1) / tileSize);

  for (let y = topTile; y <= bottomTile; y++) {
    for (let x = leftTile; x <= rightTile; x++) {
      if (
        y >= 0 &&
        y < worldHeight &&
        x >= 0 &&
        x < worldWidth &&
        world[y][x] === 1
      ) {
        return true;
      }
    }
  }
  return false;
}

function update() {
  player.dx = 0;
  if (keys["ArrowLeft"] || keys["a"]) player.dx = -player.speed;
  if (keys["ArrowRight"] || keys["d"]) player.dx = player.speed;

  player.dy += player.gravity;

  // movimento horizontal
  const newX = player.x + player.dx;
  if (!checkCollision(newX, player.y)) {
    player.x = newX;
  }

  // movimento vertical
  const newY = player.y + player.dy;
  if (!checkCollision(player.x, newY)) {
    player.y = newY;
    player.grounded = false;
  } else {
    if (player.dy > 0) {
      player.grounded = true;
    }
    player.dy = 0;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const offsetX = player.x - canvas.width / 2 + player.width / 2;
  const offsetY = player.y - canvas.height / 2 + player.height / 2;

  drawWorld(offsetX, offsetY);

  ctx.fillStyle = player.color;
  ctx.fillRect(
    player.x - offsetX,
    player.y - offsetY,
    player.width,
    player.height
  );
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", (e) => {
  keys[e.key] = true;
  if ((e.key === " " || e.key === "ArrowUp" || e.key === "w") && player.grounded) {
    player.dy = player.jumpPower;
    player.grounded = false;
  }
});

document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

window.addEventListener("load", () => {
  const audio = new Audio("assets/songs/fundo.mp3");
  audio.loop = true;

  const startAudio = () => {
    audio.play();
    window.removeEventListener("click", startAudio);
  };
  window.addEventListener("click", startAudio);

  gameLoop();
});
