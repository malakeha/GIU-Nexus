const Footer = () => {
    return (
      <footer style={styles.footer}>
        <p style={styles.text}>© 2026 GIU Nexus — AI-Powered Career & Talent Platform</p>
        <p style={styles.sub}>German International University · Software Engineering Spring 2026</p>
      </footer>
    )
  }
  
  const styles = {
    footer: {
      backgroundColor: '#1a1a2e',
      color: '#aaa',
      textAlign: 'center',
      padding: '1.5rem',
      marginTop: 'auto',
    },
    text: {
      fontSize: '0.9rem',
      marginBottom: '0.3rem',
    },
    sub: {
      fontSize: '0.75rem',
      color: '#666',
    },
  }
  
  export default Footer