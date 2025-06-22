import Logo from "./Logo";
import styles from "./SideBar.module.css";
import { NavLink, Outlet } from "react-router-dom";
import { PostContext } from "./Contexts/ContextPlusReducer";
import { useContext } from "react";

function SideBar() {
  const { dispatch } = useContext(PostContext);

  const clearingCurTrip = function () {
    dispatch({ type: "clearCurrentTrip" });
  };

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <Logo />
      </div>

      <div className={styles.buttons}>
        <NavLink
          onClick={clearingCurTrip}
          to="Cities"
          className={({ isActive }) =>
            isActive ? styles.activeLink : styles.inactiveLink
          }
        >
          Cities
        </NavLink>
        <NavLink
          onClick={clearingCurTrip}
          to="Countries"
          className={({ isActive }) =>
            isActive ? styles.activeLink : styles.inactiveLink
          }
        >
          Countries
        </NavLink>
      </div>
      <Outlet />
      <p className={styles.p}>© Copyright 2025 by WorldWise Inc.</p>
    </div>
  );
}

export default SideBar;
