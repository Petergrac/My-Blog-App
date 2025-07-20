import "../styles/App.css";
import { useMediaQuery } from "react-responsive";
import { useNavigate, NavLink } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useState } from "react";
import { signUpUser } from "../RESTapi/api";

function Signup() {
  const navigate = useNavigate();
  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirm_Password: "",
  });
  const [emailError, setEmailError] = useState("hidden");
  const [message, setMessage] = useState("hidden");
  // Responsiveness
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  // Animation
  useGSAP(() => {
    if (isMobile) {
      gsap.from(".main-div", {
        y: -200,
        opacity: 0,
        duration: 1.5,
        ease: "bounce.out",
      });
    } else {
      const tl = gsap.timeline();
      tl.from(".main-div", {
        x: -200,
        opacity: 0,
        duration: 1.5,
        ease: "power2.out",
      }).from(".floater", {
        y: -200,
        opacity: 0,
        duration: 1.5,
        ease: "bounce.out",
      });
    }
  }, []);
  // Handling form data
  const handleSignupForm = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // Handle the form submit
  const submitForm = async (e) => {
    e.preventDefault();
    if (formData.confirm_Password !== formData.password) {
      return setMessage("");
    }
    setMessage("hidden");
    const res = await signUpUser(
      formData.name,
      formData.email,
      formData.password
    );
    if (res.errors) {
      if (res.errors[0].field === "email") {
        setEmailError("");
        setTimeout(() => {
          setEmailError("hidden");
        }, 5000);
      }
    }
    if (res.message) {
      navigate("/login");
    }
  };
  return (
    <div className="main-div">
      <div className={isMobile ? "hidden" : "w-[50%] object-center  h-[100vh]"}>
        <p className="fixed floater text-5xl text-blue-300 top-1/2 left-1/10 font-extrabold">
          SIGN UP
        </p>
        <img
          className="image"
          src="/signup-image.jpeg"
          alt="sign-up image"
          loading="lazy"
        />
      </div>
      <div className="flex flex-col justify-center items-center bg-zinc-900 w-full min-h-[100vh] pl-5">
        <div>
          <div className="mb-10 heading">
            <h1 className="text-6xl michroma text-blue-400">Welcome</h1>
            <h4 className="text-xl text-blue-200">Let's sign you up quickly</h4>
          </div>
          <form
            action="/register"
            method="post"
            className="flex flex-col"
            onSubmit={submitForm}
          >
            <label className="label-signup" htmlFor="">
              Name *:
              <input
                className="input"
                type="text"
                name="name"
                value={formData.name}
                placeholder="Enter your name"
                onChange={handleSignupForm}
                required
              />
            </label>
            <label className="label-signup" htmlFor="">
              Email *:
              <input
                className="input"
                type="email"
                name="email"
                onChange={handleSignupForm}
                value={formData.email}
                placeholder="Enter your email"
                required
              />
              <p className={`error ${emailError}`}>
                Email already exists. Use another Email
              </p>
            </label>
            <label className="label-signup" htmlFor="">
              Password *:
              <input
                className="input"
                type="password"
                name="password"
                onChange={handleSignupForm}
                value={formData.password}
                placeholder="Enter your password - minimum 6 characters"
                minLength={6}
                required
              />
              <p className={`${message} text-red-500 pl-1.5`}>
                Password don't match
              </p>
            </label>
            <label className="label-signup" htmlFor="">
              Confirm Password *:
              <input
                className="input"
                type="password"
                onChange={handleSignupForm}
                name="confirm_Password"
                value={formData.confirm_Password}
                placeholder="Confirm your password - minimum 6 characters"
                minLength={6}
                required
              />
            </label>
            <div className="flex justify-between items-center">
              <button className="btn" type="submit">
                Sign Up
              </button>
              <p className="text-blue-200 pl-2">
                Already have an account?{" "}
                <NavLink className="nav-link" to="/login">
                  Login
                </NavLink>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
