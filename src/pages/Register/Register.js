import { useContext, useEffect, useState } from "react";
import { PostContext } from "../../components/Contexts/ContextPlusReducer";
import Logo from "../../components/Logo";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../Login/firebase";
import styles from "./Register.module.css";
import { Link } from "react-router-dom";
import { AvatarGenerator } from "../../components/Avatar";

function Register() {
  const { dispatch } = useContext(PostContext);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [choosedAvatar, setChoosedAvatar] = useState(
    "https://api.dicebear.com/7.x/adventurer/svg?seed=default"
  );
  const [isRegistering, setIsRegistering] = useState(false);
  const [isSuccessfullyRegistered, setIsSuccessfullyRegistered] =
    useState(false);
  const [error, setError] = useState("");

  const register = async (e) => {
    try {
      if (password.length < 6) {
        throw new Error("Password should be at least 6 characters");
      }
      if (password !== repeatPassword) {
        setPassword("");
        setRepeatPassword("");
        throw new Error("🔒 Passwords do not match!");
      }
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(userCredential.user, {
        displayName: username,
        photoURL: choosedAvatar,
      });

      setIsSuccessfullyRegistered(true);
      dispatch({
        type: "userUID",
        payLoad: {
          uid: userCredential.user.uid,
          userName: userCredential.user.displayName,
          avatar: userCredential.user.photoURL,
          isAuthorized: true,
        },
      });
      window.localStorage.setItem(
        userCredential.user.uid,
        JSON.stringify({ citiesList: [] })
      );
    } catch (error) {
      setIsRegistering(false);
      switch (error.message) {
        case "Firebase: Error (auth/email-already-in-use).":
          setError("🚫 This email is already registered.");
          break;
        case "Firebase: Error (auth/invalid-email).":
          setError("⚠️ Invalid email format.");
          break;
        case "🔒 Passwords do not match!":
          setError(error.message);
          break;
        case "Password should be at least 6 characters":
          setError(error.message);
          break;

        default:
          setError("❗ Something went wrong. Please try again.");
      }
    }
  };

  useEffect(() => {
    dispatch({ type: "isLoading", payLoad: { isLoading: false } });
  }, []);

  document.title = "WorldWise - Register";

  if (isSuccessfullyRegistered)
    return (
      <div className={styles.container}>
        <div className={styles.background}></div>
        <div className={styles.subContainer}>
          <div className={styles.header}>
            <Logo />
          </div>
          <div className={styles.content}>
            <div className={styles.contentContainer2}>
              <h3 className={styles.title}>Account Created Successfully 🎉</h3>
              <p className={styles.message}>
                You're all set! Click below to start your journey.
              </p>
              <Link to="/tracking" className={styles.link}>
                Go to App
              </Link>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <div className={styles.container}>
      <div className={styles.background}></div>
      <div className={styles.subContainer}>
        <div className={styles.header}>
          <Logo />
        </div>
        <div className={styles.contentContainer}>
          <div className={styles.content}>
            <div className={styles.leftSideContainer}>
              <form
                className={styles.form}
                onSubmit={(e) => {
                  e.preventDefault();
                  setIsRegistering(true);
                  window.setTimeout(() => {
                    register();
                  }, 1000);
                }}
              >
                <h1 className={styles.h1}>
                  Sign Up Now
                  <p className={styles.hint}>create a free account</p>
                </h1>
                <div className={styles.error}>{error}</div>

                <input
                  placeholder="Username"
                  disabled={isRegistering}
                  className={`${styles.input} ${
                    isRegistering ? styles.disabled : ""
                  }`}
                  value={username}
                  onChange={(e) => {
                    setUsername(
                      e.target.value.length < 16 ? e.target.value : username
                    );
                  }}
                  required
                />

                <input
                  placeholder="Email address"
                  disabled={isRegistering}
                  className={`${styles.input} ${
                    isRegistering ? styles.disabled : ""
                  }`}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <input
                  placeholder="Password"
                  disabled={isRegistering}
                  className={`${styles.input} ${
                    isRegistering ? styles.disabled : ""
                  }`}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <input
                  placeholder="Repeat Password"
                  disabled={isRegistering}
                  className={`${styles.input} ${
                    isRegistering ? styles.disabled : ""
                  }`}
                  type="password"
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  required
                />

                <button
                  disabled={isRegistering}
                  className={
                    isRegistering ? styles.disabledSubmitBtn : styles.submitBtn
                  }
                  type="submit"
                >
                  Register
                </button>
                <p className={styles.haveAccount}>
                  Already have an account ?{" "}
                  <Link className={styles.z} to="/login">
                    SIGN IN
                  </Link>
                </p>
              </form>
            </div>
            <div className={styles.rightSideContainer}>
              <AvatarGenerator
                onChooseAvatar={setChoosedAvatar}
                isRegistering={isRegistering}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
