import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useContext, useEffect, useState } from "react";
import { PostContext } from "./Contexts/ContextPlusReducer";
import styles from "./Map.module.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useNavigate, useSearchParams } from "react-router-dom";
import Logout from "./Logout";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const newIcon = L.divIcon({
  className: "temp-marker",
  html: `<div style="display:flex;  justify-content: center;
  align-items: center;  width: 30px; height: 30px; background: rgba(255, 0, 0, 0.7); border-radius: 50%; box-shadow: 0 0 15px 20px rgba(255, 0, 0, 0.7);">🔍</div>`,
  iconSize: [25, 25],
});

const tileOptions = [
  {
    key: "osm",
    name: "OpenStreetMap",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  {
    key: "googleMaps",
    name: "Google Maps",
    url: "http://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
    attribution: '&copy; <a href="https://www.google.com/maps">Google Maps</a>',
  },
  {
    key: "hot",
    name: "Humanitarian",
    url: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles courtesy of <a href="https://www.openstreetmap.fr/">OSM France</a>',
  },
  {
    key: "carto",
    name: "CartoDB",
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
  },
  {
    key: "esri_topo",
    name: "ESRI Topographic",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
    attribution:
      'Tiles &copy; <a href="https://www.esri.com/">Esri</a> &mdash; Source: Esri, USGS, NOAA',
  },
];

function UserLocation() {
  const { dispatch } = useContext(PostContext);
  const navigate = useNavigate();

  const getUserLocation = function () {
    window.navigator.geolocation.getCurrentPosition(
      function (data) {
        dispatch({
          type: "curCitycurCountry",
          payLoad: {
            curCity: "",
            curCountry: "",
            lat: "",
            lng: "",
            countryOrCity: "city",
          },
        });
        navigate(
          `/tracking/cities?lat=${data.coords.latitude}&lng=${data.coords.longitude}`
        );
      },
      function () {
        window.alert(
          "you need to give access to the site to use your location"
        );
      }
    );
  };

  return (
    <div
      className={styles.location}
      style={{ cursor: "pointer" }}
      onClick={getUserLocation}
    >
      Use your location 📍
    </div>
  );
}

const MapWithClick = () => {
  const map = useMap();
  const navigate = useNavigate();

  const navigateToForm = async function (event) {
    navigate(`/tracking/form?lat=${event.latlng.lat}&lng=${event.latlng.lng}`);
  };

  useEffect(function () {
    map.on("click", navigateToForm);
    return function () {
      map.off("click", navigateToForm);
    };
  }, []);

  return null;
};

const UpdateMapCenter = ({ coordinates, zoom }) => {
  const map = useMap();

  useEffect(() => {
    zoom = zoom ? zoom : map.getZoom();
    if (coordinates) {
      map.flyTo(coordinates, zoom, {
        animate: true,
        duration: 2,
        noMoveStart: true, 
      });
    }
  }, [coordinates, zoom, map]);

  return null;
};

function NoMap() {
  return (
    <>
      {" "}
      <Logout />
      <div>failed to load the map please reload the page</div>
    </>
  );
}

function Map({ onFailedFetchingTheMap }) {
  const { curState, dispatch } = useContext(PostContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const [theIndexOfTheTileOption, setTheIndexOfTheTileOption] = useState(0);
  const [retryCount, setRetryCount] = useState(0);

  const tile = tileOptions[theIndexOfTheTileOption];

  const navigate = useNavigate();

  const zoomLevel =
    curState.countryOrCity === "city"
      ? 12
      : curState.countryOrCity === "country"
      ? 4
      : "";

  const markers = curState.citiesList?.length
    ? curState.citiesList.map((city) => {
        return {
          cityName: city.cityName,
          position: [city.lat, city.lng],
          id: city.id,
          popupText: `${
            city.notes ? city.notes : "there is no notes for this trip :/"
          }`,
        };
      })
    : [];

  const handleTileError = (e) => {
    dispatch({ type: "isLoading", payLoad: { isLoading: true } });

    if (retryCount < 2) {
      setRetryCount(retryCount + 1);
    } else {
      if (theIndexOfTheTileOption < 4) {
        setTheIndexOfTheTileOption(theIndexOfTheTileOption + 1);
        setRetryCount(0);
      } else {
        onFailedFetchingTheMap(true);
      }
    }
  };

  useEffect(
    function () {
      dispatch({ type: "isLoading", payLoad: { isLoading: false } });
    },
    [dispatch, tile, retryCount]
  );

  return (
    <div className={styles.container}>
      <Logout />
      <UserLocation />
      <MapContainer
        center={[51.505, -0.09]}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          key={tile.key + retryCount}
          url={tile.url}
          attribution={tile.attribution}
          eventHandlers={{
            tileerror: handleTileError,
          }}
        />

        {markers.length
          ? markers.map((city) => (
              <Marker
                position={city.position}
                key={city.id}
                eventHandlers={{
                  click: function () {
                    console.log(city.cityName);
                    dispatch({
                      type: "isLoadingFormData",
                      payLoad: { tempMarker: false },
                    });
                    dispatch({
                      type: "curCitycurCountry",
                      payLoad: {
                        curCity: city.cityName,
                        countryOrCity: "city",
                      },
                    });
                    navigate(
                      `/tracking/cities/${city.id}?lat=${city.position[0]}&lng=${city.position[1]}`
                    );
                  },
                }}
              >
                <Popup className={styles.popUp} autoPan={false}>
                  {city.popupText} <br />
                </Popup>
              </Marker>
            ))
          : ""}
        {curState.tempMarker ? (
          <Marker
            position={[searchParams.get("lat"), searchParams.get("lng")]}
            icon={newIcon}
            className={styles.tempMarker}
          />
        ) : (
          ""
        )}
        <MapWithClick />

        {searchParams.get("lat") && searchParams.get("lng") ? (
          <UpdateMapCenter
            zoom={zoomLevel}
            coordinates={[searchParams.get("lat"), searchParams.get("lng")]}
          />
        ) : (
          ""
        )}
      </MapContainer>
    </div>
  );
}

function MapOrFailedToLoadTheMap() {
  const [faildedToFetchTheTiles, setFaildedToFetchTheTiles] = useState(false);
  const { dispatch } = useContext(PostContext);

  const handleStateOfFetchingTheMap = function (s) {
    setFaildedToFetchTheTiles(s);
  };

  useEffect(
    function () {
      dispatch({ type: "isLoading", payLoad: { isLoading: false } });
    },
    [faildedToFetchTheTiles, dispatch]
  );

  return (
    <>
      {faildedToFetchTheTiles ? (
        <NoMap />
      ) : (
        <Map onFailedFetchingTheMap={handleStateOfFetchingTheMap} />
      )}
    </>
  );
}

export default MapOrFailedToLoadTheMap;
