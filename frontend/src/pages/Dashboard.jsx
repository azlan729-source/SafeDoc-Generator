import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDocuments } from '../services/documentService';
import { getUser, logout } from '../services/authService';
import Button from '../components/Button';
import Card from '../components/Card';
import Spinner from '../components/Spinner';
import { useToast } from '../components/ToastProvider';

const Dashboard = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const user = getUser();
  const [stats, setStats] = useState({ total: 0, hirarc: 0, ptw: 0, checklist: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchDocuments();
        setStats({
          total: data.length,
          hirarc: data.filter(doc => doc.documentType === 'HIRARC').length,
          ptw: data.filter(doc => doc.documentType === 'PTW').length,
          checklist: data.filter(doc => doc.documentType === 'CHECKLIST').length,
        });
      } catch (err) {
        const message = 'Unable to load document metrics.';
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [toast]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1>Welcome back, {user?.name || 'SafeDoc User'}</h1>
          <p className="page-copy">Track your documents, safety previews, and risk workflows in one place.</p>
        </div>
        <div className="page-actions">
          <Button variant="secondary" onClick={() => navigate('/documents')}>
            Documents
          </Button>
          <Button variant="secondary" onClick={() => navigate('/hirarc-builder')}>
            Build HIRARC
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {loading ? (
        <div className="loading-panel"><Spinner /> Loading metrics...</div>
      ) : (
        <div className="stats-grid">
          <div className="stat-card">
            <span>Total Documents</span>
            <h2>{stats.total}</h2>
          </div>
          <div className="stat-card">
            <span>HIRARC</span>
            <h2>{stats.hirarc}</h2>
          </div>
          <div className="stat-card">
            <span>PTW</span>
            <h2>{stats.ptw}</h2>
          </div>
          <div className="stat-card">
            <span>Checklist</span>
            <h2>{stats.checklist}</h2>
          </div>
        </div>
      )}

      <Card title="Quick insights" subtitle="Use the documents section to create and preview safety documents for HIRARC, PTW, and checklist workflows.">
        <p className="page-copy">Track safety documents in one place and export reports when needed.</p>
      </Card>
    </div>
  );
};

export default Dashboard;
