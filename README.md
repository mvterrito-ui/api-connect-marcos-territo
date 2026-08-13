# API Connect — Cadastro de Usuários

API REST desenvolvida como MVP para o gerenciamento de usuários. O projeto expõe endpoints para cadastro, listagem, busca individual, atualização e remoção de registros, aplicando validação de dados de entrada e retornando os códigos de status HTTP adequados para cada cenário.

Os dados são mantidos em memória (array em tempo de execução), sem persistência em banco de dados. Ao reiniciar o servidor, os registros são zerados e a contagem de IDs recomeça do 1.

## Objetivo

Disponibilizar uma interface HTTP que permita a outras aplicações:

- Cadastrar novos usuários com validação dos campos obrigatórios
- Consultar a lista completa de usuários cadastrados
- Buscar um usuário específico pelo seu identificador
- Atualizar registros de forma completa (PUT) ou parcial (PATCH)
- Remover usuários da base
- Receber respostas padronizadas em JSON, com o status HTTP correspondente ao resultado da operação

## Tecnologias utilizadas

| Tecnologia | Versão | Finalidade |
|---|---|---|
| Node.js | 25.x | Ambiente de execução JavaScript no servidor |
| Express | 5.x | Framework para roteamento e tratamento de requisições HTTP |
| npm | 11.x | Gerenciador de pacotes e scripts do projeto |

## Arquitetura

O projeto separa as responsabilidades em três camadas, cada uma com um propósito único:

| Camada | Arquivo | Responsabilidade |
|---|---|---|
| Rotas | `src/routes/usuarios.routes.js` | Associa cada método HTTP à função correspondente |
| Regras | `src/controllers/usuarios.controller.js` | Valida os dados de entrada e define o status da resposta |
| Dados | `src/data/usuarios.repository.js` | Manipula o array em memória que simula a persistência |

O arquivo `server.js` atua como ponto de entrada: configura o Express e monta as rotas sob o caminho `/usuarios`.

Essa divisão permite que a origem dos dados seja trocada no futuro — por um banco de dados, por exemplo — alterando apenas a camada de dados, sem impacto nas rotas ou nas regras de validação.

## Como executar localmente

### Pré-requisitos

- Node.js instalado (versão 18 ou superior)
- npm (instalado junto com o Node.js)

### Passo a passo

**1. Clone o repositório**

```bash
git clone https://github.com/mvterrito-ui/api-connect-marcos-territo.git
```

**2. Acesse a pasta do projeto**

```bash
cd api-connect-marcos-territo
```

**3. Instale as dependências**

```bash
npm install
```

**4. Inicie o servidor**

```bash
npm start
```

O servidor sobe em `http://localhost:3000` e exibe no terminal:

```
Servidor rodando em http://localhost:3000
```

### Alterando a porta

Caso a porta 3000 já esteja em uso, defina outra através da variável de ambiente `PORT`:

```bash
PORT=3001 npm start
```

## Endpoints

URL base: `http://localhost:3000`

| Método | Rota | Descrição | Status de sucesso |
|---|---|---|---|
| POST | `/usuarios` | Cadastra um novo usuário | 201 Created |
| GET | `/usuarios` | Lista todos os usuários cadastrados | 200 OK |
| GET | `/usuarios/:id` | Busca um usuário pelo ID | 200 OK |
| PUT | `/usuarios/:id` | Substitui todos os dados de um usuário | 200 OK |
| PATCH | `/usuarios/:id` | Atualiza parcialmente um usuário | 200 OK |
| DELETE | `/usuarios/:id` | Remove um usuário da base | 204 No Content |

---

### POST /usuarios

Cadastra um novo usuário. Os campos `nome` e `email` são obrigatórios. O `id` é gerado automaticamente pelo servidor.

**Corpo da requisição**

```json
{
  "nome": "João Silva",
  "email": "joao@email.com"
}
```

**Resposta — 201 Created**

```json
{
  "data": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@email.com"
  }
}
```

**Resposta — 400 Bad Request** (campo `email` ausente)

```json
{
  "error": "O campo e-mail é obrigatório."
}
```

**Resposta — 400 Bad Request** (campo `nome` ausente)

```json
{
  "error": "O campo nome é obrigatório."
}
```

---

### GET /usuarios

Retorna a lista completa de usuários cadastrados. Quando não há registros, retorna um array vazio.

**Resposta — 200 OK**

```json
[
  {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@email.com"
  }
]
```

---

### GET /usuarios/:id

Busca um usuário específico pelo seu identificador numérico.

**Exemplo de requisição**

```
GET /usuarios/1
```

**Resposta — 200 OK**

```json
{
  "id": 1,
  "nome": "João Silva",
  "email": "joao@email.com"
}
```

**Resposta — 404 Not Found** (ID inexistente)

```json
{
  "error": "Usuário não encontrado"
}
```

---

### PUT /usuarios/:id

Substitui os dados de um usuário existente. Por se tratar de uma substituição completa, os campos `nome` e `email` são ambos obrigatórios.

**Exemplo de requisição**

```
PUT /usuarios/1
```

**Corpo da requisição**

```json
{
  "nome": "João Pedro Silva",
  "email": "joaopedro@email.com"
}
```

**Resposta — 200 OK**

```json
{
  "data": {
    "id": 1,
    "nome": "João Pedro Silva",
    "email": "joaopedro@email.com"
  }
}
```

**Resposta — 400 Bad Request** (campo obrigatório ausente)

```json
{
  "error": "O campo e-mail é obrigatório."
}
```

**Resposta — 404 Not Found** (ID inexistente)

```json
{
  "error": "Usuário não encontrado"
}
```

---

### PATCH /usuarios/:id

Atualiza parcialmente um usuário. Diferente do PUT, aceita apenas os campos que se deseja modificar — os demais permanecem inalterados.

**Exemplo de requisição**

```
PATCH /usuarios/1
```

**Corpo da requisição**

```json
{
  "email": "novo@email.com"
}
```

**Resposta — 200 OK**

```json
{
  "data": {
    "id": 1,
    "nome": "João Silva",
    "email": "novo@email.com"
  }
}
```

**Resposta — 400 Bad Request** (nenhum campo informado)

```json
{
  "error": "Informe ao menos um campo para atualizar."
}
```

**Resposta — 404 Not Found** (ID inexistente)

```json
{
  "error": "Usuário não encontrado"
}
```

---

### DELETE /usuarios/:id

Remove um usuário da base. Em caso de sucesso a resposta não possui corpo, seguindo a semântica do status 204.

**Exemplo de requisição**

```
DELETE /usuarios/1
```

**Resposta — 204 No Content**

```
(sem corpo)
```

**Resposta — 404 Not Found** (ID inexistente)

```json
{
  "error": "Usuário não encontrado"
}
```

## Códigos de status utilizados

| Código | Significado | Quando ocorre |
|---|---|---|
| 200 | OK | Listagem, busca ou atualização realizada com sucesso |
| 201 | Created | Usuário cadastrado com sucesso |
| 204 | No Content | Usuário removido com sucesso (resposta sem corpo) |
| 400 | Bad Request | Campo obrigatório ausente no corpo da requisição |
| 404 | Not Found | ID informado não corresponde a nenhum usuário |

## Testando a API

Como o projeto não possui interface gráfica, utilize um cliente HTTP como **Insomnia**, **Postman** ou **Thunder Client** para enviar as requisições.

Ao montar as requisições POST, PUT e PATCH, selecione o tipo de corpo **JSON** para que o cabeçalho `Content-Type: application/json` seja enviado corretamente — caso contrário o servidor não conseguirá interpretar os dados.

## Estrutura do projeto

```
api-connect-marcos-territo/
├── node_modules/                        # Dependências (ignorado pelo Git)
├── src/
│   ├── controllers/
│   │   └── usuarios.controller.js       # Validações e regras de negócio
│   ├── data/
│   │   └── usuarios.repository.js       # Array em memória (simula persistência)
│   └── routes/
│       └── usuarios.routes.js           # Definição das rotas do recurso
├── .gitignore                           # Arquivos e pastas fora do versionamento
├── package.json                         # Metadados e scripts do projeto
├── package-lock.json                    # Versões exatas das dependências
├── README.md                            # Documentação
└── server.js                            # Ponto de entrada da aplicação
```
