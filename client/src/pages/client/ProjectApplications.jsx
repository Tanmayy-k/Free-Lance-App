import React, { useEffect, useState } from 'react';
import API from '../../api';
import '../../styles/freelancer/MyProjects.css';

const getStatusBadge = (status) => {
  if (status === 'Accepted') return <span className="badge badge-success">Accepted</span>;
  if (status === 'Rejected') return <span className="badge badge-danger">Rejected</span>;
  return <span className="badge badge-warning">Pending</span>;
};

const ProjectApplications = () => {
  const [applications, setApplications] = useState([]);
  const [displayApplications, setDisplayApplications] = useState([]);
  const [projectTitles, setProjectTitles] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState('');
  const [actionMsg, setActionMsg] = useState('');
  const userId = localStorage.getItem('userId');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchApplications(); }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await API.get('/fetch-applications');
      const mine = res.data.filter(a => a.clientId === userId).reverse();
      setApplications(mine);
      setDisplayApplications(mine);

      const titles = [];
      mine.forEach(a => { if (!titles.includes(a.title)) titles.push(a.title); });
      setProjectTitles(titles);
    } catch (err) { /* silent */ }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (selectedProject === '') setDisplayApplications(applications);
    else setDisplayApplications(applications.filter(a => a.title === selectedProject));
  }, [selectedProject, applications]);

  const handleApprove = async (id) => {
    setActionLoading(id);
    setActionMsg('');
    try {
      await API.get(`/approve-application/${id}`);
      setActionMsg('✅ Application approved!');
      fetchApplications();
    } catch (err) {
      setActionMsg('❌ Action failed. Please try again.');
    } finally { setActionLoading(''); }
  };

  const handleReject = async (id) => {
    setActionLoading(id + '_reject');
    try {
      await API.get(`/reject-application/${id}`);
      fetchApplications();
    } catch (err) { /* silent */ }
    finally { setActionLoading(''); }
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <h1 className="page-title">Applications</h1>
            <p className="page-subtitle">{displayApplications.length} proposal{displayApplications.length !== 1 ? 's' : ''} received</p>
          </div>
          {projectTitles.length > 0 && (
            <select
              className="form-input form-select"
              style={{ width: 240 }}
              value={selectedProject}
              onChange={e => setSelectedProject(e.target.value)}
            >
              <option value="">All Projects</option>
              {projectTitles.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          )}
        </div>
      </div>

      {actionMsg && (
        <div className={actionMsg.startsWith('✅') ? 'success-message' : 'error-message'} style={{ marginBottom: 'var(--space-4)' }}>
          {actionMsg}
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: 200, borderRadius: 14 }} />)}
        </div>
      ) : displayApplications.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <p className="empty-state-title">No applications yet</p>
          <p className="empty-state-desc">Proposals from freelancers will appear here once they start bidding on your projects.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          {displayApplications.map(app => (
            <div key={app._id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
                <div>
                  <h3 style={{ marginBottom: 4 }}>{app.title}</h3>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    By {app.freelancerName} · {app.freelancerEmail}
                  </p>
                </div>
                {getStatusBadge(app.status)}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
                <div>
                  <p className="form-label" style={{ marginBottom: 'var(--space-2)' }}>Project Requirements</p>
                  <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {app.description}
                  </p>
                  <div style={{ marginTop: 'var(--space-3)', display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                    {(app.requiredSkills || []).map(s => <span key={s} className="skill-tag">{s}</span>)}
                  </div>
                  <p style={{ marginTop: 'var(--space-3)', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    Budget: <span style={{ fontWeight: 700, color: 'var(--success)' }}>₹{app.budget?.toLocaleString()}</span>
                  </p>
                </div>

                <div style={{ borderLeft: '1px solid var(--border-subtle)', paddingLeft: 'var(--space-6)' }}>
                  <p className="form-label" style={{ marginBottom: 'var(--space-2)' }}>Freelancer's Proposal</p>
                  <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {app.proposal}
                  </p>
                  <div style={{ marginTop: 'var(--space-3)', display: 'flex', gap: 'var(--space-6)' }}>
                    <div>
                      <p className="form-label" style={{ marginBottom: 4 }}>Bid Amount</p>
                      <p style={{ fontWeight: 700, color: 'var(--primary)' }}>₹{app.bidAmount?.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="form-label" style={{ marginBottom: 4 }}>Timeline</p>
                      <p style={{ fontWeight: 600 }}>{app.estimatedTime} days</p>
                    </div>
                  </div>
                  <div style={{ marginTop: 'var(--space-3)', display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                    {(app.freelancerSkills || []).map(s => <span key={s} className="skill-tag">{s}</span>)}
                  </div>
                </div>
              </div>

              {app.status === 'Pending' && (
                <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-5)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-subtle)' }}>
                  <button
                    className="btn btn-success"
                    onClick={() => handleApprove(app._id)}
                    disabled={actionLoading === app._id}
                  >
                    {actionLoading === app._id ? <><span className="spinner" /> Approving...</> : '✅ Approve'}
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleReject(app._id)}
                    disabled={actionLoading === app._id + '_reject'}
                  >
                    Decline
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectApplications;