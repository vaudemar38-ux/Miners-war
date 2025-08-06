const musica = document.getElementById("musicaFundo");

function jogar() {
  tocarMusica();
  alert("Jogo começando (em breve)!");
}

function opcoes() {
  tocarMusica();
  alert("Opções indisponíveis no momento.");
}

function loja() {
  tocarMusica();
  alert("Loja ainda em construção!");
}

function tocarMusica() {
  if (musica.paused) {
    musica.volume = 0.5; // volume opcional
    musica.play().catch((err) => {
      console.log("Falha ao reproduzir a música:", err);
    });
  }
}
