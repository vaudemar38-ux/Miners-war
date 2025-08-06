function random(seedRef) {
  const x = Math.sin(seedRef.value++) * 10000;
  return x - Math.floor(x);
}

function generateWorld(seed) {
  let rng = { value: seed };
  ground = [];

  const surfaceHeights = [];
  let currentHeight = 20 + Math.floor(random(rng) * 5);

  for (let x = 0; x < mapWidth; x++) {
    const change = Math.floor(random(rng) * 3) - 1;
    currentHeight += change;
    currentHeight = Math.max(15, Math.min(30, currentHeight));
    surfaceHeights.push(currentHeight);
  }

  for (let x = 0; x < mapWidth; x++) {
    const surfaceY = surfaceHeights[x];

    // Grama
    ground.push({
      x: x * blockSize,
      y: surfaceY * blockSize,
      width: blockSize,
      height: blockSize,
      type: "grama"
    });

    // Terra: 9 blocos abaixo da grama
    for (let y = surfaceY + 1; y < surfaceY + 10; y++) {
      if (y >= mapHeight) continue;
      ground.push({
        x: x * blockSize,
        y: y * blockSize,
        width: blockSize,
        height: blockSize,
        type: "terra"
      });
    }

    // Pedra: abaixo da camada de terra
    for (let y = surfaceY + 10; y < mapHeight; y++) {
      ground.push({
        x: x * blockSize,
        y: y * blockSize,
        width: blockSize,
        height: blockSize,
        type: "pedra"
      });
    }
  }
}
