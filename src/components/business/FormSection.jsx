const FormSection = ({
  title,
  subtitle,
  children,
}) => {
  return (
    <div className="bg-white border rounded-2xl p-5 shadow-sm">

      <div className="mb-4">
        <h3 className="text-lg font-semibold">
          {title}
        </h3>

        {subtitle && (
          <p className="text-sm text-gray-500 mt-1">
            {subtitle}
          </p>
        )}
      </div>

      <div className="grid gap-4">
        {children}
      </div>

    </div>
  );
};

export default FormSection;