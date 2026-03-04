import { useNavigate } from "react-router-dom";

const CategoryCard = ({ name, Icon }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/business?category=${name}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      handleClick();
    }
  };

  return (
    <div
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center cursor-pointer hover:shadow-xl hover:-translate-y-1 transition duration-300"
      aria-label={`View businesses in ${name} category`}
    >
      <div className="text-4xl text-blue-600 mb-3">
        {Icon ? <Icon /> : <span>🏷️</span>}
      </div>

      <h3 className="text-lg font-semibold text-gray-700 text-center">
        {name}
      </h3>
    </div>
  );
};

export default CategoryCard;