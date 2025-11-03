const gerarGridPadrao = (jogadores, formacaoStr = "4-3-3") => {
  const formacao = formacaoStr.split('-').map(Number);
  const posicoes = [];
  let jogadorIndex = 0;
  if (jogadores[jogadorIndex]) {
    posicoes.push({ ...jogadores[jogadorIndex].player, x: 1, y: 1 });
    jogadorIndex++;
  }
  formacao.forEach((jogadorasPorLinha, i) => {
    const linhaX = i + 2;
    for (let j = 0; j < jogadorasPorLinha; j++) {
      if (jogadores[jogadorIndex]) {
        posicoes.push({ ...jogadores[jogadorIndex].player, x: linhaX, y: j + 1 });
        jogadorIndex++;
      }
    }
  });
  return posicoes;
};

const formatarNomeVisivel = (nomeCompleto) => {
  if (!nomeCompleto) return '';
  const partesDoNome = nomeCompleto.split(' ');
  const primeiroNome = partesDoNome[0];
  let nomeFinal;
  if (primeiroNome.length <= 2 && partesDoNome.length > 1) {
    nomeFinal = partesDoNome[partesDoNome.length - 1];
  } else {
    nomeFinal = primeiroNome;
  }
  if (nomeFinal.length > 7) {
    return nomeFinal.substring(0, 6) + '...';
  }
  return nomeFinal;
};

const CampoTatico = ({ jogadores }) => {
  if (!jogadores || jogadores.length === 0) {
    return <div className="text-center p-4 aspect-[2/3] flex items-center justify-center text-gray-500">Sem dados de titulares.</div>;
  }

  const temGrid = jogadores.every(j => j.player.grid);
  let posicoesJogadoras;

  if (temGrid) {
    posicoesJogadoras = jogadores.map(j => {
      const [x, y] = j.player.grid.split(':').map(Number);
      return { ...j.player, x, y };
    });
  } else {
    posicoesJogadoras = gerarGridPadrao(jogadores, "4-3-3");
  }

  const jogadorasPorLinha = posicoesJogadoras.reduce((acc, jogadora) => {
    acc[jogadora.x] = (acc[jogadora.x] || 0) + 1;
    return acc;
  }, {});


  return (
    <div 
      className="relative w-full aspect-[2/3] bg-green-600 dark:bg-green-800 border-4 border-white/50 rounded-lg overflow-hidden"
      style={{ position: 'relative' }} 
    >
      <div className="absolute top-1/2 left-0 w-full h-px bg-white/30"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 md:w-24 md:h-24 border-2 border-white/30 rounded-full"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-16 md:h-20 border-2 border-white/30 border-t-0 rounded-b-lg"></div>

      {posicoesJogadoras.map(jogadora => {
        const totalNaLinha = jogadorasPorLinha[jogadora.x];
        const posicaoHorizontal = (jogadora.y * 100) / (totalNaLinha + 1);
        const posicaoVertical = (jogadora.x * 100) / 5.5;
        return (
          <div
            key={jogadora.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
            style={{
              top: `${posicaoVertical}%`,
              left: `${posicaoHorizontal}%`,
            }}
          >
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center shadow-md">
              <span className="text-white text-xs font-bold">
                {jogadora.name.charAt(0)}
              </span>
            </div>
            <span className="text-xs bg-black/70 text-white px-2 py-1 rounded-md mt-1 whitespace-nowrap">
              {formatarNomeVisivel(jogadora.name)}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default CampoTatico;