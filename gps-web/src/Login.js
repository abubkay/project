function Login() {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
  
    const handleGoogleLogin = async () => {
      try {
        setLoading(true);
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
      } catch (err) {
        setError('Failed to authenticate. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div className="login-container">
        <Paper elevation={3} className="login-box">
          <Typography variant="h4" gutterBottom>
            GPS Tracker Dashboard
          </Typography>
          
          {error && (
            <Alert severity="error" className="error-alert">
              {error}
            </Alert>
          )}
  
          <Button
            variant="contained"
            color="primary"
            startIcon={<Google />}
            onClick={handleGoogleLogin}
            disabled={loading}
            fullWidth
          >
            {loading ? 'Signing In...' : 'Sign In with Google'}
          </Button>
        </Paper>
        
        <style jsx global>{`
          .login-container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          }
          
          .login-box {
            padding: 2rem;
            width: 100%;
            max-width: 400px;
            text-align: center;
            border-radius: 12px;
          }
          
          .error-alert {
            margin: 1rem 0;
          }
        `}</style>
      </div>
    );
  }