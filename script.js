const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const BLOCK_SIZE = 16;
const MAP_WIDTH = 400;
const MAP_HEIGHT = 50;
const GRAVITY = 0.5;
const JUMP_FORCE = -10;

let map = [];
let player = {
  x: 50,
  y: 200,
  width: BLOCK_SIZE,
  height: BLOCK_SIZE,
  color: 'blue',
  velocityY: 0,
  onGround: false
};

function generateMap() {
  map = [];
  for (let y = 0; y < MAP_HEIGHT; y++) {
    let row = [];
    for (let x = 0; x < MAP_WIDTH; x++) {
      if (y > 40) {
        row.push(1); // terra
      } else {
        row.push(0); // ar
      }
    }
    map.push(row);
  }
}

function drawMap(offsetX = 0, offsetY = 0) {
  for (let y = 0; y < MAP_HEIGHT; y++) {
    for (let x = 0; x < MAP_WIDTH; x++) {
      if (map[y][x] === 1) {
        ctx.fillStyle = 'brown';
        ctx.fillRect(x * BLOCK_SIZE - offsetX, y * BLOCK_SIZE - offsetY, BLOCK_SIZE, BLOCK_SIZE);
      }
    }
  }
}

function drawPlayer(offsetX = 0, offsetY = 0) {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x - offsetX, player.y - offsetY, player.width, player.height);
}

let keys = {};

document.addEventListener('keydown', (e) => {
  keys[e.key] = true;
});
document.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

function update() {
  // Movimento horizontal
  if (keys['a']) player.x -= 2;
  if (keys['d']) player.x += 2;

  // Pulo
  if (keys['w'] && player.onGround) {
    player.velocityY = JUMP_FORCE;
    player.onGround = false;
  }

  // Gravidade
  player.y += player.velocityY;
  player.velocityY += GRAVITY;

  // Checagem de colisão com o chão
  if (player.y + player.height >= 41 * BLOCK_SIZE) {
    player.y = 41 * BLOCK_SIZE - player.height;
    player.velocityY = 0;
    player.onGround = true;
  }
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  update();
  drawMap();
  drawPlayer();
  requestAnimationFrame(gameLoop);
}

function startGame() {
  document.getElementById('menu').style.display = 'none';
  document.getElementById('options').style.display = 'none';
  canvas.style.display = 'block';
  generateMap();
  gameLoop();
}

function openOptions() {
  document.getElementById('menu').style.display = 'none';
  document.getElementById('options').style.display = 'block';
}

function closeOptions() {
  document.getElementById('options').style.display = 'none';
  document.getElementById('menu').style.display = 'block';
}

// Controle de volume
const music = document.getElementById('backgroundMusic');
document.getElementById('volumeControl').addEventListener('input', (e) => {
  music.volume = e.target.value;
});
