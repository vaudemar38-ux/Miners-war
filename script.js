<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Miners War - Game</title>
  <style>
    body {
      margin: 0;
      overflow: hidden;
      background-color: #87CEEB; /* céu azul */
    }
    canvas {
      display: block;
    }
  </style>
</head>
<body>
  <canvas id="gameCanvas" width="800" height="600"></canvas>

  <script>
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    const tileSize = 32;
    const mapWidth = 400;
    const mapHeight = 50;

    const player = {
      x: 100,
      y: 0,
      width: 32,
      height: 32,
      color: 'blue',
      dx: 0,
      dy: 0,
      speed: 3,
      jump: -10,
      gravity: 0.5,
      onGround: false
    };

    const keys = {};
    window.addEventListener('keydown', e => keys[e.key] = true);
    window.addEventListener('keyup', e => keys[e.key] = false);

    const ground = [];
    for (let y = 45; y < mapHeight; y++) {
      for (let x = 0; x < mapWidth; x++) {
        ground.push({ x: x * tileSize, y: y * tileSize, width: tileSize, height: tileSize });
      }
    }

    function update() {
      player.dx = 0;
      if (keys['ArrowLeft'] || keys['a']) player.dx = -player.speed;
      if (keys['ArrowRight'] || keys['d']) player.dx = player.speed;

      if ((keys['ArrowUp'] || keys['w'] || keys[' ']) && player.onGround) {
        player.dy = player.jump;
        player.onGround = false;
      }

      player.dy += player.gravity;
      player.x += player.dx;
      player.y += player.dy;

      // Simples colisão com o "chão"
      player.onGround = false;
      for (let block of ground) {
        if (
          player.x < block.x + block.width &&
          player.x + player.width > block.x &&
          player.y < block.y + block.height &&
          player.y + player.height > block.y
        ) {
          // Colisão vertical
          if (player.dy > 0) {
            player.y = block.y - player.height;
            player.dy = 0;
            player.onGround = true;
          }
        }
      }

      // Limites do mapa
      if (player.y > canvas.height) player.y = 0;
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Blocos de terra
      ctx.fillStyle = '#8B4513';
      for (let block of ground) {
        if (block.x >= player.x - 800 && block.x <= player.x + 800) {
          ctx.fillRect(block.x, block.y, block.width, block.height);
        }
      }

      // Jogador
      ctx.fillStyle = player.color;
      ctx.fillRect(player.x, player.y, player.width, player.height);
    }

    function loop() {
      update();
      draw();
      requestAnimationFrame(loop);
    }

    loop();
  </script>
</body>
</html>
