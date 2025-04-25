"use client";

import { FormEvent } from "react";
import styles from "./page.module.css";
import { userSchema } from "@/schemas/user";

export default function Home() {
  const parseUserData = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const userData = {
      id: formData.get("userId"),
      name: formData.get("userName"),
      email: formData.get("userEmail"),
      createdAt: new Date(formData.get("userCreatedAt") as string),
      updatedAt: formData.get("userUpdatedAt"),
    };

    const parseResult = userSchema.safeParse(userData);
    if (parseResult.success) {
      console.log("Parsed user data:", parseResult.data);
    } else {
      console.error("Validation errors:", parseResult.error);
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <form onSubmit={parseUserData}>
          <input type="text" name="userId" placeholder="user id" />
          <input type="text" name="userName" placeholder="user name" />
          <input type="text" name="userEmail" placeholder="user email" />
          <input
            type="text"
            name="userCreatedAt"
            placeholder="user createdAt"
          />
          <input
            type="text"
            name="userUpdatedAt"
            placeholder="user updatedAt"
          />
          <button type="submit">click to parse</button>
        </form>
      </main>
      <footer className={styles.footer}></footer>
    </div>
  );
}
