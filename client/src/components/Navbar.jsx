import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GeneralContext } from '../context/GeneralContext';
import './Navbar.css';

const Navbar = () => {
  const usertype = localStorage.getItem('usertype');
  const username = localStorage.getItem('username');
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useContext(GeneralContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  const freelancerLinks = [
    { label: 'Dashboard', path: '/freelancer' },
    { label: 'Find Work', path: '/all-projects' },
    { label: 'My Projects', path: '/my-projects' },
    { label: 'Applications', path: '/myApplications' },
  ];

  const clientLinks = [
    { label: 'Dashboard', path: '/client' },
    { label: 'Post Project', path: '/new-project' },
    { label: 'Applications', path: '/project-applications' },
  ];

  const adminLinks = [
    { label: 'Overview', path: '/admin' },
    { label: 'Users', path: '/all-users' },
    { label: 'Projects', path: '/admin-projects' },
    { label: 'Applications', path: '/admin-applications' },
  ];

  const links =
    usertype === 'freelancer' ? freelancerLinks :
    usertype === 'client' ? clientLinks :
    usertype === 'admin' ? adminLinks : [];

  if (!usertype) return null;

  return (
    <>
      <nav className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
        <div className="navbar-inner">
          {/* Logo */}
          <button
            className="navbar-logo"
            onClick={() => navigate(usertype === 'freelancer' ? '/freelancer' : usertype === 'client' ? '/client' : '/admin')}
          >
            <span className="navbar-logo-mark">N</span>
            <span className="navbar-logo-text">NextGig</span>
            {usertype === 'admin' && <span className="navbar-role-badge">Admin</span>}
          </button>

          {/* Desktop Links */}
          <div className="navbar-links">
            {links.map((link) => (
              <button
                key={link.path}
                className={`navbar-link${isActive(link.path) ? ' navbar-link--active' : ''}`}
                onClick={() => navigate(link.path)}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right section */}
          <div className="navbar-right">
            <div className="navbar-user">
              <div className="navbar-avatar">{username ? username[0].toUpperCase() : 'U'}</div>
              <span className="navbar-username">{username}</span>
            </div>
            <button className="btn btn-sm btn-secondary navbar-logout" onClick={logout}>
              Logout
            </button>
            {/* Mobile Hamburger */}
            <button
              className={`navbar-hamburger${menuOpen ? ' navbar-hamburger--open' : ''}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className={`navbar-drawer${menuOpen ? ' navbar-drawer--open' : ''}`}>
        <div className="navbar-drawer-inner">
          {links.map((link) => (
            <button
              key={link.path}
              className={`navbar-drawer-link${isActive(link.path) ? ' navbar-drawer-link--active' : ''}`}
              onClick={() => navigate(link.path)}
            >
              {link.label}
            </button>
          ))}
          <div className="navbar-drawer-divider" />
          <button className="navbar-drawer-link navbar-drawer-logout" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
      {menuOpen && <div className="navbar-overlay" onClick={() => setMenuOpen(false)} />}
    </>
  );
};

export default Navbar;