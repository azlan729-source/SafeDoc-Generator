import { useNavigate } from 'react-router-dom';
import { getUser, logout } from '../services/authService';
import Button from './Button';

const Navbar = () => {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <span className="navbar-title">SafeDoc Generator</span>
        <small className="navbar-tag">Safety documents in one place</small>
      </div>
      <div className="navbar-actions">
        <div className="navbar-user">
          <span>{user?.name || 'Guest'}</span>
          <small>{user?.email || 'Not signed in'}</small>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </header>
  );
};

export default Navbar;
