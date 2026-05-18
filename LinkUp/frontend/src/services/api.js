// ─── Base Config ────────────────────────────────────────────────────────────
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const getToken = () => localStorage.getItem("token");

const headers = () => ({
  "Content-Type": "application/json",
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
});

const handleResponse = async (res) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Error ${res.status}`);
  return data;
};

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (body) =>
    fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(body),
    }).then(handleResponse),

  login: (body) =>
    fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(body),
    }).then(handleResponse),
};

// ─── Posts ───────────────────────────────────────────────────────────────────
export const postsAPI = {
  getAll: () =>
    fetch(`${BASE_URL}/posts`, { headers: headers() }).then(handleResponse),

  getById: (id) =>
    fetch(`${BASE_URL}/posts/${id}`, { headers: headers() }).then(handleResponse),

  create: (body) =>
    fetch(`${BASE_URL}/posts`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(body),
    }).then(handleResponse),

  delete: (id) =>
    fetch(`${BASE_URL}/posts/${id}`, {
      method: "DELETE",
      headers: headers(),
    }).then(handleResponse),

  like: (id) =>
    fetch(`${BASE_URL}/posts/${id}/like`, {
      method: "POST",
      headers: headers(),
    }).then(handleResponse),
};

// ─── Comments ────────────────────────────────────────────────────────────────
export const commentsAPI = {
  getByPost: (postId) =>
    fetch(`${BASE_URL}/posts/${postId}/comments`, {
      headers: headers(),
    }).then(handleResponse),

  create: (postId, body) =>
    fetch(`${BASE_URL}/posts/${postId}/comments`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(body),
    }).then(handleResponse),

  delete: (postId, commentId) =>
    fetch(`${BASE_URL}/posts/${postId}/comments/${commentId}`, {
      method: "DELETE",
      headers: headers(),
    }).then(handleResponse),
};