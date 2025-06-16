"use client";
import { useEffect, useState } from "react";

export default function PostDetail({ postId }: { postId: string }) {
  const [post, setPost] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/post/${postId}`);
        if (!res.ok) throw new Error("Erreur lors du chargement");

        const data = await res.json();
        setPost(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchPost();
  }, [postId]);

  if (error) return <p>Erreur : {error}</p>;
  if (!post) return <p>Chargement...</p>;

  return (
    <div>
      <h1>{post.title}</h1>
      <p>Posté par : {post.user.username}</p>

      <h2>Commentaires</h2>
      <ul>
        {post.comments.map((comment: any) => (
          <li key={comment.id}>
            <strong>{comment.user.username}</strong>: {comment.content}
          </li>
        ))}
      </ul>

      <h2>Réactions</h2>
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
