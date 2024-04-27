import * as Yup from "yup";

export const RegisterSchema = Yup.object().shape({
  username: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Name is required"),

  email: Yup.string().email().required("Email is required"),

  password: Yup.string()
    .matches(/^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{6,}$/i, "Invalid Password")
    .required("Password is required"),

  confirmPassword: Yup.string()
    .required("You should repeat the password")
    .oneOf([Yup.ref("password")], "Type the correct password"),

  profileImage: Yup.mixed().required("profile image is required"),
});

export const LoginSchema = Yup.object().shape({
  email: Yup.string().email().required("Email is required"),

  password: Yup.string().required("Password is required"),
});

export const CreateWorkSchema = Yup.object().shape({
  creator: Yup.string(),

  category: Yup.string().required(),

  title: Yup.string().required("title is required"),

  description: Yup.string().required("description is required"),

  price: Yup.string().required("price is required"),

  photos: Yup.array(),
});
