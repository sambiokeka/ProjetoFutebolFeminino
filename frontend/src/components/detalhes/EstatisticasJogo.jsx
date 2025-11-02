import { useMemo } from 'react';
import { traduzirNome } from '../../utils/traduzir';

// --- COMPONENTES AUXILIARES ---

const Icons = {
    Goal: () => <svg className="tw-w-5 tw-h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" /></svg>,
    YellowCard: () => <svg className="tw-w-4 tw-h-5" fill="currentColor" viewBox="0 0 20 20"><rect x="3" y="3" width="14" height="14" rx="1" /></svg>,
    RedCard: () => <svg className="tw-w-4 tw-h-5" fill="currentColor" viewBox="0 0 20 20"><rect x="3" y="3" width="14" height="14" rx="1" /></svg>,
    Subst: () => <svg className="tw-w-5 tw-h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>,
    Default: () => <svg className="tw-w-5 tw-h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>,
};

const getInfoEvento = (evento) => {
    switch (evento.type) {
        case 'Goal':
            return {
                icon: Icons.Goal,
                color: 'tw-text-green-600 dark:tw-text-green-400',
                bgColor: 'tw-bg-green-100 dark:tw-bg-green-900/30',
                text: `Gol de ${evento.player?.name || 'Jogador'}`,
                team: evento.team?.name
            };
        case 'Card':
            if (evento.detail === 'Yellow Card') {
                return {
                    icon: Icons.YellowCard,
                    color: 'tw-text-yellow-600 dark:tw-text-yellow-400',
                    bgColor: 'tw-bg-yellow-100 dark:tw-bg-yellow-900/30',
                    text: `Cartão amarelo para ${evento.player?.name || 'Jogador'}`,
                    team: evento.team?.name
                };
            }
            return {
                icon: Icons.RedCard,
                color: 'tw-text-red-600 dark:tw-text-red-400',
                bgColor: 'tw-bg-red-100 dark:tw-bg-red-900/30',
                text: `Cartão vermelho para ${evento.player?.name || 'Jogador'}`,
                team: evento.team?.name
            };
        case 'subst':
            return {
                icon: Icons.Subst,
                color: 'tw-text-blue-600 dark:tw-text-blue-400',
                bgColor: 'tw-bg-blue-100 dark:tw-bg-blue-900/30',
                text: `Substituição: ${evento.player?.name || 'Sai'} → ${evento.assist?.name || 'Entra'}`,
                team: evento.team?.name
            };
        default:
            return {
                icon: Icons.Default,
                color: 'tw-text-gray-600 dark:tw-text-gray-400',
                bgColor: 'tw-bg-gray-100 dark:tw-bg-gray-800',
                text: evento.detail || 'Evento do jogo',
                team: evento.team?.name
            };
    }
};

// --- COMPONENTE PRINCIPAL ---

const EstatisticasJogo = ({ eventsData }) => {
    const dadosTraduzidos = useMemo(() => {
        if (!eventsData || !eventsData.response) return null;
        try {
            const options = { allowW: true };
            const translatedResponse = eventsData.response.map(evento => ({
                ...evento,
                team: { ...evento.team, name: traduzirNome(evento.team.name, options) },
                player: { ...evento.player, name: traduzirNome(evento.player.name, options) },
                assist: evento.assist ? { ...evento.assist, name: traduzirNome(evento.assist.name, options) } : null,
            }));
            return { ...eventsData, response: translatedResponse };
        } catch (err) {
            console.error("Erro ao traduzir eventos:", err);
            return { ...eventsData, response: [] }; 
        }
    }, [eventsData]);

    if (!dadosTraduzidos || dadosTraduzidos.results === 0) {
        return (
            <div className="tw-text-center tw-p-8 tw-text-gray-500 dark:tw-text-gray-400 tw-bg-gray-50 dark:tw-bg-gray-800/50 tw-rounded-lg tw-m-4 tw-aspect-[2/3] tw-flex tw-flex-col tw-justify-center">
                <svg className="tw-w-12 tw-h-12 tw-mx-auto tw-mb-4 tw-text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p className="tw-text-lg tw-font-medium">Nenhum evento disponível</p>
                <p className="tw-text-sm">Acompanhe os eventos da partida aqui</p>
            </div>
        );
    }

    const eventos = dadosTraduzidos.response;

    return (
        <div className="tw-bg-white dark:tw-bg-gray-900 tw-rounded-xl tw-shadow-sm tw-border tw-border-gray-200 dark:tw-border-gray-700 tw-mx-2 tw-my-4 tw-aspect-[2/3] tw-flex tw-flex-col">
            <div className="tw-px-4 tw-py-3 tw-border-b tw-border-gray-200 dark:tw-border-gray-700">
                <h3 className="tw-mt-3 tw-text-lg tw-font-semibold tw-text-gray-900 dark:tw-text-gray-100">
                    Cronologia do Jogo
                </h3>
            </div>
            
            <div className="tw-flex-1 tw-p-4 tw-overflow-y-auto">
                <style jsx>{`
                    .tw-overflow-y-auto::-webkit-scrollbar { width: 6px; }
                    .tw-overflow-y-auto::-webkit-scrollbar-track { background: transparent; }
                    .tw-overflow-y-auto::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, #93c5fd, #3b82f6); border-radius: 10px; }
                `}</style>
                <div className="tw-flow-root">
                    <ul className="-tw-mb-8">
                        {eventos.map((evento, index) => {
                            const info = getInfoEvento(evento);
                            const IconComponent = info.icon;
                            
                            return (
                                <li key={`${evento.time?.elapsed}-${index}-${evento.type}`}>
                                    <div className="tw-relative tw-pb-6">
                                        {index !== eventos.length - 1 && (
                                            <span className="tw-absolute tw-top-8 tw-left-6 -tw-ml-px tw-h-full tw-w-0.5 tw-bg-gray-200 dark:tw-bg-gray-700" aria-hidden="true" />
                                        )}
                                        <div className="tw-relative tw-flex tw-items-start tw-gap-4">
                                            <div className="tw-flex-shrink-0 tw-w-12 tw-text-right">
                                                <span className="tw-inline-flex tw-items-center tw-justify-center tw-px-2 tw-py-1 tw-text-xs tw-font-medium tw-rounded-full tw-bg-gray-100 dark:tw-bg-gray-800 tw-text-gray-800 dark:tw-text-gray-200">
                                                    {evento.time?.elapsed || '0'}'
                                                </span>
                                            </div>
                                            <div className="tw-relative tw-flex-shrink-0">
                                                <div className={`tw-h-12 tw-w-12 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-ring-8 tw-ring-white dark:tw-ring-gray-900 ${info.bgColor}`}>
                                                    <span className={info.color}><IconComponent /></span>
                                                </div>
                                            </div>
                                            <div className="tw-min-w-0 tw-flex-1 tw-pt-1.5">
                                                <div className="tw-space-y-1">
                                                    <p className="tw-text-sm tw-font-medium tw-text-gray-900 dark:tw-text-gray-100 tw-leading-tight">
                                                        {info.text}
                                                    </p>
                                                    {info.team && (
                                                        <p className="tw-text-xs tw-font-medium tw-text-gray-500 dark:tw-text-gray-400 tw-uppercase tw-tracking-wide">
                                                            {info.team}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default EstatisticasJogo;