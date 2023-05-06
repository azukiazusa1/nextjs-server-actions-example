"use client";

import { experimental_useOptimistic as useOptimistic } from "react";
import { likeTweet, Tweet } from "./actions";

type Props = {
  tweet: Tweet;
};

export default function LikeButton({ tweet }: Props) {
  const [optimisticLikes, addOptimisticLikes] = useOptimistic(
    tweet.likes,
    (state, newLikes: number) => state + newLikes
  );
  return (
    <button
      onClick={async () => {
        addOptimisticLikes(1);
        await likeTweet(tweet.id);
      }}
    >
      {optimisticLikes} Likes
    </button>
  );
}
