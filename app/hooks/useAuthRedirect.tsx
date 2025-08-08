import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { useEffect } from "react";

const useAuthRedirect = (url: string) => {
  const { auth, isLoading } = usePuterStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate(url);
    }
  }, [isLoading, auth.isAuthenticated, navigate, url]);
};

export default useAuthRedirect;
