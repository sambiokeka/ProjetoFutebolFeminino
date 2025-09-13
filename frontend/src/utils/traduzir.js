export const traducoes = {
  // Times (Santos Women → Santos Feminino)
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
    'England Women' : 'Inglaterra Feminino'
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
    'Female': 'Feminino'
  }
};

// Função para traduzir nomes
export const traduzirNome = (nome) => {
  if (!nome) return nome;
  
  let nomeTraduzido = nome;
  
  // Primeiro tenta traduzir times específicos
  if (traducoes.teams[nomeTraduzido]) {
    return traducoes.teams[nomeTraduzido];
  }
  
  // Tenta traduzir ligas específicas
  if (traducoes.leagues[nomeTraduzido]) {
    return traducoes.leagues[nomeTraduzido];
  }
  
  // Traduz termos gerais (Women → Feminino)
  Object.keys(traducoes.terms).forEach(termoIngles => {
    const termoPortugues = traducoes.terms[termoIngles];
    if (nomeTraduzido.includes(termoIngles)) {
      nomeTraduzido = nomeTraduzido.replace(termoIngles, termoPortugues);
    }
  });
  
  return nomeTraduzido;
};