import { useContext } from "react";
import { PostContext } from "../../components/Contexts/ContextPlusReducer";
import CitiesList from "../../components/CitiesList";
import styles from "./Cities.module.css";

function Cities() {
  const { curState } = useContext(PostContext);
  document.title = "WorldWise - Cities";
  return (
    <div className={styles.container}>
      {curState.citiesList.length ? (
        <CitiesList />
      ) : (
        <div className={styles.noCities}>
          👋 Add your first city by clicking <br />
          on a city on the map
        </div>
      )}
    </div>
  );
}

export default Cities;
