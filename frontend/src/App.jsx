import './App.css';
import AppRoutes from './routes/AppRoutes';
import { getToken } from './services/authService';
import { setAuthToken } from './services/api';
import { ToastProvider } from './components/ToastProvider';

function App() {
  const token = getToken();
  setAuthToken(token);

  return (
    <ToastProvider>
      <div className="app-shell">
        <AppRoutes />
      </div>
    </ToastProvider>
  );
}

export default App;
