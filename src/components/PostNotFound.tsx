const PostNotFound = () => {
  return (
    <div className="h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <h2 className="text-2xl font-semibold">Post not found</h2>
      <p className="text-muted-foreground mt-2">
        The article you&apos;re looking for does not exist or has been removed.
      </p>
    </div>
  );
};

export default PostNotFound;
