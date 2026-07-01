import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import AboutPage from './pages/AboutPage';
import Auth from './components/Auth'; // Your login/signup form
import { useTheme } from './components/ThemeContext';
import { DashboardProvider } from './components/DashboardContext';
import { useAuth } from './AuthContext'; // Import the Auth hook

export default function App() {
  const { darkMode, toggleTheme } = useTheme();
  const { user, loading } = useAuth(); // Access auth state

  // 1. Loading state while Supabase initializes the session
  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading BrainNode...</div>;
  }

  // 2. If no user is logged in, show the Auth form
  if (!user) {
    return (
      <div style={{ padding: '20px', maxWidth: '400px', margin: '100px auto' }}>
        <h1>Welcome to BrainNode</h1>
        <Auth />
      </div>
    );
  }

  // 3. Main Application (Logged in state)
  return (
    <BrowserRouter>
      <DashboardProvider>
        <div style={{ 
          fontFamily: 'sans-serif', maxWidth: '100%', minHeight: '100vh',
          backgroundColor: darkMode ? '#1e1e1e' : '#ffffff', color: darkMode ? '#ffffff' : '#333333',
          transition: 'all 0.3s ease', margin: '0', padding: '20px'
        }}>
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `2px solid ${darkMode ? '#555' : '#333'}`, paddingBottom: '10px', marginBottom: '20px' }}>
              <h1 style={{ margin: 0, fontSize: '24px' }}>BrainNode Portal</h1>
              <nav style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <Link to="/" style={{ textDecoration: 'none', color: '#2196F3', fontWeight: 'bold' }}>Dashboard</Link>
                <Link to="/about" style={{ textDecoration: 'none', color: '#2196F3', fontWeight: 'bold' }}>About</Link>
                <button onClick={toggleTheme} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', outline: 'none' }}>
                  {darkMode ? '☀️' : '🌙'}
                </button>
              </nav>
            </header>

            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/about" element={<AboutPage />} />
            </Routes>
          </div>
        </div>
      </DashboardProvider>
    </BrowserRouter>
  );
}