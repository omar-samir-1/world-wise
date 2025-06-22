import { useNavigate } from "react-router-dom";
import { PostContext } from "./Contexts/ContextPlusReducer";
import styles from "./Country.module.css";
import { useContext, useEffect, useState } from "react";

function Country({ countryName, flag, flagAlt }) {
  const { dispatch } = useContext(PostContext);
  const [countryLatLng, setCountryLatLng] = useState();
  const navigate = useNavigate();

  useEffect(
    function () {
      fetch(`https://restcountries.com/v3.1/name/${countryName}`)
        .then((res) => res.json())
        .then((data) => {
          setCountryLatLng(data[0].latlng);
        });
    },
    [countryName]
  );

  const navigating = function () {
    navigate(
      `/tracking/Countries?lat=${countryLatLng[0]}&lng=${countryLatLng[1]}`
    );
    dispatch({
      type: "curCitycurCountry",
      payLoad: {
        countryOrCity: "country",
      },
    });
  };

  return (
    <div className={styles.container} onClick={navigating}>
      <img src={flag} alt={flagAlt} className={styles.image} />
      <p className={styles.countryName}>{countryName}</p>
    </div>
  );
}

export default Country;
