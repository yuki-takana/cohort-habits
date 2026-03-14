import React from 'react';
import './ConfirmModal.css'; 

const ConfirmModal = ({ title, message, motivation, onConfirm, onCancel }) => {
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h3>{title}</h3>
        <p>{message}</p>
        
        {/* Only show the motivation if it exists */}
        {motivation && (
          <div className="modal-motivation">
            <strong>Your motivation was:</strong>
            <p>"{motivation}"</p>
          </div>
        )}
        
        <div className="modal-actions">
          <button onClick={onCancel} className="btn-modal btn-cancel">
            Cancel
          </button>
          <button onClick={onConfirm} className="btn-modal btn-confirm">
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;