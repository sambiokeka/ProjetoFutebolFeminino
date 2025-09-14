# <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/26bd.svg" width="32" alt="Bola de futebol" /> Passa a Bola - Plataforma de Futebol Feminino

**Passa a Bola** é uma plataforma web completa para acompanhamento de partidas de futebol feminino. O sistema permite que usuários visualizem jogos de diversas ligas, salvem partidas de interesse e recebam notificações sobre atualizações.

---

## <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f465.svg" width="24" alt="Equipe" /> Equipe

- Erick Jooji (RM: 564482)
- Luiz Dalboni (RM: 564189)
- Matheus Tozarelli (RM: 563490)
- Rafael Lorenzini (RM: 563643)
- Rafael Peloso (RM: 561343)

---

## <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f3ae.svg" width="24" alt="Funcionalidades" /> Funcionalidades

### <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f512.svg" width="20" alt="Cadeado" /> Sistema de Autenticação
- Registro e login de usuários
- Autenticação via JWT
- Opção "Manter-me conectado"
- Logout seguro

### <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f3c6.svg" width="20" alt="Troféu" /> Gerenciamento de Partidas
- Listagem completa de partidas por data, liga e status
- Filtros avançados por data, liga, time e status
- Visualização de placares em tempo real
- Status das partidas (Próximas, Ao Vivo, Finalizadas)

### <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/2764.svg" width="20" alt="Coração" /> Sistema de Favoritos
- Salvar partidas para acompanhamento
- Lista pessoal de partidas salvas
- Controle de notificações por partida
- Organização por status (Próximas/Finalizadas)

### <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f4bb.svg" width="20" alt="Computador" /> Recursos Técnicos
- Interface responsiva para mobile e desktop
- Atualização automática de placares
- Fusos horários ajustados para Brasil
- Fallback para imagens de escudos

---

## <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f4c8.svg" width="24" alt="Tecnologias" /> Tecnologias Utilizadas

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

## <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f4c1.svg" width="24" alt="Estrutura de pastas" /> Estrutura do Projeto

```
passa-a-bola/
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

## <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f527.svg" width="24" alt="Instalação" /> Instalação e Configuração

### Pré-requisitos
- Node.js (v14 ou superior)
- Python 3.8+
- pip (gerenciador de pacotes Python)

### Backend

1. Instale as dependências Python:
   ```bash
   pip install -r requirements.txt
   ```
2. Entre no backend:
   ```bash
   cd backend
   ```
3. Execute o servidor Flask:
   ```bash
   python rotas.py
   ```
4. Acompanhe ao vivo:
   Caso tenha algum jogo de alguma dessas ligas ["Brazil Brasileiro Women", "International Friendlies Women", "English Womens Super League"] (se quiser adicionar mais ligas, fique à vontade, mas essas são as ligas que inserimos para nosso MVP) acontecendo no momento em que você estiver com o `rotas.py` rodando, é só fazer o seguinte:
   ```bash
   python monitor.py
   ```
   > **Nota:** Como os campeonatos do Paulistão Feminino e Copa do Brasil não estavam disponíveis na nossa versão gratuita da API, pegamos os dados e inserimos artificialmente, por isso eles não podem ser acompanhados ao vivo.

   **Extras:**
   - Se quiser ver como a API funciona, você pode testar duas coisas. Primeiro, apenas rode o `main.py` (demora um pouco para ele pegar todos os dados, já que nossa API não é premium). Ele já vai chamar a API e outros arquivos `.py` e vai atualizar dados (se houver atualizações) do `futebol_feminino.db`.
   - Se quiser ver tudo do zero, delete tanto:
     - `futebol_feminino.db`
     - `users.db`
   - Rode o `main.py` e depois o `rotas.py`. Depois de esperar o `main.py` terminar, já está pronto. Se quiser ver dados de jogos adicionais, também rode os arquivos na pasta de alimentar. Eles não consomem a API e são apenas para ter mais jogos mesmo — inclusive não tem como acompanhá-los ao vivo.

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

## <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f3c3.svg" width="24" alt="Ligas" /> Ligas Suportadas

- Brazil Brasileiro Women
- International Friendlies Women
- English Womens Super League

### Ligas Artificiais 

Por não estarem disponíveis na API v1 (gratuita), adicionamos jogos dos campeonatos:

- Copa do Brasil Feminina
- Copa Paulista Feminina

de maneira artificial. Os dados são reais, mas eles não são concedidos pela nossa API.

---

## <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f4ca.svg" width="24" alt="Banco de Dados" /> Desenvolvimento

### Estrutura de Banco de Dados

O sistema utiliza dois bancos SQLite:
- `futebol_feminino.db` - Dados de partidas e ligas
- `users.db` - Dados de autenticação de usuários

### Scripts de Coleta de Dados

O `main.py` coleta os dados iniciais da API e insere no banco de dados `futebol_feminino.db`.

### Monitoramento em Tempo Real

O `monitor.py` verifica atualizações de placar e status das partidas periodicamente.

---

## <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f91d.svg" width="24" alt="Colabore" /> Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

---

## <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f4dc.svg" width="24" alt="Licença" /> Licença

Este projeto está sob licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---