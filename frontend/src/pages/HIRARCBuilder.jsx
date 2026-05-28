import { useState } from 'react';
import { createDocument } from '../services/documentService';
import Button from '../components/Button';
import Card from '../components/Card';
import { useToast } from '../components/ToastProvider';

const HIRARCBuilder = () => {
  const [projectName, setProjectName] = useState('');
  const [documentTitle, setDocumentTitle] = useState('');
  const [rows, setRows] = useState([
    { activity: '', hazard: '', risk: '', control: '' },
  ]);
  const toast = useToast();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  const payload = {
    projectName,
    activities: rows.map(({ activity, hazard, risk, control }) => ({
      activity,
      hazard,
      risk,
      control,
    })),
  };

  const showSuccess = message => {
    setSuccess(message);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleRowChange = (index, field, value) => {
    setRows(prevRows =>
      prevRows.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [field]: value } : row
      )
    );
  };

  const handleAddRow = () => {
    setRows(prevRows => [...prevRows, { activity: '', hazard: '', risk: '', control: '' }]);
  };

  const handleRemoveRow = index => {
    setRows(prevRows => prevRows.filter((_, rowIndex) => rowIndex !== index));
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!projectName.trim()) {
      setError('Please enter a project name.');
      return;
    }

    if (rows.length === 0 || rows.every(row => !row.activity && !row.hazard && !row.risk && !row.control)) {
      setError('Please add at least one activity row.');
      return;
    }

    setSaving(true);

    try {
      await createDocument({
        title: documentTitle.trim() || `HIRARC - ${projectName.trim()}`,
        documentType: 'HIRARC',
        content: payload,
      });

      setProjectName('');
      setDocumentTitle('');
      setRows([{ activity: '', hazard: '', risk: '', control: '' }]);
      showSuccess('HIRARC document created successfully.');
      toast.success('HIRARC document created successfully.');
    } catch (err) {
      const message = err.response?.data?.error || 'Unable to create HIRARC document.';
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="hirarc-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">HIRARC Builder</p>
          <h1>Create a HIRARC document</h1>
          <p className="page-copy">Build hazard rows, preview the JSON payload, and submit a structured HIRARC safety document.</p>
        </div>
      </div>

      <div className="documents-grid">
        <section className="form-panel">
          <Card title="HIRARC builder" subtitle="Fill each row to capture activities, hazards, risks, and controls.">
            <form className="auth-form" onSubmit={handleSubmit}>
              <label>
                Project name
                <input
                type="text"
                value={projectName}
                onChange={e => setProjectName(e.target.value)}
                placeholder="Project name"
                required
              />
            </label>
            <label>
              Document title
              <input
                type="text"
                value={documentTitle}
                onChange={e => setDocumentTitle(e.target.value)}
                placeholder="Optional title for this document"
              />
            </label>

            <div className="row-list">
              {rows.map((row, index) => (
                <div key={index} className="activity-row">
                  <div className="row-fields">
                    <label className="row-field">
                      Activity
                      <input
                        type="text"
                        value={row.activity}
                        onChange={e => handleRowChange(index, 'activity', e.target.value)}
                        placeholder="Describe the task or activity"
                        required
                      />
                    </label>
                    <label className="row-field">
                      Hazard
                      <input
                        type="text"
                        value={row.hazard}
                        onChange={e => handleRowChange(index, 'hazard', e.target.value)}
                        placeholder="What can go wrong?"
                        required
                      />
                    </label>
                    <label className="row-field">
                      Risk
                      <input
                        type="text"
                        value={row.risk}
                        onChange={e => handleRowChange(index, 'risk', e.target.value)}
                        placeholder="What is the consequence?"
                        required
                      />
                    </label>
                    <label className="row-field">
                      Control measure
                      <input
                        type="text"
                        value={row.control}
                        onChange={e => handleRowChange(index, 'control', e.target.value)}
                        placeholder="How will you control it?"
                        required
                      />
                    </label>
                  </div>
                  <div className="row-actions">
                    <button type="button" className="button-secondary outline" onClick={() => handleRemoveRow(index)} disabled={rows.length === 1}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <Button type="button" variant="secondary" onClick={handleAddRow}>
              Add row
            </Button>

            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <Button type="submit" disabled={saving}>
              {saving ? 'Saving HIRARC...' : 'Save HIRARC document'}
            </Button>
          </form>
          </Card>
        </section>

        <section className="preview-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Payload preview</p>
              <h2>Document JSON</h2>
            </div>
          </div>
          <pre>{JSON.stringify(payload, null, 2)}</pre>
        </section>
      </div>
    </div>
  );
};

export default HIRARCBuilder;
