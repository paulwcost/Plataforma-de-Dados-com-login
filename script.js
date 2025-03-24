document.addEventListener("DOMContentLoaded", function () {
    const listaFamilias = document.getElementById("lista-familias");
    const url = "https://servicos.jbrj.gov.br/v2/flora/families";
    const itemsPorPagina = 10;
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
            const card = document.createElement("div");
            card.classList.add("card");

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
});
