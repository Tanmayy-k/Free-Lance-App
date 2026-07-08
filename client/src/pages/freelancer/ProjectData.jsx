import React, { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../../api';
import { GeneralContext } from '../../context/GeneralContext';
import '../../styles/freelancer/ProjectData.css';

const ProjectData = () => {
  const { socket } = useContext(GeneralContext);
  const { id } = useParams();
  const userId = localStorage.getItem('userId');
  const chatEndRef = useRef(null);

  const [project, setProject] = useState(null);
  const [chats, setChats] = useState(null);
  const [message, setMessage] = useState('');
  const [bidLoading, setBidLoading] = useState(false);
  const [bidMsg, setBidMsg] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitMsg, setSubmitMsg] = useState('');

  const [proposal, setProposal] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [projectLink, setProjectLink] = useState('');
  const [manualLink, setManualLink] = useState('');
  const [submissionDescription, setSubmissionDescription] = useState('');

  useEffect(() => {
    fetchProject(id);
    fetchChats();
    joinSocketRoom();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats]);

  const joinSocketRoom = async () => {
    socket.emit('join-chat-room', { projectId: id, freelancerId: userId });
  };

  const fetchProject = async (pid) => {
    try {
      const res = await API.get(`/fetch-project/${pid}`);
      setProject(res.data);
    } catch (err) { /* silent */ }
  };

  const fetchChats = async () => {
    try {
      const res = await API.get(`/fetch-chats/${id}`);
      setChats(res.data);
    } catch (err) { /* silent */ }
  };

  useEffect(() => {
    socket.on('message-from-user', () => fetchChats());
    return () => socket.off('message-from-user');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  const handleBidding = async (e) => {
    e.preventDefault();
    setBidLoading(true);
    setBidMsg('');
    try {
      await API.post('/make-bid', {
        clientId: project?.clientId,
        freelancerId: userId,
        projectId: id,
        proposal, bidAmount, estimatedTime
      });
      setBidMsg('✅ Bid submitted successfully!');
      setProposal(''); setBidAmount(''); setEstimatedTime('');
      fetchProject(id);
    } catch (err) {
      setBidMsg('❌ Bidding failed. Please try again.');
    } finally { setBidLoading(false); }
  };

  const handleProjectSubmission = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitMsg('');
    try {
      await API.post('/submit-project', {
        clientId: project?.clientId,
        freelancerId: userId,
        projectId: id,
        projectLink, manualLink, submissionDescription
      });
      setSubmitMsg('✅ Project submitted successfully!');
      setProjectLink(''); setManualLink(''); setSubmissionDescription('');
      fetchProject(id);
    } catch (err) {
      setSubmitMsg('❌ Submission failed. Please try again.');
    } finally { setSubmitLoading(false); }
  };

  const handleMessageSend = (e) => {
    e?.preventDefault();
    if (!message.trim()) return;
    socket.emit('new-message', { projectId: id, senderId: userId, message, time: new Date() });
    setMessage('');
    fetchChats();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleMessageSend(); }
  };

  const isAssignedToMe = project?.freelancerId === userId;
  const alreadyBidded = project?.bids?.includes(userId);

  if (!project) {
    return (
      <div className="page-container">
        <div className="skeleton" style={{ height: 400, borderRadius: 14 }} />
      </div>
    );
  }

  return (
    <div className="project-data-page animate-fade-in">
      {/* Main Panel */}
      <div className="project-data-left">
        {/* Project Info */}
        <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
            <h2 style={{ fontSize: '1.375rem' }}>{project.title}</h2>
            {project.status === 'Available' && <span className="badge badge-success">Open for Bids</span>}
            {project.status === 'Assigned' && <span className="badge badge-warning">In Progress</span>}
            {project.status === 'Completed' && <span className="badge badge-muted">Completed</span>}
          </div>

          <p style={{ lineHeight: 1.7, marginBottom: 'var(--space-5)' }}>{project.description}</p>

          <div style={{ display: 'flex', gap: 'var(--space-8)', flexWrap: 'wrap' }}>
            <div>
              <p className="form-label" style={{ marginBottom: 'var(--space-2)' }}>Budget</p>
              <p style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--success)' }}>
                ₹{project.budget?.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="form-label" style={{ marginBottom: 'var(--space-2)' }}>Bids</p>
              <p style={{ fontSize: '1.375rem', fontWeight: 700 }}>{project.bids?.length || 0}</p>
            </div>
            <div>
              <p className="form-label" style={{ marginBottom: 'var(--space-2)' }}>Client</p>
              <p style={{ fontWeight: 600 }}>{project.clientName}</p>
            </div>
          </div>

          {project.skills?.length > 0 && (
            <div style={{ marginTop: 'var(--space-5)' }}>
              <p className="form-label" style={{ marginBottom: 'var(--space-2)' }}>Required Skills</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                {project.skills.map(s => <span key={s} className="skill-tag">{s}</span>)}
              </div>
            </div>
          )}
        </div>

        {/* Bid Form */}
        {project.status === 'Available' && !isAssignedToMe && (
          <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
            <h3 style={{ marginBottom: 'var(--space-5)' }}>Send a Proposal</h3>

            {bidMsg && (
              <div className={bidMsg.startsWith('✅') ? 'success-message' : 'error-message'} style={{ marginBottom: 'var(--space-4)' }}>
                {bidMsg}
              </div>
            )}

            {alreadyBidded ? (
              <div className="success-message">
                ✅ You have already submitted a bid for this project.
              </div>
            ) : (
              <form onSubmit={handleBidding}>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Your Bid Amount (₹)</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="e.g. 15000"
                      value={bidAmount}
                      onChange={e => setBidAmount(e.target.value)}
                      required
                      min="1"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Estimated Time (days)</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="e.g. 7"
                      value={estimatedTime}
                      onChange={e => setEstimatedTime(e.target.value)}
                      required
                      min="1"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Cover Letter / Proposal</label>
                  <textarea
                    className="form-input form-textarea"
                    rows={5}
                    placeholder="Explain why you're the best fit for this project..."
                    value={proposal}
                    onChange={e => setProposal(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary" disabled={bidLoading}>
                  {bidLoading ? <><span className="spinner" /> Submitting...</> : '🚀 Submit Proposal'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Submission Form */}
        {isAssignedToMe && !project.submissionAccepted && (
          <div className="card">
            <h3 style={{ marginBottom: 'var(--space-5)' }}>Submit Your Work</h3>

            {project.submissionAccepted && (
              <div className="success-message">🎉 Project marked as complete!</div>
            )}
            {project.submission && !project.submissionAccepted && (
              <div className="success-message" style={{ marginBottom: 'var(--space-4)' }}>
                ✅ Submission received — awaiting client review.
              </div>
            )}

            {submitMsg && (
              <div className={submitMsg.startsWith('✅') ? 'success-message' : 'error-message'} style={{ marginBottom: 'var(--space-4)' }}>
                {submitMsg}
              </div>
            )}

            {!project.submission && (
              <form onSubmit={handleProjectSubmission}>
                <div className="form-group">
                  <label className="form-label">Project / GitHub Link</label>
                  <input
                    type="url"
                    className="form-input"
                    placeholder="https://github.com/yourproject"
                    value={projectLink}
                    onChange={e => setProjectLink(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Documentation / Manual Link</label>
                  <input
                    type="url"
                    className="form-input"
                    placeholder="https://docs.yourproject.com"
                    value={manualLink}
                    onChange={e => setManualLink(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Describe Your Work</label>
                  <textarea
                    className="form-input form-textarea"
                    rows={4}
                    placeholder="Describe what you built, any key decisions, and how to run/test it..."
                    value={submissionDescription}
                    onChange={e => setSubmissionDescription(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary" disabled={submitLoading}>
                  {submitLoading ? <><span className="spinner" /> Submitting...</> : '📤 Submit Project'}
                </button>
              </form>
            )}
          </div>
        )}

        {isAssignedToMe && project.submissionAccepted && (
          <div className="success-message">🎉 Project successfully completed! Well done.</div>
        )}
      </div>

      {/* Chat Panel */}
      <div className="project-chat-panel">
        <div className="chat-panel-header">
          <h3>💬 Chat with Client</h3>
          {project.freelancerId && <span className="badge badge-success">Connected</span>}
        </div>

        {isAssignedToMe ? (
          <div className="chat-body-wrapper">
            <div className="chat-messages-scroll">
              {chats?.messages?.length > 0 ? (
                chats.messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`chat-message-row${msg.senderId === userId ? ' chat-message-row--me' : ''}`}
                  >
                    <div className={`chat-bubble${msg.senderId === userId ? ' sent' : ' received'}`}>
                      <p>{msg.text}</p>
                    </div>
                    <div className={`chat-time${msg.senderId === userId ? '' : ' received'}`}>
                      {msg.time ? new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state" style={{ padding: 'var(--space-8)' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No messages yet. Say hello! 👋</p>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="chat-input-bar">
              <input
                type="text"
                className="form-input"
                placeholder="Type a message..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button className="btn btn-primary btn-icon" onClick={handleMessageSend} disabled={!message.trim()}>
                →
              </button>
            </div>
          </div>
        ) : (
          <div className="chat-disabled">
            <span>🔒</span>
            <p>Chat is available once you're assigned to this project.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectData;