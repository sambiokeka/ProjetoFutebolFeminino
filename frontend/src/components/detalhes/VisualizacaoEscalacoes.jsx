import { useState, useMemo } from 'react';
import { traduzirNome } from '../../utils/traduzir';
import CampoTatico from './CampoTatico'; 

// --- Componentes Auxiliares que pertencem a esta visualização ---

const ListaJogadores = ({ titulo, jogadores }) => (
    <div className="tw-bg-gradient-to-br tw-from-gray-50 tw-to-white dark:tw-from-gray-700 dark:tw-to-gray-800 tw-rounded-xl tw-p-3 tw-shadow-sm tw-border tw-border-gray-100 dark:tw-border-gray-600 tw-aspect-[2/3] tw-flex tw-flex-col">
        <h3 className="tw-text-base md:tw-text-lg tw-font-bold tw-mb-3 md:tw-mb-4 tw-text-gray-800 dark:tw-text-gray-200 tw-pb-2 tw-border-b tw-border-gray-200 dark:tw-border-gray-600 tw-relative">
            {titulo}
            <span className="tw-absolute tw-bottom-0 tw-left-0 tw-w-8 tw-h-0.5 tw-bg-blue-500"></span>
        </h3>
        <div className="tw-flex-1 tw-overflow-y-auto tw-pr-2">
            <ul className="tw-space-y-1">
                {jogadores.map((item) => (
                    <li key={item.player.id} className="tw-p-2 tw-rounded-lg tw-transition-all tw-duration-200 hover:tw-bg-blue-50 dark:hover:tw-bg-gray-600 tw-group tw-border-l-2 tw-border-transparent hover:tw-border-blue-500">
                        <span className="tw-text-gray-700 dark:tw-text-gray-300 tw-font-medium group-hover:tw-text-blue-600 dark:group-hover:tw-text-blue-400 tw-transition-colors tw-text-sm">
                            {item.player.name}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    </div>
);

const TimeCard = ({ timeInfo, index, timeSelecao, alternarSelecao }) => (
    <div className="tw-bg-white dark:tw-bg-gray-800 tw-rounded-lg md:tw-rounded-xl tw-p-3 md:tw-p-4 tw-shadow-lg tw-border tw-border-gray-100 dark:tw-border-gray-700 tw-flex tw-flex-col">
        <div className="tw-flex tw-items-start tw-gap-2 md:tw-gap-3 tw-mb-3">
            <div className="tw-w-8 tw-h-8 md:tw-w-12 md:tw-h-12 tw-bg-gradient-to-br tw-from-blue-50 tw-to-white dark:tw-from-gray-700 dark:tw-to-gray-800 tw-rounded-lg tw-flex tw-items-center tw-justify-center tw-shadow-md tw-border tw-border-gray-200 dark:tw-border-gray-600 tw-flex-shrink-0">
                <img src={timeInfo.team.logo} alt={timeInfo.team.name} className="tw-w-5 tw-h-5 md:tw-w-7 md:tw-h-7 tw-object-contain" />
            </div>
            <div className="tw-flex-1 tw-min-w-0">
                <div className="tw-font-bold tw-text-sm md:tw-text-base tw-text-gray-800 dark:tw-text-gray-200 tw-leading-tight">{timeInfo.team.name}</div>
                <div className="tw-text-xs tw-text-gray-500 dark:tw-text-gray-400 tw-mt-1 tw-leading-tight">
                    <span className="tw-font-medium">Técnico:</span> {timeInfo.coach?.name || 'Não informado'}
                </div>
                <div className="tw-flex tw-gap-1 tw-mt-2">
                    <button onClick={() => alternarSelecao(index, 'formacao')} className={`tw-px-2 tw-py-1 tw-text-xs tw-rounded tw-font-medium tw-border ${timeSelecao[index] === 'formacao' ? 'tw-bg-blue-500 tw-text-white tw-border-blue-500' : 'tw-text-gray-500 tw-border-gray-300 dark:tw-border-gray-600'}`}>Formação</button>
                    <button onClick={() => alternarSelecao(index, 'titulares')} className={`tw-px-2 tw-py-1 tw-text-xs tw-rounded tw-font-medium tw-border ${timeSelecao[index] === 'titulares' ? 'tw-bg-blue-500 tw-text-white tw-border-blue-500' : 'tw-text-gray-500 tw-border-gray-300 dark:tw-border-gray-600'}`}>Titulares</button>
                    <button onClick={() => alternarSelecao(index, 'reservas')} className={`tw-px-2 tw-py-1 tw-text-xs tw-rounded tw-font-medium tw-border ${timeSelecao[index] === 'reservas' ? 'tw-bg-blue-500 tw-text-white tw-border-blue-500' : 'tw-text-gray-500 tw-border-gray-300 dark:tw-border-gray-600'}`}>Reservas</button>
                </div>
            </div>
        </div>
        
        <div className="tw-flex-1 tw-overflow-y-auto">
             <style jsx>{`
                .tw-overflow-y-auto::-webkit-scrollbar { width: 4px; }
                .tw-overflow-y-auto::-webkit-scrollbar-track { background: transparent; }
                .tw-overflow-y-auto::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, #93c5fd, #3b82f6); border-radius: 10px; }
            `}</style>
            {timeSelecao[index] === 'formacao' && <CampoTatico jogadores={timeInfo.startXI || []} />}
            {timeSelecao[index] === 'titulares' && <ListaJogadores titulo="Titulares" jogadores={timeInfo.startXI || []} />}
            {timeSelecao[index] === 'reservas' && <ListaJogadores titulo="Reservas" jogadores={timeInfo.substitutes || []} />}
        </div>
    </div>
);

// --- Componente Principal da Visualização de Escalações ---

function VisualizacaoEscalacoes({ data }) {
    const dadosTraduzidos = useMemo(() => {
        if (!data) return null;
        const options = { allowW: true };
        const traduzirJogadoras = (jogadoras) => {
            if (!jogadoras) return [];
            return jogadoras.map(j => ({
                ...j,
                player: { ...j.player, name: traduzirNome(j.player.name, options) }
            }));
        };
        const translatedResponse = data.response.map(time => ({
          ...time,
          team: { ...time.team, name: traduzirNome(time.team.name, options) },
          coach: { ...time.coach, name: traduzirNome(time.coach?.name, options) },
          startXI: traduzirJogadoras(time.startXI),
          substitutes: traduzirJogadoras(time.substitutes),
        }));
        return { ...data, response: translatedResponse };
    }, [data]);

    const [timeSelecao, setTimeSelecao] = useState({ 0: 'formacao', 1: 'formacao' });
    const [timeAtual, setTimeAtual] = useState(0);

    if (!dadosTraduzidos) return null;

    const totalEquipes = dadosTraduzidos.response.length;
    const alternarSelecao = (timeIndex, tipo) => setTimeSelecao(prev => ({ ...prev, [timeIndex]: tipo }));
    const proximoTime = () => setTimeAtual((prev) => (prev + 1) % totalEquipes);
    const timeAnterior = () => setTimeAtual((prev) => (prev - 1 + totalEquipes) % totalEquipes);
    
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    return (
        <div>
            <div className="tw-block md:tw-hidden tw-mb-4">
                <div className="tw-flex tw-justify-between tw-items-center tw-bg-gray-100 dark:tw-bg-gray-700 tw-rounded-lg tw-p-2">
                    <button onClick={timeAnterior} className="tw-w-8 tw-h-8 tw-flex tw-items-center tw-justify-center tw-bg-white dark:tw-bg-gray-600 tw-rounded-md tw-shadow-sm tw-border tw-border-gray-300 dark:tw-border-gray-500">
                        <svg className="tw-w-4 tw-h-4 tw-text-gray-600 dark:tw-text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <div className="tw-flex-1 tw-text-center">
                        <span className="tw-text-sm tw-font-medium tw-text-gray-700 dark:tw-text-gray-200">{dadosTraduzidos.response[timeAtual]?.team.name}</span>
                        <div className="tw-text-xs tw-text-gray-500 dark:tw-text-gray-400">Time {timeAtual + 1} de {totalEquipes}</div>
                    </div>
                    <button onClick={proximoTime} className="tw-w-8 tw-h-8 tw-flex tw-items-center tw-justify-center tw-bg-white dark:tw-bg-gray-600 tw-rounded-md tw-shadow-sm tw-border tw-border-gray-300 dark:tw-border-gray-500">
                        <svg className="tw-w-4 tw-h-4 tw-text-gray-600 dark:tw-text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>
            </div>

            <div className="tw-space-y-4 md:tw-space-y-0 md:tw-grid md:tw-grid-cols-2 md:tw-gap-6">
                {(isMobile ? dadosTraduzidos.response.filter((_, i) => i === timeAtual) : dadosTraduzidos.response)
                    .map((timeInfo, index) => {
                        const originalIndex = isMobile ? timeAtual : index;
                        return (
                            <TimeCard
                                key={timeInfo.team.id}
                                timeInfo={timeInfo}
                                index={originalIndex}
                                timeSelecao={timeSelecao}
                                alternarSelecao={alternarSelecao}
                            />
                        );
                    })}
            </div>
        </div>
    );
}

export default VisualizacaoEscalacoes;