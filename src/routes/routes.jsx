import { lazy, Suspense } from "react";
const Home = lazy(() => import("../pages/Dashboard"));
const Signup = lazy(() => import("../pages/Signup"));
const Login = lazy(() => import("../pages/Login"));
const Article = lazy(() => import("../pages/articles"));
const Post = lazy(() => import("../pages/postDetail"));

const AppRoutes = [
  {
    path: "/register",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Signup />
      </Suspense>
    ),
  },
  {
    path: "/login",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: "/",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Home />
      </Suspense>
    ),
  },
  {
    path: "/articles",
    element: (
      <Suspense fallback={<div>Loading</div>}>
        <Article />
      </Suspense>
    ),
  },
  {
    path: "/post-detail/:id",
    element: (
      <Suspense fallback={<div>Hello The</div>}>
        <Post />
      </Suspense>
    ),
  },
];
export default AppRoutes;
