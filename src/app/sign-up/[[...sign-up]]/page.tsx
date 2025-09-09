"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignUp from "@clerk/elements/sign-up";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="flex w-full flex-col items-center justify-center h-screen">
      <SignUp.Root>
        <SignUp.Step name="start">
          <h1 className="text-center mb-4 font-bold text-2xl">
            Create a <span className="text-sky-500">Blo</span>
            <span className="text-yellow-300">og</span> account
          </h1>
          <Clerk.Connection
            name="google"
            className="p-2 w-72 rounded-full bg-gray-900 text-gray-300 anim flex items-center gap-2 justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="24"
              height="24"
              viewBox="0 0 48 48"
            >
              <path
                fill="#FFC107"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
              <path
                fill="#FF3D00"
                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
              ></path>
              <path
                fill="#4CAF50"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
              ></path>
              <path
                fill="#1976D2"
                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
            </svg>
            <Clerk.Loading scope="provider:google">
              {(isLoading) =>
                isLoading ? "Signing you in..." : "Continue with Google"
              }
            </Clerk.Loading>
          </Clerk.Connection>
          <Clerk.Connection
            name="github"
            className="p-2 anim my-5 w-72 rounded-full bg-gray-900 text-gray-300 flex items-center gap-2 justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="24"
              height="24"
              viewBox="0 0 50 50"
            >
              <path d="M17.791,46.836C18.502,46.53,19,45.823,19,45v-5.4c0-0.197,0.016-0.402,0.041-0.61C19.027,38.994,19.014,38.997,19,39 c0,0-3,0-3.6,0c-1.5,0-2.8-0.6-3.4-1.8c-0.7-1.3-1-3.5-2.8-4.7C8.9,32.3,9.1,32,9.7,32c0.6,0.1,1.9,0.9,2.7,2c0.9,1.1,1.8,2,3.4,2 c2.487,0,3.82-0.125,4.622-0.555C21.356,34.056,22.649,33,24,33v-0.025c-5.668-0.182-9.289-2.066-10.975-4.975 c-3.665,0.042-6.856,0.405-8.677,0.707c-0.058-0.327-0.108-0.656-0.151-0.987c1.797-0.296,4.843-0.647,8.345-0.714 c-0.112-0.276-0.209-0.559-0.291-0.849c-3.511-0.178-6.541-0.039-8.187,0.097c-0.02-0.332-0.047-0.663-0.051-0.999 c1.649-0.135,4.597-0.27,8.018-0.111c-0.079-0.5-0.13-1.011-0.13-1.543c0-1.7,0.6-3.5,1.7-5c-0.5-1.7-1.2-5.3,0.2-6.6 c2.7,0,4.6,1.3,5.5,2.1C21,13.4,22.9,13,25,13s4,0.4,5.6,1.1c0.9-0.8,2.8-2.1,5.5-2.1c1.5,1.4,0.7,5,0.2,6.6c1.1,1.5,1.7,3.2,1.6,5 c0,0.484-0.045,0.951-0.11,1.409c3.499-0.172,6.527-0.034,8.204,0.102c-0.002,0.337-0.033,0.666-0.051,0.999 c-1.671-0.138-4.775-0.28-8.359-0.089c-0.089,0.336-0.197,0.663-0.325,0.98c3.546,0.046,6.665,0.389,8.548,0.689 c-0.043,0.332-0.093,0.661-0.151,0.987c-1.912-0.306-5.171-0.664-8.879-0.682C35.112,30.873,31.557,32.75,26,32.969V33 c2.6,0,5,3.9,5,6.6V45c0,0.823,0.498,1.53,1.209,1.836C41.37,43.804,48,35.164,48,25C48,12.318,37.683,2,25,2S2,12.318,2,25 C2,35.164,8.63,43.804,17.791,46.836z"></path>
            </svg>
            <Clerk.Loading scope="provider:github">
              {(isLoading) =>
                isLoading ? "Signin you in..." : "Continue with GitHub"
              }
            </Clerk.Loading>
          </Clerk.Connection>
          <div className="flex w-72 justify-center items-center gap-1">
            <hr className="border-1 grow" />
            <p className="text-center mb-2">or</p>
            <hr className="grow" />
          </div>
          {/* FIRST NAME */}
          <div className="flex gap-4 mt-2">
            <Clerk.Field name="firstName" className="flex flex-col gap-1 my-2">
              <Clerk.Label className="font-bold text-sm">
                First Name
              </Clerk.Label>
              <Clerk.Input
                type="text"
                title="First name required"
                required
                className="p-2 bg-gray-900 w-33 rounded-md outline-none focus:border border-sky-400 placeholder:text-gray-500"
                placeholder="First name"
              />
              <Clerk.FieldError className="text-red-500 text-xs" />
            </Clerk.Field>
            <Clerk.Field name="lastName" className="flex flex-col gap-1 my-2">
              <Clerk.Label className="font-bold text-sm">Last Name</Clerk.Label>
              <Clerk.Input
                type="text"
                title="Last name required"
                required
                className="p-2 bg-gray-900 w-33 rounded-md outline-none focus:border border-sky-400 placeholder:text-gray-500"
                placeholder="Last name"
              />
              <Clerk.FieldError className="text-red-500 text-xs" />
            </Clerk.Field>
          </div>
          <Clerk.Field name="username" className="flex flex-col gap-1 my-2">
            <Clerk.Label className="font-bold text-sm">Username</Clerk.Label>
            <Clerk.Input
              type="text"
              required
              title="Username required"
              className="p-2 bg-gray-900 w-72 rounded-md outline-none focus:border border-sky-400 placeholder:text-gray-500"
              placeholder="Enter your username"
            />
            <Clerk.FieldError className="text-red-500 text-xs" />
          </Clerk.Field>

          <Clerk.Field name="emailAddress" className="flex flex-col gap-1 my-2">
            <Clerk.Label className="font-bold text-sm">Email</Clerk.Label>
            <Clerk.Input
              type="email"
              title="Email required"
              required
              className="p-2 bg-gray-900 w-72 rounded-md outline-none focus:border border-sky-400 placeholder:text-gray-500"
              placeholder="Enter your email"
            />
            <Clerk.FieldError className="text-red-500 text-xs" />
          </Clerk.Field>

          <Clerk.Field name="password" className="flex flex-col gap-1 my-2">
            <Clerk.Label className="font-bold text-sm">Password</Clerk.Label>
            <Clerk.Input
              type="password"
              title="Password required"
              required
              className="p-2 bg-gray-900 w-72 rounded-md outline-none focus:border border-sky-400 placeholder:text-gray-500"
              placeholder="Create a password"
            />
            <Clerk.FieldError className="text-red-500 text-xs  w-72" />
          </Clerk.Field>

          <SignUp.Captcha />

          <SignUp.Action
            className="bg-sky-500 w-fill text-center py-1 my-2 rounded-full anim hover:bg-sky-400 w-70"
            submit
          >
            <Clerk.Loading>
              {(isLoading) => (isLoading ? "Submitting..." : "Submit")}
            </Clerk.Loading>
          </SignUp.Action>
         <div className="flex w-72 justify-center items-center gap-1">
            <hr className="border-1 grow" />
            <p className="text-center mb-2">or</p>
            <hr className="grow" />
          </div> 
          <div className="flex flex-col gap-2">
            <Link
              href="/sign-in"
              className="text-center text-sm rounded-full bg-sky-500 w-70 py-1 font-bold"
            >
              Sign In
            </Link>
            <p className="w-72 text-textGray text-xs">
              By Signing up, you agree to the
              <span className="text-sky-500 hover:underline cursor-pointer">
                Terms of Service
              </span>
              {" "}and{" "}
              <span className="text-sky-500 hover:underline cursor-pointer">
                Privacy Policy
              </span>
              , including
              <span className="text-sky-500 hover:underline cursor-pointer">
                {" "}Cookie Use
              </span>
              .
            </p>
          </div>
        </SignUp.Step>
        {/* VERIFICATIONS */}
        <SignUp.Step name="verifications">
          <SignUp.Strategy name="email_code">
            <h1 className="text-center text-lg font-bold my-4">
              Check your email.
            </h1>
            <Clerk.Field name="code" className="flex flex-col gap-1 my-2">
              <Clerk.Input
                type="otp"
                required
                passwordManagerOffset={40}
                render={({ value, status }) => (
                  <span
                    data-status={status}
                    className="p-3 m-2 rounded-sm border-1"
                  >
                    {value || " "}
                  </span>
                )}
                autoSubmit
              />
              <Clerk.FieldError className="text-red-500 text-xs mt-3 text-center" />
            </Clerk.Field>
            <SignUp.Action
              className="bg-sky-500 w-fill text-center py-1 my-2 rounded-full anim hover:bg-sky-400 w-70"
              submit
            >
              <Clerk.Loading>
                {(isLoading) => (isLoading ? "Verifying..." : "Verify")}
              </Clerk.Loading>
            </SignUp.Action>
          </SignUp.Strategy>
        </SignUp.Step>
      </SignUp.Root>
    </div>
  );
}
