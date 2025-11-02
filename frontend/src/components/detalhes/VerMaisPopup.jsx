import React, { useState } from 'react';

import VisualizacaoEscalacoes from './VisualizacaoEscalacoes';
import EstatisticasJogo from './EstatisticasJogo';

function VerMaisPopup({ isOpen, onClose, data }) {
    if (!isOpen || !data) {
        return null;
    }


    const [abaPrincipal, setAbaPrincipal] = useState('escalacoes');
    

    if (!data.lineups || !data.lineups.response || data.lineups.response.length === 0) {
        return (
             <div className="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-70 tw-flex tw-justify-center tw-items-center tw-z-50" onClick={onClose}>
                <div className="tw-bg-white dark:tw-bg-gray-800 tw-p-6 tw-rounded-lg tw-shadow-xl" onClick={(e) => e.stopPropagation()}>
                    <p className="tw-text-center tw-text-gray-700 dark:tw-text-gray-200">Dados de escalação não disponíveis para esta partida.</p>
                </div>
            </div>
        );
    }

    return (
        <div
            className="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-70 tw-flex tw-justify-center tw-items-start tw-z-50 tw-p-4 tw-pt-24 tw-backdrop-blur-sm tw-overflow-y-auto"
            onClick={onClose}
        >
            <div
                className="tw-mt-3 tw-bg-gradient-to-br tw-from-white tw-to-gray-50 dark:tw-from-gray-800 dark:tw-to-gray-900 tw-rounded-xl md:tw-rounded-3xl tw-shadow-2xl tw-p-3 md:tw-p-6 tw-w-full tw-max-w-4xl tw-relative tw-border tw-border-gray-200 dark:tw-border-gray-700 tw-flex tw-flex-col tw-max-h-[85vh]"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="tw-absolute tw-top-2 tw-right-2 md:tw-top-4 md:tw-right-4 tw-w-6 tw-h-6 md:tw-w-8 md:tw-h-8 tw-bg-gray-100 dark:tw-bg-gray-700 hover:tw-bg-gray-200 dark:hover:tw-bg-gray-600 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-transition-all tw-duration-200 tw-group tw-shadow-sm tw-z-10"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="tw-h-3 tw-w-3 md:tw-h-4 md:tw-w-4 tw-text-gray-500 group-hover:tw-text-gray-700 dark:group-hover:tw-text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <div className="tw-text-center tw-mb-3 md:tw-mb-6">
                     <h2 className="tw-text-lg md:tw-text-2xl tw-font-bold tw-text-gray-800 dark:tw-text-white tw-mb-1">
                        {abaPrincipal === 'escalacoes' ? 'Detalhes da Partida' : 'Eventos do Jogo'}
                    </h2>
                </div>

                <div className="tw-flex tw-mb-4 tw-border-b tw-border-gray-200 dark:tw-border-gray-700">
                    <button
                        onClick={() => setAbaPrincipal('escalacoes')}
                        className={`tw-flex-1 tw-py-2 tw-font-medium ${abaPrincipal === 'escalacoes' ? 'tw-text-blue-500 tw-border-b-2 tw-border-blue-500' : 'tw-text-gray-500'}`}
                    >
                        Escalações
                    </button>
                    <button
                        onClick={() => setAbaPrincipal('estatisticas')}
                        className={`tw-flex-1 tw-py-2 tw-font-medium ${abaPrincipal === 'estatisticas' ? 'tw-text-blue-500 tw-border-b-2 tw-border-blue-500' : 'tw-text-gray-500'}`}
                    >
                        Eventos
                    </button>
                </div>
                
                <div className="tw-flex-1 tw-overflow-y-auto">
                    {abaPrincipal === 'escalacoes' && (

                        <VisualizacaoEscalacoes data={data.lineups} />
                    )}

                    {abaPrincipal === 'estatisticas' && (

                        <EstatisticasJogo eventsData={data.events} />
                    )}
                </div>
            </div>
        </div>
    );
}

export default VerMaisPopup;