import { useAuth } from "../hooks/useAuth";

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please sign in to access this page</div>;
  }

  return children;
}
