import { useContext } from "react";
import styles from "./City.module.css";
import { PostContext } from "./Contexts/ContextPlusReducer";
import { useNavigate } from "react-router-dom";

function City({ cityName, date, flag, flagAlt, notes, id }) {
  const value = useContext(PostContext);
  const navigate = useNavigate();

  const curTrip = function (e) {
    if (e.target === document.querySelector(`.${styles.close}`)) return;

    const city = value.curState.citiesList.find((city) => city.id === id);
    value.dispatch({
      type: "curCitycurCountry",
      payLoad: {
        countryOrCity: "city",
        curCity: cityName,
      },
    });
    navigate(
      `/tracking/Cities/${String(city.id)}?lat=${city.lat}&lng=${city.lng}`
    );
  };

  const remove = function (e) {
    e.stopPropagation();
    const finalList = value.curState.citiesList.filter((city) => {
      return city.id !== id;
    });

    value.dispatch({ type: "removeCityFromList", payLoad: finalList });
  };

  return (
    <div className={styles.city} onClick={curTrip}>
      <div className={styles.subContainer}>
        <img src={flag} alt={flagAlt} className={styles.flag} />
        <p className={styles.cityName}>{cityName}</p>
      </div>
      <div className={styles.subContainer}>
        <p className={styles.date}>{date}</p>
        <button className={styles.close} onClick={remove}>
          x
        </button>
      </div>
    </div>
  );
}

export default City;
