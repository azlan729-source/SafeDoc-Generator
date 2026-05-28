import { createContext, useContext, useMemo, useState } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);

  const notify = (type, message) => {
    const id = Date.now() + Math.random();
    setMessages(current => [...current, { id, type, message }]);
    setTimeout(() => {
      setMessages(current => current.filter(item => item.id !== id));
    }, 4200);
  };

  const value = useMemo(
    () => ({
      success: message => notify('success', message),
      error: message => notify('error', message),
    }),
    []
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-container">
        {messages.map(toast => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};
