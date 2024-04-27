"use client";

import { LoginSchema } from "@lib/validation";
import "@styles/Login.scss";
import { useFormik } from "formik";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";

type LoginFormValues = {
  email: string;
  password: string;
};

const Login = () => {
  const [error, setError] = useState("");
  const router = useRouter();

  const initialValues: LoginFormValues = {
    email: "",
    password: "",
  };

  const submitForm = async (values: LoginFormValues) => {
    try {
      const response = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (response?.ok) {
        router.push("/");
      }

      if (response?.error) {
        setError("Invalid email or password. Please try again!");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const {
    values,
    errors,
    touched,
    isValid,
    dirty,
    handleChange,
    handleSubmit,
    handleBlur,
  } = useFormik({
    initialValues,
    validationSchema: LoginSchema,
    onSubmit: submitForm,
  });

  const loginWithGoogle = () => {
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="login">
      <Image
        src="/assets/login.jpg"
        alt="login"
        className="login_decor"
        width={300}
        height={450}
      />

      <div className="login_content">
        <form className="login_content_form" onSubmit={handleSubmit}>
          <input
            placeholder="Email"
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          {errors.email && touched.email && (
            <p style={{ color: "red", fontSize: "12px" }}>
              {errors.email || touched.email}
            </p>
          )}

          <input
            placeholder="Password"
            type="password"
            name="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          {errors.password && touched.password && (
            <p style={{ color: "red", fontSize: "12px" }}>
              {errors.password || touched.password}
            </p>
          )}

          {error && <p className="error">{error}</p>}

          <button type="submit" disabled={!(dirty && isValid)}>
            Log In
          </button>
        </form>

        <button className="google" onClick={loginWithGoogle}>
          <p>Log In with Google</p>
          <FcGoogle />
        </button>
        <Link href="/register">Don{"'"}t have an account? Sign Up Here</Link>
      </div>
    </div>
  );
};

export default Login;
