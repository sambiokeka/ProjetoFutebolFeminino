import '../styles/Popup.css';

const Popup = ({ isOpen, onClose, onLoginRedirect }) => {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-container" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h2>Conta necessária</h2>
          <button className="popup-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="popup-content">
          <div className="popup-icon">
            <i className="fas fa-user-lock"></i>
          </div>
        
          <p><b>Faça login para continuar.</b></p>
        </div>

        <div className="popup-footer">
          <button className="popup-btn-cancel" onClick={onClose}>
            Cancelar
          </button>
          <button className="popup-btn-login" onClick={onLoginRedirect}>
            Fazer Login
          </button>
        </div>
      </div>
    </div>

  );
};

export default Popup;