import { useState } from 'react';
import VisualizacaoEscalacoes from './VisualizacaoEscalacoes';
import EstatisticasJogo from './EstatisticasJogo';

function VerMaisPopup({ isOpen, onClose, data }) {
    if (!isOpen || !data) {
        return null;
    }

    const [abaPrincipal, setAbaPrincipal] = useState('escalacoes');

    if (!data.lineups || !data.lineups.response || data.lineups.response.length === 0) {
        return (
            <div className="!fixed !inset-0 !z-[10000] !flex !items-center !justify-center !bg-opacity-50 !p-4" onClick={onClose}>
                <div className="!bg-white !p-6 !rounded-lg !shadow-xl !text-center" onClick={(e) => e.stopPropagation()}>
                    <h3 className="!font-bold !text-lg !mb-2">Erro ao carregar</h3>
                    <p className="!text-gray-600">Os dados de escalação não estão disponíveis para esta partida.</p>
                </div>
            </div>
        );
    }

    return (
        <div
            className="!fixed !inset-0 !bg-black/50 !bg-opacity-50 !flex !justify-center !items-start !z-[10000] !p-4 !pt-24 !backdrop-blur-sm !overflow-y-auto"
            onClick={onClose}
        >
            <div
                className="!bg-gray-50 !rounded-2xl !shadow-2xl !w-full !max-w-4xl !relative !border !border-gray-200 !flex !flex-col !max-h-[calc(100vh-8rem)]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="!p-4 !border-b !border-gray-200 !sticky !top-0 !bg-gray-50/80 !backdrop-blur-sm !z-10 !rounded-t-2xl">
                    <button onClick={onClose} className="!absolute !top-4 !right-4 !text-gray-400 hover:!text-gray-600 !transition-colors">
                        <i className="fas fa-times !text-xl"></i>
                    </button>
                    <h2 className="!text-xl !font-bold !text-center !text-gray-800">
                        {abaPrincipal === 'escalacoes' ? 'Detalhes da Partida' : 'Eventos do Jogo'}
                    </h2>
                    <div className="!flex !mt-4 !border !border-gray-200 !rounded-lg !p-1 !bg-gray-200">
                        <button
                            onClick={() => setAbaPrincipal('escalacoes')}
                            className={`!flex-1 !py-2 !text-sm !font-semibold !rounded-md !transition-all ${abaPrincipal === 'escalacoes' ? '!bg-white !text-purple-700 !shadow' : '!text-gray-600'}`}
                        >
                            Escalações
                        </button>
                        <button
                            onClick={() => setAbaPrincipal('eventos')}
                            className={`!flex-1 !py-2 !text-sm !font-semibold !rounded-md !transition-all ${abaPrincipal === 'eventos' ? '!bg-white !text-purple-700 !shadow' : '!text-gray-600'}`}
                        >
                            Eventos
                        </button>
                    </div>
                </div>

                <div className="!flex-1 !overflow-y-auto !p-4">
                    {abaPrincipal === 'escalacoes' && (
                        <VisualizacaoEscalacoes data={data.lineups} />
                    )}
                    {abaPrincipal === 'eventos' && (
                        <EstatisticasJogo eventsData={data.events} />
                    )}
                </div>
            </div>
        </div>
    );
}

export default VerMaisPopup;
