import React, { useEffect } from "react";
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  return isLoggedIn && <>{children}</>;
};

export default ProtectedRoute;
