import { useState, useEffect } from 'react';
import { fetchDocuments, fetchDocumentById, deleteDocument } from '../services/documentService';
import Button from '../components/Button';
import Card from '../components/Card';
import Spinner from '../components/Spinner';
import { useToast } from '../components/ToastProvider';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewLoading, setViewLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [error, setError] = useState('');
  const toast = useToast();

  const loadDocuments = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchDocuments();
      setDocuments(data);
    } catch (err) {
      setError('Unable to load document history.');
      toast.error('Unable to load document history.');
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

    setError('');
    setDeleteLoadingId(id);
    try {
      await deleteDocument(id);
      setDocuments(prev => prev.filter(doc => doc.id !== id));
      if (selectedDocument?.id === id) {
        setSelectedDocument(null);
      }
      toast.success('Document deleted successfully.');
    } catch (err) {
      const message = err.response?.data?.error || 'Unable to delete document.';
      setError(message);
      toast.error(message);
    } finally {
      setDeleteLoadingId(null);
    }
  };

  return (
    <div className="documents-page">
      <div className="page-header">
        <div>
          <h1>Documents</h1>
          <p className="page-copy">Manage and review your safety documents.</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <Card title="Document history" subtitle="View your document activity and manage files with a single click.">
        {loading ? (
          <div className="loading-panel"><Spinner /> Loading documents...</div>
        ) : documents.length === 0 ? (
          <div className="empty-state">No documents found. Generate a document from the HIRARC Builder to get started.</div>
        ) : (
          <div className="table-wrapper">
            <table className="document-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Document Type</th>
                  <th>Status</th>
                  <th>Created Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map(document => (
                  <tr key={document.id}>
                    <td>{document.title}</td>
                    <td>{document.documentType}</td>
                    <td>{document.status}</td>
                    <td>{new Date(document.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="table-actions">
                        <Button onClick={() => handleView(document.id)}>
                          {viewLoading && selectedDocument?.id === document.id ? 'Loading…' : 'View'}
                        </Button>
                        <Button
                          variant="outline"
                          disabled={deleteLoadingId === document.id}
                          onClick={() => handleDelete(document.id)}
                        >
                          {deleteLoadingId === document.id ? 'Deleting…' : 'Delete'}
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

export default Documents;
