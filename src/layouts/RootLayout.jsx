import { Outlet } from "react-router-dom";

function RootLayout() {
  return <Outlet />; // This will render the child route's element
}

export default RootLayout;
