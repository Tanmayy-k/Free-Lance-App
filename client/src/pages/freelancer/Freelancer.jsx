import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api';
import '../../styles/freelancer/freelancer.css';

const Freelancer = () => {
  const navigate = useNavigate();
  const [freelancerData, setFreelancerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [updateSkills, setUpdateSkills] = useState('');
  const [updateDescription, setUpdateDescription] = useState('');
  const [updateMsg, setUpdateMsg] = useState('');
  const [applicationsCount, setApplicationsCount] = useState(0);
  const userId = localStorage.getItem('userId');
  const username = localStorage.getItem('username');

  useEffect(() => {
    fetchUserData(userId);
    fetchApplications();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const fetchUserData = async (id) => {
    setLoading(true);
    try {
      const res = await API.get(`/fetch-freelancer/${id}`);
      setFreelancerData(res.data);
      setUpdateSkills(res.data?.skills?.join(', ') || '');
      setUpdateDescription(res.data?.description || '');
    } catch (err) {
      /* silently handled */
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await API.get('/fetch-applications');
      const mine = res.data.filter(a => a.freelancerId === userId);
      setApplicationsCount(mine.length);
    } catch (err) { /* silent */ }
  };

  const updateUserData = async () => {
    try {
      await API.post('/update-freelancer', {
        freelancerId: freelancerData._id,
        updateSkills,
        description: updateDescription,
      });
      setUpdateMsg('Profile updated successfully!');
      fetchUserData(userId);
      setTimeout(() => { setIsEditing(false); setUpdateMsg(''); }, 1200);
    } catch (err) {
      setUpdateMsg('Update failed. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="freelancer-skeleton">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 120, borderRadius: 14 }} />
          ))}
        </div>
      </div>
    );
  }

  const skills = freelancerData?.skills || [];
  const currentProjects = freelancerData?.currentProjects?.length || 0;
  const completedProjects = freelancerData?.completedProjects?.length || 0;
  const funds = freelancerData?.funds || 0;
  const description = freelancerData?.description || '';

  return (
    <div className="page-container animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div className="freelancer-header-row">
          <div className="freelancer-avatar-large">
            {username ? username[0].toUpperCase() : 'F'}
          </div>
          <div>
            <h1 className="page-title">Hey, {username || 'Freelancer'} 👋</h1>
            <p className="page-subtitle">Here's an overview of your freelancing activity</p>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid-4" style={{ marginBottom: 'var(--space-8)' }}>
        <div className="stat-card" style={{ borderTop: '2px solid var(--primary)' }}>
          <div className="stat-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>⚡</div>
          <div className="stat-label">Active Projects</div>
          <div className="stat-value">{currentProjects}</div>
          <button className="btn btn-sm btn-outline" onClick={() => navigate('/my-projects')}>View →</button>
        </div>

        <div className="stat-card" style={{ borderTop: '2px solid var(--success)' }}>
          <div className="stat-icon" style={{ background: 'var(--success-light)', color: 'var(--success)' }}>✅</div>
          <div className="stat-label">Completed</div>
          <div className="stat-value">{completedProjects}</div>
          <button className="btn btn-sm btn-outline" onClick={() => navigate('/my-projects')}>View →</button>
        </div>

        <div className="stat-card" style={{ borderTop: '2px solid var(--accent)' }}>
          <div className="stat-icon" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>📋</div>
          <div className="stat-label">Applications</div>
          <div className="stat-value">{applicationsCount}</div>
          <button className="btn btn-sm btn-outline" onClick={() => navigate('/myApplications')}>View →</button>
        </div>

        <div className="stat-card" style={{ borderTop: '2px solid var(--warning)' }}>
          <div className="stat-icon" style={{ background: 'var(--warning-light)', color: 'var(--warning)' }}>💰</div>
          <div className="stat-label">Total Earnings</div>
          <div className="stat-value" style={{ fontSize: '1.5rem' }}>₹{funds.toLocaleString()}</div>
        </div>
      </div>

      {/* Profile Panel */}
      <div className="freelancer-profile-panel">
        <div className="freelancer-profile-header">
          <h3>My Profile</h3>
          {!isEditing && (
            <button className="btn btn-secondary btn-sm" onClick={() => setIsEditing(true)}>
              ✏️ Edit Profile
            </button>
          )}
        </div>

        {!isEditing ? (
          <div className="freelancer-profile-view">
            <div>
              <p className="form-label" style={{ marginBottom: 'var(--space-3)' }}>Skills</p>
              {skills.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                  {skills.map(skill => (
                    <span key={skill} className="skill-tag">{skill}</span>
                  ))}
                </div>
              ) : (
                <div className="empty-state" style={{ padding: 'var(--space-6)' }}>
                  <p className="empty-state-desc">No skills added yet. Edit your profile to add skills.</p>
                </div>
              )}
            </div>

            <div className="divider" />

            <div>
              <p className="form-label" style={{ marginBottom: 'var(--space-3)' }}>Bio / Description</p>
              {description ? (
                <p style={{ lineHeight: 1.7, color: 'var(--text-secondary)' }}>{description}</p>
              ) : (
                <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  No description added. Tell clients what makes you great!
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="freelancer-profile-edit">
            {updateMsg && (
              <div className={updateMsg.includes('successfully') ? 'success-message' : 'error-message'}>
                {updateMsg}
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="skills-input">
                Skills <span style={{ color: 'var(--text-muted)' }}>(comma-separated)</span>
              </label>
              <input
                type="text"
                id="skills-input"
                className="form-input"
                placeholder="React, Node.js, Python..."
                value={updateSkills}
                onChange={(e) => setUpdateSkills(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="desc-textarea">About You</label>
              <textarea
                id="desc-textarea"
                className="form-input form-textarea"
                rows={5}
                placeholder="Tell clients about your experience, expertise, and what you love to work on..."
                value={updateDescription}
                onChange={(e) => setUpdateDescription(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <button className="btn btn-primary" onClick={updateUserData}>Save Changes</button>
              <button className="btn btn-secondary" onClick={() => { setIsEditing(false); setUpdateMsg(''); }}>Cancel</button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="freelancer-quick-actions">
        <h3>Quick Actions</h3>
        <div className="grid-3" style={{ marginTop: 'var(--space-4)' }}>
          <div className="card card-clickable" onClick={() => navigate('/all-projects')}>
            <div style={{ fontSize: '1.75rem', marginBottom: 'var(--space-3)' }}>🔍</div>
            <h4>Browse Projects</h4>
            <p style={{ fontSize: '0.875rem', marginTop: 'var(--space-2)' }}>Find new opportunities matching your skills</p>
          </div>
          <div className="card card-clickable" onClick={() => navigate('/myApplications')}>
            <div style={{ fontSize: '1.75rem', marginBottom: 'var(--space-3)' }}>📨</div>
            <h4>My Applications</h4>
            <p style={{ fontSize: '0.875rem', marginTop: 'var(--space-2)' }}>Track the status of your proposals</p>
          </div>
          <div className="card card-clickable" onClick={() => navigate('/my-projects')}>
            <div style={{ fontSize: '1.75rem', marginBottom: 'var(--space-3)' }}>💼</div>
            <h4>Active Work</h4>
            <p style={{ fontSize: '0.875rem', marginTop: 'var(--space-2)' }}>Manage your ongoing projects</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Freelancer;