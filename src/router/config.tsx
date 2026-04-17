import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import ScannerPage from "../pages/scanner/page";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/scanner",
    element: <ScannerPage />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;
