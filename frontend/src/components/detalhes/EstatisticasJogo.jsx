import { useMemo } from 'react';
import { traduzirNome } from '../../utils/traduzir';

const Icons = {
    Goal: () => <svg className="!w-5 !h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" /></svg>,
    YellowCard: () => <svg className="!w-4 !h-5" fill="currentColor" viewBox="0 0 20 20"><rect x="3" y="3" width="14" height="14" rx="1" /></svg>,
    RedCard: () => <svg className="!w-4 !h-5" fill="currentColor" viewBox="0 0 20 20"><rect x="3" y="3" width="14" height="14" rx="1" /></svg>,
    Subst: () => <svg className="!w-5 !h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>,
    Default: () => <svg className="!w-5 !h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>,
};

const getInfoEvento = (evento) => {
    switch (evento.type) {
        case 'Goal':
            return {
                icon: Icons.Goal,
                color: '!text-green-600',
                bgColor: '!bg-green-100',
                text: `Gol de ${evento.player?.name || 'Jogador'}`,
                team: evento.team?.name
            };
        case 'Card':
            if (evento.detail === 'Yellow Card') {
                return {
                    icon: Icons.YellowCard,
                    color: '!text-yellow-600',
                    bgColor: '!bg-yellow-100',
                    text: `Cartão amarelo para ${evento.player?.name || 'Jogador'}`,
                    team: evento.team?.name
                };
            }
            return {
                icon: Icons.RedCard,
                color: '!text-red-600',
                bgColor: '!bg-red-100',
                text: `Cartão vermelho para ${evento.player?.name || 'Jogador'}`,
                team: evento.team?.name
            };
        case 'subst':
            return {
                icon: Icons.Subst,
                color: '!text-blue-600',
                bgColor: '!bg-blue-100',
                text: `Substituição: ${evento.player?.name || 'Sai'} → ${evento.assist?.name || 'Entra'}`,
                team: evento.team?.name
            };
        default:
            return {
                icon: Icons.Default,
                color: '!text-gray-600',
                bgColor: '!bg-gray-100',
                text: evento.detail || 'Evento do jogo',
                team: evento.team?.name
            };
    }
};

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
            <div className="!text-center !p-8 !text-gray-500 !bg-gray-50 !rounded-lg !m-4 !aspect-[2/3] !flex !flex-col !justify-center">
                <svg className="!w-12 !h-12 !mx-auto !mb-4 !text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p className="!text-lg !font-medium">Nenhum evento disponível</p>
                <p className="!text-sm">Acompanhe os eventos da partida aqui</p>
            </div>
        );
    }

    const eventos = dadosTraduzidos.response;

    return (
        <div className="!bg-white !rounded-xl !shadow-sm !border !border-gray-200 !mx-2 !my-4 !aspect-[2/3] !flex !flex-col">
            <div className="!px-4 !py-3 !border-b !border-gray-200">
                <h3 className="!mt-3 !text-lg !font-semibold !text-gray-900">
                    Cronologia do Jogo
                </h3>
            </div>

            <div className="!mt-8 !flex-1 !p-4 !overflow-y-auto">
                <style jsx>{`
                    .overflow-y-auto::-webkit-scrollbar { width: 6px; }
                    .overflow-y-auto::-webkit-scrollbar-track { background: transparent; }
                    .overflow-y-auto::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, #93c5fd, #3b82f6); border-radius: 10px; }
                `}</style>
                <div className="!flow-root">
                    <ul className="!-mb-8">
                    {eventos.map((evento, index) => {
                        const info = getInfoEvento(evento);
                        const IconComponent = info.icon;

                        return (
                        <li key={`${evento.time?.elapsed}-${index}-${evento.type}`}>
                            <div className="!relative !pb-6">
                            {index !== eventos.length - 1 && (
                                <span
                                className="!absolute !top-8 !left-6 sm:!left-8 !-ml-px !h-full !w-0.5 !bg-gray-200"
                                aria-hidden="true"
                                />
                            )}
                            <div className="!relative !flex !items-start !gap-4 sm:!gap-6 !-ml-5 sm:!ml-0">
                                <div className="!flex-shrink-0 !w-10 sm:!w-12 !text-right">
                                <span className="!inline-flex !items-center !justify-center !px-2 !py-1 !text-xs !font-medium !rounded-full !bg-gray-100 !text-gray-800">
                                    {evento.time?.elapsed || '0'}'
                                </span>
                                </div>

                                <div className="!relative !flex-shrink-0">
                                <div className={`!h-10 !w-10 sm:!h-12 sm:!w-12 !rounded-full !flex !items-center !justify-center !ring-8 !ring-white ${info.bgColor}`}>
                                    <span className={info.color}><IconComponent /></span>
                                </div>
                                </div>

                                <div className="!min-w-0 !flex-1 !pt-1.5">
                                <div className="!space-y-1">
                                    <p className="!text-sm !font-medium !text-gray-900 !leading-tight">
                                    {info.text}
                                    </p>
                                    {info.team && (
                                    <p className="!text-xs !font-medium !text-gray-500 !uppercase !tracking-wide">
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
