import React, { useEffect, useState } from "react";
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

  const onSubmit = () => {
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
      <p>something wrong</p>;
    }
  }, [data]);

  console.log(handleSubmit);

  return (
    <div className={styles.reportContainer}>
      {sent ? (
        <p className={styles.nextBtn}>Thank you for your feedback</p>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles.reportFormContainer}
        >
          <p className={styles.label}>Title</p>
          <input
            className={styles.reportInput}
            type="text"
            {...register("name", { required: true })}
          />
          {errors.name && (
            <p className={styles.warning}>{"The Name Field is Required "}</p>
          )}

          <p className={styles.label}>Message</p>
          <input
            className={styles.reportInputMessage}
            type="text"
            {...register("message", { required: true, minLength: 10 })}
          />
          {errors.message && (
            <p className={styles.warning}>
              {"The message Field is Required and must be > 10 characters"}
            </p>
          )}

          <p className={styles.label} htmlFor="email">
            Email
          </p>
          <input
            className={styles.reportInput}
            type="email"
            {...register("email", { required: true })}
          />
          {errors.email && (
            <p className={styles.warning}>{"The Name Field is Required "}</p>
          )}

          <input type="submit" className={styles.nextBtn} />
        </form>
      )}

      <div />
    </div>
  );
}
