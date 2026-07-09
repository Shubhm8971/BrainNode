import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import DashboardPage from './pages/DashboardPage';
import AboutPage from './pages/AboutPage';
import ProfilePage from './pages/ProfilePage';
import Auth from './components/Auth';
import { useTheme } from './components/ThemeContext';
import { DashboardProvider } from './components/DashboardContext';
import { useAuth } from './AuthContext';

export default function App() {
  const { darkMode, toggleTheme } = useTheme();
  const { user, profile, loading } = useAuth();

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading BrainNode...</div>;
  }

  if (!user) {
    return (
      <div style={{ padding: '20px', maxWidth: '400px', margin: '100px auto' }}>
        <h1 style={{ textAlign: 'center' }}>Welcome to BrainNode</h1>
        <Auth />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: darkMode ? '#333' : '#fff',
            color: darkMode ? '#fff' : '#333',
          },
        }} 
      />
      
      <DashboardProvider>
        <div style={{ 
          fontFamily: 'sans-serif', maxWidth: '100%', minHeight: '100vh',
          backgroundColor: darkMode ? '#1e1e1e' : '#ffffff', 
          color: darkMode ? '#ffffff' : '#333333',
          transition: 'background-color 0.3s ease, color 0.3s ease', 
          margin: '0', padding: '20px'
        }}>
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            
            <header style={{ 
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
              borderBottom: `2px solid ${darkMode ? '#555' : '#e5e7eb'}`, 
              paddingBottom: '10px', marginBottom: '20px' 
            }}>
              <h1 style={{ margin: 0, fontSize: '24px' }}>BrainNode Portal</h1>
              <nav style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <Link to="/" style={{ textDecoration: 'none', color: '#2196F3', fontWeight: 'bold' }}>Dashboard</Link>
                <Link to="/about" style={{ textDecoration: 'none', color: '#2196F3', fontWeight: 'bold' }}>About</Link>
                <Link to="/profile" style={{ textDecoration: 'none', color: '#2196F3', fontWeight: 'bold' }}>
                  {profile?.username || "Profile"}
                </Link>
                <button 
                  onClick={toggleTheme} 
                  style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}
                >
                  {darkMode ? '☀️' : '🌙'}
                </button>
              </nav>
            </header>

            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </div>
        </div>
      </DashboardProvider>
    </BrowserRouter>
  );
}