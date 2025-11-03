import { useState, useMemo } from 'react';
import { traduzirNome } from '../../utils/traduzir';
import CampoTatico from './CampoTatico'; 

const ListaJogadores = ({ titulo, jogadores }) => (
    <div className="!bg-gradient-to-br !from-gray-50 !to-white !rounded-xl !p-3 !shadow-sm !border !border-gray-100 !aspect-[2/3] !flex !flex-col">
        <h3 className="!text-base md:!text-lg !font-bold !mb-3 md:!mb-4 !text-gray-800 !pb-2 !border-b !border-gray-200 !relative">
            {titulo}
            <span className="!absolute !bottom-0 !left-0 !w-8 !h-0.5 !bg-blue-500"></span>
        </h3>
        <div className="!flex-1 !overflow-y-auto !pr-2">
            <ul className="!space-y-1">
                {jogadores.map((item) => (
                    <li key={item.player.id} className="!p-2 !rounded-lg !transition-all !duration-200 hover:!bg-blue-50 !group !border-l-2 !border-transparent hover:!border-blue-500">
                        <span className="!text-gray-700 !font-medium group-hover:!text-blue-600 !transition-colors !text-sm">
                            {item.player.name}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    </div>
);

const TimeCard = ({ timeInfo, index, timeSelecao, alternarSelecao }) => (
    <div className="!bg-white !rounded-lg md:!rounded-xl !p-3 md:!p-4 !shadow-lg !border !border-gray-100 !flex !flex-col">
        <div className="!flex !items-start !gap-2 md:!gap-3 !mb-3">
            <div className="!w-8 !h-8 md:!w-12 md:!h-12 !bg-gradient-to-br !from-blue-50 !to-white !rounded-lg !flex !items-center !justify-center !shadow-md !border !border-gray-200 !flex-shrink-0">
                <img src={timeInfo.team.logo} alt={timeInfo.team.name} className="!w-5 !h-5 md:!w-7 md:!h-7 !object-contain" />
            </div>
            <div className="!flex-1 !min-w-0">
                <div className="!font-bold !text-sm md:!text-base !text-gray-800 !leading-tight">{timeInfo.team.name}</div>
                <div className="!text-xs !text-gray-500 !mt-1 !leading-tight">
                    <span className="!font-medium">Técnico:</span> {timeInfo.coach?.name || 'Não informado'}
                </div>
                <div className="!flex !gap-1 !mt-2">
                    <button onClick={() => alternarSelecao(index, 'formacao')} className={`!px-2 !py-1 !text-xs !rounded !font-medium !border ${timeSelecao[index] === 'formacao' ? '!bg-blue-500 !text-white !border-blue-500' : '!text-gray-500 !border-gray-300'}`}>Formação</button>
                    <button onClick={() => alternarSelecao(index, 'titulares')} className={`!px-2 !py-1 !text-xs !rounded !font-medium !border ${timeSelecao[index] === 'titulares' ? '!bg-blue-500 !text-white !border-blue-500' : '!text-gray-500 !border-gray-300'}`}>Titulares</button>
                    <button onClick={() => alternarSelecao(index, 'reservas')} className={`!px-2 !py-1 !text-xs !rounded !font-medium !border ${timeSelecao[index] === 'reservas' ? '!bg-blue-500 !text-white !border-blue-500' : '!text-gray-500 !border-gray-300'}`}>Reservas</button>
                </div>
            </div>
        </div>
        
        <div className="!flex-1 !overflow-y-auto">
             <style jsx>{`
                .overflow-y-auto::-webkit-scrollbar { width: 4px; }
                .overflow-y-auto::-webkit-scrollbar-track { background: transparent; }
                .overflow-y-auto::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, #93c5fd, #3b82f6); border-radius: 10px; }
            `}</style>
            {timeSelecao[index] === 'formacao' && <CampoTatico jogadores={timeInfo.startXI || []} />}
            {timeSelecao[index] === 'titulares' && <ListaJogadores titulo="Titulares" jogadores={timeInfo.startXI || []} />}
            {timeSelecao[index] === 'reservas' && <ListaJogadores titulo="Reservas" jogadores={timeInfo.substitutes || []} />}
        </div>
    </div>
);


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
            <div className="!block md:!hidden !mb-4">
                <div className="!flex !justify-between !items-center !bg-gray-100 !rounded-lg !p-2">
                    <button onClick={timeAnterior} className="!w-8 !h-8 !flex !items-center !justify-center !bg-white !rounded-md !shadow-sm !border !border-gray-300">
                        <svg className="!w-4 !h-4 !text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <div className="!flex-1 !text-center">
                        <span className="!text-sm !font-medium !text-gray-700">{dadosTraduzidos.response[timeAtual]?.team.name}</span>
                        <div className="!text-xs !text-gray-500">Time {timeAtual + 1} de {totalEquipes}</div>
                    </div>
                    <button onClick={proximoTime} className="!w-8 !h-8 !flex !items-center !justify-center !bg-white !rounded-md !shadow-sm !border !border-gray-300">
                        <svg className="!w-4 !h-4 !text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>
            </div>

            <div className="!space-y-4 md:!space-y-0 md:!grid md:!grid-cols-2 md:!gap-6">
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