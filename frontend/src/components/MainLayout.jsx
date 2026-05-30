import Sidebar from './Sidebar';
import Navbar from './Navbar';

const MainLayout = ({ children }) => (
  <div className="layout-shell">
    <Sidebar />
    <main className="layout-main">
      <Navbar />
      <section className="layout-content">{children}</section>
    </main>
  </div>
);

export default MainLayout;
