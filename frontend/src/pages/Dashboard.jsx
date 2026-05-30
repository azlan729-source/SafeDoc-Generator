import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDocumentById, fetchDocuments, deleteDocument } from '../services/documentService';
import { getUser } from '../services/authService';
import Button from '../components/Button';
import Card from '../components/Card';
import Spinner from '../components/Spinner';
import { useToast } from '../components/ToastProvider';

const Dashboard = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const user = getUser();
  const [stats, setStats] = useState({ total: 0, hirarc: 0, draft: 0, completed: 0 });
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewLoading, setViewLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [error, setError] = useState('');

  const initials = user?.name
    ? user.name
        .split(' ')
        .map(part => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'SD';

  const loadDocuments = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchDocuments();
      setDocuments(data);
      setStats({
        total: data.length,
        hirarc: data.filter(doc => doc.documentType === 'HIRARC').length,
        draft: data.filter(doc => doc.status === 'draft').length,
        completed: data.filter(doc => doc.status === 'completed').length,
      });
    } catch (err) {
      const message = 'Unable to load document metrics.';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleView = async id => {
    setError('');
    setViewLoading(true);
    try {
      const data = await fetchDocumentById(id);
      setSelectedDocument(data);
    } catch (err) {
      const message = err.response?.data?.error || 'Unable to load document details.';
      setError(message);
      toast.error(message);
    } finally {
      setViewLoading(false);
    }
  };

  const handleDelete = async id => {
    const confirmed = window.confirm('Are you sure you want to delete this document?');
    if (!confirmed) return;

    setDeleteLoadingId(id);
    setError('');
    try {
      await deleteDocument(id);
      setDocuments(prev => prev.filter(doc => doc.id !== id));
      if (selectedDocument?.id === id) {
        setSelectedDocument(null);
      }
      toast.success('Document deleted successfully.');
      await loadDocuments();
    } catch (err) {
      const message = err.response?.data?.error || 'Unable to delete document.';
      setError(message);
      toast.error(message);
    } finally {
      setDeleteLoadingId(null);
    }
  };

  const recentDocuments = [...documents]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="dashboard-page">
      <div className="dashboard-top">
        <div className="dashboard-intro">
          <h1>Dashboard</h1>
          <p className="page-copy">Welcome back, safedoc! Here's what's happening with your safety documents.</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="stats-grid dashboard-stats">
        <Card className="dashboard-stat-card" title="Total Documents" subtitle="All documents in your workspace.">
          <div className="stat-card-body">
            <div className="icon-box">T</div>
            <div>
              <h2>{stats.total}</h2>
              <p className="stat-description">Documents created across all workflows.</p>
            </div>
          </div>
        </Card>
        <Card className="dashboard-stat-card" title="HIRARC Documents" subtitle="Total HIRARC reports.">
          <div className="stat-card-body">
            <div className="icon-box">H</div>
            <div>
              <h2>{stats.hirarc}</h2>
              <p className="stat-description">Safety hazard reports created so far.</p>
            </div>
          </div>
        </Card>
        <Card className="dashboard-stat-card" title="Draft Documents" subtitle="Documents still in draft.">
          <div className="stat-card-body">
            <div className="icon-box">D</div>
            <div>
              <h2>{stats.draft}</h2>
              <p className="stat-description">Drafts waiting for completion.</p>
            </div>
          </div>
        </Card>
        <Card className="dashboard-stat-card" title="Completed Documents" subtitle="Finished documents.">
          <div className="stat-card-body">
            <div className="icon-box">C</div>
            <div>
              <h2>{stats.completed}</h2>
              <p className="stat-description">Completed documents ready to review.</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <div>
            <p className="eyebrow">Recent Documents</p>
            <h2>Latest documents</h2>
          </div>
          <Button variant="secondary" onClick={() => navigate('/documents')}>
            View all documents
          </Button>
        </div>

        <Card className="recent-card">
          {loading ? (
            <div className="loading-panel"><Spinner /> Loading documents...</div>
          ) : recentDocuments.length === 0 ? (
            <div className="empty-state">No documents yet. Create your first HIRARC document.</div>
          ) : (
            <div className="table-wrapper">
              <table className="document-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Document Type</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentDocuments.map(doc => (
                    <tr key={doc.id}>
                      <td>{doc.title}</td>
                      <td>{doc.documentType}</td>
                      <td>{doc.status}</td>
                      <td>{new Date(doc.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="table-actions">
                          <Button onClick={() => handleView(doc.id)}>
                            {viewLoading && selectedDocument?.id === doc.id ? 'Loading…' : 'View'}
                          </Button>
                          <Button
                            variant="outline"
                            disabled={deleteLoadingId === doc.id}
                            onClick={() => handleDelete(doc.id)}
                          >
                            {deleteLoadingId === doc.id ? 'Deleting…' : 'Delete'}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <div>
            <p className="eyebrow">Quick Actions</p>
            <h2>Get started faster</h2>
          </div>
        </div>

        <div className="quick-actions">
          <Card className="quick-card" onClick={() => navigate('/hirarc-builder')}>
            <h3>Create HIRARC</h3>
            <p>Start a new safety assessment with the HIRARC builder.</p>
          </Card>
          <Card className="quick-card" onClick={() => navigate('/documents')}>
            <h3>View Documents</h3>
            <p>Open the full document history page.</p>
          </Card>
          <Card className="quick-card disabled-card">
            <h3>Export PDF</h3>
            <p>Export support is coming soon for document reports.</p>
          </Card>
        </div>
      </div>

      {selectedDocument && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-content">
            <div className="modal-header">
              <div>
                <p className="eyebrow">Document details</p>
                <h2>{selectedDocument.title}</h2>
                <p className="page-copy">{selectedDocument.documentType} · {selectedDocument.status}</p>
              </div>
              <Button variant="outline" onClick={() => setSelectedDocument(null)}>
                Close
              </Button>
            </div>
            <div className="modal-body">
              <div className="modal-row">
                <strong>Title</strong>
                <span>{selectedDocument.title}</span>
              </div>
              <div className="modal-row">
                <strong>Document Type</strong>
                <span>{selectedDocument.documentType}</span>
              </div>
              <div className="modal-row">
                <strong>Status</strong>
                <span>{selectedDocument.status}</span>
              </div>
              <div className="modal-row">
                <strong>Created</strong>
                <span>{new Date(selectedDocument.createdAt).toLocaleString()}</span>
              </div>
              <div className="modal-row">
                <strong>Content</strong>
                <pre className="json-preview">{JSON.stringify(selectedDocument.content, null, 2)}</pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
