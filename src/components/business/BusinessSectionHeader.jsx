const BusinessSectionHeader = ({
  icon: Icon,
  title,
  subtitle,
  action,
  className = "",
}) => {
  return (
    <div
      className={`
        flex
        items-start
        justify-between
        gap-4
        mb-5
        ${className}
      `}
    >
      <div className="flex-1">

        <h2
          className="
            flex
            items-center
            gap-2
            text-xl
            font-bold
            text-gray-900
          "
        >
          {Icon && <Icon size={22} className="shrink-0" />}

          <span>{title}</span>
        </h2>

        {subtitle && (
          <p
            className="
              mt-1
              text-sm
              text-gray-500
            "
          >
            {subtitle}
          </p>
        )}

      </div>

      {action && (
        <div className="shrink-0">
          {action}
        </div>
      )}
    </div>
  );
};

export default BusinessSectionHeader;