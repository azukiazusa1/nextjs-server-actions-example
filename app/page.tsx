import { sql } from "@vercel/postgres";
import LikeButton from "./LikeButton";
import { Tweet } from "./actions";
import TweetForm from "./TweetForm";

export default async function Home() {
  const { rows } = await sql`SELECT * FROM tweets ORDER BY created_at DESC`;

  return (
    <main>
      <TweetForm />

      <ul>
        {rows.map((tweet) => (
          <li key={tweet.id}>
            <p>{tweet.tweet}</p>
            <LikeButton tweet={tweet as Tweet} />
          </li>
        ))}
      </ul>
    </main>
  );
}
