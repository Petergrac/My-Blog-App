import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Intercept the response
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export default api;
// Sign up a user
async function signUpUser(username, email, password) {
  const res = await axios.post(`${import.meta.env.VITE_API_URL}/register`,{
    username,
    email,
    password,
  });
  return res.data;
}
// Log in
async function loginUser(email, password) {
  const res = await axios.post(`${import.meta.env.VITE_API_URL}/login`, {
    email,
    password,
  });
  return res.data;
}
// Get all posts
async function getAllPosts() {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts`);
  return res.data;
}

// Get post by id
async function getPostById(id) {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts/${id}`);
  return res.data.post;
}

// Use the api to all protected routes

// Get user by id
async function getUserById(id) {
  const res = await api.get(`/me/${id}`);
  return res.data.user;
}
async function updateUser(userId, updatedFields) {
  console.log(updatedFields);
  const res = await api.patch(`/users/${userId}`, { updatedFields });
  return res.data;
}
// Post a comment
async function postAComment(comment, id) {
  const res = await api.post(`/posts/${id}/comments`, { comment });
  console.log(res.data);
  return res.data;
}

// Add a like
async function addLike(id) {
  const res = api.post(`/posts/${id}/like`);
  console.log(res.data);
  return res.data;
}
// Like a comment
async function likeComment(id) {
  const res = await api.post(`/comments/${id}/like`);
  console.log(res.data);
  return res.data;
}
// Edit a comment
async function editComment(content, id) {
  const res = await api.patch(`/comments/${id}`, { content });
  console.log(res.data);
  return res.data;
}
// Delete Comment
async function deleteComment(id) {
  const res = await api.delete(`/comments/${id}`);
  console.log(res.data);
  return res.data;
}
export {
  signUpUser,
  loginUser,
  getUserById,
  updateUser,
  getAllPosts,
  getPostById,
  postAComment,
  addLike,
  likeComment,
  editComment,
  deleteComment,
};
