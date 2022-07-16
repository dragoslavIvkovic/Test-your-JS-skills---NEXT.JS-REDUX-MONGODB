import React from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import styles from "../styles/Elements.module.css";

export default function Report() {
  const [data, setData] = useState();
  const [sent, setSent] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = (data) => {
    setData(data);
    setSent(true);
  };

  useEffect(() => {


    if (data) {
  fetch("/api/reportAPI", {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((res) => {
      console.log("Response received");
      if (res.status === 200) {
        console.log("Response succeeded!");
      }
    });
    } else {
      null
}



    
  }, [data]);

  console.log(handleSubmit);

  return (
    <div className={styles.reportContainer2}>
      {sent ? (
        <p className={styles.nextBtn}>Thank you for your feedback</p>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles.reportContainer}
        >
          <label className={styles.label}>Title</label>
          <input
            className={styles.reportInput}
            type="text"
            {...register("name", { required: true })}
          />
          {errors.name && <p>{"The Name Field is Required "}</p>}

          <label className={styles.label}>Message</label>
          <input
            className={styles.reportInputMessage}
            type="text"
            {...register("message", { required: true, minLength: 10 })}
          />
          {errors.message && (
            <p>{"The message Field is Required and must be > 10 characters"}</p>
          )}

          <label className={styles.label} htmlFor="email">
            Email
          </label>
          <input
            className={styles.reportInput}
            type="email"
            {...register("email", { required: true })}
          />

          <input type="submit" className={styles.nextBtn} />
        </form>
      )}

      <div></div>
    </div>
  );
}
