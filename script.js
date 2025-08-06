const playBtn = document.getElementById('playBtn');
const optionsBtn = document.getElementById('optionsBtn');
const storeBtn = document.getElementById('storeBtn');
const optionsMenu = document.getElementById('options');
const storeMenu = document.getElementById('store');
const volumeSlider = document.getElementById('volumeSlider');
const bgMusic = document.getElementById('bgMusic');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Inicializar volume
bgMusic.volume = volumeSlider.value;
bgMusic.play();

// Ajustar volume ao mover slider
volumeSlider.addEventListener('input', () => {
  bgMusic.volume = volumeSlider.value;
});

// Botões do menu
optionsBtn.addEventListener('click', () => {
  optionsMenu.classList.toggle('hidden');
});

storeBtn.addEventListener('click', () => {
  storeMenu.classList.toggle('hidden');
});

playBtn.addEventListener('click', startGame);

let map = [];
const blockSize = 32;
const mapWidth = 400;
const mapHeight = 50;

let player = {
  x: 100,
  y: 100,
  width: blockSize,
  height: blockSize,
  color: 'blue',
  velocityY: 0,
  onGround: false
};

function generateMap() {
  map = [];
  for (let y = 0; y < mapHeight; y++) {
    const row = [];
    for (let x = 0; x < mapWidth; x++) {
      if (y > 45) {
        row.push('brown');
      } else {
        row.push(null);
      }
    }
    map.push(row);
  }
}

function drawMap(offsetX) {
  for (let y = 0; y < mapHeight; y++) {
    for (let x = 0; x < mapWidth; x++) {
      const block = map[y][x];
      if (block) {
        ctx.fillStyle = block;
        ctx.fillRect(x * blockSize - offsetX, y * blockSize, blockSize, blockSize);
      }
    }
  }
}

function drawPlayer(offsetX) {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x - offsetX, player.y, player.width, player.height);
}

let keys = {};
document.addEventListener('keydown', e => keys[e.key] = true);
document.addEventListener('keyup', e => keys[e.key] = false);

function updatePlayer() {
  if (keys['ArrowLeft']) player.x -= 5;
  if (keys['ArrowRight']) player.x += 5;

  // Pulo
  if (keys[' '] && player.onGround) {
    player.velocityY = -12;
    player.onGround = false;
  }

  // Gravidade
  player.velocityY += 0.5;
  player.y += player.velocityY;

  // Colisão com o chão
  const tileY = Math.floor((player.y + player.height) / blockSize);
  const tileX = Math.floor(player.x / blockSize);
  if (map[tileY] && map[tileY][tileX]) {
    player.y = tileY * blockSize - player.height;
    player.velocityY = 0;
    player.onGround = true;
  }
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const offsetX = player.x - canvas.width / 2;
  drawMap(offsetX);
  updatePlayer();
  drawPlayer(offsetX);

  requestAnimationFrame(gameLoop);
}

function startGame() {
  generateMap();
  player.x = 100;
  player.y = 100;
  gameLoop();
}
