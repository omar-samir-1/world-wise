import imgg from "../images/icon.png";
import styles from "./Logo.module.css";
import { NavLink } from "react-router-dom";
import { PostContext } from "./Contexts/ContextPlusReducer";
import { useContext } from "react";

function Logo() {
  const { dispatch } = useContext(PostContext);

  const triggeringLoadingSpinner = function () {
    dispatch({ type: "isLoading", payLoad: { isLoading: true } });
  };
  return (
    <NavLink
      onClick={triggeringLoadingSpinner}
      to="/"
      className={({ isActive }) =>
        isActive ? styles.homePageActive : styles.homePageIsNotActive
      }
    >
      <div className={styles.containerChild1}>
        <img src={imgg} alt="Logo" className={styles.logo} />
        <p className={styles.brandName}>WorldWise</p>
      </div>
    </NavLink>
  );
}

export default Logo;
