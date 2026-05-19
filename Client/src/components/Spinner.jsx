const Spinner = ({ size = 40 }) => {
    return (
      <div style={styles.wrapper}>
        <div style={{
          width: size,
          height: size,
          border: '4px solid #e0e0e0',
          borderTop: '4px solid #e94560',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }
  
  const styles = {
    wrapper: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem',
    },
  }
  
  export default Spinner