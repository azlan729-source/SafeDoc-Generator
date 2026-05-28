const Button = ({ children, type = 'button', variant = 'primary', className = '', ...props }) => {
  const base = 'button';
  const variantClass = variant === 'secondary' ? 'button-secondary' : variant === 'outline' ? 'button-outline' : 'button-primary';

  return (
    <button type={type} className={`${base} ${variantClass} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
