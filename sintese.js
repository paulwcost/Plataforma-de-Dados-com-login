document.addEventListener("DOMContentLoaded", function () {
    fetch("/especie_local.json")
      .then(response => response.json())
      .then(data => {
        const container = document.querySelector(".grid-especies");
  
        data.forEach(especie => {
          const card = document.createElement("div");
          card.classList.add("especie-card");
  
          card.innerHTML = `
            <img src="imagens/${especie.imagem}" alt="${especie.nomePopular}">
            <h3>${especie.nomePopular}</h3>
            <p><strong>Nome Científico:</strong> <em>${especie.nomeCientifico}</em></p>
            <p><strong>Local:</strong> ${especie.local}</p>
            ${especie.alturaMedia ? `<p><strong>Altura média:</strong> ${especie.alturaMedia}</p>` : ""}
            ${especie.floracao ? `<p><strong>Floração:</strong> ${especie.floracao}</p>` : ""}
            ${especie.frutificacao ? `<p><strong>Frutificação:</strong> ${especie.frutificacao}</p>` : ""}
          `;
  
          container.appendChild(card);
        });
      })
      .catch(error => {
        console.error("Erro ao carregar os dados das espécies:", error);
      });
  });