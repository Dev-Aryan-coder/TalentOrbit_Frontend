import React, { useState, useEffect } from 'react';
import { portfolioAPI } from '../../services/api';
import {
  FolderGit2,
  ExternalLink,
  ShieldCheck,
  Plus,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import './StudentPortfolioTab.css';

export default function StudentPortfolioTab({ currentUser }) {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fileOrLink: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState({});

  const userId = currentUser?.id || currentUser?.userId;

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    portfolioAPI.getByUser(userId)
      .then((res) => {
        if (Array.isArray(res)) {
          setProjects(res);
        }
      })
      .catch((err) => {
        console.warn('Could not load portfolio from database:', err.message);
        setProjects([]);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  const handleAddProject = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || isSubmitting) return;
    setIsSubmitting(true);

    const payload = {
      studentUserId: userId,
      itemType: 'PROJECT',
      title: formData.title.trim(),
      description: formData.description.trim(),
      fileUrl: formData.fileOrLink.trim(),
    };

    try {
      const created = await portfolioAPI.addItem(payload);
      setProjects((prev) => [created, ...prev]);
      setFormData({ title: '', description: '', fileOrLink: '' });
      setShowAddForm(false);
    } catch (err) {
      console.error('Could not add portfolio item to backend:', err.message);
      alert(err.message || 'Failed to add project to database. Please ensure backend is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async (projectId) => {
    setVerifyStatus((prev) => ({ ...prev, [projectId]: 'verifying' }));
    try {
      await portfolioAPI.verifyItem(projectId);
      setVerifyStatus((prev) => ({ ...prev, [projectId]: 'verified' }));
      setProjects((prev) =>
        prev.map((p) =>
          p.id === projectId ? { ...p, isVerified: true, verifiedFlag: true } : p
        )
      );
    } catch (err) {
      console.error('Could not verify item via backend:', err.message);
      setVerifyStatus((prev) => ({ ...prev, [projectId]: 'error' }));
    }
  };

  return (
    <div className="student-portfolio-container">
      <div className="portfolio-header-row">
        <div>
          <h2 className="portfolio-header-title">Engineering Showcase & Digital Repositories</h2>
          <p className="portfolio-header-desc">
            Production git repositories, technical architecture diagrams, and verified code projects.
          </p>
        </div>

        <button
          type="button"
          className="portfolio-add-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <Plus size={16} />
          <span>{showAddForm ? 'Cancel' : 'Add Repository / Project'}</span>
        </button>
      </div>

      {/* Add Project Drawer */}
      {showAddForm && (
        <form onSubmit={handleAddProject} className="portfolio-form-card">
          <h3 className="portfolio-form-title">Link Production Project</h3>
          <div className="portfolio-form-grid">
            <div>
              <label className="portfolio-input-lbl">Project Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Distributed Consensus Engine"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="portfolio-input"
              />
            </div>

            <div>
              <label className="portfolio-input-lbl">Repository or Deployment URL</label>
              <input
                type="url"
                placeholder="https://github.com/user/repository"
                value={formData.fileOrLink}
                onChange={(e) => setFormData({ ...formData, fileOrLink: e.target.value })}
                className="portfolio-input"
              />
            </div>

            <div className="full-width">
              <label className="portfolio-input-lbl">Technical Architecture & Stack Description</label>
              <textarea
                rows={3}
                placeholder="Explain the design decisions, concurrency models, databases, and containerization used..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="portfolio-textarea"
              />
            </div>
          </div>

          <div className="portfolio-form-footer">
            <button
              type="submit"
              disabled={isSubmitting}
              className="quiz-primary-btn"
            >
              {isSubmitting ? 'Linking...' : 'Save to Portfolio'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-500">
          <RefreshCw size={28} className="animate-spin text-indigo-500 mb-3" />
          <p className="text-sm font-medium">Fetching portfolio from database...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
          <AlertTriangle size={36} className="text-amber-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">No Projects in Digital Portfolio</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-5">
            Add your GitHub repositories, full-stack microservices, and technical projects to showcase empirical evidence to corporate recruiters.
          </p>
          <button
            type="button"
            className="quiz-primary-btn inline-flex items-center gap-2"
            onClick={() => setShowAddForm(true)}
          >
            <Plus size={16} />
            <span>Add Your First Project</span>
          </button>
        </div>
      ) : (
        <div className="portfolio-projects-grid">
          {projects.map((proj) => {
            const isVerified = proj.isVerified || proj.verifiedFlag;
            const url = proj.fileOrLink || proj.fileUrl;

            return (
              <div key={proj.id} className="portfolio-project-card">
                <div>
                  <div className="portfolio-card-top">
                    <div className="portfolio-icon-wrap">
                      <FolderGit2 size={20} className="text-indigo-600" />
                    </div>
                    {isVerified ? (
                      <span className="portfolio-verified-badge verified">
                        <ShieldCheck size={12} />
                        <span>Peer Verified</span>
                      </span>
                    ) : (
                      <span className="portfolio-verified-badge pending">
                        <span>Self-Linked</span>
                      </span>
                    )}
                  </div>

                  <h3 className="portfolio-proj-title">{proj.title}</h3>
                  <p className="portfolio-proj-desc">{proj.description}</p>
                </div>

                <div className="portfolio-card-footer mt-4">
                  {url ? (
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="portfolio-link-btn"
                    >
                      <span>Repository</span>
                      <ExternalLink size={12} />
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400">Documentation only</span>
                  )}

                  {!isVerified && (
                    <button
                      type="button"
                      onClick={() => handleVerify(proj.id)}
                      disabled={verifyStatus[proj.id] === 'verifying'}
                      className="portfolio-verify-btn"
                    >
                      {verifyStatus[proj.id] === 'verifying' ? 'Verifying...' : 'Request Verification'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
