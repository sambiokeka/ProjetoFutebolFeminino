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
│   ├── database/
│   │   ├── futebol_feminino.json
│   │   └── users.json
│   ├── alimentar/
│   │   ├── alimentar_paulistao.py
│   │   └── alimentar_copa_br.py
│   ├── json_database.py
│   ├── rotas.py
│   ├── monitor.py
│   └── config.py
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
3. Execute o main.py:
   ```bash
   python main.py
   ```
4. Execute o servidor:
   ```bash
   python rotas.py
   ```
5. Acompanhe ao vivo:
   ```
   python monitor.py
   ```

**Extras:**
- Para testar a API: rode `main.py` para coletar dados da API e atualizar o banco de dados.
- Para recriar tudo do zero: apague os arquivos `futebol_feminino.json` e `users.json`, rode `main.py` e depois `rotas.py`.
- Para adicionar mais jogos, rode os arquivos da pasta `alimentar`. como os dados da pasta alimentar não são da API eles não tem acompanhamento ao vivo.


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

Para nosso MVP (mas podemos aumentar facilmente), estamos contando com 3 ligas:
- Brazil Brasileiro Women
- International Friendlies Women
- English Womens Super League

### Ligas Artificiais

Adicionadas manualmente por limitação da API gratuita:
- Copa do Brasil Feminina
- Copa Paulista Feminina

---

## Arquivos importantes

### Estrutura de Dados JSON

O sistema utiliza dois arquivos JSON:
- `database/futebol_feminino.json` — Dados de partidas e ligas
- `database/users.json` — Dados de autenticação de usuários

### Scripts

- **json_database.py**: Manipula os arquivos JSON 
- **monitor.py**: Atualiza placares e status das partidas em tempo real
- **rotas.py**: Cria os endpoints e faz autenticação de usuários
- **config.py**: Configurações para requisições da API
- **alimentar/**: Inserção manual de partidas

### Frontend Utils

- **traduzir.js**: Traduz nomes vindos da API (inglês → português)
- **escudos.js**: Implementa os escudos dos times para exibição nas partidas

---

## Migração de SQLite para JSON

O sistema foi migrado de SQLite para JSON para simplificar a implementação. As principais mudanças:
- Remoção de dependências: Não é mais necessário instalar/suportar SQLite
- Simplicidade: Dados armazenados em formato JSON legível
- Portabilidade: Arquivos JSON são mais fáceis de visualizar e manipular
- Backup: Fácil backup e restauração copiando arquivos JSON

**Scripts de migração disponíveis:**
- **migrate_sqlite_to_json.py**: Migra dados existentes do SQLite para JSON
- **migrate_to_database_folder.py**: Move arquivos JSON para a pasta database

---

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

