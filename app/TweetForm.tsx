"use client";

import { useRef, useState } from "react";
import { addTweet } from "./actions";
import { experimental_useFormStatus as useFormStatus } from "react-dom";

export default function TweetForm() {
  const [error, setError] = useState<string | null>(null);
  const form = useRef<HTMLFormElement>(null);
  const { pending } = useFormStatus();

  return (
    <>
      <form
        action={async (formData) => {
          setError(null);
          const tweet = formData.get("tweet");
          if (typeof tweet !== "string" || tweet.length === 0) {
            setError("Tweet cannot be empty");
            return;
          }
          if (tweet.length > 140) {
            setError("Tweet cannot be longer than 140 characters");
            return;
          }

          const result = await addTweet(tweet);
          if (result.success === false) {
            setError(result.error);
            return;
          }
          form.current?.reset();
        }}
        ref={form}
      >
        <textarea name="tweet"></textarea>
        <button disabled={pending}>Tweet</button>
        {pending && <p>Submitting...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </>
  );
}
