import { Navigate, useParams } from "react-router-dom";

const LegacyCityRedirect = () => {
  const { citySlug } = useParams();

  return (
    <Navigate
      to={`/${citySlug}`}
      replace
    />
  );
};

export default LegacyCityRedirect;