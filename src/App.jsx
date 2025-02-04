import "./App.css";
import Navbar from "./Components/Navbar.component";
import { Outlet } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./Components/Loader";
import UseApiCall from "./utils/customHook/useApiCall";
import { setAllVideosData } from "./utils/Redux/reducer";
import CustomSidebar from "./Components/CustomSidebar.component";
import ErrorPage from "./Pages/Error.page";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function App() {
  const base_url = import.meta.env.VITE_API_BASE_URL;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data, isLoading, error } = UseApiCall(`${base_url}/all-videos`);
  let tags = [];

  useEffect(() => {
    async function checkJWT() {
      try {
        const jwtCheck = await fetch(`${base_url}/validatejwt`, {
          method: "GET",
          headers: {
            Authorization: `JWT ${localStorage.getItem("token")}`,
          },
        });
        const response = await jwtCheck.json();
        if (!jwtCheck.ok) {
          if (
            response.message == "jwt expired" ||
            response.message == "jwt malformed"
          ) {
            localStorage.clear();
            //don't navigate to home screen on no jwt or malformed as it would redirect you to the home everytime
            //when you try to navigate to other pages without logging in.
            // toast.error("You have been logged out");
          }
        } else {
          // console.log("response from jwt validate::", response);
        }
      } catch (err) {
        console.log("error from validate jwt::", err.message);
      }
    }
    checkJWT();
  });

  if (error) {
    return <ErrorPage />;
  } else if (isLoading) {
    return <Loader />;
  } else if (data) {
    // console.log("data::", data.data);
    dispatch(setAllVideosData(data.data));
  }
  return (
    <>
      <Navbar />
      <div className="flex">
        <CustomSidebar />
        <Outlet />
      </div>
      <ToastContainer />
    </>
  );
}

export default App;
