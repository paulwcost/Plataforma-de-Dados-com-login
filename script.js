document.addEventListener("DOMContentLoaded", function () {
    const listaFamilias = document.getElementById("lista-familias");
    const detalhesEspecie = document.getElementById("detalhes-especie");
    const url = "https://servicos.jbrj.gov.br/v2/flora/families";  // URL para as famílias
    const itemsPorPagina = 12;
    let familias = [];
    let paginaAtual = 1;

    function exibirPagina(pagina) {
        listaFamilias.innerHTML = "";

        const inicio = (pagina - 1) * itemsPorPagina;
        const fim = inicio + itemsPorPagina;
        const familiasPagina = familias.slice(inicio, fim);

        const container = document.createElement("div");
        container.classList.add("familias-container");

        familiasPagina.forEach(familia => {
            const card = document.createElement("a");
            card.classList.add("card");
            // Atualize o href para redirecionar para a página "Especies.html" com o parâmetro family
            card.href = `especies.html?family=${familia}`;
            card.style.cursor = 'pointer'; // Garantir que o cursor seja o de mãozinha

            const titulo = document.createElement("h3");
            titulo.textContent = familia;
            
            card.appendChild(titulo);
            container.appendChild(card);
        });

        listaFamilias.appendChild(container);
        atualizarPaginacao();
    }

    function atualizarPaginacao() {
        let paginacaoDiv = document.getElementById("paginacao");

        if (!paginacaoDiv) {
            paginacaoDiv = document.createElement("div");
            paginacaoDiv.id = "paginacao";
            paginacaoDiv.classList.add("paginacao");

            const botaoAnterior = document.createElement("button");
            botaoAnterior.id = "btn-anterior";
            botaoAnterior.textContent = "Anterior";
            botaoAnterior.addEventListener("click", function () {
                if (paginaAtual > 1) {
                    paginaAtual--;
                    exibirPagina(paginaAtual);
                }
            });

            const botaoProximo = document.createElement("button");
            botaoProximo.id = "btn-proximo";
            botaoProximo.textContent = "Próximo";
            botaoProximo.addEventListener("click", function () {
                if (paginaAtual * itemsPorPagina < familias.length) {
                    paginaAtual++;
                    exibirPagina(paginaAtual);
                }
            });

            paginacaoDiv.appendChild(botaoAnterior);
            paginacaoDiv.appendChild(botaoProximo);
            listaFamilias.appendChild(paginacaoDiv);
        }

        document.getElementById("btn-anterior").disabled = paginaAtual === 1;
        document.getElementById("btn-proximo").disabled = paginaAtual * itemsPorPagina >= familias.length;
    }

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            familias = data;
            exibirPagina(paginaAtual);
        })
        .catch(error => {
            listaFamilias.innerHTML = `<p style="color: red;">Erro ao buscar famílias: ${error.message}</p>`;
        });
    
    if (detalhesEspecie) {
        const params = new URLSearchParams(window.location.search);
        const familia = params.get("family");
        
        console.log(familia);

        fetch(`https://servicos.jbrj.gov.br/v2/flora/species/${familia}`)
    .then(response => response.json())
    .then(data => {
        // Verifique os dados retornados
        console.log(data); // Verifique o que está sendo retornado da API

        // Se o array de espécies estiver vazio, exiba uma mensagem
        if (data.length === 0) {
            detalhesEspecie.innerHTML = `<p>Não há espécies disponíveis para esta família.</p>`;
        } else {
            detalhesEspecie.innerHTML = `<h2>Espécies da Família ${familia}</h2>`;

            // Loop para cada espécie retornada
            data.forEach(species => {
                console.log("Está são as espécies: ", species); // Verifique a estrutura de cada espécie

                let div = document.createElement("div");
                div.classList.add("species-item");

                // Ajuste conforme os nomes corretos dos campos
                const scientificName = species.scientificname; // Usar o nome correto

                // Se os dados existem, exiba-os
                if (scientificName) {
                    div.innerHTML = `<strong>${scientificName}</strong>}`;
                } else {
                    div.innerHTML = `<strong>Informação não disponível</strong>`;
                }

                // Adicione o novo elemento à página
                detalhesEspecie.appendChild(div);
            });
        }
    })
    .catch(error => {
        console.error("Erro ao buscar detalhes da espécie: ", error);
        detalhesEspecie.innerHTML = `<p style="color: red;">Erro ao carregar as informações da espécie.</p>`;
    });

    
    }
});