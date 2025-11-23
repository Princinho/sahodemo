// This page is no longer used - redirected to Home
// Keeping for backwards compatibility
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/", { replace: true });
  }, [navigate]);

  return null;
};

export default Index;
