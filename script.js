// Seleciona o botão e o menu pelo ID
const btnMenu = document.getElementById("btn-menu");
const menu = document.getElementById("menu");

// Adiciona um evento de clique ao botão
btnMenu.addEventListener("click", () => {
    menu.classList.toggle("ativo"); // Alterna a classe 'ativo' no menu
});