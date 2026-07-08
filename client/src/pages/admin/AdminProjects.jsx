import React, { useEffect, useState } from 'react';
import API from '../../api';

const getStatusBadge = (status) => {
  if (status === 'Available') return <span className="badge badge-success">Open</span>;
  if (status === 'Assigned') return <span className="badge badge-warning">In Progress</span>;
  if (status === 'Completed') return <span className="badge badge-muted">Completed</span>;
  return <span className="badge badge-muted">{status}</span>;
};

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [displayProjects, setDisplayProjects] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await API.get('/fetch-projects');
      const data = [...res.data].reverse();
      setProjects(data);
      setDisplayProjects(data);

      const skills = [];
      res.data.forEach(p => p.skills?.forEach(s => { if (!skills.includes(s)) skills.push(s); }));
      setAllSkills(skills);
    } catch (err) { /* silent */ }
    finally { setLoading(false); }
  };

  useEffect(() => {
    let filtered = [...projects];
    if (statusFilter !== 'all') {
      filtered = filtered.filter(p =>
        statusFilter === 'open' ? p.status === 'Available' :
        statusFilter === 'active' ? p.status === 'Assigned' :
        p.status === 'Completed'
      );
    }
    if (categoryFilter.length > 0) {
      filtered = filtered.filter(p => categoryFilter.every(s => p.skills?.includes(s)));
    }
    setDisplayProjects(filtered);
  }, [statusFilter, categoryFilter, projects]);

  const handleSkillToggle = (e) => {
    const val = e.target.value;
    if (e.target.checked) setCategoryFilter(prev => [...prev, val]);
    else setCategoryFilter(prev => prev.filter(s => s !== val));
  };

  return (
    <div className="all-projects-layout">
      {/* Sidebar */}
      <aside className="projects-sidebar">
        <div className="sidebar-header"><h3>Filters</h3></div>
        <div className="divider" />
        <div className="sidebar-section">
          <h5 style={{ marginBottom: 'var(--space-3)', color: 'var(--text-secondary)' }}>Status</h5>
          <div className="filter-options">
            {['all', 'open', 'active', 'done'].map(s => (
              <label key={s} className="filter-checkbox">
                <input
                  type="radio"
                  name="status-filter"
                  value={s}
                  checked={statusFilter === s}
                  onChange={e => setStatusFilter(e.target.value)}
                />
                <span>{s === 'all' ? 'All' : s === 'open' ? 'Open' : s === 'active' ? 'In Progress' : 'Completed'}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="divider" />
        <div className="sidebar-section">
          <h5 style={{ marginBottom: 'var(--space-3)', color: 'var(--text-secondary)' }}>Skills</h5>
          <div className="filter-options">
            {allSkills.map(skill => (
              <label key={skill} className="filter-checkbox">
                <input type="checkbox" value={skill} checked={categoryFilter.includes(skill)} onChange={handleSkillToggle} />
                <span>{skill}</span>
              </label>
            ))}
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="projects-main">
        <div className="projects-main-header">
          <div>
            <h2 className="page-title">All Projects</h2>
            <p className="page-subtitle">{displayProjects.length} projects total</p>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 160, borderRadius: 14 }} />)}
          </div>
        ) : displayProjects.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📁</div>
            <p className="empty-state-title">No projects match</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {displayProjects.map(project => (
              <div key={project._id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ marginBottom: 4 }}>{project.title}</h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {project.clientName} · {project.clientEmail} · {project.postedDate ? new Date(project.postedDate).toLocaleDateString() : ''}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--space-2)', flexShrink: 0, alignItems: 'center' }}>
                    {getStatusBadge(project.status)}
                    <span style={{ fontWeight: 700, color: 'var(--success)' }}>₹{project.budget?.toLocaleString()}</span>
                  </div>
                </div>
                <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: 'var(--space-4)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {project.description}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                    {(project.skills || []).slice(0, 4).map(s => <span key={s} className="skill-tag">{s}</span>)}
                    {project.skills?.length > 4 && <span className="badge badge-muted">+{project.skills.length - 4}</span>}
                  </div>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    {project.bids?.length || 0} bids
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminProjects;