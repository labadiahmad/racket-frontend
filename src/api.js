const API_URL = "http://localhost:5050/api";

export function getAuthHeaders() {
  const user = JSON.parse(localStorage.getItem("user"));

  return user
    ? {
        "Content-Type": "application/json",
        "x-user-id": user.user_id,
        "x-role": user.role,
      }
    : { "Content-Type": "application/json" };
}

export async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "API error");
  }

  return res.json();
}