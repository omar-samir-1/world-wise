import styles from "./Tracking.module.css";
import MapOrFailedToLoadTheMap from "../../components/Map";
import SideBar from "../../components/SideBar";
import { useContext, useEffect } from "react";
import { PostContext } from "../../components/Contexts/ContextPlusReducer";

const defaultFlag =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvTcS9Htcr-m4r8gQwVegTozmGRNMWmSZ6CtW0kXa6_x7RoLn7qnufXDsRLMvb1DAEj6c&usqp=CAU";

function Tracking() {
  const { dispatch, curState } = useContext(PostContext);

  useEffect(
    function () {
      async function optimizingCitiesList() {
        if (
          curState.citiesList.length &&
          curState.citiesList.some(
            (city) => city.countryName && city.flag === defaultFlag
          )
        ) {
          const enhancedCitiesList = curState.citiesList.map(async function (
            city
          ) {
            if (!city.countryName) return { ...city };
            if (city.flag === defaultFlag) {
              try {
                const ajaxCall = fetch(
                  `https://restcountries.com/v3.1/name/${city.countryName}`
                );

                const rejectedPromise = new Promise(function (resolve, reject) {
                  setTimeout(
                    () => reject(new Error("Request Timed Out")),
                    1000
                  );
                });

                const res = await Promise.race([ajaxCall, rejectedPromise]);
                const data = await res.json();
                if (data.message === "Not Found") throw new Error(data.message);

                return {
                  ...city,
                  flag:
                    data[0]?.flags?.png || data[0]?.flags?.svg || defaultFlag,
                };
              } catch (error) {
                return { ...city };
              }
            }
            if (city.flag !== defaultFlag) {
              return { ...city };
            }
          });
          const finalCitiesList = await Promise.all(enhancedCitiesList);

          dispatch({
            type: "updatingCitiesList",
            payLoad: { citiesList: finalCitiesList },
          });
        }
      }
      optimizingCitiesList();
    },
    [curState.citiesList]
  );

  useEffect(function () {
    if (window.localStorage.getItem(curState.uid)) {
      dispatch({ type: "loadingUserTrips" });
    }
    return function () {
      dispatch({ type: "clearCurrentTrip" });
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.background}></div>
      <div className={styles.subContainer}>
        <SideBar />
        <MapOrFailedToLoadTheMap />
      </div>
    </div>
  );
}

export default Tracking;
