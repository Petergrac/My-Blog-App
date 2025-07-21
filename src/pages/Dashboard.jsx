import Footer from "../components/footer";
import "../styles/App.css";
import { lazy } from "react";
const Navbar = lazy(() => import("../components/dashNavBar"));
const HomePage = lazy(() => import("../components/homeComponent"));

function Home() {
  return (
    <div className="home-div">
      <Navbar />
      <main className="bg-slate-700">
        <HomePage />
        <Footer />
      </main>
    </div>
  );
}
export default Home;
