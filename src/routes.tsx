import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

import AppContainer from "./containers/AppContainer";
import Schools from "./containers/Schools";

export default function Routes(): JSX.Element {
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
          lazy: () => import("./containers/About"),
        },
        {
          path: "/:school/:course/:exam/:number?/results",
          lazy: () => import("./containers/Result"),
        },
        {
          path: "/:school",
          lazy: () => import("./containers/Courses"),
        },
        {
          path: "/:school/:course",
          lazy: () => import("./containers/Exams"),
        },
        {
          path: "/:school/:course/:mode/:number",
          lazy: () => import("./containers/Questions"),
        },
        {
          path: "/:school/:course/:exam",
          lazy: () => import("./containers/Questions"),
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}
