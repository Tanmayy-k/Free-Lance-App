import React, { useEffect, useState } from 'react';
import API from '../../api';
import '../../styles/freelancer/MyProjects.css';

const getStatusBadge = (status) => {
  if (status === 'Accepted') return <span className="badge badge-success">Accepted</span>;
  if (status === 'Rejected') return <span className="badge badge-danger">Rejected</span>;
  return <span className="badge badge-warning">Pending</span>;
};

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const userId = localStorage.getItem('userId');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchApplications(); }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await API.get('/fetch-applications');
      const mine = res.data.filter(a => a.freelancerId === userId).reverse();
      setApplications(mine);
    } catch (err) { /* silent */ }
    finally { setLoading(false); }
  };

  const filtered = filter === 'all' ? applications
    : applications.filter(a => a.status.toLowerCase() === filter);

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">My Applications</h1>
        <p className="page-subtitle">Track your submitted proposals</p>
      </div>

      <div className="filter-tabs" style={{ marginBottom: 'var(--space-6)' }}>
        {[
          { label: 'All', value: 'all' },
          { label: 'Pending', value: 'pending' },
          { label: 'Accepted', value: 'accepted' },
          { label: 'Rejected', value: 'rejected' },
        ].map(tab => (
          <button
            key={tab.value}
            className={`filter-tab${filter === tab.value ? ' filter-tab--active' : ''}`}
            onClick={() => setFilter(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: 180, borderRadius: 14 }} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <p className="empty-state-title">No applications found</p>
          <p className="empty-state-desc">You haven't applied to any projects yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {filtered.map(app => (
            <div key={app._id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ marginBottom: 'var(--space-1)' }}>{app.title}</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Client: {app.clientName}</p>
                </div>
                {getStatusBadge(app.status)}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
                <div>
                  <p className="form-label" style={{ marginBottom: 'var(--space-2)' }}>Project Description</p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {app.description}
                  </p>
                  <div style={{ marginTop: 'var(--space-3)', display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                    {(app.requiredSkills || []).map(s => <span key={s} className="skill-tag">{s}</span>)}
                  </div>
                  <p style={{ marginTop: 'var(--space-3)', fontWeight: 700, color: 'var(--success)' }}>
                    Budget: ₹{app.budget?.toLocaleString()}
                  </p>
                </div>

                <div style={{ borderLeft: '1px solid var(--border-subtle)', paddingLeft: 'var(--space-6)' }}>
                  <p className="form-label" style={{ marginBottom: 'var(--space-2)' }}>Your Proposal</p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {app.proposal}
                  </p>
                  <div style={{ marginTop: 'var(--space-3)', display: 'flex', gap: 'var(--space-4)' }}>
                    <div>
                      <p className="form-label" style={{ marginBottom: 4 }}>Bid Amount</p>
                      <p style={{ fontWeight: 700, color: 'var(--primary)' }}>₹{app.bidAmount?.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="form-label" style={{ marginBottom: 4 }}>Est. Time</p>
                      <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{app.estimatedTime} days</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;