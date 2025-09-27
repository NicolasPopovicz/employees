# 📂 Documentação Employees API

Este projeto é uma API para gerenciamento de **documentos de colaboradores**, construída com **NestJS**.

## 📌 Objetivo do Projeto

O sistema tem como finalidade centralizar e organizar a documentação obrigatória de colaboradores, permitindo:

- Cadastrar documentos que serão **atrelados aos colaboradores**.
- Cadastrar os **tipos de documentos** que poderão ser atrelados aos colaboradores.
- Indicar se os documentos estão **pendentes de envio** ou já foram **enviados**.

---

## 🏗 Arquitetura Utilizada

A arquitetura adotada segue o padrão **modular** do NestJS, inspirada no Angular.
Cada domínio da aplicação possui seu próprio **módulo**, garantindo organização e separação de responsabilidades.

### Estrutura da aplicação

- **Modules** → Dividem a aplicação em domínios (ex.: `employee`, `document`).
- **Controllers** → Responsáveis por receber as requisições HTTP e direcionar para os serviços.
- **Services** → Contêm a lógica de negócio e manipulação dos dados.
- **DTOs** → Definem a entrada e saída de dados e faz a tratativa dos mesmos.
- **Entities** → Representam as entidades do banco de dados.
- **Interfaces & Enums** → Contratos e tipos compartilhados.

---

## 📡 Endpoints Disponíveis

### 📑 Document
- `POST /document/create` → Cria um tipo de documento.

### 👤 Employee
- `POST /employee/new` → Cria um novo colaborador, passando os parâmetros no corpo da requisição.
- `PUT /employee/update` → Atualiza os dados de um colaborador.
- `GET /employee/{id}/status/documents` → Lista todos os documentos de um colaborador específico, mostrando seus status.
- `GET /employee/list/pending/documents` → Lista documentos pendentes de todos os colaboradores ou de um colaborador específico.
- `POST /employee/{id}/send/document` → Atrela um documento a um colaborador, deixando pendente de envio.
- `POST /employee/{id}/link/documents` → Faz o vínculo de documentos enviados ao colaborador.
- `POST /employee/{id}/unlink/documents` → Remove o vínculo de documentos enviados ao colaborador.


---

## 🚀 Tecnologias Utilizadas

- [NestJS](https://nestjs.com/) — Framework principal.
- Node.js
- TypeScript
- Docker (para containerização)
- PostgreSQL (banco de dados)

---

## ✅ Conclusão

Optei por utilizar o **NestJS** dentre os frameworks solicitados, pois sua estrutura inicial já é **robusta e pronta para uso**.
A documentação oficial é clara e de fácil consulta, o que agilizou o desenvolvimento.

A arquitetura escolhida foi a **modular sugerida pelo próprio NestJS**, separando responsabilidades em módulos (`employee`, `document`, etc.), o que torna o código mais **organizado, escalável e de fácil manutenção**.

---

## 🔧 Como executar o projeto

Primeiro, sugiro criar um arquivo `.env` na raíz do projeto com as configurações de acesso ao banco de dados. Exemplo:

```bash
DB_HOST='localhost'
DB_USERNAME='postgres'
DB_PASSWORD='postgres'
DB_DATABASE='employees'
```

Caso ocorra algum problema na comunicação entre a aplicação e o banco de dados, altere a senha do usuário `postgres` no banco e nos arquivos `.env`, `src/app.module.ts` e `docker-compose.yaml`.

```bash
# Instalar dependências
npm install

# Rodar a aplicação em modo de desenvolvimento
npm run start:dev

# Rodar via Docker
docker compose up --build
```

Se optar por rodar na própria máquina, certifique-se de que o Postgre esteja instalado. Também será necessário rodar os arquivos `.sql` que se encontram no diretório `/sql`.

A API estará disponível em: http://localhost:3000

A documentação da API está dicponível em: http://localhost:3000/api
