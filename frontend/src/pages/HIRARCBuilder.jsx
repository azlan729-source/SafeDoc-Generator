import { useState } from 'react';
import { createDocument } from '../services/documentService';
import Button from '../components/Button';
import Card from '../components/Card';
import { useToast } from '../components/ToastProvider';

const defaultRow = {
  workActivity: '',
  hazard: '',
  hazardClassification: {
    physical: false,
    chemical: false,
    biological: false,
    ergonomic: false,
    psychosocial: false,
  },
  eventAndConsequence: '',
  existingControl: '',
  likelihoodJustification: '',
  likelihood: '1',
  severity: '1',
  additionalControl: '',
  reLikelihood: '1',
  reSeverity: '1',
  personInCharge: '',
  remarks: '',
};

const likelihoodOptions = [1, 2, 3, 4, 5];
const classificationTypes = ['physical', 'chemical', 'biological', 'ergonomic', 'psychosocial'];

const HIRARCBuilder = () => {
  const [projectName, setProjectName] = useState('');
  const [documentTitle, setDocumentTitle] = useState('');
  const [rows, setRows] = useState([defaultRow]);
  const toast = useToast();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  const payload = {
    projectName,
    activities: rows.map((row, index) => {
      const likelihood = Number(row.likelihood || 0);
      const severity = Number(row.severity || 0);
      const reLikelihood = Number(row.reLikelihood || 0);
      const reSeverity = Number(row.reSeverity || 0);

      return {
        no: index + 1,
        workActivity: row.workActivity,
        hazard: row.hazard,
        hazardClassification: row.hazardClassification,
        eventAndConsequence: row.eventAndConsequence,
        existingControl: row.existingControl,
        likelihoodJustification: row.likelihoodJustification,
        likelihood,
        severity,
        rmn: likelihood * severity,
        additionalControl: row.additionalControl,
        reLikelihood,
        reSeverity,
        reRmn: reLikelihood * reSeverity,
        personInCharge: row.personInCharge,
        remarks: row.remarks,
      };
    }),
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

  const handleHazardClassificationChange = (index, key, checked) => {
    setRows(prevRows =>
      prevRows.map((row, rowIndex) =>
        rowIndex === index
          ? {
              ...row,
              hazardClassification: {
                ...row.hazardClassification,
                [key]: checked,
              },
            }
          : row
      )
    );
  };

  const handleAddRow = () => {
    setRows(prevRows => [...prevRows, defaultRow]);
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

    if (
      rows.length === 0 ||
      rows.every(row => !row.workActivity && !row.hazard && !row.eventAndConsequence)
    ) {
      setError('Please add at least one HIRARC row.');
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
      setRows([defaultRow]);
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
          <p className="page-copy">
            Build hazard rows, preview the JSON payload, and submit a structured HIRARC safety document.
          </p>
        </div>
      </div>

      <div className="documents-grid">
        <section className="form-panel">
          <Card
            title="HIRARC builder"
            subtitle="Capture full HIRARC rows with grouped hazard, assessment, control, reassessment and PIC sections."
          >
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
                  <details key={index} className="activity-row" open>
                    <summary className="row-summary">
                      <div>
                        <div className="row-title">HIRARC row {index + 1}</div>
                        <div className="row-subtitle">
                          {row.workActivity || 'Start by entering a work activity'}
                        </div>
                      </div>
                      <button
                        type="button"
                        className="button-secondary outline"
                        onClick={e => {
                          e.preventDefault();
                          handleRemoveRow(index);
                        }}
                        disabled={rows.length === 1}
                      >
                        Remove
                      </button>
                    </summary>

                    <div className="row-card-body">
                      <div className="row-section">
                        <div className="section-heading">
                          <strong>A. Hazard identification</strong>
                        </div>
                        <div className="row-section-group">
                          <label className="row-field">
                            Work activity
                            <input
                              type="text"
                              value={row.workActivity}
                              onChange={e => handleRowChange(index, 'workActivity', e.target.value)}
                              placeholder="Describe the task"
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
                        </div>
                        <label className="row-field">
                          Event and consequence
                          <textarea
                            value={row.eventAndConsequence}
                            onChange={e => handleRowChange(index, 'eventAndConsequence', e.target.value)}
                            placeholder="Describe the possible event and outcome"
                            required
                          />
                        </label>
                        <div className="row-classification-group">
                          <div className="section-label">Hazard classification</div>
                          <div className="row-classification">
                            {classificationTypes.map(type => (
                              <label key={type} className="checkbox-field">
                                <input
                                  type="checkbox"
                                  checked={row.hazardClassification[type]}
                                  onChange={e => handleHazardClassificationChange(index, type, e.target.checked)}
                                />
                                <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="row-section">
                        <div className="section-heading">
                          <strong>B. Risk assessment</strong>
                        </div>
                        <label className="row-field">
                          Existing control / mitigation
                          <textarea
                            value={row.existingControl}
                            onChange={e => handleRowChange(index, 'existingControl', e.target.value)}
                            placeholder="What controls are already in place?"
                            required
                          />
                        </label>
                        <label className="row-field">
                          Likelihood justification
                          <textarea
                            value={row.likelihoodJustification}
                            onChange={e => handleRowChange(index, 'likelihoodJustification', e.target.value)}
                            placeholder="Why did you choose this likelihood rating?"
                            required
                          />
                        </label>
                        <div className="row-section-group">
                          <label className="row-field">
                            Likelihood
                            <select
                              value={row.likelihood}
                              onChange={e => handleRowChange(index, 'likelihood', e.target.value)}
                            >
                              {likelihoodOptions.map(value => (
                                <option key={value} value={String(value)}>{value}</option>
                              ))}
                            </select>
                          </label>
                          <label className="row-field">
                            Severity
                            <select
                              value={row.severity}
                              onChange={e => handleRowChange(index, 'severity', e.target.value)}
                            >
                              {likelihoodOptions.map(value => (
                                <option key={value} value={String(value)}>{value}</option>
                              ))}
                            </select>
                          </label>
                        </div>
                        <label className="row-field read-only-field">
                          RMN
                          <input
                            type="text"
                            value={Number(row.likelihood) * Number(row.severity)}
                            readOnly
                          />
                        </label>
                      </div>

                      <div className="row-section">
                        <div className="section-heading">
                          <strong>C. Risk control</strong>
                        </div>
                        <label className="row-field">
                          Additional control measures
                          <textarea
                            value={row.additionalControl}
                            onChange={e => handleRowChange(index, 'additionalControl', e.target.value)}
                            placeholder="What further risk controls are required?"
                          />
                        </label>
                      </div>

                      <div className="row-section">
                        <div className="section-heading">
                          <strong>D. Risk reassessment</strong>
                        </div>
                        <div className="row-section-group">
                          <label className="row-field">
                            Re-likelihood
                            <select
                              value={row.reLikelihood}
                              onChange={e => handleRowChange(index, 'reLikelihood', e.target.value)}
                            >
                              {likelihoodOptions.map(value => (
                                <option key={value} value={String(value)}>{value}</option>
                              ))}
                            </select>
                          </label>
                          <label className="row-field">
                            Re-severity
                            <select
                              value={row.reSeverity}
                              onChange={e => handleRowChange(index, 'reSeverity', e.target.value)}
                            >
                              {likelihoodOptions.map(value => (
                                <option key={value} value={String(value)}>{value}</option>
                              ))}
                            </select>
                          </label>
                        </div>
                        <label className="row-field read-only-field">
                          Re-RMN
                          <input
                            type="text"
                            value={Number(row.reLikelihood) * Number(row.reSeverity)}
                            readOnly
                          />
                        </label>
                      </div>

                      <div className="row-section">
                        <div className="section-heading">
                          <strong>E. PIC / remarks</strong>
                        </div>
                        <div className="row-section-group">
                          <label className="row-field">
                            Person in charge
                            <input
                              type="text"
                              value={row.personInCharge}
                              onChange={e => handleRowChange(index, 'personInCharge', e.target.value)}
                              placeholder="Assigned person"
                            />
                          </label>
                          <label className="row-field">
                            Remarks
                            <textarea
                              value={row.remarks}
                              onChange={e => handleRowChange(index, 'remarks', e.target.value)}
                              placeholder="Additional notes"
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </details>
                ))}
              </div>

              <div className="row-actions-footer">
                <Button type="button" variant="secondary" onClick={handleAddRow}>
                  Add row
                </Button>
              </div>

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
