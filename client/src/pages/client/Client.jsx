import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api';
import '../../styles/freelancer/MyProjects.css';

const getStatusBadge = (status) => {
  if (status === 'Available') return <span className="badge badge-success">Open</span>;
  if (status === 'Assigned') return <span className="badge badge-warning">In Progress</span>;
  if (status === 'Completed') return <span className="badge badge-muted">Completed</span>;
  return <span className="badge badge-muted">{status}</span>;
};

const Client = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [displayProjects, setDisplayProjects] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const username = localStorage.getItem('username');
  const userId = localStorage.getItem('userId');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await API.get('/fetch-projects');
      const mine = res.data.filter(p => p.clientId === userId).reverse();
      setProjects(mine);
      setDisplayProjects(mine);
    } catch (err) { /* silent */ }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (filter === 'all') setDisplayProjects(projects);
    else if (filter === 'open') setDisplayProjects(projects.filter(p => p.status === 'Available'));
    else if (filter === 'active') setDisplayProjects(projects.filter(p => p.status === 'Assigned'));
    else if (filter === 'done') setDisplayProjects(projects.filter(p => p.status === 'Completed'));
  }, [filter, projects]);

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <h1 className="page-title">Hey, {username || 'Client'} 👋</h1>
            <p className="page-subtitle">Manage your projects and find the right talent</p>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/new-project')}>
            + Post New Project
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid-4" style={{ marginBottom: 'var(--space-8)' }}>
        <div className="stat-card" style={{ borderTop: '2px solid var(--primary)' }}>
          <div className="stat-label">Total Projects</div>
          <div className="stat-value">{projects.length}</div>
        </div>
        <div className="stat-card" style={{ borderTop: '2px solid var(--success)' }}>
          <div className="stat-label">Open</div>
          <div className="stat-value">{projects.filter(p => p.status === 'Available').length}</div>
        </div>
        <div className="stat-card" style={{ borderTop: '2px solid var(--warning)' }}>
          <div className="stat-label">In Progress</div>
          <div className="stat-value">{projects.filter(p => p.status === 'Assigned').length}</div>
        </div>
        <div className="stat-card" style={{ borderTop: '2px solid var(--accent)' }}>
          <div className="stat-label">Completed</div>
          <div className="stat-value">{projects.filter(p => p.status === 'Completed').length}</div>
        </div>
      </div>

      <h2 style={{ marginBottom: 'var(--space-4)' }}>My Projects</h2>

      {/* Filter Tabs */}
      <div className="filter-tabs" style={{ marginBottom: 'var(--space-6)' }}>
        {[
          { label: 'All', value: 'all' },
          { label: 'Open', value: 'open' },
          { label: 'In Progress', value: 'active' },
          { label: 'Completed', value: 'done' },
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
          {[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: 140, borderRadius: 14 }} />)}
        </div>
      ) : displayProjects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📂</div>
          <p className="empty-state-title">No projects yet</p>
          <p className="empty-state-desc">Post your first project and start receiving proposals from talented freelancers.</p>
          <button className="btn btn-primary" onClick={() => navigate('/new-project')}>
            + Post a Project
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {displayProjects.map(project => (
            <div
              key={project._id}
              className="card card-clickable"
              onClick={() => navigate(`/client-project/${project._id}`)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-4)' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ marginBottom: 'var(--space-1)' }}>{project.title}</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 'var(--space-2)' }}>
                    Posted {project.postedDate ? new Date(project.postedDate).toLocaleDateString() : 'N/A'}
                  </p>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {project.description}
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 'var(--space-2)', flexShrink: 0 }}>
                  {getStatusBadge(project.status)}
                  <span style={{ fontWeight: 700, color: 'var(--success)', fontSize: '1.0625rem' }}>
                    ₹{project.budget?.toLocaleString()}
                  </span>
                  {project.bids?.length > 0 && (
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                      {project.bids.length} bids
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Client;