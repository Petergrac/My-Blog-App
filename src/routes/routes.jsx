import { lazy, Suspense } from "react";
const Home = lazy(()=> import("../pages/Dashboard"));
const Signup = lazy(() => import("../pages/Signup"));
const Login = lazy(()=> import('../pages/Login'));

const AppRoutes = [
  {
    path: "/",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Signup />
      </Suspense>
    ),
  },
  {
    path: '/login',
    element:(
      <Suspense fallback={<div>Loading...</div>}>
        <Login />
      </Suspense>
    )
  },
  {
    path: '/home',
    element:(
      <Suspense fallback={<div>Loading...</div>}>
        <Home />
      </Suspense>
    )
  }
];
export default AppRoutes;
