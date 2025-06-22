import { Link } from "react-router-dom";
import styles from "./PageNotFound.module.css";
import { useContext, useEffect } from "react";
import { PostContext } from "../../components/Contexts/ContextPlusReducer";
function PageNotFound() {
  const { dispatch, curState } = useContext(PostContext);
  useEffect(function () {
    if (curState.isLoading)
      dispatch({ type: "isLoading", payLoad: { isLoading: false } });
  });
  return (
    <div className={styles.container}>
      <p>Uh-oh! Looks like this page doesn’t exist.</p>
      <p>No worries — you can go back to the homepage by</p>

      <Link className={styles.navigationBtn} to="/">
        Clicking here
      </Link>
    </div>
  );
}

export default PageNotFound;
