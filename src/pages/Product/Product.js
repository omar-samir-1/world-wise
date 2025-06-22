import NavBar from "../../components/NavBar";
import styles from "./Product.module.css";
import { PostContext } from "../../components/Contexts/ContextPlusReducer";
import { useContext, useEffect, useState } from "react";
import imgHigh from "../../images/productImgHigh.jpg";
import imgLow from "../../images/productImgLow.jpg";
import Logo from "../../components/Logo";
import LogReg from "../../components/LogReg";

function Product() {
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

  document.title = "WorldWise - Product";

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
            <div className={styles.imgContainer}>
              <img
                src={img}
                alt="pricing img"
                className={`${styles.img} ${
                  isHQImageLoaded ? styles.imgWithoutBlur : ""
                }`}
              />
            </div>
            <div className={styles.text}>
              <h1>
                Track your adventures.
                <br /> All in one place.
              </h1>
              <p>
                Click anywhere on the map to log your journey. Add details, save
                your trip, and build your personal travel history — simple and
                intuitive.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Product;
