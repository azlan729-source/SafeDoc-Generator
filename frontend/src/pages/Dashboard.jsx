import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDocumentById, fetchDocuments, deleteDocument } from '../services/documentService';
import { getUser } from '../services/authService';
import Button from '../components/Button';
import Card from '../components/Card';
import Spinner from '../components/Spinner';
import { useToast } from '../components/ToastProvider';

// Inline SVG icons (lightweight fallback to avoid adding a dependency)
const FileTextIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
    <path d="M8 13h8" />
    <path d="M8 17h8" />
  </svg>
);

const ShieldAlertIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M12 2l7 4v5c0 5-3.5 9.7-7 11-3.5-1.3-7-6-7-11V6z" />
    <path d="M12 8v4" />
    <circle cx="12" cy="17" r="1" />
  </svg>
);

const FileEditIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
    <path d="M9 13h6" />
    <path d="M9 17h3" />
    <path d="M16 5l3 3" />
  </svg>
);

const CheckCircleIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

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
        <Card className="dashboard-stat-card">
          <div className="stat-compact">
            <div className="stat-icon blue"><FileTextIcon size={28} /></div>
            <h2 className="stat-number">{stats.total}</h2>
            <div className="stat-title">Total Documents</div>
          </div>
        </Card>
        <Card className="dashboard-stat-card">
          <div className="stat-compact">
            <div className="stat-icon orange"><ShieldAlertIcon size={28} /></div>
            <h2 className="stat-number">{stats.hirarc}</h2>
            <div className="stat-title">HIRARC Documents</div>
          </div>
        </Card>
        <Card className="dashboard-stat-card">
          <div className="stat-compact">
            <div className="stat-icon purple"><FileEditIcon size={28} /></div>
            <h2 className="stat-number">{stats.draft}</h2>
            <div className="stat-title">Draft Documents</div>
          </div>
        </Card>
        <Card className="dashboard-stat-card">
          <div className="stat-compact">
            <div className="stat-icon green"><CheckCircleIcon size={28} /></div>
            <h2 className="stat-number">{stats.completed}</h2>
            <div className="stat-title">Completed Documents</div>
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
