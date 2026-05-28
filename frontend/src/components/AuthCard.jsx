const AuthCard = ({ title, children, footer }) => (
  <div className="auth-card">
    <h1>{title}</h1>
    <div className="auth-card-body">{children}</div>
    {footer && <div className="auth-card-footer">{footer}</div>}
  </div>
);

export default AuthCard;
