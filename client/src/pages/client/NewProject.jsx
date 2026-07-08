import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api';

const NewProject = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [skills, setSkills] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !budget || !skills) {
      setError('All fields are required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await API.post('/new-project', {
        title, description, budget, skills,
        clientId: localStorage.getItem('userId'),
        clientName: localStorage.getItem('username'),
        clientEmail: localStorage.getItem('email'),
      });
      navigate('/client');
    } catch (err) {
      setError('Failed to post project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container animate-fade-in">
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <div className="page-header">
          <button
            className="btn btn-secondary btn-sm"
            style={{ marginBottom: 'var(--space-4)' }}
            onClick={() => navigate('/client')}
          >
            ← Back to Dashboard
          </button>
          <h1 className="page-title">Post a New Project</h1>
          <p className="page-subtitle">Fill in the details to start receiving proposals from qualified freelancers</p>
        </div>

        <div className="card" style={{ padding: 'var(--space-8)' }}>
          {error && (
            <div className="error-message" style={{ marginBottom: 'var(--space-5)' }}>
              ⚠ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="project-title">Project Title</label>
              <input
                type="text"
                id="project-title"
                className="form-input"
                placeholder="e.g. Build a responsive e-commerce website"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="project-desc">
                Description
                <span style={{ color: 'var(--text-muted)', marginLeft: 'var(--space-2)' }}>
                  (Be as detailed as possible)
                </span>
              </label>
              <textarea
                id="project-desc"
                className="form-input form-textarea"
                rows={6}
                placeholder="Describe the project scope, deliverables, timeline expectations, and any specific requirements..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="project-budget">Budget (₹)</label>
                <input
                  type="number"
                  id="project-budget"
                  className="form-input"
                  placeholder="e.g. 25000"
                  value={budget}
                  onChange={e => setBudget(e.target.value)}
                  required
                  min="1"
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="project-skills">
                  Required Skills
                  <span style={{ color: 'var(--text-muted)', marginLeft: 'var(--space-1)' }}>(comma-separated)</span>
                </label>
                <input
                  type="text"
                  id="project-skills"
                  className="form-input"
                  placeholder="React, Node.js, MongoDB"
                  value={skills}
                  onChange={e => setSkills(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Skill preview */}
            {skills && (
              <div style={{ marginTop: '-var(--space-2)', marginBottom: 'var(--space-5)', display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                {skills.split(',').map(s => s.trim()).filter(Boolean).map(s => (
                  <span key={s} className="skill-tag">{s}</span>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', gap: 'var(--space-3)', paddingTop: 'var(--space-4)' }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <><span className="spinner" /> Posting...</> : '🚀 Post Project'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/client')}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewProject;