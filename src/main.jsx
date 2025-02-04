import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFound from "./Pages/NotFound.jsx";
import { Provider } from "react-redux";
import Loader from "./Components/Loader.jsx";
import Video from "./Pages/Video.page.jsx";
const Login = lazy(() => import("./Pages/Login.Page.jsx"));
const Register = lazy(() => import("./Pages/Register.page.jsx"));
const Channel = lazy(() => import("./Pages/Channel.page.jsx"));
const Home = lazy(() => import("./Pages/Home.page.jsx"));
import { appStore } from "./utils/Redux/store.js";
import ErrorPage from "./Pages/Error.page.jsx";
const CreateChannel = lazy(() => import("./Pages/createChannel.page.jsx"));

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/",
        element: (
          <Suspense fallback={<Loader />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: "/login",
        element: (
          <Suspense fallback={<Loader />}>
            <Login />
          </Suspense>
        ),
      },
      {
        path: "/register",
        element: (
          <Suspense fallback={<Loader />}>
            <Register />
          </Suspense>
        ),
      },
      // {
      //   path: "/channel",
      //   element: (
      //     <Suspense fallback={<Loader />}>
      //       <Channel />
      //     </Suspense>
      //   ),
      // },
      {
        path: "/videos/:id",
        element: (
          <Suspense fallback={<Loader />}>
            <Video />
          </Suspense>
        ),
      },
      {
        path: "/create-channel",
        element: (
          <Suspense fallback={<Loader />}>
            <CreateChannel />
          </Suspense>
        ),
      },
      {
        path: "/channels/:username",
        element: (
          <Suspense fallback={<Loader />}>
            <Channel />
          </Suspense>
        ),
      },
      {
        path: "/error",
        element: (
          <Suspense fallback={<Loader />}>
            <ErrorPage />
          </Suspense>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <Provider store={appStore}>
    <RouterProvider router={appRouter} />
  </Provider>
);
