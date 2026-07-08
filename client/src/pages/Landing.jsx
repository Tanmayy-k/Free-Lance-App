import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

const CATEGORIES = [
  { icon: '💻', title: 'Web Development', count: '1,240+ gigs' },
  { icon: '🎨', title: 'UI/UX Design', count: '890+ gigs' },
  { icon: '📱', title: 'Mobile Apps', count: '640+ gigs' },
  { icon: '✍️', title: 'Content Writing', count: '1,120+ gigs' },
  { icon: '📊', title: 'Data Science', count: '430+ gigs' },
  { icon: '🎬', title: 'Video Editing', count: '520+ gigs' },
  { icon: '📣', title: 'Digital Marketing', count: '780+ gigs' },
  { icon: '🔐', title: 'Cybersecurity', count: '290+ gigs' },
];

const FREELANCERS = [
  { name: 'Arjun Sharma', role: 'Full Stack Developer', rating: 4.9, projects: 48, skills: ['React', 'Node.js', 'MongoDB'], avatar: 'A' },
  { name: 'Priya Patel', role: 'UI/UX Designer', rating: 4.8, projects: 63, skills: ['Figma', 'Adobe XD', 'CSS'], avatar: 'P' },
  { name: 'Rahul Gupta', role: 'Data Scientist', rating: 4.9, projects: 31, skills: ['Python', 'TensorFlow', 'SQL'], avatar: 'R' },
  { name: 'Sneha Iyer', role: 'Content Strategist', rating: 4.7, projects: 95, skills: ['SEO', 'Copywriting', 'Strategy'], avatar: 'S' },
];

const TESTIMONIALS = [
  {
    quote: 'NextGig transformed how we hire. Found an amazing developer within 24 hours who delivered beyond our expectations.',
    name: 'Vikram Mehta',
    role: 'CTO, TechStart India',
    avatar: 'V',
  },
  {
    quote: 'As a freelancer, NextGig gave me the visibility I needed. My income tripled in the first three months on the platform.',
    name: 'Ananya Bose',
    role: 'Freelance Designer',
    avatar: 'A',
  },
  {
    quote: 'The bidding system is transparent and fair. We always get proposals from genuinely skilled professionals.',
    name: 'Rohan Kapoor',
    role: 'Product Manager, GrowthLabs',
    avatar: 'R',
  },
];

const FAQ = [
  {
    q: 'How does NextGig work?',
    a: 'Clients post projects with a budget and required skills. Freelancers browse and submit proposals. Clients review bids and hire the best fit. Payments are released upon project completion.',
  },
  {
    q: 'Is it free to sign up?',
    a: 'Yes! Creating an account on NextGig is completely free for both clients and freelancers. We only charge a small platform fee upon successful project completion.',
  },
  {
    q: 'How are freelancers verified?',
    a: 'Freelancers build their profiles with skills and project history. Ratings and reviews from completed projects help clients make informed decisions.',
  },
  {
    q: 'What happens if I am not satisfied with the work?',
    a: 'Clients have the ability to review and either approve or request revisions on submitted work before officially completing a project.',
  },
  {
    q: 'Can I chat with the freelancer before hiring?',
    a: 'Once a freelancer is assigned to your project, a real-time chat channel opens between you and the freelancer for seamless communication.',
  },
];

const AnimatedCounter = ({ end, suffix = '' }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 1800;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [end]);
  return <span>{count.toLocaleString()}{suffix}</span>;
};

const Landing = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const usertype = localStorage.getItem('usertype');
    if (usertype === 'freelancer') navigate('/freelancer');
    else if (usertype === 'client') navigate('/client');
    else if (usertype === 'admin') navigate('/admin');
  }, [navigate]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    const el = document.getElementById('stats-section');
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing">
      {/* ── Hero ── */}
      <section className="landing-hero">
        <div className="landing-hero-bg" aria-hidden="true">
          <div className="hero-blob hero-blob-1" />
          <div className="hero-blob hero-blob-2" />
          <div className="hero-grid" />
        </div>
        <nav className="landing-nav">
          <div className="landing-nav-logo">
            <span className="landing-logo-mark">N</span>
            <span className="landing-logo-text">NextGig</span>
          </div>
          <div className="landing-nav-actions">
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/authenticate')}>
              Sign In
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/authenticate')}>
              Get Started Free
            </button>
          </div>
        </nav>

        <div className="landing-hero-content">
          <div className="landing-hero-badge">
            <span className="badge-dot" />
            <span>Trusted by 500+ freelancers worldwide</span>
          </div>
          <h1 className="landing-hero-title">
            Find World-Class<br />
            <span className="gradient-text">Freelance Talent</span>
          </h1>
          <p className="landing-hero-desc">
            Connect with top-rated freelancers for your projects. Post a gig, receive competitive bids,
            and get exceptional work delivered — all on one platform.
          </p>
          <div className="landing-hero-cta">
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/authenticate')}>
              🚀 Start Hiring Today
            </button>
            <button className="btn btn-secondary btn-lg" onClick={() => navigate('/authenticate')}>
              Explore as Freelancer
            </button>
          </div>
          <div className="landing-hero-proof">
            <div className="proof-avatars">
              {['A','P','R','S','V'].map((l, i) => (
                <div key={i} className="proof-avatar" style={{ zIndex: 5 - i }}>{l}</div>
              ))}
            </div>
            <span>Join <strong>500+</strong> active freelancers this month</span>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section id="stats-section" className="landing-stats">
        <div className="landing-container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-num">
                {statsVisible ? <AnimatedCounter end={500} suffix="+" /> : '0+'}
              </div>
              <div className="stat-desc">Active Freelancers</div>
            </div>
            <div className="stat-item">
              <div className="stat-num">
                {statsVisible ? <AnimatedCounter end={1200} suffix="+" /> : '0+'}
              </div>
              <div className="stat-desc">Projects Completed</div>
            </div>
            <div className="stat-item">
              <div className="stat-num">
                {statsVisible ? <AnimatedCounter end={2} suffix="M+" /> : '0M+'}
              </div>
              <div className="stat-desc">Paid to Freelancers</div>
            </div>
            <div className="stat-item">
              <div className="stat-num">
                {statsVisible ? <AnimatedCounter end={98} suffix="%" /> : '0%'}
              </div>
              <div className="stat-desc">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="landing-section">
        <div className="landing-container">
          <div className="section-header">
            <span className="section-label">Simple Process</span>
            <h2>How NextGig Works</h2>
            <p>From posting to completion — everything in three simple steps</p>
          </div>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-num">01</div>
              <div className="step-icon">📋</div>
              <h3>Post Your Project</h3>
              <p>Describe what you need, set your budget, and list required skills. It takes under 2 minutes.</p>
            </div>
            <div className="step-connector" />
            <div className="step-card">
              <div className="step-num">02</div>
              <div className="step-icon">🤝</div>
              <h3>Receive Proposals</h3>
              <p>Qualified freelancers submit competitive bids. Review their profiles, skills, and proposals.</p>
            </div>
            <div className="step-connector" />
            <div className="step-card">
              <div className="step-num">03</div>
              <div className="step-icon">✅</div>
              <h3>Get It Done</h3>
              <p>Hire your ideal freelancer, collaborate via chat, review deliverables, and approve completion.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="landing-section landing-section--dark">
        <div className="landing-container">
          <div className="section-header">
            <span className="section-label">Explore</span>
            <h2>Popular Categories</h2>
            <p>Find talent across every discipline your project demands</p>
          </div>
          <div className="categories-grid">
            {CATEGORIES.map((cat, i) => (
              <div key={i} className="category-card" onClick={() => navigate('/authenticate')}>
                <div className="category-icon">{cat.icon}</div>
                <div className="category-info">
                  <h4>{cat.title}</h4>
                  <span className="category-count">{cat.count}</span>
                </div>
                <span className="category-arrow">→</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Freelancers ── */}
      <section className="landing-section">
        <div className="landing-container">
          <div className="section-header">
            <span className="section-label">Top Talent</span>
            <h2>Featured Freelancers</h2>
            <p>Work with the best in the business</p>
          </div>
          <div className="freelancers-grid">
            {FREELANCERS.map((f, i) => (
              <div key={i} className="freelancer-card">
                <div className="freelancer-card-header">
                  <div className="freelancer-avatar">{f.avatar}</div>
                  <div>
                    <h4 className="freelancer-name">{f.name}</h4>
                    <p className="freelancer-role">{f.role}</p>
                  </div>
                </div>
                <div className="freelancer-stats">
                  <span>⭐ {f.rating}</span>
                  <span>·</span>
                  <span>{f.projects} projects</span>
                </div>
                <div className="freelancer-skills">
                  {f.skills.map(s => <span key={s} className="skill-tag">{s}</span>)}
                </div>
                <button className="btn btn-outline btn-sm" onClick={() => navigate('/authenticate')}>
                  View Profile
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="landing-section landing-section--dark">
        <div className="landing-container">
          <div className="section-header">
            <span className="section-label">What People Say</span>
            <h2>Loved by Clients & Freelancers</h2>
          </div>
          <div className="testimonials-grid">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="testimonial-card">
                <div className="testimonial-quote">"</div>
                <p className="testimonial-text">{t.quote}</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.avatar}</div>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="landing-section">
        <div className="landing-container">
          <div className="section-header">
            <span className="section-label">FAQ</span>
            <h2>Frequently Asked Questions</h2>
          </div>
          <div className="faq-list">
            {FAQ.map((item, i) => (
              <div key={i} className={`faq-item${openFaq === i ? ' faq-item--open' : ''}`}>
                <button className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span>{item.q}</span>
                  <span className="faq-chevron">{openFaq === i ? '−' : '+'}</span>
                </button>
                <div className="faq-answer">
                  <p>{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="landing-cta-banner">
        <div className="landing-container">
          <div className="cta-banner-content">
            <h2>Ready to get started?</h2>
            <p>Join thousands of clients and freelancers already using NextGig to build amazing things.</p>
            <div className="cta-banner-btns">
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/authenticate')}>
                Create Free Account
              </button>
              <button className="btn btn-secondary btn-lg" onClick={() => navigate('/authenticate')}>
                Browse Projects
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="landing-footer">
        <div className="landing-container">
          <div className="footer-top">
            <div className="footer-brand">
              <div className="landing-nav-logo">
                <span className="landing-logo-mark">N</span>
                <span className="landing-logo-text">NextGig</span>
              </div>
              <p className="footer-tagline">Connecting world-class talent with ambitious projects.</p>
            </div>
            <div className="footer-links-group">
              <h5>Platform</h5>
              <a href="/authenticate">Find Freelancers</a>
              <a href="/authenticate">Post a Project</a>
              <a href="/authenticate">How It Works</a>
            </div>
            <div className="footer-links-group">
              <h5>For Freelancers</h5>
              <a href="/authenticate">Find Projects</a>
              <a href="/authenticate">Build Profile</a>
              <a href="/authenticate">Get Paid</a>
            </div>
            <div className="footer-links-group">
              <h5>Company</h5>
              <a href="/">About</a>
              <a href="/">Blog</a>
              <a href="/">Contact</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2024 NextGig. All rights reserved.</p>
            <div className="footer-legal">
              <a href="/">Privacy Policy</a>
              <a href="/">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;