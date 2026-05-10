const FormField = ({
  label,
  required,
  error,
  children,
}) => {
  return (
    <div>

      <label className="block text-sm font-medium mb-1">
        {label}

        {required && (
          <span className="text-red-500 ml-1">*</span>
        )}
      </label>

      {children}

      {error && (
        <p className="text-sm text-red-500 mt-1">
          {error}
        </p>
      )}

    </div>
  );
};

export default FormField;