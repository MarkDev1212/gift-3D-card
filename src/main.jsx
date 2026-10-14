import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(err) {
    return { error: err };
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{
          position: 'fixed', inset: 0, background: '#060811',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          color: '#ff4b72', fontFamily: 'sans-serif', padding: '20px', textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem' }}>💔</div>
          <h2 style={{ marginTop: '16px', color: '#fff' }}>Something went wrong</h2>
          <pre style={{
            marginTop: '12px', fontSize: '0.8rem', color: '#a0aec0',
            background: 'rgba(255,255,255,0.05)', padding: '16px',
            borderRadius: '8px', maxWidth: '600px', overflowX: 'auto',
            textAlign: 'left', whiteSpace: 'pre-wrap'
          }}>
            {this.state.error.message}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '20px', padding: '12px 24px', border: 'none',
              borderRadius: '30px', background: '#ff4b72', color: '#fff',
              fontWeight: '700', cursor: 'pointer', fontSize: '0.95rem'
            }}
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
)
