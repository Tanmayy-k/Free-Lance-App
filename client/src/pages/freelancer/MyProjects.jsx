import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api';

const getStatusBadge = (status) => {
  if (status === 'Available') return <span className="badge badge-success">Available</span>;
  if (status === 'Assigned') return <span className="badge badge-warning">In Progress</span>;
  if (status === 'Completed') return <span className="badge badge-muted">Completed</span>;
  return <span className="badge badge-muted">{status}</span>;
};

const MyProjects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [displayProjects, setDisplayProjects] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('userId');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await API.get('/fetch-projects');
      const mine = res.data.filter(p => p.freelancerId === userId).reverse();
      setProjects(mine);
      setDisplayProjects(mine);
    } catch (err) { /* silent */ }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (filter === 'all') setDisplayProjects(projects);
    else if (filter === 'active') setDisplayProjects(projects.filter(p => p.status === 'Assigned'));
    else if (filter === 'completed') setDisplayProjects(projects.filter(p => p.status === 'Completed'));
  }, [filter, projects]);

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">My Projects</h1>
        <p className="page-subtitle">Projects assigned to you</p>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs" style={{ marginBottom: 'var(--space-6)' }}>
        {[
          { label: 'All', value: 'all' },
          { label: 'In Progress', value: 'active' },
          { label: 'Completed', value: 'completed' },
        ].map(tab => (
          <button
            key={tab.value}
            className={`filter-tab${filter === tab.value ? ' filter-tab--active' : ''}`}
            onClick={() => setFilter(tab.value)}
          >
            {tab.label}
            <span className="filter-tab-count">
              {tab.value === 'all' ? projects.length
                : tab.value === 'active' ? projects.filter(p => p.status === 'Assigned').length
                : projects.filter(p => p.status === 'Completed').length}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: 140, borderRadius: 14 }} />)}
        </div>
      ) : displayProjects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">💼</div>
          <p className="empty-state-title">No projects here</p>
          <p className="empty-state-desc">
            {filter === 'all'
              ? 'You haven\'t been assigned any projects yet.'
              : `No ${filter === 'active' ? 'active' : 'completed'} projects found.`}
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/all-projects')}>Browse Projects</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {displayProjects.map(project => (
            <div
              key={project._id}
              className="card card-clickable"
              onClick={() => navigate(`/project/${project._id}`)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-4)' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ marginBottom: 'var(--space-1)' }}>{project.title}</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {project.postedDate ? new Date(project.postedDate).toLocaleDateString() : 'N/A'}
                  </span>
                  <p style={{ marginTop: 'var(--space-2)', fontSize: '0.9rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {project.description}
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 'var(--space-2)', flexShrink: 0 }}>
                  {getStatusBadge(project.status)}
                  <span style={{ fontWeight: 700, color: 'var(--success)', fontSize: '1rem' }}>
                    ₹{project.budget?.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProjects;