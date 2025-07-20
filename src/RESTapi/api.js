import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:3000/api/',
});

// Intercept the response
api.interceptors.request.use((config)=>{
    const token = localStorage.getItem('token');
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
export default api;
// Sign up a user
async function signUpUser(username,email,password) {
    const res = await axios.post('http://localhost:3000/api/register',{
        username,email,password
    })
    return res.data;
}
// Log in
async function loginUser(email,password) {
    const res = await axios.post('http://localhost:3000/api/login',{email,password});
    return res.data;
}
// Use the api to all protected routes

// Get all posts
async function getAllPosts() {
    const res = await axios.get('http://localhost:3000/api/posts');
    return res.data;
}


// Get post by id
async function getPostById(id) {
    const res = await axios.get(`http://localhost:3000/api/posts/${id}`);
    return res.data.post;
}

// Post a comment
async function postAComment(comment,id) {
    const res = await api.post(`/posts/${id}/comments`,{comment});
    console.log(res.data);
    return res.data
}

// Add a like
async function addLike(id){
    const res = api.post(`/posts/${id}/like`);
    console.log(res.data);
    return res.data;
}
// Like a comment
async function likeComment(id) {
    const res = await api.post(`/comments/${id}/like`);
    console.log(res.data);
    return res.data
}
export {
    signUpUser,
    loginUser,
    getAllPosts,
    getPostById,
    postAComment,
    addLike,
    likeComment
}