import { lazy, Suspense } from "react";
import RootLayout from "../layouts/RootLayout"; // new
const ProfilePage = lazy(() => import("../pages/profile"));
const Contact = lazy(() => import("../pages/contact"));
const About = lazy(() => import("../pages/about"));
const PageNotFound = lazy(() => import("../pages/404"));
const Home = lazy(() => import("../pages/Dashboard"));
const Signup = lazy(() => import("../pages/Signup"));
const Login = lazy(() => import("../pages/Login"));
const Article = lazy(() => import("../pages/articles"));
const Post = lazy(() => import("../pages/postDetail"));
const Loading = lazy(() => import("../components/Loading"));
const ErrorPage = lazy(() => import("../pages/ErrorPage"));

const AppRoutes = [
  {
    path: "/",
    element: (
      <Suspense fallback={<Loading />}>
        <RootLayout />
      </Suspense>
    ),
    errorElement: (
      <Suspense fallback={<Loading />}>
        <ErrorPage />
      </Suspense>
    ),
    children: [
      {
        path: "",
        element: (
          <Suspense fallback={<Loading />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: "register",
        element: (
          <Suspense fallback={<Loading />}>
            <Signup />
          </Suspense>
        ),
      },
      {
        path: "login",
        element: (
          <Suspense fallback={<Loading />}>
            <Login />
          </Suspense>
        ),
      },
      {
        path: "articles",
        element: (
          <Suspense fallback={<Loading />}>
            <Article />
          </Suspense>
        ),
      },
      {
        path: "post-detail/:id",
        element: (
          <Suspense fallback={<Loading />}>
            <Post />
          </Suspense>
        ),
      },
      {
        path: "contact",
        element: (
          <Suspense fallback={<Loading />}>
            <Contact />
          </Suspense>
        ),
      },
      {
        path: "about",
        element: (
          <Suspense fallback={<Loading />}>
            <About />
          </Suspense>
        ),
      },
      {
        path: "profile",
        element: (
          <Suspense fallback={<Loading />}>
            <ProfilePage />
          </Suspense>
        ),
      },
      {
        path: "*",
        element: (
          <Suspense fallback={<Loading />}>
            <PageNotFound />
          </Suspense>
        ),
      },
    ],
  },
];

export default AppRoutes;
