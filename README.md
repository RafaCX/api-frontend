# Loja Online - Frontend

## Descrição do Projeto

Este é o componente de frontend para o projeto "Loja Online", uma aplicação de e-commerce desenvolvida com arquitetura de microserviços. O frontend foi construído usando React e fornece uma interface amigável para os usuários navegarem pelos produtos disponíveis, adicioná-los ao carrinho, realizar pedidos e gerenciar esses pedidos.

Este projeto foi desenvolvido como parte do MVP para a disciplina de Desenvolvimento Full Stack Avançado, focando na implementação de uma solução baseada em microserviços.

## Arquitetura da Aplicação

![Arquitetura do Sistema de Microserviços](arquitetura.jpg)

A aplicação segue o padrão de microserviços, onde temos três componentes principais:

1. **Frontend (React)**: Interface do usuário para visualização de produtos e interação
2. **API de Pedidos (Python/Flask)**: Gerencia pedidos e itens
3. **API de Produtos (Python/Flask)**: Consome a FakeStore API para obter dados de produtos

O frontend se comunica com ambas as APIs para obter dados de produtos e enviar pedidos.

## Funcionalidades

- Listagem de produtos obtidos da API de Produtos
- Filtragem de produtos por categoria
- Adição de produtos ao carrinho de compras
- Finalização de pedidos com informações do cliente
- Área administrativa para gerenciamento de pedidos
- Visualização, atualização de status e exclusão de pedidos

## Requisitos

- Node.js (versão 16 ou superior)
- npm (gerenciador de pacotes do Node.js)
- Conexão com as APIs de Produtos e Pedidos

## Instalação e Configuração

Siga as etapas abaixo para configurar e executar o frontend:

1. **Clone o repositório**

```bash
git clone https://github.com/RafaCX/api-frontend.git
cd loja-online-frontend
```

2. **Instale as dependências**

```bash
npm install
```

3. **Configure as URLs das APIs**

Por padrão, o frontend está configurado para se comunicar com as APIs nos seguintes endereços:
- API de Produtos: `http://localhost:5001`
- API de Pedidos: `http://localhost:5000`

Se suas APIs estiverem rodando em endereços diferentes, você precisará editar os arquivos:
- `src/App.js` - Onde as chamadas à API são realizadas

4. **Inicie o servidor de desenvolvimento**

```bash
npm start
```

O frontend estará disponível em: http://localhost:3000

## Execução com Docker

Este projeto inclui um Dockerfile para facilitar a implantação.

1. **Construa a imagem Docker**

```bash
docker build -t loja-online-frontend .
```

2. **Execute o contêiner**

```bash
docker run -p 80:80 api-frontend
```

O frontend estará disponível em: http://localhost

## Estrutura do Projeto

```
frontend/
├── public/              # Arquivos estáticos
├── src/                 # Código fonte
│   ├── components/      # Componentes React
│   │   ├── Header.js    # Cabeçalho com navegação
│   │   ├── ProductList.js # Lista de produtos
│   │   ├── ProductCard.js # Card de produto individual
│   │   ├── Cart.js     # Carrinho de compras
│   │   ├── Checkout.js # Finalização de compra
│   │   └── OrderManagement.js # Gerenciamento de pedidos
│   ├── App.js          # Componente principal
│   └── index.js        # Ponto de entrada
├── Dockerfile          # Configuração do Docker
├── Docker-compose.yml 
└── package.json        # Dependências e scripts
```

## Comunicação com as APIs

O frontend se comunica com as seguintes APIs:

- **API de Produtos (porta 5001)**
  - `GET /produtos`: Lista todos os produtos
  - `GET /produto/{id}`: Obtém detalhes de um produto específico
  - `GET /categorias`: Lista todas as categorias
  - `GET /produtos/categoria/{categoria}`: Lista produtos por categoria

- **API de Pedidos (porta 5000)**
  - `POST /pedido`: Cria um novo pedido
  - `GET /pedidos`: Lista todos os pedidos
  - `DELETE /pedido?id={id}`: Remove um pedido
  - `PUT /pedido`: Atualiza o status de um pedido



Projeto desenvolvido como MVP para a disciplina de Desenvolvimento Full Stack Avançado.