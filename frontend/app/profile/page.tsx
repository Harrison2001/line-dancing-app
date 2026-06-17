"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  getSavedDances,
  saveDance,
  uploadMedia,
  createMediaPost,
  getUserUploads,
} from "@/services/api";

type User = {
  id: string;
  username: string;
  email: string;
  profileImage?: string;
  bio?: string;
  city?: string;
  state?: string;
  danceExperience?: string;
  skillLevel?: string;
  danceFrequency?: string;
  interests?: string[];
};

type MainTab = "uploads" | "library";

type SavedDance = {
  _id: string;
  danceTitle: string;
  danceId?: string;
  status: "known" | "learning" | "wantToLearn";
};

type UploadedFile = {
  _id?: string;
  mediaUrl: string;
  publicId: string;
  resourceType: "image" | "video";
};

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<MainTab>("uploads");

  const [savedDances, setSavedDances] = useState<SavedDance[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const [danceTitle, setDanceTitle] = useState("");
  const [status, setStatus] = useState<"known" | "learning" | "wantToLearn">(
    "wantToLearn"
  );

  const [isEditing, setIsEditing] = useState(false);
  const [editBio, setEditBio] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editState, setEditState] = useState("");
  const [editProfileImage, setEditProfileImage] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.push("/login");
      return;
    }

    const parsedUser: User = JSON.parse(storedUser);
    setUser(parsedUser);

    setEditBio(parsedUser.bio || "");
    setEditCity(parsedUser.city || "");
    setEditState(parsedUser.state || "");
    setEditProfileImage(parsedUser.profileImage || "");

    loadSavedDances(parsedUser.id);
    loadUserUploads(parsedUser.id);
  }, [router]);

  async function handleSaveProfile() {
    if (!user) return;

    try {
      const res = await fetch(`http://localhost:5000/api/profiles/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          displayName: user.username,
          bio: editBio,
          location: `${editCity}, ${editState}`,
          profileImage: editProfileImage,
          favoriteStyles: user.interests || [],
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update profile");
      }

      const updatedUser: User = {
        ...user,
        bio: editBio,
        city: editCity,
        state: editState,
        profileImage: editProfileImage,
      };

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setIsEditing(false);
    } catch (error) {
      console.error("Profile update failed:", error);
    }
  }

  async function loadSavedDances(userId: string) {
    try {
      const data = await getSavedDances(userId);
      setSavedDances(data);
    } catch (error) {
      console.error("Failed to load saved dances:", error);
    }
  }

  async function loadUserUploads(userId: string) {
    try {
      const data = await getUserUploads(userId);
      setUploadedFiles(data);
    } catch (error) {
      console.error("Failed to load user uploads:", error);
    }
  }

  async function handleAddDance(e: React.FormEvent) {
    e.preventDefault();

    if (!user || !danceTitle.trim()) return;

    try {
      const newDance = await saveDance(user.id, undefined, status, {
        danceTitle,
      });
      setSavedDances((prev) => [newDance, ...prev]);
      setDanceTitle("");
      setStatus("wantToLearn");
    } catch (error) {
      console.error("Failed to save dance:", error);
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file || !user) return;

    try {
      const uploaded = await uploadMedia(file);

      const newPost = await createMediaPost(
        user.id,
        "",
        uploaded.mediaUrl,
        uploaded.publicId,
        uploaded.resourceType
      );

      setUploadedFiles((prev) => [newPost, ...prev]);
      e.target.value = "";
    } catch (error) {
      console.error("Upload failed:", error);
    }
  }

  const knownDances = savedDances.filter((dance) => dance.status === "known");
  const learningDances = savedDances.filter(
    (dance) => dance.status === "learning"
  );
  const wantToLearnDances = savedDances.filter(
    (dance) => dance.status === "wantToLearn"
  );

  return (
    <main className="min-h-screen bg-[#100905] pb-24 text-white md:pb-0">
      <section className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt="Profile"
                  className="h-24 w-24 rounded-full border-4 border-orange-500 object-cover"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-orange-500 bg-orange-300 text-4xl font-bold text-black">
                  {user ? user.username.charAt(0).toUpperCase() : "?"}
                </div>
              )}

              <div>
                <h1 className="text-4xl font-bold">
                  {user ? user.username : "Guest User"}
                </h1>

                <p className="mt-2 text-gray-400">
                  {user ? user.email : "Not logged in"}
                </p>

                <p className="mt-3 max-w-xl text-gray-300">
                  {user?.bio || "No bio added yet."}
                </p>

                <div className="mt-4 flex flex-wrap gap-2 text-sm">
                  <ProfileBadge>
                    📍{" "}
                    {user?.city && user?.state
                      ? `${user.city}, ${user.state}`
                      : "Location not set"}
                  </ProfileBadge>

                  <ProfileBadge>
                    💃 {user?.skillLevel || "Skill not set"}
                  </ProfileBadge>

                  <ProfileBadge>
                    ⭐ {user?.danceExperience || "Experience not set"}
                  </ProfileBadge>

                  <ProfileBadge>
                    🕺 {user?.danceFrequency || "Frequency not set"}
                  </ProfileBadge>
                </div>

                {user?.interests && user.interests.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {user.interests.map((interest) => (
                      <span
                        key={interest}
                        className="rounded-full bg-orange-500/15 px-3 py-1 text-xs font-semibold text-orange-300"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => setIsEditing(true)}
              className="rounded-full bg-orange-500 px-6 py-3 font-semibold text-black"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {isEditing && (
          <section className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-4 text-2xl font-bold">Edit Profile</h2>

            <div className="grid gap-4">
              <textarea
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                placeholder="Bio"
                rows={4}
                className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
              />

              <input
                value={editCity}
                onChange={(e) => setEditCity(e.target.value)}
                placeholder="City"
                className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
              />

              <input
                value={editState}
                onChange={(e) => setEditState(e.target.value)}
                placeholder="State"
                className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
              />

              <input
                value={editProfileImage}
                onChange={(e) => setEditProfileImage(e.target.value)}
                placeholder="Profile image URL"
                className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
              />
            </div>

            <div className="mt-5 flex gap-3">
              <button
                onClick={handleSaveProfile}
                className="rounded-full bg-orange-500 px-6 py-3 font-semibold text-black"
              >
                Save Changes
              </button>

              <button
                onClick={() => setIsEditing(false)}
                className="rounded-full border border-white/10 px-6 py-3 text-white"
              >
                Cancel
              </button>
            </div>
          </section>
        )}

        <div className="mb-8 flex rounded-full border border-white/10 bg-white/5 p-2">
          <button
            onClick={() => setActiveTab("uploads")}
            className={`flex-1 rounded-full py-3 font-semibold ${
              activeTab === "uploads"
                ? "bg-orange-500 text-black"
                : "text-gray-300"
            }`}
          >
            User Uploads
          </button>

          <button
            onClick={() => setActiveTab("library")}
            className={`flex-1 rounded-full py-3 font-semibold ${
              activeTab === "library"
                ? "bg-orange-500 text-black"
                : "text-gray-300"
            }`}
          >
            Dance Library
          </button>
        </div>

        {activeTab === "uploads" && (
          <UploadsSection
            uploadedFiles={uploadedFiles}
            handleUpload={handleUpload}
          />
        )}

        {activeTab === "library" && (
          <DanceLibrarySection
            danceTitle={danceTitle}
            status={status}
            setDanceTitle={setDanceTitle}
            setStatus={setStatus}
            handleAddDance={handleAddDance}
            knownDances={knownDances}
            learningDances={learningDances}
            wantToLearnDances={wantToLearnDances}
          />
        )}
      </section>
    </main>
  );
}

function ProfileBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-gray-300">
      {children}
    </span>
  );
}

function UploadsSection({
  uploadedFiles,
  handleUpload,
}: {
  uploadedFiles: UploadedFile[];
  handleUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-bold">User Uploads</h2>

        <label className="cursor-pointer rounded-full bg-orange-500 px-5 py-2 font-semibold text-black">
          Upload Video
          <input
            type="file"
            accept="video/*,image/*"
            onChange={handleUpload}
            className="hidden"
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {uploadedFiles.length === 0 ? (
          <div className="col-span-full flex h-40 items-center justify-center rounded-2xl border border-dashed border-white/20 text-gray-400">
            No uploads yet
          </div>
        ) : (
          uploadedFiles.map((file) => (
            <div
              key={file._id || file.publicId}
              className="overflow-hidden rounded-2xl border border-white/10 bg-black/20"
            >
              <div className="relative h-72">
                {file.resourceType === "video" ? (
                  <video
                    src={file.mediaUrl}
                    controls
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <img
                    src={file.mediaUrl}
                    alt="upload"
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

function DanceLibrarySection({
  danceTitle,
  status,
  setDanceTitle,
  setStatus,
  handleAddDance,
  knownDances,
  learningDances,
  wantToLearnDances,
}: {
  danceTitle: string;
  status: "known" | "learning" | "wantToLearn";
  setDanceTitle: (value: string) => void;
  setStatus: (value: "known" | "learning" | "wantToLearn") => void;
  handleAddDance: (e: React.FormEvent) => void;
  knownDances: SavedDance[];
  learningDances: SavedDance[];
  wantToLearnDances: SavedDance[];
}) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Dance Library</h2>

        <p className="mt-2 text-gray-400">
          Track dances you know, are learning, and want to learn.
        </p>
      </div>

      <form
        onSubmit={handleAddDance}
        className="mb-8 grid gap-4 rounded-3xl border border-white/10 bg-black/20 p-5 md:grid-cols-[1fr_220px_auto]"
      >
        <input
          value={danceTitle}
          onChange={(e) => setDanceTitle(e.target.value)}
          placeholder="Add a dance title..."
          className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 outline-none placeholder:text-gray-500"
        />

        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value as "known" | "learning" | "wantToLearn")
          }
          className="rounded-2xl border border-white/10 bg-[#100905] px-5 py-3 outline-none"
        >
          <option value="known">I Know</option>
          <option value="learning">Learning</option>
          <option value="wantToLearn">Want To Learn</option>
        </select>

        <button className="rounded-2xl bg-orange-500 px-6 py-3 font-semibold text-black">
          Add Dance
        </button>
      </form>

      <section className="grid gap-6 lg:grid-cols-3">
        <DanceColumn title="Dances I Know" dances={knownDances} />
        <DanceColumn title="Currently Learning" dances={learningDances} />
        <DanceColumn title="Want To Learn" dances={wantToLearnDances} />
      </section>
    </section>
  );
}

function DanceColumn({
  title,
  dances,
}: {
  title: string;
  dances: SavedDance[];
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
      <h2 className="mb-5 text-2xl font-bold">{title}</h2>

      <div className="space-y-4">
        {dances.length === 0 && (
          <p className="text-sm text-gray-400">No dances added yet.</p>
        )}

        {dances.map((dance) => {
          const cardContent = (
            <>
              <h3 className="font-semibold">{dance.danceTitle}</h3>
              <p className="mt-1 text-sm text-gray-400">Saved dance</p>
            </>
          );

          return dance.danceId ? (
            <Link
              key={dance._id}
              href={`/dances/${dance.danceId}`}
              className="block rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
            >
              {cardContent}
            </Link>
          ) : (
            <div
              key={dance._id}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
            >
              {cardContent}
            </div>
          );
        })}
      </div>
    </div>
  );
}