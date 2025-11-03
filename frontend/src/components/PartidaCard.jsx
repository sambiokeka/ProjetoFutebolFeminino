import { getEscudoTime } from '../utils/escudos';
import { ajustarHorarioBrasil, formatarData } from '../utils/formatters'; 

// --- O COMPONENTE DO CARD ---

const PartidaCard = ({
    partida,
    status,
    variant = 'partidas',
    isSalvo,
    notificacaoAtiva,
    onSalvar,
    onRemover,
    onToggleNotificacao,
    onVerDetalhes
}) => {

    const placarDisponivel = partida.intHomeScore !== null && partida.intAwayScore !== null;

    const renderFooter = () => {
        const baseBtnClass = "flex items-center gap-2 px-5 py-2 text-sm font-semibold !rounded-xl cursor-pointer transition-all duration-300 ease-in-out shadow-md hover:-translate-y-0.5 hover:shadow-lg w-full md:w-auto justify-center";

        if (variant === 'partidas') {
            return (
                <>
                    {status === "proxima" && (
                        isSalvo ? (
                            <button type="button" className={`${baseBtnClass} bg-gradient-to-r from-green-500 to-green-700 text-white`} onClick={() => onRemover(partida.idEvent)}>
                                <i className="fas fa-check-circle text-sm"></i> Lembrar-me
                            </button>
                        ) : (
                            <button type="button" className={`${baseBtnClass} bg-gradient-to-r from-purple-600 to-blue-500 hover:shadow-purple-300 text-white`} onClick={() => onSalvar(partida.idEvent)}>
                                <i className="fas fa-bell text-sm"></i> Lembrar-me
                            </button>
                        )
                    )}
                    {status === "ao-vivo" && (
                        <button type="button" className={`${baseBtnClass} bg-gradient-to-r from-green-400 to-green-600 hover:shadow-green-300 text-white`}>
                            <i className="fas fa-play-circle text-sm"></i> Assistir ao vivo
                        </button>
                    )}
                    {status === "finalizada" && (
                        <button type="button" className={`${baseBtnClass} bg-gradient-to-r from-purple-700 to-purple-500 hover:shadow-purple-300 text-white`} onClick={() => onVerDetalhes(partida)}>
                            <i className="fas fa-info-circle text-sm"></i> Ver detalhes
                        </button>
                    )}
                </>
            );
        }

        if (variant === 'salvo') {
            return (
                <>
                    <button
                        type="button"
                        className={`${baseBtnClass} ${notificacaoAtiva ? 'bg-gradient-to-r from-green-500 to-green-700 text-white' : 'bg-gradient-to-r from-purple-600 to-blue-500 text-white'}`}
                        onClick={() => onToggleNotificacao(partida.idEvent, notificacaoAtiva)}
                        title={notificacaoAtiva ? "Desativar notificações" : "Ativar notificações"}
                    >
                        <i className={`fas ${notificacaoAtiva ? 'fa-bell' : 'fa-bell-slash'} text-sm`}></i>
                        <span>Notificar</span>
                    </button>
                    <button
                        type="button"
                        className={`${baseBtnClass} bg-gradient-to-r from-red-600 to-red-700 text-white`}
                        onClick={() => onRemover(partida.idEvent)}
                        title="Remover partida"
                    >
                        <i className="fas fa-trash text-sm"></i>
                        <span>Remover</span>
                    </button>
                </>
            );
        }

        return null;
    };

    const getStatusStyles = () => {
        switch (status) {
            case "proxima": return "text-blue-600 bg-blue-100";
            case "ao-vivo": return "text-red-600 bg-red-100 animate-pulse";
            case "finalizada": return "text-gray-600 bg-gray-100";
            default: return "text-gray-600 bg-gray-100";
        }
    };

    const getStatusText = () => {
        switch (status) {
            case "proxima": return "PRÓXIMA";
            case "ao-vivo": return "● AO VIVO";
            case "finalizada": return "FINALIZADA";
            default: return "PRÓXIMA";
        }
    };

    return (
        <div className="bg-white rounded-xl p-4 md:p-8 mb-4 border border-white border-opacity-50 shadow-md hover:shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-1">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                <span className="text-lg font-bold text-gray-700">{partida.strLeague}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusStyles()}`}>
                    {getStatusText()}
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-6 mb-4">
                {/* Time Casa */}
                <div className="flex flex-col items-center gap-2 order-1 md:order-none">
                    <div className="relative w-16 h-16 rounded-full bg-white flex items-center justify-center border-[10px] border-white shadow-md">
                        <img
                            src={getEscudoTime(partida.strHomeTeam)}
                            alt={partida.strHomeTeam}
                            className="w-full h-full object-contain absolute top-0 left-0"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                const placeholder = e.target.nextSibling;
                                if (placeholder) placeholder.style.display = 'flex';
                            }}
                        />
                        <div className="hidden items-center justify-center w-full h-full text-gray-400">
                            <i className="fas fa-shield-alt text-xl"></i>
                        </div>
                    </div>
                    <span className="text-base font-bold text-gray-700 text-center">{partida.strHomeTeam}</span>
                </div>

                {/* Placar/Horário */}
                <div className="flex flex-col items-center gap-1 justify-center order-2 md:order-none my-2 md:my-0">
                    {status === "proxima" ? (
                        <span className="text-xl font-bold text-black">{ajustarHorarioBrasil(partida.strTime, status)}</span>
                    ) : (
                        <div className="flex items-center gap-2">
                            <span className="text-3xl font-extrabold text-gray-900 min-w-[35px] text-center">
                                {placarDisponivel ? partida.intHomeScore : '-'}
                            </span>
                            <span className="text-2xl font-medium text-gray-500">x</span>
                            <span className="text-3xl font-extrabold text-gray-900 min-w-[35px] text-center">
                                {placarDisponivel ? partida.intAwayScore : '-'}
                            </span>
                        </div>
                    )}
                    {status !== 'finalizada' && (
                        <span className="text-sm text-gray-500">{formatarData(partida.dateEvent)}</span>
                    )}
                </div>

                {/* Time Visitante */}
                <div className="flex flex-col items-center gap-2 order-3 md:order-none">
                    <div className="relative w-16 h-16 rounded-full bg-white flex items-center justify-center border-[10px] border-white shadow-md">
                        <img
                            src={getEscudoTime(partida.strAwayTeam)}
                            alt={partida.strAwayTeam}
                            className="w-full h-full object-contain absolute top-0 left-0"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                const placeholder = e.target.nextSibling;
                                if (placeholder) placeholder.style.display = 'flex';
                            }}
                        />
                        <div className="hidden items-center justify-center w-full h-full text-gray-400">
                            <i className="fas fa-shield-alt text-xl"></i>
                        </div>
                    </div>
                    <span className="text-base font-bold text-gray-700 text-center">{partida.strAwayTeam}</span>
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-center gap-3 mt-4">
                {renderFooter()}
            </div>
        </div>
    );
};

export default PartidaCard;