import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./styles/App.css";

import AppRoutes from "./routes/routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const router = createBrowserRouter(AppRoutes);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
