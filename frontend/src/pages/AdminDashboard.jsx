import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import api from '../api/api';

const sidebarLinks = [
  { to: '/admin', icon: '📊', label: 'Dashboard' },
  { to: '/admin/books', icon: '📚', label: 'Manage Books' },
  { to: '/admin/borrows', icon: '📋', label: 'Borrow Records' },
  { to: '/admin/fines', icon: '💰', label: 'Fine Management' },
  { to: '/admin/users', icon: '👥', label: 'Users' },
];

function AdminOverview() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    api.get('/admin/stats').then(r => setStats(r.data)).catch(() => {});
  }, []);

  return (
    <div>
      <h1 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '20px' }}>Admin Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card"><div className="label">Total Users</div><div className="value">{stats.totalUsers || 0}</div></div>
        <div className="stat-card green"><div className="label">Total Books</div><div className="value">{stats.totalBooks || 0}</div></div>
        <div className="stat-card orange"><div className="label">Borrowed</div><div className="value">{stats.borrowedBooks || 0}</div></div>
        <div className="stat-card red"><div className="label">Returned</div><div className="value">{stats.returnedBooks || 0}</div></div>
      </div>
      <div className="card">
        <h2 style={{ fontWeight: '700', marginBottom: '12px' }}>📋 System Status</h2>
        <p style={{ color: '#64748b', fontSize: '14px' }}>All systems operational. Library management system is running smoothly.</p>
      </div>
    </div>
  );
}

function ManageBooks() {
  const [books, setBooks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', author: '', genre: '', isbn: '', description: '', totalCopies: 1, publishedDate: '2020-01-01' });
  const [message, setMessage] = useState('');

  const genres = ['Fiction', 'Technology', 'Fantasy', 'History', 'Self-Help', 'Thriller', 'Dystopian', 'Science', 'Biography'];

  const load = () => api.get('/books/all').then(r => setBooks(r.data)).catch(() => {});

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ title: '', author: '', genre: '', isbn: '', description: '', totalCopies: 1, publishedDate: '2020-01-01' });
    setShowModal(true);
  };

  const openEdit = (book) => {
    setEditing(book);
    setForm({ title: book.title, author: book.author, genre: book.genre, isbn: book.isbn, description: book.description, totalCopies: book.totalCopies, publishedDate: book.publishedDate || '2020-01-01' });
    setShowModal(true);
  };

  const save = async () => {
    try {
      if (editing) {
        await api.put(`/books/${editing.id}`, form);
      } else {
        await api.post('/books', form);
      }
      setShowModal(false);
      load();
      setMessage(editing ? 'Book updated!' : 'Book added!');
    } catch {
      setMessage('Failed to save book');
    }
    setTimeout(() => setMessage(''), 3000);
  };

  const deleteBook = async (id) => {
    if (confirm('Delete this book?')) {
      await api.delete(`/books/${id}`);
      load();
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 style={{ fontSize: '22px', fontWeight: '700' }}>Manage Books</h1>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Book</button>
      </div>
      {message && <div className="alert alert-success">{message}</div>}
      <div className="card">
        <table>
          <thead><tr><th>Title</th><th>Author</th><th>Genre</th><th>ISBN</th><th>Copies</th><th>Available</th><th>Actions</th></tr></thead>
          <tbody>
            {books.map(book => (
              <tr key={book.id}>
                <td><strong>{book.title}</strong></td>
                <td>{book.author}</td>
                <td><span className="badge badge-info">{book.genre}</span></td>
                <td style={{ fontSize: '12px', color: '#64748b' }}>{book.isbn}</td>
                <td>{book.totalCopies}</td>
                <td><span className={`badge ${book.availableCopies > 0 ? 'badge-success' : 'badge-danger'}`}>{book.availableCopies}</span></td>
                <td style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn btn-outline" style={{ padding: '5px 10px', fontSize: '12px' }} onClick={() => openEdit(book)}>Edit</button>
                  <button className="btn btn-danger" style={{ padding: '5px 10px', fontSize: '12px' }} onClick={() => deleteBook(book.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{editing ? 'Edit Book' : 'Add Book'}</h2>
            <div className="form-group"><label>Title</label><input value={form.title} onChange={e => setForm({...form, title: e.target.value})} /></div>
            <div className="form-group"><label>Author</label><input value={form.author} onChange={e => setForm({...form, author: e.target.value})} /></div>
            <div className="form-group">
              <label>Genre</label>
              <select value={form.genre} onChange={e => setForm({...form, genre: e.target.value})}>
                <option value="">Select genre...</option>
                {genres.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div className="form-group"><label>ISBN</label><input value={form.isbn} onChange={e => setForm({...form, isbn: e.target.value})} /></div>
            <div className="form-group"><label>Total Copies</label><input type="number" min="1" value={form.totalCopies} onChange={e => setForm({...form, totalCopies: parseInt(e.target.value)})} /></div>
            <div className="form-group"><label>Description</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} /></div>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={save}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BorrowRecords() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    api.get('/borrow/all').then(r => setRecords(r.data)).catch(() => {});
  }, []);

  const returnBook = async (id) => {
    await api.post(`/borrow/return/${id}`);
    api.get('/borrow/all').then(r => setRecords(r.data));
  };

  return (
    <div>
      <h1 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '20px' }}>Borrow Records</h1>
      <div className="card">
        <table>
          <thead><tr><th>User</th><th>Book</th><th>Borrow Date</th><th>Due Date</th><th>Status</th><th>Fine</th><th>Action</th></tr></thead>
          <tbody>
            {records.map(r => (
              <tr key={r.id}>
                <td>{r.user?.name}</td>
                <td>{r.book?.title}</td>
                <td>{r.borrowDate}</td>
                <td>{r.dueDate}</td>
                <td><span className={`badge ${r.status === 'RETURNED' ? 'badge-success' : 'badge-warning'}`}>{r.status}</span></td>
                <td>${(r.fine || 0).toFixed(2)}</td>
                <td>
                  {r.status === 'BORROWED' && (
                    <button className="btn btn-success" style={{ padding: '5px 10px', fontSize: '12px' }} onClick={() => returnBook(r.id)}>
                      Mark Returned
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

function FineManagement() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    api.get('/borrow/all').then(r => setRecords(r.data)).catch(() => {});
  }, []);

  const fined = records.filter(r => r.fine > 0);
  const totalFines = fined.reduce((s, r) => s + r.fine, 0);
  const unpaid = records.filter(r => r.status === 'BORROWED' && r.fine > 0);

  return (
    <div>
      <h1 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '20px' }}>Fine Management</h1>
      <div className="stats-grid">
        <div className="stat-card red"><div className="label">Total Fines Collected</div><div className="value">${totalFines.toFixed(2)}</div></div>
        <div className="stat-card orange"><div className="label">Pending Fines</div><div className="value">{unpaid.length}</div></div>
        <div className="stat-card"><div className="label">Fine Rate</div><div className="value">$1/day</div></div>
      </div>
      <div className="card">
        <h2 style={{ fontWeight: '700', marginBottom: '16px' }}>Fine Records</h2>
        <table>
          <thead><tr><th>User</th><th>Book</th><th>Due Date</th><th>Status</th><th>Fine Amount</th></tr></thead>
          <tbody>
            {fined.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>No fines recorded</td></tr>
            ) : fined.map(r => (
              <tr key={r.id}>
                <td>{r.user?.name}</td>
                <td>{r.book?.title}</td>
                <td>{r.dueDate}</td>
                <td><span className={`badge ${r.status === 'RETURNED' ? 'badge-success' : 'badge-danger'}`}>{r.status}</span></td>
                <td style={{ fontWeight: '700', color: '#dc2626' }}>${r.fine.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get('/admin/users').then(r => setUsers(r.data)).catch(() => {});
  }, []);

  return (
    <div>
      <h1 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '20px' }}>Users</h1>
      <div className="card">
        <table>
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td><strong>{u.name}</strong></td>
                <td>{u.email}</td>
                <td><span className={`badge ${u.role === 'ADMIN' ? 'badge-danger' : 'badge-info'}`}>{u.role}</span></td>
                <td style={{ color: '#64748b', fontSize: '13px' }}>{u.createdAt?.split('T')[0]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar links={sidebarLinks} />
      <div style={{ flex: 1, padding: '28px', overflow: 'auto' }}>
        <Routes>
          <Route index element={<AdminOverview />} />
          <Route path="books" element={<ManageBooks />} />
          <Route path="borrows" element={<BorrowRecords />} />
          <Route path="fines" element={<FineManagement />} />
          <Route path="users" element={<Users />} />
        </Routes>
      </div>
    </div>
  );
}
