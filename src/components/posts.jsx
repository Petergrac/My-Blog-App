function PostCard({post}){
    return (
        <div className="text-white ">
            <h1 className="text-3xl">{post.title}</h1>
            <h3>{post.content}</h3>
            <img src={post.image_url} alt={post.title} />
            <p>Likes: {post.likes}</p>
            <p>{post.createdAt}</p>
        </div>
    )
}
export default PostCard;