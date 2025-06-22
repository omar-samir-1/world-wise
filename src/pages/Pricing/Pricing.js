import NavBar from "../../components/NavBar";
import styles from "./Pricing.module.css";
import { useContext, useEffect, useState } from "react";
import { PostContext } from "../../components/Contexts/ContextPlusReducer";
import imgHigh from "../../images/pricingImgHigh.jpg";
import imgLow from "../../images/pricingImgLow.jpg";
import Logo from "../../components/Logo";
import LogReg from "../../components/LogReg";

function Pricing() {
  const { dispatch, curState } = useContext(PostContext);
  const [img, setImg] = useState(imgLow);
  const [isHQImageLoaded, setIsHQImageLoaded] = useState(false);

  useEffect(function () {
    const img = new Image();
    img.src = imgHigh;
    img.onload = function () {
      setImg(imgHigh);
      setIsHQImageLoaded(true);
    };
  }, []);

  useEffect(function () {
    if (curState.isLoading)
      dispatch({ type: "isLoading", payLoad: { isLoading: false } });
  });

  document.title = "WorldWise - Pricing";

  return (
    <div className={styles.container}>
      <div className={styles.background}></div>
      <div className={styles.subContainer}>
        <div className={styles.headerContainer}>
          <div className={styles.header}>
            <Logo />
            <NavBar classNameProp={styles.navBar1} />
            <LogReg />
          </div>
          <NavBar classNameProp={styles.navBar2} />
        </div>
        <div className={styles.contentContainer}>
          <div className={styles.content}>
            <div className={styles.text}>
              <h1>
                Simple. Free. <br /> Forever.
              </h1>
              <p>
                Start tracking your trips with zero cost. No subscriptions, no
                hidden fees — just pure adventure logging made easy.
              </p>
            </div>

            <div className={styles.imgContainer}>
              <img
                src={img}
                alt="pricing img"
                className={`${styles.img} ${
                  isHQImageLoaded ? styles.imgWithoutBlur : ""
                }`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pricing;
