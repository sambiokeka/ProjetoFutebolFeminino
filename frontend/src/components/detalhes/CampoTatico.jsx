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
    return <div className="tw-text-center tw-p-4 tw-aspect-[2/3] tw-flex tw-items-center tw-justify-center tw-text-gray-500">Sem dados de titulares.</div>;
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
      className="tw-relative tw-w-full tw-aspect-[2/3] tw-bg-green-600 dark:tw-bg-green-800 tw-border-4 tw-border-white/50 tw-rounded-lg tw-overflow-hidden"
      style={{ position: 'relative' }} 
    >
      <div className="tw-absolute tw-top-1/2 tw-left-0 tw-w-full tw-h-px tw-bg-white/30"></div>
      <div className="tw-absolute tw-top-1/2 tw-left-1/2 tw--translate-x-1/2 tw--translate-y-1/2 tw-w-20 tw-h-20 md:tw-w-24 md:tw-h-24 tw-border-2 tw-border-white/30 tw-rounded-full"></div>
      <div className="tw-absolute tw-top-0 tw-left-1/2 tw--translate-x-1/2 tw-w-1/2 tw-h-16 md:tw-h-20 tw-border-2 tw-border-white/30 tw-border-t-0 tw-rounded-b-lg"></div>

      {posicoesJogadoras.map(jogadora => {
        const totalNaLinha = jogadorasPorLinha[jogadora.x];
        const posicaoHorizontal = (jogadora.y * 100) / (totalNaLinha + 1);
        const posicaoVertical = (jogadora.x * 100) / 5.5;
        return (
          <div
            key={jogadora.id}
            className="tw-absolute tw-transform tw--translate-x-1/2 tw--translate-y-1/2 tw-flex tw-flex-col tw-items-center"
            style={{
              top: `${posicaoVertical}%`,
              left: `${posicaoHorizontal}%`,
            }}
          >
            <div className="tw-w-6 tw-h-6 md:tw-w-8 md:tw-h-8 tw-rounded-full tw-bg-blue-500 tw-border-2 tw-border-white tw-flex tw-items-center tw-justify-center tw-shadow-md">
              <span className="tw-text-white tw-text-xs tw-font-bold">
                {jogadora.name.charAt(0)}
              </span>
            </div>
            <span className="tw-text-xs tw-bg-black/70 tw-text-white tw-px-2 tw-py-1 tw-rounded-md tw-mt-1 tw-whitespace-nowrap">
              {formatarNomeVisivel(jogadora.name)}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default CampoTatico;