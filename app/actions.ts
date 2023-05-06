"use server";

import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";

export type Tweet = {
  id: string;
  tweet: string;
  likes: number;
  created_at: Date;
  sending?: boolean;
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type Result =
  | {
      success: true;
    }
  | {
      success: false;
      error: string;
    };

const maxDailyTweets = 10;
let tweetCount = 0;

export async function addTweet(tweet: string): Promise<Result> {
  "use server";
  if (tweetCount > maxDailyTweets) {
    return {
      success: false,
      error: "Exceeds the number of tweets possible per day",
    };
  }

  try {
    await sql`INSERT INTO tweets (tweet, likes) VALUES (${tweet}, ${0})`;
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to add tweet" };
  }

  tweetCount++;

  revalidatePath("/");
  return { success: true };
}

export async function likeTweet(id: string) {
  try {
    await sql`UPDATE tweets SET likes = likes + 1 WHERE id = ${id}`;
  } catch (error) {
    console.error(error);
  } finally {
    revalidatePath("/");
  }
}
