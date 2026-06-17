const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";


// POSTS

export async function getPosts() {
  const response = await fetch(
    `${API_URL}/api/posts`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }

  return response.json();
}

export async function createPost(
  text: string
) {
  const response = await fetch(
    `${API_URL}/api/posts`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        type: "text",
        danceTitle: text,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to create post"
    );
  }

  return response.json();
}


// LOGIN

export async function loginUser(
  email: string,
  password: string
) {
  const response = await fetch(
    `${API_URL}/api/users/login`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  if (!response.ok) {
    let message = "Login failed";

    try {
      const data = await response.json();
      if (data.message) message = data.message;
    } catch {
      // keep default message
    }

    throw new Error(message);
  }

  return response.json();
}


// SIGNUP

export async function signupUser(
  username: string,
  email: string,
  password: string
) {
  const response = await fetch(
    `${API_URL}/api/users/signup`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Signup failed"
    );
  }

  return response.json();
}


// USER UPLOADS

export async function getUserUploads(
  userId: string
) {
  const response = await fetch(
    `${API_URL}/api/posts/user/${userId}`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch user uploads"
    );
  }

  return response.json();
}


// SAVED DANCES

export type SavedDanceStatus = "known" | "learning" | "wantToLearn";

export type SavedDanceRecord = {
  _id: string;
  userId: string;
  danceId?: string;
  danceTitle: string;
  song?: string;
  artist?: string;
  choreographer?: string;
  difficulty?: string;
  status: SavedDanceStatus;
};

export type SaveDanceMetadata = {
  danceTitle: string;
  song?: string;
  artist?: string;
  choreographer?: string;
  difficulty?: string;
};

export async function getSavedDances(
  userId: string
) {
  const response = await fetch(
    `${API_URL}/api/saved-dances/${userId}`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch saved dances"
    );
  }

  return response.json();
}

export async function checkSavedDance(
  userId: string,
  danceId: string
) {
  const params = new URLSearchParams({
    userId,
    danceId,
  });

  const response = await fetch(
    `${API_URL}/api/saved-dances/check?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to check saved dance"
    );
  }

  return response.json() as Promise<{
    saved: boolean;
    record?: SavedDanceRecord;
  }>;
}

export async function saveDance(
  userId: string,
  danceId: string | undefined,
  status: string,
  metadata?: SaveDanceMetadata
) {
  const response = await fetch(
    `${API_URL}/api/saved-dances`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        userId,
        danceId,
        status,
        danceTitle: metadata?.danceTitle,
        song: metadata?.song,
        artist: metadata?.artist,
        choreographer: metadata?.choreographer,
        difficulty: metadata?.difficulty,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to save dance"
    );
  }

  return response.json();
}

export async function updateSavedDanceStatus(
  id: string,
  status: string
) {
  const response = await fetch(
    `${API_URL}/api/saved-dances/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({ status }),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to update saved dance"
    );
  }

  return response.json();
}

export async function unsaveDance(id: string) {
  const response = await fetch(
    `${API_URL}/api/saved-dances/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to remove saved dance"
    );
  }

  return response.json();
}


// MEDIA

export async function uploadMedia(
  file: File
) {
  const formData =
    new FormData();

  formData.append(
    "media",
    file
  );

  const response = await fetch(
    `${API_URL}/api/uploads`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to upload media"
    );
  }

  return response.json();
}

export async function createMediaPost(
  userId: string,
  text: string,
  mediaUrl: string,
  publicId: string,
  resourceType: string
) {
  const response = await fetch(
    `${API_URL}/api/posts/media`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        userId,
        text,
        mediaUrl,
        publicId,
        resourceType,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to create media post"
    );
  }

  return response.json();
}


// LIKES

export async function likePost(
  postId: string,
  userId: string
) {
  const response = await fetch(
    `${API_URL}/api/likes`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        postId,
        userId,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to like post"
    );
  }

  return response.json();
}

export async function getLikes(
  postId: string
) {
  const response = await fetch(
    `${API_URL}/api/likes/${postId}`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch likes"
    );
  }

  return response.json();
}

export async function getComments(postId: string) {
  const response = await fetch(`${API_URL}/api/comments/${postId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch comments");
  }

  return response.json();
}

export async function createComment(
  postId: string,
  userId: string,
  text: string
) {
  const response = await fetch(`${API_URL}/api/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      postId,
      userId,
      text,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create comment");
  }

  return response.json();
}

// FOLLOW USER

export async function toggleFollow(
  followerId: string,
  followingId: string
) {
  const response = await fetch(`${API_URL}/api/follows`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      followerId,
      followingId,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update follow");
  }

  return response.json();
}

export async function getFollowerCount(userId: string) {
  const response = await fetch(
    `${API_URL}/api/follows/${userId}/follower-count`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch follower count");
  }

  return response.json();
}

export async function getFollowingCount(userId: string) {
  const response = await fetch(
    `${API_URL}/api/follows/${userId}/following-count`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch following count");
  }

  return response.json();
}