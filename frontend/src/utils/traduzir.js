export const traducoes = {
  teams: {
    'Santos Women': 'Santos Feminino',
    'Corinthians Women': 'Corinthians Feminino',
    'Flamengo Women': 'Flamengo Feminino',
    'São Paulo Women': 'São Paulo Feminino',
    'Palmeiras Women': 'Palmeiras Feminino',
    'Grêmio Women': 'Grêmio Feminino',
    'Internacional Women': 'Internacional Feminino',
    'Atlético Mineiro Women': 'Atlético Mineiro Feminino',
    'Cruzeiro Women': 'Cruzeiro Feminino',
    'Botafogo Women': 'Botafogo Feminino',
    'Fluminense Women': 'Fluminense Feminino',
    'Vasco Women': 'Vasco Feminino',
    'America Mineiro Women': 'América Mineiro Feminino',
    'Athletico Paranaense Women': 'Athletico Paranaense Feminino',
    'Bahia Women': 'Bahia Feminino',
    'Ceará Women': 'Ceará Feminino',
    'Fortaleza Women': 'Fortaleza Feminino',
    'Goiás Women': 'Goiás Feminino',
    'AD Taubaté Women' : 'AD Taubaté Feminino',
    'Bragantino Women' : 'Bragantino Feminino',
    '3B da Amazônia' : '3B da Amazônia Feminino',
    '3B da Amazônia Women' : '3B da Amazônia Feminino',
    'Juventude-RS Feminino' : 'Juventude Feminino',


    'Sport Women': 'Sport Feminino',
    'Vitória Women': 'Vitória Feminino',
    'Ireland Women' : 'Irlanda Feminino',
    'Belarus Women' : 'Bielorrússia Feminino',
    'Azerbaijan Women' : 'Azerbaijão Feminino',
    'USA Women' : 'EUA Feminino',
    'Estonia Women' : 'Estónia Feminino',
    'Serbia Women' : 'Sévia Feminino',
    'England Women' : 'Inglaterra Feminino',
    'Georgia Women' : 'Geórgia Feminino',
    'Moldova Women' : 'Moldávia Feminino',
    'Switzerland Women' : 'Suíça Feminino',
    'Wales Women' : 'País de Gales Feminino',
    'Slovakia Women' : 'Eslováquia Feminino',
    'Ukraine Women' : 'Ucrânia Feminino',
    'Brazil Women' : 'Brasil Feminino',
    'Finland Women' : 'Finlândia Feminino',
    'Austria Women' : 'Áustria Feminino',
    'New Zealand Women' : 'Nova Zelândia Feminino',
    'Cyprus Women' : 'Chipre Feminino',
    'Luxembourg Women' : 'Luxemburgo Feminino',
    'Netherlands Women' : 'Holanda Feminino',
    'Turkey Women' : 'Turquia Feminino',
    'Albania Women' : 'Albânia Feminino',
    'Italy Women' : 'Italia Feminino',
    'Chinese Taipei Women' : 'Taiwan Feminino',
    'Japan Women' : 'Japão Feminino',
    'Denmark Women' : 'Dinamarca Feminino',
    'Norway Women' : 'Noruega Feminino',
    'Belgium Women' : 'Bélgica Feminino',

  },

  // Ligas/Campeonatos
  leagues: {
    'Brazil Brasileiro Women': 'Brasileirão Feminino',
    'Brazil Série A1 Women': 'Brasileirão Feminino Série A1',
    'English Womens Super League': 'Superliga Feminina Inglesa',
    'International Friendlies Women': 'Amistosos Internacionais Feminino',
    'UEFA Womens Champions League': 'Liga dos Campeões Feminino',
    'Copa Libertadores Feminina': 'Copa Libertadores Feminina',
    'Copa do Brasil Feminina': 'Copa do Brasil Feminina',
    'Campeonato Paulista Feminino': 'Campeonato Paulista Feminino',
    'Campeonato Carioca Feminino': 'Campeonato Carioca Feminino'
  },

  // Termos gerais
  terms: {
    'Women': 'Feminino',
    'Womens': 'Feminino',
    'Women\'s': 'Feminino',
    'Female': 'Feminino',
    'W' : 'Feminino',
    'WFC' : 'Feminino',
    'FC' : ''
  }
};

export const traduzirNome = (nome) => {
  if (!nome) return nome;
 
  let nomeTraduzido = nome;
 
  if (traducoes.teams[nomeTraduzido]) {
    return traducoes.teams[nomeTraduzido];
  }
  if (traducoes.leagues[nomeTraduzido]) {
    return traducoes.leagues[nomeTraduzido];
  }
 
  const termos = Object.keys(traducoes.terms);

  termos.sort((a, b) => b.length - a.length);

  termos.forEach(termoIngles => {
    const termoPortugues = traducoes.terms[termoIngles];
     
    const regex = new RegExp(`\\b${termoIngles}\\b`, 'gi');

    nomeTraduzido = nomeTraduzido.replace(regex, termoPortugues);
  });
 
  nomeTraduzido = nomeTraduzido.replace(/\s+/g, ' ').trim();
 
  return nomeTraduzido;
};