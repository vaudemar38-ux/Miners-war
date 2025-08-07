document.addEventListener("DOMContentLoaded", () => {
  const inventory = document.getElementById("inventory");
  const craftGrid = document.getElementById("craftGrid");
  const craftResult = document.getElementById("craftResult");
  const craftButton = document.getElementById("craft-button");
  const exploreBtn = document.getElementById("exploreBtn");

  // Cria os espaços da mochila
  for (let i = 0; i < 6; i++) {
    const slot = document.createElement("div");
    slot.classList.add("slot");
    inventory.appendChild(slot);
  }

  // Cria os espaços de crafting
  for (let i = 0; i < 9; i++) {
    const slot = document.createElement("div");
    slot.classList.add("craft-slot");
    craftGrid.appendChild(slot);
  }

  // Referencia novamente após criar dinamicamente
  const mochila = document.querySelectorAll(".slot");
  const craftSlots = document.querySelectorAll(".craft-slot");

  // Carrega mochila do localStorage ou inicia vazia
  let inventario = JSON.parse(localStorage.getItem("mochila")) || Array(6).fill(null);

  // Mostra os itens na tela
  mochila.forEach((slot, index) => {
    const item = inventario[index];
    if (item) slot.textContent = item; // Apenas texto por enquanto
    slot.addEventListener("click", () => moverParaCrafting(index));
  });

  // Mover item da mochila para a primeira posição vazia da mesa
  function moverParaCrafting(index) {
    const item = inventario[index];
    if (!item) return;

    for (let i = 0; i < craftSlots.length; i++) {
      if (!craftSlots[i].textContent) {
        craftSlots[i].textContent = item;
        inventario[index] = null;
        localStorage.setItem("mochila", JSON.stringify(inventario));
        mochila[index].textContent = "";
        break;
      }
    }
  }

  // Craftar mochila
  craftButton.addEventListener("click", () => {
    const materiais = Array.from(craftSlots).map(slot => slot.textContent);

    if (materiais.filter(x => x === "couro").length >= 2 && materiais.filter(x => x === "linha").length >= 2) {
      craftResult.textContent = "🎒 Mochila Criada!";
      craftSlots.forEach(slot => (slot.textContent = ""));
      const vazio = inventario.findIndex(x => x === null);
      if (vazio !== -1) {
        inventario[vazio] = "mochila";
        localStorage.setItem("mochila", JSON.stringify(inventario));
        mochila[vazio].textContent = "mochila";
      }
    } else {
      craftResult.textContent = "❌ Receita incorreta";
    }
  });

  // Botão explorar leva para mapa.html
  if (exploreBtn) {
    exploreBtn.addEventListener("click", () => {
      window.location.href = "mapa.html";
    });
  }
});
