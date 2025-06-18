"use client";
import { useClientDictionary } from "@/app/[locale]/context/dictionnary-context";
import { useEffect, useState } from "react";

export default function PostDetail({ postId }: { postId: string }) {
  const [post, setPost] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { dict } = useClientDictionary();
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/private/post/${postId}`);
        if (!res.ok) throw new Error("Erreur lors du chargement");

        const data = await res.json();
        setPost(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchPost();
  }, [postId]);

  if (error) return <p>{dict.common.error} : {error}</p>;
  if (!post) return <p>{dict.common.loading}</p>;

  return (
    <div>
      <h1>{post.title}</h1>
      <p>Posté par : {post.user.username}</p>

      <h2>{dict.feed.comments}</h2>
      <ul>
        {post.comments.map((comment: any) => (
          <li key={comment.id}>
            <strong>{comment.user.username}</strong>: {comment.content}
          </li>
        ))}
      </ul>

      <h2>{dict.feed.reactions}</h2>
      <ul>
        {post.reactions.map((reaction: any) => (
          <li key={reaction.id}>
            👍 par {reaction.user.username}
          </li>
        ))}
      </ul>
    </div>
  );
}
