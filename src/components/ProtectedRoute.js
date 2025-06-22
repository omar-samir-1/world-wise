import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { PostContext } from "./Contexts/ContextPlusReducer";

function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState("waiting");
  const auth = getAuth();
  const { dispatch, curState } = useContext(PostContext);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);

        if (!curState.uid & !curState.avatar & !curState.userName) {
          dispatch({
            type: "userUID",
            payLoad: {
              uid: user.uid,
              userName: user.displayName,
              avatar: user.photoURL,
            },
          });
        }
      } else {
        setIsAuthenticated(false);
      }
    });

    return () => unsubscribe(); // Cleanup when unmounting (stop listening for auth changes)
  }, []);

  if (isAuthenticated === "waiting") return null;

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
