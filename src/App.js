import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import Tracking from "./pages/Tracking/Tracking";
import Login from "./pages/Login/Login";
import Pricing from "./pages/Pricing/Pricing";
import Product from "./pages/Product/Product";
import PageNotFound from "./pages/PageNotFound/PageNotFound";
import Cities from "./pages/Cities/Cities";
import Form from "./pages/Form/Form";
import Countries from "./pages/Countries/Countries";
import Card from "./pages/Card/Card";
import { PostContext } from "./components/Contexts/ContextPlusReducer";
import { useContext, useEffect } from "react";
import LoadingSpinner from "./components/LoadingSpinner";
import Register from "./pages/Register/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function App() {
  const { curState, dispatch } = useContext(PostContext);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      dispatch({
        type: "authentication on first load status",
        payLoad: { authenticationOnInitialLoadStatus: "loading" },
      });
      if (user) {
        if (!curState.uid & !curState.avatar & !curState.userName) {
          dispatch({
            type: "userUID",
            payLoad: {
              uid: user.uid,
              userName: user.displayName,
              avatar: user.photoURL,
            },
          });
          dispatch({
            type: "authentication on first load status",
            payLoad: { authenticationOnInitialLoadStatus: "finished" },
          });
        }
      } else {
        dispatch({
          type: "authentication on first load status",
          payLoad: { authenticationOnInitialLoadStatus: "finished" },
        });
      }
    });
  }, []);

  return (
    <div>
      {curState.isLoading ? <LoadingSpinner /> : ""}

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route
            path="/tracking"
            element={
              <ProtectedRoute>
                <Tracking />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate replace to="cities" />} />
            <Route path="cities" element={<Cities />} />
            <Route path="cities/:cityId" element={<Card />} />
            <Route path="countries" element={<Countries />} />
            <Route path="form" element={<Form />} />
          </Route>

          <Route path="/register" element={<Register />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/pricing" element={<Pricing />}></Route>
          <Route path="/product" element={<Product />}></Route>

          <Route path="*" element={<PageNotFound />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
