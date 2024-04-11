# Dumcrown

#### o que é :
Dumcrown é um jogo de cartas online player vs player baseado na história do RPG de mesa do meu irmão Daniel.

## OBJETIVO
O principal objetivo desse projeto foi me expor ao máximo de tecnologias, conceitos e complexidades possíveis.
Eu queria um projeto no qual eu pudesse aprender o máximo de coisas possíveis em um único projeto, e nesse projeto eu aprendi:

* Banco de Dados
* Accounts do Django
* Django Channels & Websockets
* Forms e Models do Django
* Docker & Docker Compose
* OAuth com Social Accounts
* Git & GitHub 
* Classes e funções assíncronas na prática
* JavaScript
* Nginx
* Certbot
* Celery
 

Entre outras coisas mais pontuais.

## Tecnologias Utilizadas

* [Docker](https://www.docker.com/)
* [Nginx](https://www.nginx.com/)
* [Postgres](https://www.postgresql.org/)
* [Django](https://www.djangoproject.com/)
* [Redis](https://redis.io/)
* [Phaser](https://phaser.io/)

## Como Rodar o Projeto

Para rodar o projeto, tudo que você vai precisar é do Docker e do Docker Compose. 
Caso não funcione na versão que você tem instalada, o projeto está rodando com:
* Docker 25.0.4
* Docker-Compose v2.24.7.

clone o repositório:
```
git clone git@github.com:GabriellAfonso/dumcrown.git
```
Va para a pasta dotenv_files e renomeie o arquivo _.env pra .env

Depois volte à pasta raiz do projeto e execute o docker compose
```
docker compose up --build
```
após esperar, basta acessar o localhost ou 127.0.0.1 no seu navegador.

## Considerações Sobre o Projeto

Enfrentei inúmeros desafios nesse projeto, já que a cada passo a mais que eu dava, me deparava com um mundo inteiro de novos conceitos e novas complexidades,
o que contribuiu imensamente para o meu aprendizado, Parando pra estudar cada vez que me deparava com um novo problema. 
Foi muito divertido ver meu irmão e os amigos dele, que jogavam o RPG de mesa dele, testar o jogo. 
Com certeza, valeu muito a pena todos os meses de estudo e esforço dedicados a esse simples jogo que me rendeu muito conhecimento e diversão!

## Agradecimentos 
Primeiramente, gostaria de agradecer ao meu irmão Daniel, que me ajudou bastante desenhando as cartas, ícones e imagens do jogo,
e também aos nossos amigos que nos ajudaram testando o jogo e nos dando mais ideias. Muito obrigado pelo apoio!

## Próximos Passos

Criar um jogo é um objetivo meu desde criança, então não termina por aqui. 
Esse projeto foi apenas um rascunho que utilizei para aprender, e agora estou trabalhando em um projeto mais completo e estruturado,
que irei fazer utilizando a engine Godot para fazer o jogo tanto para desktop quanto mobile e o Django para fazer a parte do servidor.
Os respectivos repositórios estão linkados abaixo.

* [Dumcrown-Godot](https://github.com/GabriellAfonso/dumcrown-godot)
