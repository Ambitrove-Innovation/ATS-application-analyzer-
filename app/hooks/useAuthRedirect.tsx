import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { useEffect } from "react";

const useAuthRedirect = (url: string) => {
  const { auth } = usePuterStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.isAuthenticated) navigate(`${url}`);
  }, [auth.isAuthenticated]);
};

export default useAuthRedirect;
