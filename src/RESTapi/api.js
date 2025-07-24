import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Request Interceptor: Add Authorization header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: Handle 401 errors
api.interceptors.response.use(
  (response) => response, // Pass through if no error
  async (error) => {
    const originalRequest = error.config; 

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/refresh`,
          { refreshToken }
        );
        localStorage.setItem("token", data.accessToken);
        api.defaults.headers.Authorization = `Bearer ${data.accessToken}`;

        return api(originalRequest); // Retry original request
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

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
// Search query
async function search(query) {
    const result = await axios.get(`${import.meta.env.VITE_API_URL}/search`,{
      params: {q: query}
    });
    return result.data.results;
    }


// ====================================== PROTECTED ROUTES =====================================
// 
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
  search,
  getPostById,
  postAComment,
  addLike,
  likeComment,
  editComment,
  deleteComment,
};
