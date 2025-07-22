import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="text-center mt-20">
      <h1 className="text-3xl font-bold text-red-600">Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p className="text-gray-500">
        <i>
          {error.message === "data is undefined"
            ? "Problem connecting to the server"
            : "Make sure you are connected to the internet"}
        </i>
      </p>
    </div>
  );
}
