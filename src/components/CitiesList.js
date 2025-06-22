import { useContext } from "react";
import { PostContext } from "./Contexts/ContextPlusReducer";
import City from "./City";
import styles from "./CitiesList.module.css";
 
function CitiesList() {
  const value = useContext(PostContext);
  return (
    <div className={styles.container}>
      {value.curState.citiesList.map((city, i) => {
        return (
          <City
            cityName={city.cityName}
            date={city.date}
            flag={city.flag}
            flagAlt={city.flagAlt}
            notes={city.notes}
            key={city.id}
            id={city.id}
          />
        );
      })}
    </div>
  );
}

export default CitiesList;
