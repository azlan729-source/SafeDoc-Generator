import { getUser } from '../services/authService';

const Navbar = () => {
  // Intentionally minimal topbar — user identity is shown only in the sidebar
  return (
    <header className="topbar">
      <div className="topbar-spacer" />
    </header>
  );
};

export default Navbar;
