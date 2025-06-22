import { NavLink } from "react-router-dom";
import NavBar from "../../components/NavBar";
import styles from "./HomePage.module.css";
import { PostContext } from "../../components/Contexts/ContextPlusReducer";
import { useContext, useEffect, useState } from "react";
import bgHigh from "../../images/homepageHighQuality.jpg";
import bgLow from "../../images/homepageLowQuality.jpg";
import Logo from "../../components/Logo";
import LogReg from "../../components/LogReg";
import SocialLinks from "../../components/SocialLinks";

function HomePage() {
  const { dispatch, curState } = useContext(PostContext);
  const [bgImage, setBgImage] = useState(bgLow);
  const [isLoaded, setIsLoaded] = useState(false);

  const triggeringLoadingSpinner = function () {
    dispatch({ type: "isLoading", payLoad: { isLoading: true } });
  };

  useEffect(() => {
    if (curState.isLoading)
      dispatch({ type: "isLoading", payLoad: { isLoading: false } });
  }, [curState.isLoading, dispatch]);

  useEffect(() => {
    const img = new Image();
    img.src = bgHigh;
    img.onload = () => {
      setIsLoaded(true);
      setBgImage(bgHigh);
    };
  }, []);

  document.title = "WorldWise - Homepage";

  return (
    <div className={styles.container}>
      <div
        className={`${styles.bg} ${!isLoaded ? styles.blur : ""}`}
        style={{
          backgroundImage: `linear-gradient(
            rgba(82, 82, 84, 0.387),
            rgba(82, 82, 84, 0.387)
          ), url(${bgImage})`,
        }}
      ></div>
      <div className={styles.subContainer}>
        <div className={styles.headerContainer}>
          <div className={styles.header}>
            <Logo />
            <NavBar classNameProp={styles.navBar1} />
            <LogReg />
          </div>
          <NavBar classNameProp={styles.navBar2} />
        </div>

        <div className={styles.content}>
          <p className={styles.tagLine}>
            Adventure awaits, and the world is yours to explore. <br />
            WorldWise keeps track of your adventures. <br />
            Your memories last forever.
          </p>
          <SocialLinks />
        </div>

        <div className={styles.footerContainer}>
          <div className={styles.footer}>
            <NavLink
              to="/tracking"
              className={styles.trackingBtn}
              onClick={triggeringLoadingSpinner}
            >
              <p>START TRACKING NOW</p>
              <span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="wheat"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="icon"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </NavLink>
            <p className={styles.endLine}>
              A world map that tracks your footsteps into every city you can
              think of.
              <br /> Never forget your wonderful experiences, and show your
              friends how you have wandered the world.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
