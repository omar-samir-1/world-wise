import { useContext } from "react";
import { PostContext } from "./Contexts/ContextPlusReducer";
import styles from "./Logout.module.css";
import Avatar from "./Avatar";
import { getAuth, signOut } from "firebase/auth";

function Logout() {
  const { curState, dispatch } = useContext(PostContext);

  const auth = getAuth();
 
  function handleLogout() {
    signOut(auth)
      .then(() => {
        console.log("User logged out successfully! ✅");
        dispatch({ type: "logout" });
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  }

  return (
    <div className={styles.container}>
      <Avatar url={curState.avatar} />
      <p>Welcome, {curState.userName}</p>
      <button onClick={handleLogout}>Log out</button>
    </div>
  );
}

export default Logout;
