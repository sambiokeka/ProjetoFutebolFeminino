import React from 'react';

const Popup = ({ isOpen, onClose, onLoginRedirect }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="tw-fixed tw-inset-0 tw-z-[10000] tw-flex tw-items-center tw-justify-center tw-bg-gray-800 tw-bg-opacity-70 tw-p-5"
      onClick={onClose}
    >
      <div
        className="tw-w-full tw-max-w-md tw-rounded-2xl tw-bg-white tw-shadow-2xl tw-animate-[popupIn_0.3s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="tw-flex tw-items-center tw-justify-between tw-border-b tw-border-gray-200 tw-p-6">
          <h2 className="tw-text-2xl tw-font-bold tw-text-gray-800">Conta necessária</h2>
          <button
            className="tw-rounded-full tw-p-2 tw-text-gray-600 tw-transition-colors tw-duration-300 hover:tw-bg-gray-100 hover:tw-text-gray-900"
            onClick={onClose}
            aria-label="Fechar popup"
          >
            <i className="fas fa-times tw-text-lg"></i>
          </button>
        </div>
        
        <div className="tw-py-8 tw-px-6 tw-text-center">
          <div className="tw-mb-6 tw-text-5xl tw-text-purple-600">
            <i className="fas fa-user-lock"></i>
          </div>
          <p className="tw-text-base tw-font-semibold tw-text-gray-700">Faça login para continuar.</p>
        </div>

        <div className="tw-flex tw-gap-4 tw-border-t tw-border-gray-200 tw-p-6">
          <button
            className="tw-flex-1 tw-rounded-xl tw-border-2 tw-border-gray-300 tw-bg-gray-100 tw-p-3 tw-font-semibold tw-text-gray-600 tw-transition-colors tw-duration-300 hover:tw-bg-gray-200 hover:tw-text-gray-800"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="tw-flex-1 tw-rounded-xl tw-p-3 tw-font-semibold tw-text-white tw-transition-transform tw-duration-300 hover:tw-scale-105"
            style={{
              background: 'linear-gradient(135deg, #6f42c1 0%, #8b5cf6 100%)',
              boxShadow: '0 4px 15px rgba(111, 66, 193, 0.3)'
            }}
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