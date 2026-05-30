const Card = ({ title, subtitle, children, className = '', ...props }) => (
  <section className={`card ${className}`} {...props}>
    {(title || subtitle) && (
      <div className="card-header">
        {title && <h2>{title}</h2>}
        {subtitle && <p>{subtitle}</p>}
      </div>
    )}
    {children}
  </section>
);

export default Card;
