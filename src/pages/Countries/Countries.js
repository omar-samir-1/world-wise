import CountriesList from "../../components/CountriesList";
import styles from "./Countries.module.css";
import { PostContext } from "../../components/Contexts/ContextPlusReducer";
import { useContext } from "react";

function Countries() {
  const { curState } = useContext(PostContext);
  document.title = "WorldWise - Countries";
  return (
    <div className={styles.container}>
      {curState.citiesList.length ? (
        <CountriesList />
      ) : (
        <div className={styles.noCountries}>add your first trip first 💪</div>
      )}
    </div>
  );
}

export default Countries;
