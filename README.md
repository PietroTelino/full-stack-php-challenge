# Full Stack PHP Challenge – Laravel + React + Docker

Este repositório contém a implementação de um **desafio Full Stack** utilizando **Laravel (backend)**, **React + Vite (frontend)** e **Docker**. O projeto inclui autenticação com **Laravel Sanctum (SPA)**, cadastro/login, carteira digital (wallet), depósito, transferência e reversão de transações.

---

## 🧱 Tecnologias Utilizadas

### Backend
- PHP 8.4
- Laravel
- Laravel Sanctum (SPA Authentication)
- PostgreSQL
- Docker / Docker Compose

### Frontend
- React
- Vite
- TypeScript
- Axios

---

## 📁 Estrutura do Projeto

```
.
├── api/        # Backend Laravel
├── front/      # Frontend React + Vite
├── docker-compose.yml
└── README.md
```

### Arquivos .gitignore

O repositório contém arquivos `.gitignore` nas pastas `api/` e `front/` para ignorar artefatos de build, dependências e arquivos sensíveis (ex.: `.env`, `node_modules`, `vendor`, etc.).

---

## ✅ Pré-requisitos

Antes de iniciar, certifique-se de ter instalado na sua máquina:

- **Docker** (>= 24)
- **Docker Compose**
- **Git**

> Não é necessário ter PHP, Node ou PostgreSQL instalados localmente, pois tudo roda via Docker.

---

## 🚀 Passo a Passo para Rodar o Projeto

### 1️⃣ Clonar o repositório

```bash
git clone https://github.com/PietroTelino/full-stack-php-challenge.git
cd full-stack-php-challenge
```

---

### 2️⃣ Subir os containers

Na raiz do projeto, execute:

```bash
docker compose up --build
```

Esse comando irá:
- Subir o PostgreSQL
- Construir o container do Laravel
- Instalar dependências PHP via Composer
- Executar migrations automaticamente
- Subir o servidor Laravel em `http://localhost:8000`
- Subir o frontend em `http://localhost:5173`

---

### 3️⃣ Acessar a aplicação

- **Frontend (SPA)**:  
  👉 http://localhost:5173

- **Backend (API)**:  
  👉 http://localhost:8000

---

## 🔐 Autenticação

A autenticação é feita utilizando **Laravel Sanctum no modo SPA**, baseada em **cookies e sessão**.

Fluxo utilizado:
1. `GET /sanctum/csrf-cookie`
2. `POST /api/register`
3. `POST /api/login`
4. Requisições autenticadas via `auth:sanctum`

O frontend já está configurado para lidar automaticamente com CSRF e cookies.

---

## 💰 Funcionalidades Implementadas

- Cadastro de usuário
- Login e logout
- Criação automática de wallet por usuário
- Consulta de saldo
- Depósito
- Transferência entre usuários
- Reversão de transações
- Histórico de transações (extrato)

---

## 🧪 Testes (opcional)

### Backend (Laravel)

Para rodar os testes no backend:

```bash
docker compose exec api php artisan test
```

### Frontend (React)

Para rodar os testes no frontend, execute dentro do container `front`:

```bash
docker compose exec front npm run test
```

Se o projeto estiver usando Vitest e você quiser modo watch:

```bash
docker compose exec front npm run test -- --watch
```

> Observação: os comandos acima assumem que existe um script `test` no `front/package.json`.

---

## 🛠️ Comandos Úteis

### Limpar caches do Laravel

```bash
docker compose exec api php artisan optimize:clear
```

### Parar os containers

```bash
docker compose down
```

### Parar e remover volumes (reset total)

```bash
docker compose down -v
```