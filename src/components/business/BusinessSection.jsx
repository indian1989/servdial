const BusinessSection = ({
  id,
  className = "",
  children,
  padded = true,
}) => {
  return (
    <section
      id={id}
      className={`
        bg-white
        rounded-2xl
        shadow
        ${padded ? "p-5" : ""}
        ${className}
      `}
    >
      {children}
    </section>
  );
};

export default BusinessSection;