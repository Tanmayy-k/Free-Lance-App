import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api';

const Admin = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ projects: 0, completed: 0, applications: 0, users: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [proRes, appRes, userRes] = await Promise.all([
          API.get('/fetch-projects'),
          API.get('/fetch-applications'),
          API.get('/fetch-users'),
        ]);
        setStats({
          projects: proRes.data.length,
          completed: proRes.data.filter(p => p.status === 'Completed').length,
          applications: appRes.data.length,
          users: userRes.data.length,
        });
      } catch (err) { /* silent */ }
      finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  const cards = [
    { label: 'Total Projects', value: stats.projects, icon: '📁', color: 'var(--primary)', light: 'var(--primary-light)', path: '/admin-projects' },
    { label: 'Completed', value: stats.completed, icon: '✅', color: 'var(--success)', light: 'var(--success-light)', path: '/admin-projects' },
    { label: 'Applications', value: stats.applications, icon: '📋', color: 'var(--accent)', light: 'var(--accent-light)', path: '/admin-applications' },
    { label: 'Total Users', value: stats.users, icon: '👥', color: 'var(--warning)', light: 'var(--warning-light)', path: '/all-users' },
  ];

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Admin Overview</h1>
        <p className="page-subtitle">Platform-wide statistics and management</p>
      </div>

      {/* Stat Cards */}
      <div className="grid-4" style={{ marginBottom: 'var(--space-10)' }}>
        {cards.map(card => (
          <div
            key={card.label}
            className="stat-card"
            style={{ borderTop: `2px solid ${card.color}`, cursor: 'pointer' }}
            onClick={() => navigate(card.path)}
          >
            <div className="stat-icon" style={{ background: card.light, color: card.color, fontSize: '1.25rem' }}>
              {card.icon}
            </div>
            <div className="stat-label">{card.label}</div>
            <div className="stat-value">
              {loading ? <div className="skeleton" style={{ height: 32, width: 60, borderRadius: 8 }} /> : card.value}
            </div>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Click to view →</span>
          </div>
        ))}
      </div>

      {/* Quick Navigation */}
      <h2 style={{ marginBottom: 'var(--space-4)' }}>Quick Actions</h2>
      <div className="grid-2" style={{ maxWidth: 640 }}>
        <div className="card card-clickable" onClick={() => navigate('/admin-projects')}>
          <div style={{ fontSize: '1.5rem', marginBottom: 'var(--space-3)' }}>📁</div>
          <h3>Manage Projects</h3>
          <p style={{ fontSize: '0.875rem', marginTop: 'var(--space-2)' }}>View all projects, their status and details</p>
        </div>
        <div className="card card-clickable" onClick={() => navigate('/all-users')}>
          <div style={{ fontSize: '1.5rem', marginBottom: 'var(--space-3)' }}>👥</div>
          <h3>Manage Users</h3>
          <p style={{ fontSize: '0.875rem', marginTop: 'var(--space-2)' }}>View all registered users and their roles</p>
        </div>
        <div className="card card-clickable" onClick={() => navigate('/admin-applications')}>
          <div style={{ fontSize: '1.5rem', marginBottom: 'var(--space-3)' }}>📋</div>
          <h3>All Applications</h3>
          <p style={{ fontSize: '0.875rem', marginTop: 'var(--space-2)' }}>Review all bids and applications</p>
        </div>
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.05))', border: '1px solid rgba(99,102,241,0.2)' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: 'var(--space-3)' }}>⚡</div>
          <h3 style={{ background: 'var(--gradient-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>NextGig Admin</h3>
          <p style={{ fontSize: '0.875rem', marginTop: 'var(--space-2)' }}>Full platform oversight and control</p>
        </div>
      </div>
    </div>
  );
};

export default Admin;