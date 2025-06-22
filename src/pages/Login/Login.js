import { useContext, useEffect, useState } from "react";
import NavBar from "../../components/NavBar";
import styles from "./Login.module.css";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { PostContext } from "../../components/Contexts/ContextPlusReducer";
import highImage from "../../images/loginImgHigh.jpg";
import lowImage from "../../images/loginImgLow.jpg";
import { auth } from "./firebase";
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserSessionPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
} from "firebase/auth";
import Logo from "../../components/Logo";
import { Eye, EyeOff } from "lucide-react";
import LogReg from "../../components/LogReg";

function Login() {
  const { dispatch, curState } = useContext(PostContext);
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [img, setImg] = useState(lowImage);
  const [isHighImageLoaded, setIsHighImageLoaded] = useState(false);
  const [isAuthenication, setIsAuthenication] = useState(false);
  const [isAlreadyAuthenticated, setIsAlreadyAuthenticated] = useState(
    "Waiting ... Checking"
  );
  const [isNotAuthinicated, setIsNotAuthencicated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [stayLoggedIn, setStayLoggedIn] = useState(false);

  const navigate = useNavigate();

  const triggeringLoadingSpinner = function () {
    dispatch({ type: "isLoading", payLoad: { isLoading: true } });
  };

  const handlingSubmitting = function (e) {
    e.preventDefault();
    setIsAuthenication(true);
    setTimeout(login, 1000);
  };

  const login = async () => {
    try {
      await setPersistence(
        auth,
        stayLoggedIn ? browserLocalPersistence : browserSessionPersistence
      );

      const res = await signInWithEmailAndPassword(
        auth,
        emailAddress,
        password
      );

      dispatch({ type: "isLoading", payLoad: { isLoading: true } });

      if (!window.localStorage.getItem(res.user.uid)) {
        window.localStorage.setItem(
          res.user.uid,
          JSON.stringify({ citiesList: [] })
        );
      }

      setIsAuthenication(false);
      setIsNotAuthencicated(false);

      dispatch({
        type: "userUID",
        payLoad: {
          uid: res.user.uid,
          userName: res.user.displayName,
          avatar: res.user.photoURL,
          isAuthorized: true,
        },
      });
      navigate("/tracking");
    } catch (error) {
      setIsAuthenication(false);
      setIsNotAuthencicated(true);
      setPassword("");
    }
  };

  useEffect(function () {
    if (curState.isLoading && isAlreadyAuthenticated === false)
      dispatch({ type: "isLoading", payLoad: { isLoading: false } });
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (!curState.uid & !curState.avatar & !curState.userName) {
          dispatch({
            type: "userUID",
            payLoad: {
              uid: user.uid,
              userName: user.displayName,
              avatar: user.photoURL,
              isAuthorized: true,
            },
          });
        }
        setIsAlreadyAuthenticated(true);
      } else {
        setIsAlreadyAuthenticated(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(function () {
    const image = new Image();
    image.src = highImage;
    image.onload = function () {
      setImg(highImage);
      setIsHighImageLoaded(true);
    };
    return function () {
      document.body.style.overflow = "";
    };
  }, []);

  document.title = "WorldWise - Login";

  if (curState.uid) {
    return <Navigate to="/tracking" replace />;
  }

  if (isAlreadyAuthenticated === "Waiting ... Checking") return null;

  return (
    <div className={styles.container}>
      <div
        className={styles.subContainer}
        onChange={() => {
          if (isNotAuthinicated) setIsNotAuthencicated(false);
        }}
      >
        <div
          style={{
            backgroundImage: `url(${img})`,
          }}
          className={`${styles.background} ${
            isHighImageLoaded ? "" : styles.blur
          }`}
        ></div>
        <div className={styles.headerContainer}>
          <div className={styles.header}>
            <Logo style={{ minWidth: "20%" }} />
            <NavBar classNameProp={styles.navBar1} />
            <LogReg style={{ minWidth: "20%" }} />
          </div>
          <NavBar classNameProp={styles.navBar2} />
        </div>
        <div className={styles.formContainer}>
          <form onSubmit={handlingSubmitting} className={styles.form}>
            <h1>Sign in</h1>
            <p className={styles.err}>
              {isNotAuthinicated ? (
                <>
                  ⚠️ Oops! .. Invalid username or password. <br />
                  Please double-check your credentials and try again.
                </>
              ) : (
                ""
              )}
            </p>

            <input
              disabled={isAuthenication}
              className={`${styles.input} ${
                isAuthenication ? styles.notAllowedCursor : ""
              }`}
              placeholder="username"
              value={emailAddress}
              onChange={function (e) {
                setEmailAddress(e.target.value);
              }}
              required
            />
            <div className={styles.passwordContainer}>
              <input
                type={showPassword ? "text" : "password"}
                disabled={isAuthenication}
                className={`${styles.input} ${
                  isAuthenication ? styles.notAllowedCursor : ""
                }`}
                placeholder="password"
                value={password}
                onChange={function (e) {
                  setPassword(e.target.value);
                }}
                required
              />
              {password ? (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={styles.eyeButton}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              ) : (
                ""
              )}
            </div>

            <button
              disabled={isAuthenication}
              className={`${isAuthenication ? styles.weakBtn : styles.button} `}
              type="submit"
            >
              LOGIN
            </button>
            <div className={styles.stayLoggedInContainer}>
              <input
                disabled={isAuthenication}
                className={isAuthenication ? styles.notAllowedCursor : ""}
                type="checkbox"
                checked={stayLoggedIn}
                onChange={(e) => setStayLoggedIn(e.target.checked)}
              />
              <label>Keep me logged in</label>
            </div>

            <div className={styles.registerContainer}>
              <p className={styles.registerPara}>Not registered ?</p>
              <Link
                to="/register"
                onClick={triggeringLoadingSpinner}
                className={styles.registerNavBtn}
              >
                Create an account
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
