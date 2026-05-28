import Sidebar from './Sidebar';
import Navbar from './Navbar';

const MainLayout = ({ children }) => (
  <div className="layout-shell">
    <Sidebar />
    <main className="layout-main">
      <Navbar />
      <section className="layout-content">{children}</section>
      <footer className="app-footer">Built by Azlan bin Kamarul Baharin</footer>
    </main>
  </div>
);

export default MainLayout;
