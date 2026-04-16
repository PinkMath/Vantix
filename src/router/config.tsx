import type { RouteObject } from "react-router-dom";
import NotFound from "@/pages/NotFound";
import Home from "@/pages/home/page";
import SqlInjectionLab from "@/pages/labs/SqlInjectionLab";
import NetworkLab from "@/pages/labs/NetworkLab";
import TerminalLabPage from "@/pages/labs/TerminalLab";
import MalwareScannerLab from "@/pages/labs/MalwareScannerLab";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/labs/sql-injection",
    element: <SqlInjectionLab />,
  },
  {
    path: "/labs/network",
    element: <NetworkLab />,
  },
  {
    path: "/labs/terminal",
    element: <TerminalLabPage />,
  },
  {
    path: "/labs/malware-scanner",
    element: <MalwareScannerLab />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;
