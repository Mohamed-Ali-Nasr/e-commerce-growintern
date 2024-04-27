"use client";

import "@styles/Register.scss";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { RegisterSchema } from "@lib/validation";
import { signIn } from "next-auth/react";

type RegisterFormValues = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  profileImage: File | null;
};

const Register = () => {
  const router = useRouter();

  const initialValues: RegisterFormValues = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    profileImage: null,
  };

  const submitForm = async (values: RegisterFormValues) => {
    try {
      const registerForm = new FormData();

      for (const key in values) {
        registerForm.append(key, values[key as keyof typeof values]!);
      }

      const response = await fetch("/api/register/", {
        method: "POST",
        body: registerForm,
      });

      if (response.ok) {
        router.push("/login");
      }
    } catch (err: any) {
      console.log("Registration failed", err.message);
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
    setFieldValue,
  } = useFormik({
    initialValues,
    validationSchema: RegisterSchema,
    onSubmit: submitForm,
  });

  const loginWithGoogle = () => {
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="register">
      <Image
        src="/assets/register.jpg"
        alt="register"
        width={350}
        height={550}
        className="register_decor"
      />

      <div className="register_content">
        <form className="register_content_form" onSubmit={handleSubmit}>
          <input
            placeholder="Username"
            name="username"
            value={values.username}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          {errors.username && touched.username && (
            <p style={{ color: "red", fontSize: "12px" }}>
              {errors.username || touched.username}
            </p>
          )}

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

          <input
            placeholder="Confirm Password"
            type="password"
            name="confirmPassword"
            value={values.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          {errors.confirmPassword && touched.confirmPassword && (
            <p style={{ color: "red", fontSize: "12px" }}>
              {errors.confirmPassword || touched.confirmPassword}
            </p>
          )}

          <input
            id="image"
            type="file"
            name="profileImage"
            onChange={(e) => {
              setFieldValue("profileImage", e.target.files![0]);
            }}
            accept="image/*"
            style={{ display: "none" }}
          />

          <label htmlFor="image">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/addImage.png" alt="add profile" />
            <p>Upload Profile Photo</p>
          </label>

          {values.profileImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={URL.createObjectURL(values.profileImage)}
              alt="Profile"
              style={{ maxWidth: "80px", maxHeight: "100px" }}
            />
          )}

          <button type="submit" disabled={!(dirty && isValid)}>
            Register
          </button>
        </form>

        <button type="button" className="google" onClick={loginWithGoogle}>
          <p>Log In with Google</p>
          <FcGoogle />
        </button>
        <Link href="/login">Already have an account? Log In Here</Link>
      </div>
    </div>
  );
};

export default Register;
