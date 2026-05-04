import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { LocationContext } from "../App";

const ProtectedRoute = ({ children }) => {
  const context = React.useContext(LocationContext);
  const routerLocation = useLocation();

  // ✅ Safety check (prevents white screen crash)
  if (!context) {
    return <div>Loading...</div>;
  }

  const { token, location } = context;

  // ❌ Not logged in → redirect to login
  if (!token) {
    return (
      <Navigate
        to="/login"
        state={{ from: routerLocation.pathname }}
        replace
      />
    );
  }

  // ✅ Allow access
  return children;
};

export default ProtectedRoute;