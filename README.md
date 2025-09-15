# Passa a Bola - Plataforma de Futebol Feminino

**Passa a Bola** é uma plataforma web completa para acompanhamento de partidas de futebol feminino. O sistema permite que usuários visualizem jogos de diversas ligas, salvem partidas de interesse e recebam notificações sobre atualizações.

---

## Equipe

- Erick Jooji (RM: 564482)
- Luiz Dalboni (RM: 564189)
- Matheus Tozarelli (RM: 563490)
- Rafael Lorenzini (RM: 563643)
- Rafael Peloso (RM: 561343)

---

## Funcionalidades

### Sistema de Autenticação
- Registro e login de usuários
- Autenticação via JWT
- Opção "Manter-me conectado"
- Logout seguro

### Gerenciamento de Partidas
- Listagem completa de partidas por data, liga e status
- Filtros avançados por data, liga, time e status
- Visualização de placares em tempo real
- Status das partidas (Próximas, Ao Vivo, Finalizadas)

### Sistema de Favoritos
- Salvar partidas para acompanhamento
- Lista pessoal de partidas salvas
- Controle de notificações por partida
- Organização por status (Próximas, Ao Vivo, Finalizadas)

### Recursos Técnicos
- Interface responsiva para mobile e desktop
- Atualização automática de placares
- Fusos horários ajustados para Brasil
- Fallback para imagens de escudos

---

## Tecnologias Utilizadas

### Frontend
- React.js com hooks
- React Router para navegação
- CSS personalizado com design responsivo
- Font Awesome para ícones
- Bootstrap para componentes UI

### Backend
- Python Flask
- SQLite para banco de dados
- JWT para autenticação
- API TheSportsDB para dados de partidas
- Sistema de webhooks para notificações (sendo implementado)

---

## Estrutura do Projeto

```
ProjetoFutebolFeminino/
├── frontend/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── Layout.jsx
│   │   ├── PrivateRoute.jsx
│   │   └── Popup.jsx
│   ├── pages/
│   │   ├── Partidas.jsx
│   │   ├── Salvo.jsx
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── utils/
│   │   ├── traduzir.js
│   │   └── escudos.js
│   ├── styles/
│   │   ├── Partidas.css
│   │   ├── Salvo.css
│   │   ├── Login.css
│   │   ├── Register.css
│   │   ├── Header.css
│   │   └── Footer.css
│   └── assets/
│       ├── google-icon.png
│       ├── facebook-icon.png
│       └── bola-icon.png
├── backend/
│   ├── alimentar/
│   │   ├── alimentar_paulistao.py
│   │   ├── alimentar_copa_br.py
│   ├── main.py
│   ├── rotas.py
│   ├── database.py
│   ├── monitor.py
│   ├── config.py
├── requirements.txt
└── README.md
```

---

## Instalação e Configuração

### Pré-requisitos
- Node.js (v14 ou superior)
- Python 3.8+
- pip (gerenciador de pacotes Python)

### Backend

1. Instale as dependências Python:
   ```bash
   pip install -r requirements.txt
   ```
2. Entre na pasta backend:
   ```bash
   cd backend
   ```
3. Execute o servidor Flask:
   ```bash
   python rotas.py
   ```
4. Para acompanhamento ao vivo:
   Caso esteja acontecendo algum jogo de uma das ligas suportadas, rode:
   ```bash
   python monitor.py
   ```
   > **Nota:** Paulistão Feminino e Copa do Brasil tiveram dados inseridos artificialmente, pois não estavam disponíveis na versão gratuita da API. Não é possível acompanhá-los ao vivo.

**Extras:**
- Para testar a API: rode `main.py` para coletar dados da API e atualizar o banco de dados.
- Para recriar tudo do zero: apague os arquivos `futebol_feminino.db` e `users.db`, rode `main.py` e depois `rotas.py`.
- Para adicionar mais jogos, rode os arquivos da pasta `alimentar`. Esses dados não são ao vivo.

### Frontend

1. Navegue até a pasta frontend:
   ```bash
   cd frontend
   ```
2. Instale as dependências Node.js:
   ```bash
   npm install
   ```
3. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

---

## Ligas Suportadas

Por enquanto para nosso MVP (ou seja podemos aumentar tranquilamente), estamos contando com 3 ligas:

- Brazil Brasileiro Women
- International Friendlies Women
- English Womens Super League

### Ligas Artificiais 
Adicionadas manualmente por limitação da API gratuita:
- Copa do Brasil Feminina
- Copa Paulista Feminina

---

## Arquivos importantes

### Estrutura de Banco de Dados

O sistema utiliza dois bancos SQLite:
(ambos estão na pasta backend, dentro da pasta database)
- `futebol_feminino.db` — Dados de partidas e ligas
- `users.db` — Dados de autenticação de usuários

### Scripts

- `main.py`: Consome a API e insere dados no banco.
- `monitor.py`: Atualiza placares e status das partidas em tempo real.
- `rotas.py`: Cria os endpoints e faz autenticação de usuários.
- `config.py`: Configurações para requisições da API.
- `database.py`: Cria o banco e tabelas se não existirem, além de gerenciar status dos jogos.
- Arquivos em `alimentar/`: Inserção manual de partidas.

### Frontend Utils

- `traduzir.js`: Traduz nomes vindos da API (inglês → português).
- `escudos.js`: Implementa os escudos dos times para exibição nas partidas.

---

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request
