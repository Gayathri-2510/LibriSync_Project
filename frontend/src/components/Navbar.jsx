import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{
      background: '#1e293b',
      color: 'white',
      padding: '0 24px',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
    }}>
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '24px' }}>📚</span>
        <span style={{ color: 'white', fontWeight: '700', fontSize: '18px' }}>LibriSync</span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {!user ? (
          <>
            <Link to="/login" className="btn btn-outline" style={{ color: 'white', borderColor: 'white', padding: '8px 16px' }}>Login</Link>
            <Link to="/register" className="btn btn-primary" style={{ padding: '8px 16px' }}>Register</Link>
          </>
        ) : (
          <>
            <span style={{ fontSize: '14px', color: '#94a3b8' }}>👤 {user.name}</span>
            {user.role === 'ADMIN' ? (
              <Link to="/admin" className="btn btn-primary" style={{ padding: '8px 16px' }}>Dashboard</Link>
            ) : (
              <Link to="/dashboard" className="btn btn-primary" style={{ padding: '8px 16px' }}>Dashboard</Link>
            )}
            <button onClick={handleLogout} className="btn btn-danger" style={{ padding: '8px 16px' }}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
