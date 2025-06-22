import { useContext, useEffect, useRef, useState } from "react";
import styles from "./Form.module.css";
import { PostContext } from "../../components/Contexts/ContextPlusReducer";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { useFetcher, useNavigate, useSearchParams } from "react-router-dom";

const defaultFlag =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvTcS9Htcr-m4r8gQwVegTozmGRNMWmSZ6CtW0kXa6_x7RoLn7qnufXDsRLMvb1DAEj6c&usqp=CAU";

function MyDatePicker({ city, setSelectedDate, selectedDate }) {
  return (
    <>
      <label className={styles.label}>When did you go to {city} ?</label>
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        dateFormat="yyyy/MM/dd"
        placeholderText="Click to select a date"
        required
        popperPlacement="bottom"
      />
    </>
  );
}

function Spinner() {
  return <div className={styles.spinner}></div>;
}

function Form() {
  const isThereAnyRequest = useRef(false);
  const abortController = useRef(null);
  const value = useContext(PostContext);
  const navigate = useNavigate();
  const [cityName, setCityName] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [notesAboutTrip, setNotesAboutTrip] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(
    function () {
      value.dispatch({
        type: "isLoadingFormData",
        payLoad: { isLoadingFormData: true, tempMarker: true },
      });

      async function fetchCityName() {
        let lat = searchParams.get("lat");
        let lng = searchParams.get("lng");
        try {
          if (!lat || !lng)
            throw new Error("Latitude and Longitude are required");

          if (isThereAnyRequest.current) {
            abortController.current.abort();
          }
          abortController.current = new AbortController();
          isThereAnyRequest.current = true;

          const ajaxCall = fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json
    `,
            { signal: abortController.current.signal }
          );

          const rejectedPromise = new Promise(function (resolve, reject) {
            setTimeout(
              () =>
                reject(
                  new Error(
                    "The Request taking so much time and it lost the promises race"
                  )
                ),
              2000
            );
          });

          const response = await Promise.race([ajaxCall, rejectedPromise]);

          const data = await response.json();

          if (data.error) throw new Error(data.error);

          value.dispatch({
            type: "curCitycurCountry",
            payLoad: {
              curCity:
                data?.address?.city ||
                data?.address?.state ||
                data?.address?.country ||
                "",
              curCountry: data?.address?.country || "",
              lat: lat,
              lng: lng,
            },
          });
          value.dispatch({
            type: "isLoadingFormData",
            payLoad: { isLoadingFormData: false, tempMarker: true },
          });
          setCityName(
            data?.address?.city ||
              data?.address?.state ||
              data?.address?.country ||
              ""
          );
        } catch (error) {
          console.log(error.message);
          if (error.message === "signal is aborted without reason")
            return console.log(error.message);
          value.dispatch({
            type: "curCitycurCountry",
            payLoad: {
              curCity: "",
              curCountry: "",
              lat: lat,
              lng: lng,
            },
          });
          value.dispatch({
            type: "isLoadingFormData",
            payLoad: { isLoadingFormData: false },
          });
        }
      }
      fetchCityName();
    },
    [searchParams]
  );
  document.title = "WorldWise - Form";

  useEffect(function () {
    return function () {
      value.dispatch({ type: "clearCurrentTrip" });
    };
  }, []);

  const add = function (cityName, selectedDate, countryName, notes, e) {
    e.preventDefault();
    value.dispatch({
      type: "isLoadingFormData",
      payLoad: { isLoadingFormData: true },
    });
    const options = { month: "short", day: "numeric", year: "numeric" };
    const formattedDate = selectedDate.toLocaleDateString("en-US", options);
    if (countryName) {
      const ajaxCall = fetch(
        `https://restcountries.com/v3.1/name/${countryName}`
      );

      const rejectedPromise = new Promise(function (resolve, reject) {
        setTimeout(() => reject(new Error("Request Timed Out")), 4000);
      });

      Promise.race([ajaxCall, rejectedPromise])
        .then((res) => res.json())
        .then((data) => {
          if (data.message === "Not Found") throw new Error(data.message);
          value.dispatch({
            type: "addCityToList",
            payLoad: {
              cityName: cityName,
              countryName: countryName,
              date: formattedDate,
              flag: defaultFlag,
              flagAlt: data[0]?.flags?.alt || "default flag",
              notes: notes,
              lat: value.curState.lat,
              lng: value.curState.lng,
              id: Math.random() + Math.random() + Math.random(),
            },
          });
          value.dispatch({ type: "clearCurrentTrip" });
          navigate("/tracking/cities");
          value.dispatch({
            type: "isLoadingFormData",
            payLoad: { isLoadingFormData: false },
          });
        })
        .catch((error) => {
          console.log(error);
          value.dispatch({
            type: "addCityToList",
            payLoad: {
              cityName: cityName,
              countryName: "",
              date: formattedDate,
              flag: defaultFlag,
              flagAlt: "default flag",
              notes: notes,
              lat: value.curState.lat,
              lng: value.curState.lng,
              id: Math.random() + Math.random() + Math.random(),
            },
          });
          value.dispatch({ type: "clearCurrentTrip" });
          navigate("/tracking/cities");
          value.dispatch({
            type: "isLoadingFormData",
            payLoad: { isLoadingFormData: false },
          });
        });
    }
    if (!countryName) {
      value.dispatch({
        type: "addCityToList",
        payLoad: {
          cityName: cityName,
          countryName: "",
          date: formattedDate,
          flag: defaultFlag,
          flagAlt: "default flag",
          notes: notes,
          lat: value.curState.lat,
          lng: value.curState.lng,
          id: Math.random() + Math.random() + Math.random(),
        },
      });
      value.dispatch({ type: "clearCurrentTrip" });
      navigate("/tracking/cities");
      value.dispatch({
        type: "isLoadingFormData",
        payLoad: { isLoadingFormData: false },
      });
    }
  };

  const back = function () {
    value.dispatch({ type: "clearCurrentTrip" });
    navigate("/tracking/cities");
  };

  return (
    <form
      className={styles.form}
      onSubmit={function (e) {
        add(
          cityName,
          selectedDate,
          value.curState.curCountry,
          notesAboutTrip,
          e
        );
      }}
    >
      <div className={styles.formWithoutButtons}>
        {value.curState.isLoadingFormData && (
          <div className={styles.overlay}>
            <Spinner />
          </div>
        )}
        <div className={styles.entry}>
          <label>City name</label>
          <input
            required
            value={cityName}
            onChange={function (e) {
              setCityName(
                e.target.value.length > 20 ? cityName : e.target.value
              );
            }}
          />
        </div>
        <div className={`${styles.entry}`}>
          <MyDatePicker
            city={cityName}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        </div>

        <div className={styles.entry}>
          <label className={styles.label}>
            Notes about your trip to {cityName}
          </label>
          <input
            value={notesAboutTrip}
            onChange={function (e) {
              setNotesAboutTrip(
                e.target.value.length > 400 ? notesAboutTrip : e.target.value
              );
            }}
          />
        </div>
      </div>
      <div className={styles.buttons}>
        <button type="submit">Add</button>

        <button onClick={back} type="back">
          Back
        </button>
      </div>
    </form>
  );
}

export default Form;
