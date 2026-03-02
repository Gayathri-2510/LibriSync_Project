import { Link, useLocation } from 'react-router-dom';

export default function Sidebar({ links }) {
  const location = useLocation();

  return (
    <div style={{
      width: '220px',
      minHeight: 'calc(100vh - 64px)',
      background: 'white',
      borderRight: '1px solid #e2e8f0',
      padding: '20px 0',
      flexShrink: 0
    }}>
      {links.map(link => (
        <Link
          key={link.to}
          to={link.to}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 20px',
            textDecoration: 'none',
            color: location.pathname === link.to ? '#2563eb' : '#475569',
            background: location.pathname === link.to ? '#eff6ff' : 'transparent',
            fontWeight: location.pathname === link.to ? '600' : '400',
            fontSize: '14px',
            borderRight: location.pathname === link.to ? '3px solid #2563eb' : '3px solid transparent',
            transition: 'all 0.15s'
          }}
        >
          <span>{link.icon}</span>
          {link.label}
        </Link>
      ))}
    </div>
  );
}
