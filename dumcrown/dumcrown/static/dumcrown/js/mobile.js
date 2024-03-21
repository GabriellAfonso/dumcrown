document.addEventListener('DOMContentLoaded', function () {
    // Seleciona a div clicável e o elemento #bar após o carregamento do DOM
    const toggleBtn = document.getElementById('menu');
    const navegationBar = document.getElementById('bar');

    // Adiciona um evento de clique à div clicável
    toggleBtn.addEventListener('click', function (event) {
        // Impede a propagação do clique para evitar que seja tratado pelo evento do documento
        event.stopPropagation();

        // Alterna a classe 'active' na navegação para mostrar/ocultar a navegação
        navegationBar.classList.toggle('active');
    });

    // Adiciona um evento de clique ao documento
    document.addEventListener('click', function (event) {
        // Verifica se o clique ocorre fora do elemento #bar
        if (!navegationBar.contains(event.target) && !toggleBtn.contains(event.target)) {
            // Remove a classe 'active' para ocultar a navegação
            navegationBar.classList.remove('active');
        }
    });
});