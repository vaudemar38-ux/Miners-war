const musica = document.getElementById("musicaFundo");
const volumeRange = document.getElementById("volumeRange");
const menuPrincipal = document.querySelector(".menu");
const opcoesMenu = document.getElementById("opcoesMenu");

// Toca a música se ainda não estiver tocando
function tocarMusica() {
  if (musica.paused) {
    musica.volume = volumeRange.value / 100;
    musica.play().catch(err => console.log("Erro ao tocar música:", err));
  }
}

// Função chamada ao clicar em "Jogar"
function jogar() {
  tocarMusica();
  alert("Jogo começando (em breve)!");
}

// Abre o menu de opções
function opcoes() {
  tocarMusica();
  menuPrincipal.style.display = "none";
  opcoesMenu.style.display = "block";
}

// Fecha o menu de opções e volta ao principal
function fecharOpcoes() {
  opcoesMenu.style.display = "none";
  menuPrincipal.style.display = "block";
}

// Ajusta volume ao mover o slider
volumeRange.addEventListener("input", () => {
  musica.volume = volumeRange.value / 100;
});
