const Modal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel' }) => {
    if (!isOpen) return null
  
    return (
      <div style={styles.overlay} onClick={onClose}>
        <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
          <h3 style={styles.title}>{title}</h3>
          <p style={styles.message}>{message}</p>
          <div style={styles.actions}>
            <button onClick={onClose} style={styles.cancelBtn}>{cancelText}</button>
            <button onClick={onConfirm} style={styles.confirmBtn}>{confirmText}</button>
          </div>
        </div>
      </div>
    )
  }
  
  const styles = {
    overlay: {
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 999,
    },
    modal: {
      background: '#fff',
      borderRadius: '12px',
      padding: '2rem',
      minWidth: '320px',
      maxWidth: '480px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
    },
    title: {
      fontSize: '1.2rem',
      marginBottom: '0.75rem',
      color: '#1a1a2e',
    },
    message: {
      color: '#555',
      marginBottom: '1.5rem',
      lineHeight: 1.5,
    },
    actions: {
      display: 'flex',
      gap: '0.75rem',
      justifyContent: 'flex-end',
    },
    cancelBtn: {
      padding: '0.5rem 1.2rem',
      border: '1px solid #ccc',
      borderRadius: '6px',
      background: '#fff',
      cursor: 'pointer',
      fontSize: '0.9rem',
    },
    confirmBtn: {
      padding: '0.5rem 1.2rem',
      border: 'none',
      borderRadius: '6px',
      background: '#e94560',
      color: '#fff',
      cursor: 'pointer',
      fontSize: '0.9rem',
    },
  }
  
  export default Modal