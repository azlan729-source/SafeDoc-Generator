import { NavLink, useNavigate } from 'react-router-dom';
import { getUser, logout } from '../services/authService';

const Sidebar = () => {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-mark">SD</div>
        <div>
          <p className="brand-name">SafeDoc Generator</p>
          <p className="brand-tag">Document safety workspace</p>
        </div>
      </div>
      <div className="sidebar-user">
        <span className="user-name">{user?.name || 'User'}</span>
        <span className="user-email">{user?.email || 'No email'}</span>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
          Dashboard
        </NavLink>
        <NavLink to="/documents" className={({ isActive }) => isActive ? 'active' : ''}>
          Documents
        </NavLink>
        <NavLink to="/hirarc-builder" className={({ isActive }) => isActive ? 'active' : ''}>
          HIRARC Builder
        </NavLink>
      </nav>
      <button type="button" className="sidebar-logout" onClick={handleLogout}>
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
