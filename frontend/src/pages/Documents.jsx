import { useState, useEffect } from 'react';
import { fetchDocuments, createDocument, deleteDocument, previewDocument, downloadDocumentPDF } from '../services/documentService';
import Button from '../components/Button';
import Card from '../components/Card';
import Spinner from '../components/Spinner';
import { useToast } from '../components/ToastProvider';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [title, setTitle] = useState('');
  const [documentType, setDocumentType] = useState('HIRARC');
  const [content, setContent] = useState('');
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [exportLoadingId, setExportLoadingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  useEffect(() => {
    loadDocuments();
  }, []);

  const showSuccess = message => {
    setSuccess(message);
    setTimeout(() => setSuccess(''), 3000);
  };

  const loadDocuments = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchDocuments();
      setDocuments(data);
    } catch (err) {
      setError('Unable to load documents.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async event => {
    event.preventDefault();
    setError('');
    setPreview(null);
    let parsedContent;

    try {
      parsedContent = JSON.parse(content);
    } catch (err) {
      setError('Content must be valid JSON.');
      return;
    }

    setSaving(true);
    try {
      await createDocument({ title, documentType, content: parsedContent });
      setTitle('');
      setDocumentType('HIRARC');
      setContent('');
      showSuccess('Document created successfully.');
      await loadDocuments();
    } catch (err) {
      const message = err.response?.data?.error || 'Unable to save document.';
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async id => {
    setError('');
    try {
      await deleteDocument(id);
      setDocuments(prev => prev.filter(doc => doc.id !== id));
      if (preview?.id === id) {
        setPreview(null);
      }
      showSuccess('Document deleted successfully.');
      toast.success('Document deleted successfully.');
    } catch (err) {
      setError('Unable to delete document.');
    }
  };

  const handlePreview = async id => {
    setError('');
    setPreviewLoading(true);
    try {
      const data = await previewDocument(id);
      setPreview({ id, data });
    } catch (err) {
      const message = 'Unable to load preview.';
      setError(message);
      toast.error(message);
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleExportPDF = async docItem => {
    setError('');
    setExportLoadingId(docItem.id);

    try {
      const pdfBlob = await downloadDocumentPDF(docItem.id);
      const fileUrl = window.URL.createObjectURL(new Blob([pdfBlob], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = `${docItem.title || 'safedoc'}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(fileUrl);
    } catch (err) {
      setError('Unable to download PDF.');
    } finally {
      setExportLoadingId(null);
    }
  };

  return (
    <div className="documents-page">
      <div className="documents-grid">
        <section className="form-panel">
          <Card title="Create document" subtitle="Enter the document details and JSON content to generate a safety preview.">
            <form className="auth-form" onSubmit={handleCreate}>
            <label>
              Title
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Document title"
                required
              />
            </label>
            <label>
              Document Type
              <select value={documentType} onChange={e => setDocumentType(e.target.value)}>
                <option value="HIRARC">HIRARC</option>
                <option value="PTW">PTW</option>
                <option value="CHECKLIST">CHECKLIST</option>
              </select>
            </label>
            <label>
              Content (JSON)
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder='e.g. { "items": [{ "task": "Check tool", "completed": false }] }'
                rows="8"
                required
              />
            </label>
            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving document...' : 'Create Document'}
            </Button>
          </form>
          </Card>
        </section>

        <section className="list-panel">
          <Card title="Your documents" subtitle="Preview or delete documents created under your account.">
            {loading ? (
              <div className="loading-panel"><Spinner /> Loading documents...</div>
            ) : (
              <div className="document-grid">
                {documents.length === 0 ? (
                  <div className="empty-state">No documents available yet.</div>
                ) : (
                  documents.map(document => (
                    <div key={document.id} className="document-card">
                      <div>
                        <h3>{document.title}</h3>
                        <p className="document-meta">{document.documentType}</p>
                      </div>
                      <div className="document-actions">
                        <Button onClick={() => handlePreview(document.id)}>
                          {previewLoading && preview?.id === document.id ? 'Previewing…' : 'Preview'}
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => handleExportPDF(document)}
                          disabled={exportLoadingId === document.id}
                        >
                          {exportLoadingId === document.id ? 'Exporting…' : 'Export PDF'}
                        </Button>
                        <Button variant="outline" onClick={() => handleDelete(document.id)}>
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </Card>
        </section>
      </div>

      <section className="preview-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Document preview</p>
            <h2>Preview output</h2>
          </div>
        </div>
        {error && !success && <div className="alert alert-error">{error}</div>}
        {preview ? (
          <pre>{JSON.stringify(preview.data, null, 2)}</pre>
        ) : (
          <p className="preview-hint">Select a document to view the preview output here.</p>
        )}
      </section>
    </div>
  );
};

export default Documents;
