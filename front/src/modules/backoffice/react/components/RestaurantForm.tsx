"use client"
import React from 'react';
import { useActionState, useId } from "react";
import "./newsletter.css";

export const RestaurantForm: React.FC = () => {
    return (
        <NewsletterSubscribe />
    );
};

type FormState = {
  type: "error" | "success";
  message: string;
} | null;

const fakeSendEmail = async () => {
  return new Promise((resolve) => setTimeout(resolve, 1000));
};

const NewsletterSubscribe = () => {
  const [result, submitAction, isPending] = useActionState<FormState, FormData>(
    async (previousState: FormState, formData: FormData): Promise<FormState> => {
      const name = formData.get("name");
      const email = formData.get("email");
      if (!name || !email) {
        return {
          type: "error",
          message: `Please fill in your name and email.`,
        };
      }

      await fakeSendEmail();
      return {
        type: "success",
        message: `You have succesfully subscribed!`,
      };
    },
    null
  );

  const emailInputId = useId();
  const nameInputId = useId();
  return (
    <>
      {result && <p className={`message ${result.type}`}>{result.message}</p>}
      {isPending && <p className="message loading">Loading ...</p>}
      <form action={submitAction}>
        <h3>Join the newsletter</h3>
        <div>
          <label htmlFor={nameInputId}>Name</label>
          <input type="text" name="name" id={nameInputId} />
        </div>
        <div>
          <label htmlFor={emailInputId}>Email</label>
          <input type="email" name="email" id={emailInputId} />
        </div>
        <div>
          <button type="submit">Subscribe</button>
        </div>
      </form>
    </>
  );
};

export default NewsletterSubscribe;