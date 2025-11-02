const Popup = ({ isOpen, onClose, onLoginRedirect }) => {
  if (!isOpen) {
    return null;
  }

  return (
      <div
        className="!fixed !inset-0 !z-[10000] !flex !items-center !justify-center !p-4 !bg-black/50"
        onClick={onClose}
      >
      <div
        className="!w-full !max-w-md !rounded-2xl !bg-white !shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="!flex !items-center !justify-between !p-6 !border-b !border-gray-100 !-mb-2">
          <h2 className="!text-2xl !font-bold !text-gray-800 !-mb-1">Acesso necessário</h2>
          <button
            className="!text-gray-400 hover:!text-gray-600 !transition-colors !duration-200 !rounded-full !p-2 hover:!bg-gray-100"
            onClick={onClose}
            aria-label="Fechar"
          >
            <i className="fas fa-times !text-lg"></i>
          </button>
        </div>
        
        {/* Conteúdo */}
        <div className="!p-8 !text-center">
          <div className="!mx-auto !w-20 !h-20 !bg-purple-100 !rounded-2xl !flex !items-center !justify-center !mb-3">
            <i className="fas fa-user-lock !text-3xl !text-purple-600"></i>
          </div>
          <h3 className="!text-lg !font-semibold !text-gray-800 !mb-3">
            Faça login para continuar
          </h3>
          <p className="!text-gray-600 !text-sm !leading-relaxed !p-2 !-mb-3">
            Você precisa estar logado para salvar partidas e acessar recursos exclusivos.
          </p>
        </div>

        {/* Botões */}
        <div className="!flex !gap-4 !p-6 !border-t !border-gray-100">
          <button
            className="!flex-1 !py-4 !px-6 !border !border-gray-300 !text-gray-700 !font-medium !rounded-xl hover:!bg-gray-50 !transition-colors !duration-200"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="!flex-1 !py-4 !px-6 !bg-purple-600 !text-white !font-medium !rounded-xl hover:!bg-purple-700 !transition-colors !duration-200 !shadow-md"
            onClick={onLoginRedirect}
          >
            Fazer Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;