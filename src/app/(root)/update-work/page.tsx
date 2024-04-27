"use client";

import "@styles/Form.scss";
import Navbar from "@components/Navbar";
import { useFormik } from "formik";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { categories } from "@constants";
import { IoIosImages } from "react-icons/io";
import { BiTrash } from "react-icons/bi";
import { CreateWorkSchema } from "@lib/validation";
import Loader from "@components/Loader";

type UpdateFormValues = {
  category: string;
  title: string;
  description: string;
  price: string;
  photos: File[];
};

const CreateWork = () => {
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const { data: session } = useSession();

  const searchParams = useSearchParams();
  const workId = searchParams.get("id");

  const initialValues: UpdateFormValues = {
    category: "",
    title: "",
    description: "",
    price: "",
    photos: [],
  };

  const submitForm = async (values: UpdateFormValues) => {
    try {
      const updateFormWork = new FormData();

      updateFormWork.append("category", values.category);
      updateFormWork.append("title", values.title);
      updateFormWork.append("description", values.description);
      updateFormWork.append("price", values.price);

      values.photos.forEach((photo) => {
        updateFormWork.append("workPhotoPaths", photo);
      });

      const response = await fetch(`/api/work/${workId}`, {
        method: "PATCH",
        body: updateFormWork,
      });

      if (response.ok) {
        router.push(`/shop?id=${session?.user?.id}`);
      }
    } catch (err: any) {
      console.log("Publish Work failed", err.message);
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
    setValues,
  } = useFormik({
    initialValues,
    validationSchema: CreateWorkSchema,
    onSubmit: submitForm,
  });

  const handleRemovePhoto = (indexToRemove: number) => {
    setFieldValue(
      "photos",
      values.photos.filter((_, index) => index !== indexToRemove)
    );
  };

  useEffect(() => {
    const getWorkDetails = async () => {
      try {
        const response = await fetch(`api/work/${workId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        setValues({
          category: data.category,
          title: data.title,
          description: data.description,
          price: data.price,
          photos: data.workPhotoPaths,
        });

        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    if (workId) {
      getWorkDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workId]);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <div className="form">
        <h1>Edit Your Work</h1>
        <form onSubmit={handleSubmit}>
          <h3>Which of these categories best describes your work?</h3>
          <div className="category-list">
            {categories?.map((item, index) => (
              <p
                key={index}
                className={`${values.category === item ? "selected" : ""}`}
                onClick={() => {
                  setFieldValue("category", item);
                }}
              >
                {item}
              </p>
            ))}
          </div>

          <h3>Add some photos of your work</h3>
          {values.photos.length < 1 && (
            <div className="photos">
              <input
                id="image"
                type="file"
                style={{ display: "none" }}
                accept="image/*"
                onChange={(e) => {
                  setFieldValue("photos", [
                    ...values.photos,
                    ...(e.target.files as unknown as File[]),
                  ]);
                }}
                multiple
              />
              <label htmlFor="image" className="alone">
                <div className="icon">
                  <IoIosImages />
                </div>
                <p>Upload from your device</p>
              </label>
            </div>
          )}

          {values.photos.length > 0 && (
            <div className="photos">
              {values.photos.map((photo, index) => (
                <div key={index} className="photo">
                  {photo instanceof Object ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={URL.createObjectURL(photo)} alt="work" />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={photo} alt="work" />
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(index)}
                  >
                    <BiTrash />
                  </button>
                </div>
              ))}
              <input
                id="image"
                type="file"
                style={{ display: "none" }}
                accept="image/*"
                onChange={(e) => {
                  setFieldValue("photos", [
                    ...values.photos,
                    ...(e.target.files as unknown as File[]),
                  ]);
                }}
                multiple
              />
              <label htmlFor="image" className="together">
                <div className="icon">
                  <IoIosImages />
                </div>
                <p>Upload from your device</p>
              </label>
            </div>
          )}

          <h3>What make your Work attractive?</h3>
          <div className="description">
            <div className="error">
              <p>Title</p>
              {errors.title && touched.title && (
                <p style={{ color: "red", fontSize: "14px" }}>
                  {errors.title || touched.title}
                </p>
              )}
            </div>
            <input
              type="text"
              placeholder="Title"
              onChange={handleChange}
              onBlur={handleBlur}
              name="title"
              value={values.title}
            />

            <div className="error">
              <p>Description</p>
              {errors.description && touched.description && (
                <p style={{ color: "red", fontSize: "14px" }}>
                  {errors.description || touched.description}
                </p>
              )}
            </div>
            <textarea
              typeof="text"
              placeholder="Description"
              onChange={handleChange}
              onBlur={handleBlur}
              name="description"
              value={values.description}
            />

            <div className="error">
              <div>
                <p>Now, set your PRICE</p>
                <span>$</span>
              </div>
              {errors.price && touched.price && (
                <p style={{ color: "red", fontSize: "14px" }}>
                  {errors.price || touched.price}
                </p>
              )}
            </div>
            <input
              type="number"
              placeholder="Price"
              onChange={handleChange}
              onBlur={handleBlur}
              name="price"
              value={values.price}
              className="price"
            />
          </div>
          <button
            className="submit_btn"
            type="submit"
            disabled={!(dirty && isValid)}
          >
            PUBLISH YOUR WORK
          </button>
        </form>
      </div>
    </>
  );
};

const CreateWorkPage = () => {
  return (
    <Suspense fallback={<Loader />}>
      <CreateWork />
    </Suspense>
  );
};

export default CreateWorkPage;
