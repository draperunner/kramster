import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AppContainer from "./containers/AppContainer";
import About from "./containers/About";
import Schools from "./containers/Schools";
import Courses from "./containers/Courses";
import Exams from "./containers/Exams";
import Questions from "./containers/Questions";
import Result from "./containers/Result";
import { useAnonymousLogin, UserContext } from "./auth";

export default function Routes(): JSX.Element {
  const user = useAnonymousLogin();

  const router = createBrowserRouter([
    {
      path: "/",
      element: <AppContainer />,
      children: [
        {
          path: "/",
          element: <Schools />,
        },
        {
          path: "/about",
          element: <About />,
        },
        {
          path: "/:school/:course/:exam/:number?/results",
          element: <Result />,
        },
        {
          path: "/:school",
          element: <Courses />,
        },
        {
          path: "/:school/:course",
          element: <Exams />,
        },
        {
          path: "/:school/:course/:mode/:number",
          element: <Questions />,
        },
        {
          path: "/:school/:course/:exam",
          element: <Questions />,
        },
      ],
    },
  ]);

  return (
    <UserContext.Provider value={user}>
      <RouterProvider router={router} />
    </UserContext.Provider>
  );
}
