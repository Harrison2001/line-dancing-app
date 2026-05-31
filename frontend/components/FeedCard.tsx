"use client";

import Image from "next/image";
import { useState } from "react";
import {
  likePost,
  getComments,
  createComment,
  toggleFollow,
} from "@/services/api";

type FeedCardProps = {
  _id?: string;
  creator?: string;
  handle?: string;
  userId?: {
    _id: string;
    username: string;
    email?: string;
  };
  choreographer?: string;
  difficulty?: string;
  danceTitle?: string;
  caption?: string;
  text?: string;
  song?: string;
  artist?: string;
  bpm?: number;
  counts?: number;
  walls?: number;
  likes?: string | number;
  comments?: string | number;
  saves?: string | number;
  image?: string;
  mediaUrl?: string;
  publicId?: string;
  resourceType?: "image" | "video";
  type?: "tutorial" | "text" | "media";
};

type Comment = {
  _id: string;
  text: string;
  userId?: {
    username?: string;
  };
};

export default function FeedCard({
  _id,
  creator,
  handle,
  userId,
  choreographer,
  difficulty,
  danceTitle,
  caption,
  text,
  song,
  artist,
  bpm,
  counts,
  walls,
  likes = 0,
  comments = 0,
  saves = 0,
  image,
  mediaUrl,
  resourceType,
  type,
}: FeedCardProps) {
  const [likeCount, setLikeCount] = useState(Number(likes) || 0);
  const [liked, setLiked] = useState(false);

  const [showComments, setShowComments] = useState(false);
  const [commentList, setCommentList] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [commentCount, setCommentCount] = useState(Number(comments) || 0);

  const displayName = creator || userId?.username || "Unknown User";
  const displayHandle = handle || userId?.username || "user";
  const displayTitle = danceTitle || caption || text || "Dance post";
  const displayMedia = mediaUrl || image;

  const isVideo = resourceType === "video";
  const isTextPost = type === "text" || !displayMedia;

  const [following, setFollowing] = useState(false);
const [followLoading, setFollowLoading] = useState(false);

  async function handleLike() {
    if (!_id) return;

    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;

    const user = JSON.parse(storedUser);

    try {
      const result = await likePost(_id, user.id);
      setLiked(result.liked);
      setLikeCount(result.count);
    } catch (error) {
      console.error("Failed to like post:", error);
    }
  }

  async function handleToggleComments() {
    if (!_id) return;

    const nextValue = !showComments;
    setShowComments(nextValue);

    if (nextValue && commentList.length === 0) {
      try {
        const data = await getComments(_id);
        setCommentList(data);
        setCommentCount(data.length);
      } catch (error) {
        console.error("Failed to load comments:", error);
      }
    }
  }

  async function handleCreateComment(e: React.FormEvent) {
    e.preventDefault();

    if (!_id || !commentText.trim()) return;

    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;

    const user = JSON.parse(storedUser);

    try {
      const newComment = await createComment(_id, user.id, commentText);

      setCommentList((prev) => [newComment, ...prev]);
      setCommentCount((prev) => prev + 1);
      setCommentText("");
    } catch (error) {
      console.error("Failed to create comment:", error);
    }
  }
  async function handleFollow() {
  if (!userId?._id) return;

  const storedUser = localStorage.getItem("user");
  if (!storedUser) return;

  const currentUser = JSON.parse(storedUser);

  if (currentUser.id === userId._id) return;

  try {
    setFollowLoading(true);

    const result = await toggleFollow(currentUser.id, userId._id);

    setFollowing(result.following);
  } catch (error) {
    console.error("Failed to follow user:", error);
  } finally {
    setFollowLoading(false);
  }
}

  return (
    <article className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
      <div className="flex items-center justify-between p-6">
        <div className="flex gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-300 font-bold text-black">
            {displayName.charAt(0).toUpperCase()}
          </div>

          <div>
            <h3 className="font-bold">{displayName}</h3>

            <p className="text-gray-400">
              @{displayHandle}
              {choreographer && ` · choreo by ${choreographer}`}
            </p>
            {userId?._id && (
  <button
    onClick={handleFollow}
    disabled={followLoading}
    className={`mt-2 rounded-full px-4 py-1 text-sm font-semibold transition ${
      following
        ? "border border-white/20 text-white"
        : "bg-orange-500 text-black"
    }`}
  >
    {following ? "Following" : "Follow"}
  </button>
)}
          </div>
        </div>

        {difficulty && (
          <span className="rounded-full border border-orange-500 px-5 py-2 text-orange-500">
            {difficulty}
          </span>
        )}
      </div>

      {isTextPost ? (
        <div className="p-8">
          <div className="rounded-3xl border border-white/10 p-8">
            <h2 className="text-4xl font-bold">{displayTitle}</h2>

            {caption && danceTitle && (
              <p className="mt-4 text-gray-300">{caption}</p>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="relative flex max-h-[650px] min-h-[400px] items-center justify-center bg-black">
            {isVideo ? (
              <video
                src={displayMedia}
                controls
                className="max-h-[650px] w-full object-contain"
              />
            ) : (
              displayMedia && (
                <Image
                  src={displayMedia}
                  alt={displayTitle}
                  width={1200}
                  height={800}
                  className="max-h-[650px] w-full object-contain"
                />
              )
            )}
          </div>

          <div className="p-6">
            <h2 className="text-4xl font-bold">{displayTitle}</h2>

            {(song || artist || bpm || counts || walls) && (
              <p className="mt-4 text-gray-300">
                ♪ {song || "Unknown song"}
                {artist && ` — ${artist}`}
                {bpm && ` · ${bpm} BPM`}
                {counts && ` · ${counts} ct`}
                {walls && ` · ${walls} walls`}
              </p>
            )}

            {caption && <p className="mt-4 text-gray-300">{caption}</p>}

            {text && !caption && (
              <p className="mt-4 text-gray-300">{text}</p>
            )}

            <div className="mt-6 flex flex-wrap gap-4">
              <button className="rounded-full border px-6 py-3">
                ✓ I Know This
              </button>

              <button className="rounded-full border border-orange-500 px-6 py-3 text-orange-500">
                📖 Learning
              </button>

              <button className="rounded-full border px-6 py-3">
                ☆ Want To Learn
              </button>
            </div>
          </div>
        </>
      )}

      <div className="flex gap-8 p-6">
        <button
          onClick={handleLike}
          className={`transition ${
            liked ? "text-orange-500" : "text-white hover:text-orange-400"
          }`}
        >
          {liked ? "❤️" : "♡"} {likeCount}
        </button>

        <button
          onClick={handleToggleComments}
          className="text-white transition hover:text-orange-400"
        >
          💬 {commentCount}
        </button>

        <span>🎟 {saves}</span>
      </div>

      {showComments && (
        <div className="border-t border-white/10 p-6">
          <form onSubmit={handleCreateComment} className="mb-5 flex gap-3">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 rounded-full border border-white/10 bg-black/30 px-5 py-3 outline-none placeholder:text-gray-500"
            />

            <button className="rounded-full bg-orange-500 px-5 py-3 font-semibold text-black">
              Post
            </button>
          </form>

          <div className="space-y-3">
            {commentList.length === 0 ? (
              <p className="text-sm text-gray-400">No comments yet.</p>
            ) : (
              commentList.map((comment) => (
                <div
                  key={comment._id}
                  className="rounded-2xl bg-black/30 p-4"
                >
                  <p className="text-sm font-semibold text-orange-400">
                    {comment.userId?.username || "User"}
                  </p>

                  <p className="mt-1 text-gray-200">{comment.text}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </article>
  );
}