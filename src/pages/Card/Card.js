import { useNavigate, useParams } from "react-router-dom";
import { PostContext } from "../../components/Contexts/ContextPlusReducer";
import { useContext, useEffect, useState } from "react";
import styles from "./Card.module.css";
import LoadingSpinner from "../../components/LoadingSpinner";

function Card() {
  const { curState, dispatch } = useContext(PostContext);
  const [curCity, setCurCity] = useState("wait .. searching for your trip");

  const navigate = useNavigate();

  const params = useParams();

  const back = function () {
    dispatch({ type: "clearCurrentTrip" });
    navigate("/tracking/cities");
  };

  useEffect(
    function () {
      setCurCity(
        curState.citiesList.find((city) => String(city.id) === params.cityId)
      );
    },
    [params.cityId, curState.citiesList]
  );

  useEffect(function () {
    return function () {
      dispatch({ type: "clearCurrentTrip" });
    };
  }, []);

  document.title = "WorldWise - Trip Card";

  if (curCity === "wait .. searching for your trip")
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  if (!curCity) {
    return (
      <div className={styles.container}>
        <div className={styles.cardWithoutBtn}>
          <p
            className={styles.data}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              width: "100%",
            }}
          >
            No trip found with this ID
          </p>
        </div>
        <button className={styles.backBtn} onClick={back}>
          &#x2B05; BACK
        </button>
      </div>
    );
  }
  if (curCity)
    return (
      <div className={styles.container}>
        <div className={styles.cardWithoutBtn}>
          <div>
            <label className={styles.label}>CITY NAME</label>
            <div>
              <span></span>
              <p className={styles.data}>{curCity.cityName}</p>
            </div>
          </div>
          <div>
            <label className={styles.label}>
              YOU WENT TO {curCity.cityName} ON
            </label>
            <p className={styles.data}>{curCity.date}</p>
          </div>
          <div>
            <label className={styles.label}>YOUR NOTES</label>
            <p className={styles.data}>
              {curCity.notes
                ? curCity.notes
                : "u don't have any notes for this trip :/"}
            </p>
          </div>
          <div>
            <label className={styles.label}>LEARN MORE</label>
            <p className={styles.data}>
              <a
                href={`https://www.wikipedia.org/wiki/${curCity.cityName}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                https://www.wikipedia.org/wiki/{curCity.cityName}
              </a>
            </p>
          </div>
        </div>
        <button className={styles.backBtn} onClick={back}>
          &#x2B05; BACK
        </button>
      </div>
    );
}

export default Card;
