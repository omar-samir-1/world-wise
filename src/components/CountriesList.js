import styles from "./CountriesList.module.css";
import { PostContext } from "./Contexts/ContextPlusReducer";
import { useContext, useEffect, useState } from "react";
import Country from "./Country";

const defaultFlag =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvTcS9Htcr-m4r8gQwVegTozmGRNMWmSZ6CtW0kXa6_x7RoLn7qnufXDsRLMvb1DAEj6c&usqp=CAU";

function CountriesList() {
  const { curState } = useContext(PostContext);
  const [countriesList, setCountriesList] = useState([]);

  useEffect(
    function () {
      const tripsHaveCountry = curState.citiesList.filter(
        (city) => city.countryName && city.flag !== defaultFlag
      );
      const extractedCountriesList = curState.citiesList.length
        ? new Map(
            tripsHaveCountry.map((city) => {
              return [
                city.countryName,
                {
                  countryName: city.countryName,
                  flag: city.flag,
                  flagAlt: city.flagAlt,
                  key: city.key,
                },
              ];
            })
          )
        : [];
      setCountriesList(extractedCountriesList);
    },
    [curState.citiesList]
  );

  return (
    <div className={styles.container}>
      {countriesList
        ? [...countriesList].map((city) => {
            return (
              <Country
                countryName={city[1].countryName}
                flag={city[1].flag}
                flagAlt={city[1].flagAlt}
                key={city[1].countryName}
                latlng={city[1].latlng}
              />
            );
          })
        : ""}
    </div>
  );
}

export default CountriesList;
