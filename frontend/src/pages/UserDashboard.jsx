import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

const sidebarLinks = [
  { to: '/dashboard', icon: '🏠', label: 'Overview' },
  { to: '/dashboard/books', icon: '📚', label: 'Browse Books' },
  { to: '/dashboard/my-books', icon: '📖', label: 'My Books' },
  { to: '/dashboard/fines', icon: '💰', label: 'Fines' },
];

function Overview() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    api.get('/borrow/my').then(r => setRecords(r.data)).catch(() => {});
    api.get('/recommendations').then(r => setRecommendations(r.data)).catch(() => {});
  }, []);

  const active = records.filter(r => r.status === 'BORROWED');
  const totalFine = records.reduce((s, r) => s + (r.fine || 0), 0);

  return (
    <div>
      <h1 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '20px' }}>Welcome back, {user?.name}! 👋</h1>
      <div className="stats-grid">
        <div className="stat-card"><div className="label">Books Borrowed</div><div className="value">{records.length}</div></div>
        <div className="stat-card green"><div className="label">Currently Reading</div><div className="value">{active.length}</div></div>
        <div className="stat-card red"><div className="label">Total Fines</div><div className="value">${totalFine.toFixed(2)}</div></div>
      </div>

      <div className="card">
        <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>⭐ Recommended For You</h2>
        {recommendations.length === 0 ? (
          <p style={{ color: '#64748b' }}>Start borrowing books to get personalized recommendations!</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
            {recommendations.map(book => (
              <div key={book.id} style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '10px', background: '#f8fafc' }}>
                <div style={{ fontSize: '36px', textAlign: 'center', marginBottom: '8px' }}>📕</div>
                <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>{book.title}</div>
                <div style={{ color: '#64748b', fontSize: '12px' }}>{book.author}</div>
                <span className="badge badge-info" style={{ marginTop: '8px', display: 'inline-block' }}>{book.genre}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function BrowseBooks() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [msgType, setMsgType] = useState('');

  useEffect(() => {
    api.get('/books/all').then(r => setBooks(r.data)).catch(() => {});
  }, []);

  const filtered = books.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase()) ||
    b.genre.toLowerCase().includes(search.toLowerCase())
  );

  const borrow = async (bookId) => {
    try {
      await api.post(`/borrow/book/${bookId}`);
      setMessage('Book borrowed successfully! Due in 14 days.');
      setMsgType('success');
      api.get('/books/all').then(r => setBooks(r.data));
    } catch (err) {
      setMessage(err.response?.data?.message || 'Could not borrow book');
      setMsgType('error');
    }
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div>
      <h1 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '20px' }}>Browse Books</h1>
      {message && <div className={`alert alert-${msgType}`}>{message}</div>}
      <div style={{ marginBottom: '20px' }}>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Search by title, author, or genre..." 
          style={{ padding: '10px 16px', border: '1px solid #e2e8f0', borderRadius: '8px', width: '100%', maxWidth: '400px', fontSize: '14px', outline: 'none' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {filtered.map(book => (
          <div key={book.id} className="card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>📘</div>
            <h3 style={{ fontWeight: '700', fontSize: '15px', marginBottom: '4px' }}>{book.title}</h3>
            <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '6px' }}>{book.author}</p>
            <span className="badge badge-info" style={{ marginBottom: '10px', display: 'inline-block' }}>{book.genre}</span>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px', lineHeight: '1.5' }}>{book.description}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: book.availableCopies > 0 ? '#16a34a' : '#dc2626', fontWeight: '600' }}>
                {book.availableCopies > 0 ? `✅ ${book.availableCopies} available` : '❌ Unavailable'}
              </span>
              <button className="btn btn-primary" style={{ padding: '7px 14px', fontSize: '13px' }}
                onClick={() => borrow(book.id)} disabled={book.availableCopies === 0}>
                Borrow
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MyBooks() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    api.get('/borrow/my').then(r => setRecords(r.data)).catch(() => {});
  }, []);

  const returnBook = async (recordId) => {
    await api.post(`/borrow/return/${recordId}`);
    api.get('/borrow/my').then(r => setRecords(r.data));
  };

  return (
    <div>
      <h1 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '20px' }}>My Books</h1>
      <div className="card">
        <table>
          <thead><tr><th>Book</th><th>Borrow Date</th><th>Due Date</th><th>Status</th><th>Fine</th><th>Action</th></tr></thead>
          <tbody>
            {records.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', color: '#64748b', padding: '30px' }}>No books borrowed yet</td></tr>
            ) : records.map(r => (
              <tr key={r.id}>
                <td><strong>{r.book?.title}</strong><br /><small style={{ color: '#64748b' }}>{r.book?.author}</small></td>
                <td>{r.borrowDate}</td>
                <td>{r.dueDate}</td>
                <td><span className={`badge ${r.status === 'RETURNED' ? 'badge-success' : 'badge-warning'}`}>{r.status}</span></td>
                <td>${(r.fine || 0).toFixed(2)}</td>
                <td>
                  {r.status === 'BORROWED' && (
                    <button className="btn btn-success" style={{ padding: '6px 12px', fontSize: '13px' }} onClick={() => returnBook(r.id)}>
                      Return
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Fines() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    api.get('/borrow/my').then(r => setRecords(r.data)).catch(() => {});
  }, []);

  const fined = records.filter(r => r.fine > 0);
  const total = fined.reduce((s, r) => s + r.fine, 0);

  return (
    <div>
      <h1 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '20px' }}>Fine Management</h1>
      <div className="stats-grid" style={{ marginBottom: '20px' }}>
        <div className="stat-card red"><div className="label">Total Fines</div><div className="value">${total.toFixed(2)}</div></div>
        <div className="stat-card orange"><div className="label">Overdue Items</div><div className="value">{fined.length}</div></div>
      </div>
      <div className="card">
        <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '16px' }}>Fine rate: $1.00 per day overdue</p>
        <table>
          <thead><tr><th>Book</th><th>Due Date</th><th>Return Date</th><th>Days Overdue</th><th>Fine</th></tr></thead>
          <tbody>
            {fined.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', color: '#64748b', padding: '30px' }}>🎉 No fines! Keep it up.</td></tr>
            ) : fined.map(r => (
              <tr key={r.id}>
                <td><strong>{r.book?.title}</strong></td>
                <td>{r.dueDate}</td>
                <td>{r.returnDate || 'Not returned'}</td>
                <td>{Math.ceil(r.fine)}</td>
                <td style={{ color: '#dc2626', fontWeight: '700' }}>${r.fine.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function UserDashboard() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar links={sidebarLinks} />
      <div style={{ flex: 1, padding: '28px', overflow: 'auto' }}>
        <Routes>
          <Route index element={<Overview />} />
          <Route path="books" element={<BrowseBooks />} />
          <Route path="my-books" element={<MyBooks />} />
          <Route path="fines" element={<Fines />} />
        </Routes>
      </div>
    </div>
  );
}
