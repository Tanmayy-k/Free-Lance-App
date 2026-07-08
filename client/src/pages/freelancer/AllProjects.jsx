import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api';
import '../../styles/freelancer/AllProjects.css';

const AllProjects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [displayProjects, setDisplayProjects] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await API.get('/fetch-projects');
      const data = [...res.data].reverse();
      setProjects(data);
      setDisplayProjects(data);

      const skills = [];
      res.data.forEach(p => p.skills.forEach(s => { if (!skills.includes(s)) skills.push(s); }));
      setAllSkills(skills);
    } catch (err) { /* silent */ }
    finally { setLoading(false); }
  };

  useEffect(() => {
    let filtered = [...projects];
    if (categoryFilter.length > 0) {
      filtered = filtered.filter(p => categoryFilter.every(s => p.skills.includes(s)));
    }
    if (search) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    setDisplayProjects(filtered);
  }, [categoryFilter, search, projects]);

  const handleCategoryCheckBox = (e) => {
    const value = e.target.value;
    if (e.target.checked) setCategoryFilter(prev => [...prev, value]);
    else setCategoryFilter(prev => prev.filter(s => s !== value));
  };

  const getStatusBadge = (status) => {
    if (status === 'Available') return <span className="badge badge-success">Available</span>;
    if (status === 'Assigned') return <span className="badge badge-warning">In Progress</span>;
    if (status === 'Completed') return <span className="badge badge-muted">Completed</span>;
    return <span className="badge badge-muted">{status}</span>;
  };

  const avgBid = (project) => {
    if (!project.bidAmounts || project.bidAmounts.length === 0) return 0;
    return Math.round(project.bidAmounts.reduce((a, b) => a + b, 0) / project.bidAmounts.length);
  };

  return (
    <div className="all-projects-layout">
      {/* Sidebar */}
      <aside className="projects-sidebar">
        <div className="sidebar-header">
          <h3>Filters</h3>
          {categoryFilter.length > 0 && (
            <button className="btn btn-sm btn-secondary" onClick={() => setCategoryFilter([])}>
              Clear all
            </button>
          )}
        </div>

        <div className="divider" />

        <div className="sidebar-section">
          <h5 style={{ marginBottom: 'var(--space-3)', color: 'var(--text-secondary)' }}>Skills</h5>
          {allSkills.length > 0 ? (
            <div className="filter-options">
              {allSkills.map(skill => (
                <label key={skill} className="filter-checkbox">
                  <input
                    type="checkbox"
                    value={skill}
                    checked={categoryFilter.includes(skill)}
                    onChange={handleCategoryCheckBox}
                  />
                  <span>{skill}</span>
                </label>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Loading skills...</p>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="projects-main">
        <div className="projects-main-header">
          <div>
            <h2 className="page-title">Browse Projects</h2>
            <p className="page-subtitle">{displayProjects.length} project{displayProjects.length !== 1 ? 's' : ''} available</p>
          </div>
          <input
            type="text"
            className="form-input projects-search"
            placeholder="🔍 Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="projects-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 200, borderRadius: 14 }} />
            ))}
          </div>
        ) : displayProjects.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <p className="empty-state-title">No projects found</p>
            <p className="empty-state-desc">Try adjusting your filters or search query</p>
          </div>
        ) : (
          <div className="projects-list-cards">
            {displayProjects.map(project => (
              <div
                key={project._id}
                className="project-card card card-clickable"
                onClick={() => navigate(`/project/${project._id}`)}
              >
                <div className="project-card-header">
                  <div>
                    <h3 className="project-title">{project.title}</h3>
                    <span className="project-date">{new Date(project.postedDate).toLocaleDateString()}</span>
                  </div>
                  {getStatusBadge(project.status)}
                </div>

                <p className="project-desc">{project.description}</p>

                <div className="project-skills">
                  {(project.skills || []).slice(0, 5).map(s => (
                    <span key={s} className="skill-tag">{s}</span>
                  ))}
                  {project.skills?.length > 5 && (
                    <span className="badge badge-muted">+{project.skills.length - 5}</span>
                  )}
                </div>

                <div className="project-card-footer">
                  <div className="project-budget">
                    <span className="budget-label">Budget</span>
                    <span className="budget-value">₹{project.budget?.toLocaleString()}</span>
                  </div>
                  <div className="project-bids">
                    <span>{project.bids?.length || 0} bids</span>
                    {project.bids?.length > 0 && (
                      <span className="avg-bid">avg ₹{avgBid(project).toLocaleString()}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AllProjects;