import React, { useEffect, useState } from 'react';
import API from '../../api';

const getStatusBadge = (status) => {
  if (status === 'Accepted') return <span className="badge badge-success">Accepted</span>;
  if (status === 'Rejected') return <span className="badge badge-danger">Rejected</span>;
  return <span className="badge badge-warning">Pending</span>;
};

const AllApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => { fetchApplications(); }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await API.get('/fetch-applications');
      setApplications(res.data.reverse());
    } catch (err) { /* silent */ }
    finally { setLoading(false); }
  };

  const filtered = filter === 'all' ? applications
    : applications.filter(a => a.status.toLowerCase() === filter);

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">All Applications</h1>
        <p className="page-subtitle">{applications.length} total applications across the platform</p>
      </div>

      <div className="filter-tabs" style={{ marginBottom: 'var(--space-6)' }}>
        {['all', 'pending', 'accepted', 'rejected'].map(f => (
          <button key={f} className={`filter-tab${filter === f ? ' filter-tab--active' : ''}`} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
            <span className="filter-tab-count">
              {f === 'all' ? applications.length : applications.filter(a => a.status.toLowerCase() === f).length}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 200, borderRadius: 14 }} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <p className="empty-state-title">No applications found</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          {filtered.map(app => (
            <div key={app._id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
                <div>
                  <h3 style={{ marginBottom: 4 }}>{app.title}</h3>
                  <div style={{ display: 'flex', gap: 'var(--space-4)', fontSize: '0.8125rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                    <span>Client: <strong style={{ color: 'var(--text-secondary)' }}>{app.clientName}</strong></span>
                    <span>Freelancer: <strong style={{ color: 'var(--text-secondary)' }}>{app.freelancerName}</strong></span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'flex-start', flexShrink: 0 }}>
                  {getStatusBadge(app.status)}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
                <div>
                  <p className="form-label" style={{ marginBottom: 'var(--space-2)' }}>Project</p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 'var(--space-3)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{app.description}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                    {(app.requiredSkills || []).map(s => <span key={s} className="skill-tag">{s}</span>)}
                  </div>
                  <p style={{ marginTop: 'var(--space-2)', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    Budget: <strong style={{ color: 'var(--success)' }}>₹{app.budget?.toLocaleString()}</strong>
                  </p>
                </div>

                <div style={{ borderLeft: '1px solid var(--border-subtle)', paddingLeft: 'var(--space-6)' }}>
                  <p className="form-label" style={{ marginBottom: 'var(--space-2)' }}>Proposal</p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 'var(--space-3)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{app.proposal}</p>
                  <div style={{ display: 'flex', gap: 'var(--space-5)', fontSize: '0.875rem' }}>
                    <div>
                      <p className="form-label" style={{ marginBottom: 4 }}>Bid</p>
                      <strong style={{ color: 'var(--primary)' }}>₹{app.bidAmount?.toLocaleString()}</strong>
                    </div>
                    <div>
                      <p className="form-label" style={{ marginBottom: 4 }}>Timeline</p>
                      <strong>{app.estimatedTime} days</strong>
                    </div>
                  </div>
                  <div style={{ marginTop: 'var(--space-2)', display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                    {(app.freelancerSkills || []).map(s => <span key={s} className="skill-tag">{s}</span>)}
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

export default AllApplications;