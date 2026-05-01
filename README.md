# Dumcrown — Jogo de Cartas Online

[![Python](https://img.shields.io/badge/Python-3.11-3776AB?logo=python&logoColor=white)](https://python.org)
[![Django](https://img.shields.io/badge/Django-4.2-092E20?logo=django&logoColor=white)](https://djangoproject.com)
[![Channels](https://img.shields.io/badge/Django_Channels-4.0-092E20?logo=django&logoColor=white)](https://channels.readthedocs.io)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-336791?logo=postgresql&logoColor=white)](https://postgresql.org)
[![Redis](https://img.shields.io/badge/Redis-8.0-DC382D?logo=redis&logoColor=white)](https://redis.io)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)](https://docker.com)

Jogo de cartas online **player vs player** baseado no RPG de mesa criado pelo meu irmão Daniel. Desenvolvido com Django e Django Channels para comunicação em tempo real via WebSockets.

[Jogar como convidado →](https://dumcrown.com.br/guest/)

---

## Tecnologias

- **Python 3.11** + **Django 4.2** — backend principal
- **Django Channels 4** + **WebSockets** — comunicação em tempo real entre jogadores
- **Daphne** — servidor ASGI
- **PostgreSQL 17** — banco de dados principal
- **Redis 8** — message broker para os canais WebSocket
- **django-allauth** — autenticação social (OAuth)
- **Phaser 3** — engine de jogo no frontend
- **Docker / Docker Compose** — containerização

---

## Módulos

| App | Responsabilidade |
|---|---|
| `core` | Configurações, URLs, roteamento ASGI e WSGI |
| `dumcrown` | Lógica do jogo, matchmaking, modelos, WebSocket consumers e views |

---

## Como Rodar

**Pré-requisito:** Docker Compose

```bash
git clone https://github.com/GabriellAfonso/dumcrown.git
cd dumcrown

# Renomeie o arquivo .env.example para .env
cp dotenv_files/.env.example dotenv_files/.env

# Suba o ambiente
docker compose up --build
```

Acesse em `http://localhost`.

> **Testando uma partida:** o jogo é exclusivamente PvP — não há bot. Para jogar sozinho, abra dois navegadores simultaneamente (ex: um normal e um anônimo) ou acesse de dois dispositivos na mesma rede.

---

## Arquitetura

Comunicação em tempo real via **Django Channels** com Redis como layer de mensagens. Cada partida roda em um consumer WebSocket dedicado, que gerencia o estado do jogo e sincroniza as ações entre os dois jogadores.

```
dumcrown/
├── core/              # Configurações, ASGI, URLs globais
└── dumcrown/          # App principal
    ├── models/        # Cartas, partidas, jogadores
    ├── match_objects/ # Lógica da partida em memória
    ├── server/        # WebSocket consumers
    ├── views.py       # Views HTTP
    └── routing.py     # Roteamento WebSocket
```

---

## Agradecimentos

Ao meu irmão **Daniel**, que criou o RPG de mesa original, desenhou as cartas, ícones e imagens do jogo — e aos amigos que testaram e deram ideias. Valeu o apoio!

---

GNU General Public License v3.0 — veja [LICENSE](./LICENSE) para detalhes.
