import { NavLink } from "react-router-dom";
import styles from "./NavBar.module.css";
import { PostContext } from "./Contexts/ContextPlusReducer";
import { useContext } from "react";

function NavBar({ classNameProp }) {
  const { dispatch } = useContext(PostContext);

  const triggeringLoadingSpinner = function () {
    dispatch({ type: "isLoading", payLoad: { isLoading: true } });
  };

  return (
    <div className={`${styles.container} ${classNameProp}`}>
      <div className={styles.subContainer}>
        <NavLink
          onClick={triggeringLoadingSpinner}
          to="/"
          className={({ isActive }) =>
            isActive ? styles.activeLink : styles.notActiveLink
          }
        >
          HOMEPAGE
        </NavLink>
        <NavLink
          onClick={triggeringLoadingSpinner}
          to="/PRICING"
          className={({ isActive }) =>
            isActive ? styles.activeLink : styles.notActiveLink
          }
        >
          PRICING
        </NavLink>
        <NavLink
          onClick={triggeringLoadingSpinner}
          to="/PRODUCT"
          className={({ isActive }) =>
            isActive ? styles.activeLink : styles.notActiveLink
          }
        >
          PRODUCT
        </NavLink>
      </div>
    </div>
  );
}

export default NavBar;
