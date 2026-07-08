import React, { useEffect, useState } from 'react';
import API from '../../api';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [displayUsers, setDisplayUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await API.get('/fetch-users');
      setUsers(res.data);
      setDisplayUsers(res.data);
    } catch (err) { /* silent */ }
    finally { setLoading(false); }
  };

  useEffect(() => {
    let result = [...users];
    if (filter !== 'all') result = result.filter(u => u.usertype === filter);
    if (search) result = result.filter(u =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    );
    setDisplayUsers(result);
  }, [filter, search, users]);

  const getRoleBadge = (type) => {
    if (type === 'freelancer') return <span className="badge badge-primary">Freelancer</span>;
    if (type === 'client') return <span className="badge badge-success">Client</span>;
    if (type === 'admin') return <span className="badge badge-warning">Admin</span>;
    return <span className="badge badge-muted">{type}</span>;
  };

  const getInitial = (username) => username ? username[0].toUpperCase() : 'U';

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <h1 className="page-title">All Users</h1>
            <p className="page-subtitle">{displayUsers.length} of {users.length} users</p>
          </div>
          <input
            type="text"
            className="form-input"
            placeholder="🔍 Search users..."
            style={{ width: 240 }}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="filter-tabs" style={{ marginBottom: 'var(--space-6)' }}>
        {['all', 'freelancer', 'client', 'admin'].map(f => (
          <button key={f} className={`filter-tab${filter === f ? ' filter-tab--active' : ''}`} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
            <span className="filter-tab-count">
              {f === 'all' ? users.length : users.filter(u => u.usertype === f).length}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)' }}>
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton" style={{ height: 100, borderRadius: 14 }} />)}
        </div>
      ) : displayUsers.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">👥</div>
          <p className="empty-state-title">No users found</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
          {displayUsers.map(user => (
            <div key={user._id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-4) var(--space-5)' }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: user.usertype === 'freelancer' ? 'var(--gradient)' : user.usertype === 'client' ? 'var(--success-light)' : 'var(--warning-light)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: user.usertype === 'client' ? 'var(--success)' : user.usertype === 'admin' ? 'var(--warning)' : '#fff',
                fontWeight: 700, fontSize: '1.125rem', flexShrink: 0
              }}>
                {getInitial(user.username)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.username}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
              </div>
              {getRoleBadge(user.usertype)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllUsers;