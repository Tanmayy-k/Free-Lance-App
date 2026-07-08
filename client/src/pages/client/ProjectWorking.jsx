import React, { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../../api';
import { GeneralContext } from '../../context/GeneralContext';
import '../../styles/freelancer/ProjectData.css';

const ProjectWorking = () => {
  const { socket } = useContext(GeneralContext);
  const { id } = useParams();
  const userId = localStorage.getItem('userId');
  const chatEndRef = useRef(null);

  const [project, setProject] = useState(null);
  const [chats, setChats] = useState(null);
  const [message, setMessage] = useState('');
  const [actionLoading, setActionLoading] = useState('');
  const [actionMsg, setActionMsg] = useState('');

  useEffect(() => {
    fetchProject(id);
    fetchChats();
    socket.emit('join-chat-room-client', { projectId: id });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats]);

  useEffect(() => {
    socket.on('message-from-user', () => fetchChats());
    return () => socket.off('message-from-user');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

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

  const handleApproveSubmission = async () => {
    setActionLoading('approve');
    setActionMsg('');
    try {
      await API.get(`/approve-submission/${id}`);
      setActionMsg('✅ Submission approved! Project marked as complete.');
      fetchProject(id);
    } catch (err) {
      setActionMsg('❌ Action failed. Please try again.');
    } finally { setActionLoading(''); }
  };

  const handleRejectSubmission = async () => {
    setActionLoading('reject');
    setActionMsg('');
    try {
      await API.get(`/reject-submission/${id}`);
      setActionMsg('⚠ Submission rejected. Freelancer can resubmit.');
      fetchProject(id);
    } catch (err) {
      setActionMsg('❌ Action failed.');
    } finally { setActionLoading(''); }
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
            {project.status === 'Assigned' && <span className="badge badge-warning">In Progress</span>}
            {project.status === 'Completed' && <span className="badge badge-success">Completed</span>}
          </div>
          <p style={{ lineHeight: 1.7, marginBottom: 'var(--space-5)' }}>{project.description}</p>

          <div style={{ display: 'flex', gap: 'var(--space-8)', flexWrap: 'wrap' }}>
            <div>
              <p className="form-label" style={{ marginBottom: 4 }}>Budget</p>
              <p style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--success)' }}>
                ₹{project.budget?.toLocaleString()}
              </p>
            </div>
            {project.freelancerName && (
              <div>
                <p className="form-label" style={{ marginBottom: 4 }}>Assigned Freelancer</p>
                <p style={{ fontWeight: 600 }}>{project.freelancerName}</p>
              </div>
            )}
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

        {/* Submission Review */}
        {project.freelancerId && (
          <div className="card">
            <h3 style={{ marginBottom: 'var(--space-5)' }}>📦 Submission</h3>

            {actionMsg && (
              <div className={actionMsg.startsWith('✅') ? 'success-message' : actionMsg.startsWith('⚠') ? 'error-message' : 'error-message'} style={{ marginBottom: 'var(--space-4)', background: actionMsg.startsWith('⚠') ? 'var(--warning-light)' : undefined, color: actionMsg.startsWith('⚠') ? 'var(--warning)' : undefined }}>
                {actionMsg}
              </div>
            )}

            {project.submissionAccepted ? (
              <div className="success-message">🎉 Project successfully completed!</div>
            ) : project.submission ? (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                  <div>
                    <p className="form-label" style={{ marginBottom: 'var(--space-2)' }}>Project Link</p>
                    <a href={project.projectLink} target="_blank" rel="noreferrer" className="submission-link">
                      🔗 {project.projectLink || 'No link provided'}
                    </a>
                  </div>
                  {project.manulaLink && (
                    <div>
                      <p className="form-label" style={{ marginBottom: 'var(--space-2)' }}>Documentation Link</p>
                      <a href={project.manulaLink} target="_blank" rel="noreferrer" className="submission-link">
                        📄 {project.manulaLink}
                      </a>
                    </div>
                  )}
                  <div>
                    <p className="form-label" style={{ marginBottom: 'var(--space-2)' }}>Description</p>
                    <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                      {project.submissionDescription}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-6)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-subtle)' }}>
                  <button className="btn btn-success" onClick={handleApproveSubmission} disabled={actionLoading === 'approve'}>
                    {actionLoading === 'approve' ? <><span className="spinner" /> Processing...</> : '✅ Approve & Complete'}
                  </button>
                  <button className="btn btn-danger" onClick={handleRejectSubmission} disabled={actionLoading === 'reject'}>
                    {actionLoading === 'reject' ? <><span className="spinner" /> Processing...</> : '↩ Request Revision'}
                  </button>
                </div>
              </>
            ) : (
              <div className="empty-state" style={{ padding: 'var(--space-8)' }}>
                <div className="empty-state-icon">⏳</div>
                <p className="empty-state-title">Awaiting Submission</p>
                <p className="empty-state-desc">The freelancer hasn't submitted their work yet.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Chat Panel */}
      <div className="project-chat-panel">
        <div className="chat-panel-header">
          <h3>💬 Chat with Freelancer</h3>
          {project.freelancerId && <span className="badge badge-success">Active</span>}
        </div>

        {project.freelancerId ? (
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
            <p>Chat opens once a freelancer is assigned to this project.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectWorking;