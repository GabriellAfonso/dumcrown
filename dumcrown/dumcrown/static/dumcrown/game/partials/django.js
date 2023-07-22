// Enviar o nickname para o Django usando AJAX
// Função para enviar o nickname para o Django usando AJAX
export default function sendDataToDjango(nickname) {
    const url = '/save_nickname/'; // Defina a URL da sua view Django para salvar o nickname
    const csrfToken = getCSRFToken(); // Obtenha o token CSRF para fazer a requisição POST

    const data = new FormData();
    data.append('nickname', nickname);


    fetch(url, {
        method: 'POST',
        headers: {
            'X-CSRFToken': csrfToken,
        },
        body: data, // Envie o FormData como corpo da requisição
    })
        .then(response => response.json())
        .then(data => {
            console.log('Data from Django:', data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Função para obter o token CSRF
function getCSRFToken() {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'csrftoken') {
            return value;
        }
    }
    return null;
}