import { Link } from "react-router-dom";
import styles from "./LogReg.module.css";
import { PostContext } from "../components/Contexts/ContextPlusReducer";
import { useContext } from "react";
function LogReg() {
  const { curState } = useContext(PostContext);
  return (
    <div className={styles.container}>
      <div className={styles.btnsContainer}>
        <Link
          to="/register"
          className={styles.clear}
          style={{
            display: `${
              curState.authenticationOnInitialLoadStatus === "loading" ||
              !curState.authenticationOnInitialLoadStatus
                ? "none"
                : curState.authenticationOnInitialLoadStatus === "finished"
                ? curState.userName
                  ? "none"
                  : "initial"
                : ""
            }`,
          }}
        >
          <button className={styles.reg}>REGISTER</button>
        </Link>
        <Link to="/login" className={styles.clear}>
          <button
            className={styles.log}
            style={{
              backgroundColor: `${
                curState.authenticationOnInitialLoadStatus === "loading" ||
                !curState.authenticationOnInitialLoadStatus
                  ? "red"
                  : curState.authenticationOnInitialLoadStatus === "finished"
                  ? curState.userName
                    ? "rgb(18, 215, 199)"
                    : "green"
                  : ""
              }`,
            }}
          >
            {curState.authenticationOnInitialLoadStatus === "loading" ||
            !curState.authenticationOnInitialLoadStatus
              ? "loading..."
              : curState.authenticationOnInitialLoadStatus === "finished"
              ? curState.userName
                ? "Hi, " + curState.userName
                : "LOGIN"
              : ""}
          </button>
        </Link>
      </div>
    </div>
  );
}

export default LogReg;
