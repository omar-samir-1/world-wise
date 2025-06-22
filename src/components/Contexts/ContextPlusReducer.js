import { createContext, useReducer } from "react";

export const PostContext = createContext();

const initialState = {
  citiesList: [],
  isLoading: true,
  curCity: "",
  curCountry: "",
  lat: "",
  lng: "",
  countryOrCity: "",
  isLoadingFormData: false,
  uid: "",

  userName: "",
  avatar: "",
  tempMarker: false,
  authenticationOnInitialLoadStatus: "",
};

const reducer = (curState, action) => {
  switch (action.type) {
    case "curCitycurCountry":
      return {
        ...curState,
        curCity: action.payLoad.curCity || "",
        curCountry: action.payLoad.curCountry || "",
        lat: action.payLoad.lat || "",
        lng: action.payLoad.lng || "",
        countryOrCity: action.payLoad.countryOrCity || "",
      };

    case "addCityToList":
      window.localStorage.setItem(
        curState.uid,
        JSON.stringify({
          citiesList: [
            ...JSON.parse(window.localStorage.getItem(curState.uid)).citiesList,
            action.payLoad,
          ],
        })
      );
      return {
        ...curState,
        citiesList: [...curState.citiesList, action.payLoad],
      };

    case "removeCityFromList":
      window.localStorage.setItem(
        curState.uid,
        JSON.stringify({ citiesList: action.payLoad })
      );
      return { ...curState, citiesList: action.payLoad };

    case "updatingCitiesList":
      window.localStorage.setItem(
        curState.uid,
        JSON.stringify({ citiesList: action.payLoad.citiesList })
      );
      return { ...curState, citiesList: action.payLoad.citiesList };

    case "clearCurrentTrip":
      return {
        ...curState,
        curCity: "",
        curCountry: "",
        lat: "",
        lng: "",
        countryOrCity: "",
        tempMarker: false,
      };

    case "isLoading":
      return { ...curState, isLoading: action.payLoad.isLoading };

    case "isLoadingFormData":
      return {
        ...curState,
        isLoadingFormData: action.payLoad.isLoadingFormData,
        tempMarker: action.payLoad.tempMarker,
      };

    case "userUID":
      return {
        ...curState,
        uid: action.payLoad.uid,
        userName: action.payLoad.userName,
        avatar: action.payLoad.avatar,
      };

    case "loadingUserTrips":
      return {
        ...curState,
        citiesList: [
          ...JSON.parse(window.localStorage.getItem(curState.uid)).citiesList,
        ],
      };

    case "authentication on first load status":
      return {
        ...curState,
        authenticationOnInitialLoadStatus:
          action.payLoad.authenticationOnInitialLoadStatus,
      };

    case "logout":
      return { ...initialState, authenticationOnInitialLoadStatus: "finished" };

    default:
      return curState;
  }
};

function ContextPlusReducer({ children }) {
  const [curState, dispatch] = useReducer(reducer, initialState);

  return (
    <PostContext.Provider value={{ curState, dispatch }}>
      {children}
    </PostContext.Provider>
  );
}

export default ContextPlusReducer;
