export type StoredUser = {
  id?: string;
  _id?: string;
  username?: string;
  email?: string;
  profileImage?: string;
  bio?: string;
  city?: string;
  state?: string;
  danceExperience?: string;
  skillLevel?: string;
  danceFrequency?: string;
  interests?: string[];
};

export function normalizeStoredUser(user: StoredUser): StoredUser {
  const id = user.id || user._id;

  if (!id) return user;

  return {
    ...user,
    id: String(id),
  };
}

export function getStoredUser(): StoredUser | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;

    return normalizeStoredUser(JSON.parse(raw) as StoredUser);
  } catch {
    return null;
  }
}

export function getUserId(user: StoredUser | null | undefined): string | null {
  if (!user) return null;

  const id = user.id || user._id;
  return id ? String(id) : null;
}

export function persistUser(user: StoredUser): void {
  localStorage.setItem("user", JSON.stringify(normalizeStoredUser(user)));
}
