import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  const features = [
    { icon: '🔍', title: 'Smart Recommendations', desc: 'AI-powered book recommendations based on your reading history and preferences.' },
    { icon: '📖', title: 'Easy Borrowing', desc: 'Borrow and return books with just a click. No paperwork needed.' },
    { icon: '💰', title: 'Fine Management', desc: 'Transparent fine calculation for overdue books. Pay easily online.' },
    { icon: '📊', title: 'Admin Dashboard', desc: 'Powerful tools for librarians to manage books, users, and records.' },
  ];

  return (
    <div>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #2563eb 100%)',
        color: 'white',
        padding: '80px 24px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '60px', marginBottom: '20px' }}>📚</div>
        <h1 style={{ fontSize: '42px', fontWeight: '800', marginBottom: '16px' }}>
          LibriSync  
        </h1>
        <p style={{ fontSize: '18px', color: '#bfdbfe', maxWidth: '600px', margin: '0 auto 32px' }}>
          Discover, borrow, and manage books with intelligent recommendations. Your digital library companion.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {!user ? (
            <>
              <Link to="/register" className="btn" style={{ background: 'white', color: '#2563eb', fontWeight: '700', padding: '14px 28px', fontSize: '16px' }}>
                Get Started
              </Link>
              <Link to="/login" className="btn btn-outline" style={{ borderColor: 'white', color: 'white', padding: '14px 28px', fontSize: '16px' }}>
                Login
              </Link>
            </>
          ) : (
            <Link to={user.role === 'ADMIN' ? '/admin' : '/dashboard'} className="btn"
              style={{ background: 'white', color: '#2563eb', fontWeight: '700', padding: '14px 28px', fontSize: '16px' }}>
              Go to Dashboard
            </Link>
          )}
        </div>
      </div>

      {/* Features */}
      <div style={{ padding: '60px 24px', maxWidth: '1100px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: '30px', fontWeight: '700', marginBottom: '40px', color: '#1e293b' }}>
          Why SmartLibrary?
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
          {features.map((f, i) => (
            <div key={i} className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>{f.icon}</div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '10px', color: '#1e293b' }}>{f.title}</h3>
              <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.6' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: '#eff6ff', padding: '60px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '12px', color: '#1e293b' }}>
          Ready to explore thousands of books?
        </h2>
        <p style={{ color: '#64748b', marginBottom: '24px' }}>Join our community of readers today.</p>
        {!user && (
          <Link to="/register" className="btn btn-primary" style={{ padding: '12px 32px', fontSize: '16px' }}>
            Create Free Account
          </Link>
        )}
      </div>
    </div>
  );
}
