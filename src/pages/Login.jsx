import "../styles/App.css";
import { useMediaQuery } from "react-responsive";
import { useNavigate, NavLink } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useState } from "react";
import { loginUser } from "../RESTapi/api";
import { jwtDecode } from "jwt-decode";

function Login() {
  // States
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [emailError, setEmailError] = useState("hidden");
  const [passError, setPassError] = useState("hidden");
  // Responsiveness
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  // Animation
  useGSAP(() => {
    if (isMobile) {
      gsap.from(".main-div", {
        y: -200,
        rotate: 45,
        opacity: 0,
        duration: 1.5,
        ease: "bounce.out",
      });
    } else {
      const tl = gsap.timeline();
      tl.from(".main-div", {
        x: -200,
        opacity: 0,
        rotate: 90,
        duration: 1.5,
        ease: "power2.out",
      }).from(".floater", {
        y: +200,
        opacity: 0,
        duration: 1.5,
        ease: "power2.out",
      });
    }
  }, []);
  // Handling form data
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  //   Submitting the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await loginUser(formData.email, formData.password);
    if (data.message === "Incorrect email") {
      setEmailError("");
    } else if (data.message === "Incorrect Password") {
      setPassError("");
    }
    if (data.accessToken && data.refreshToken) {
      // Save both access & request tokens in localstorage
      localStorage.setItem("token", data.accessToken);
      localStorage.setItem('refresh_token',data.refreshToken);
      // Save the user id from the token
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = jwtDecode(token);
        const userId = decoded.id || decoded.userId;
        localStorage.setItem("currentUser", userId);
      }
      navigate("/");
    }
    setFormData({
      email: "",
      password: "",
    });
  };
  return (
    <div className="main-div">
      <div className={isMobile ? "hidden" : "w-[50%] object-center  h-[100vh]"}>
        <p className="fixed floater text-5xl text-blue-300 top-1/2 left-1/10 font-extrabold">
          LOG IN
        </p>
        <img className="image" src="/signup-image.jpeg" alt="sign-up image" />
      </div>
      <div className="flex flex-col justify-center items-center bg-zinc-900 w-full min-h-[100vh] pl-5">
        <div>
          <div className="mb-10 heading">
            <h1 className="text-6xl michroma text-blue-400 mb-3">Welcome</h1>
            <h4 className="text-xl text-blue-200">Let's log you in quickly</h4>
          </div>
          <form
            action="/login"
            method="post"
            className="flex flex-col"
            onSubmit={handleSubmit}
          >
            <label className="label-signup" htmlFor="">
              Email *:
              <input
                className="input"
                type="email"
                title="Please enter a valid email"
                value={formData.email}
                name="email"
                onChange={handleChange}
                placeholder="example123@gmail.com"
                required
              />
              <p className={`error ${emailError}`}>Incorrect Email</p>
            </label>
            <label className="label-signup" htmlFor="">
              Password *:
              <input
                className="input"
                type="password"
                value={formData.password}
                title="Enter a correct password"
                name="password"
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
              <p className={`error ${passError}`}>Incorrect Password</p>
            </label>
            <div className="flex justify-between items-center">
              <button className="btn" type="submit">
                Login
              </button>
              <p className="text-blue-200 pl-3 ">
                Don't have an account?
                <NavLink className="nav-link" to="/">
                  Register
                </NavLink>
              </p>
            </div>
          </form>
          
        </div>
        <NavLink className={`btn text-lg mt-5`} to={`/`}>
            Go to homepage
          </NavLink>
      </div>
    </div>
  );
}

export default Login;
